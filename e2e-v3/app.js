/*
 * Przeklik E2E CRM v3 — logika strony: zakładki, liczniki i wspólny zapis odznaczeń.
 * Stan trzyma magazyn checklisty QA w backendzie v3 (GET/POST <API_URL>/api/qa-checklist/items).
 * POST idzie jako text/plain (żądanie proste, bez preflightu CORS) i bez ciasteczek.
 * Gdy magazyn nie odpowiada, zmiany czekają w kolejce w localStorage i są ponawiane.
 */
(function () {
  'use strict';

  // Jedyne miejsce z adresem backendu v3 — podmień po wdrożeniu (bez ukośnika na końcu).
  var API_URL = 'https://handshake-crm-v3-production.up.railway.app';

  var POLL_MS = 10000;
  var NOTE_DEBOUNCE_MS = 800;
  var REQUEST_TIMEOUT_MS = 8000;
  var RETRY_MIN_MS = 3000;
  var RETRY_MAX_MS = 30000;
  var LS_QUEUE = 'e2e-v3.queue.v1';
  var LS_CACHE = 'e2e-v3.cache.v1';
  var LS_TAB = 'e2e-v3.tab';
  var LS_HIDE = 'e2e-v3.hideDone';

  var SAMPLE_VALUATION = [
    'WYCENA TESTOWA E2E (fikcyjna)',
    'Nieruchomość: Lokal mieszkalny 48 m2, nieruchomość TEST',
    'Wartość rynkowa: 415 000 zł (8 650 zł/m2)',
    'Zakres: 400 000 – 430 000 zł',
    'Rekomendowana cena ofertowa: 425 000 zł',
    'Porównania: 3 fikcyjne transakcje z okolicy, 45–52 m2, 8 300–8 900 zł/m2.',
    'Uwagi: dokument testowy, nie stanowi wyceny.'
  ].join('\n');

  var D = window.E2E_V3;
  var PEOPLE = D.PEOPLE;
  var DATA = {};
  var ITEM_PERSON = {};
  PEOPLE.forEach(function (p) {
    DATA[p.key] = D.build(p);
    DATA[p.key].forEach(function (s) {
      s.items.forEach(function (it) { ITEM_PERSON[it.id] = p; });
    });
  });

  // ---------- pamięć przeglądarki (zawsze w try/catch) ----------
  function lsGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* tryb prywatny / brak miejsca */ }
  }
  function lsJson(key) {
    var raw = lsGet(key);
    if (!raw) return {};
    try {
      var v = JSON.parse(raw);
      return v && typeof v === 'object' ? v : {};
    } catch (e) { return {}; }
  }

  // ---------- adres magazynu ----------
  function apiRoot() {
    var base = API_URL;
    // Podmiana adresu przez ?api= działa wyłącznie lokalnie (testy strony).
    try {
      if (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) {
        var q = new URLSearchParams(window.location.search).get('api');
        if (q) base = q;
      }
    } catch (e) { /* stare przeglądarki */ }
    return base.replace(/\/+$/, '');
  }
  var ROOT = apiRoot();
  var BASE = ROOT + '/api/qa-checklist';
  var CONFIGURED = !/REPLACE-ME/i.test(ROOT);

  // ---------- stan ----------
  var CACHE_KEY = LS_CACHE + ':' + ROOT;
  var server = lsJson(CACHE_KEY);    // id -> {checked, note, updated_by, updated_at}
  var queue = lsJson(LS_QUEUE);      // id -> {checked, note, updated_by, seq}
  var seqN = 0;
  Object.keys(queue).forEach(function (id) {
    if (!ITEM_PERSON[id]) { delete queue[id]; return; }
    seqN = Math.max(seqN, queue[id].seq || 0);
  });
  var online = null;                 // null = jeszcze nie wiadomo
  var flushing = false;
  var retryTimer = null;
  var retryDelay = RETRY_MIN_MS;
  var noteTimers = {};
  var activeKey = null;

  function saveQueue() { lsSet(LS_QUEUE, JSON.stringify(queue)); }
  function saveCache() { lsSet(CACHE_KEY, JSON.stringify(server)); }

  function effective(id) {
    var q = queue[id];
    var s = server[id];
    if (q) {
      return { checked: !!q.checked, note: q.note || '', updated_by: q.updated_by, updated_at: null, pending: true };
    }
    if (s) {
      return { checked: !!s.checked, note: s.note || '', updated_by: s.updated_by || '', updated_at: s.updated_at || null, pending: false };
    }
    return { checked: false, note: '', updated_by: '', updated_at: null, pending: false };
  }

  // ---------- sieć ----------
  function request(method, url, body) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT_MS) : null;
    var opts = { method: method, credentials: 'omit', mode: 'cors', cache: 'no-store' };
    if (ctrl) opts.signal = ctrl.signal;
    if (body !== undefined) {
      opts.headers = { 'Content-Type': 'text/plain;charset=UTF-8' };
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        return { status: res.status, ok: res.ok, data: data };
      });
    }, function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  function isPermanentFailure(status) {
    return status >= 400 && status < 500 && status !== 408 && status !== 429;
  }

  function load() {
    if (!CONFIGURED) { setOnline(false); return Promise.resolve(); }
    return request('GET', BASE + '/items').then(function (r) {
      if (!r.ok || !r.data || !Array.isArray(r.data.items)) throw new Error('GET ' + r.status);
      var next = {};
      r.data.items.forEach(function (e) {
        if (e && typeof e.item_id === 'string') next[e.item_id] = e;
      });
      server = next;
      saveCache();
      setOnline(true);
      refreshAll();
      if (Object.keys(queue).length) flush();
    }).catch(function () {
      setOnline(false);
      scheduleRetry();
    });
  }

  function flush() {
    if (flushing || !CONFIGURED) return;
    var ids = Object.keys(queue);
    if (!ids.length) return;
    flushing = true;
    updateSync();
    var i = 0;
    function next() {
      if (i >= ids.length) {
        flushing = false;
        updateSync();
        // Coś doszło w trakcie wysyłki — wyślij od razu.
        if (Object.keys(queue).length && online) flush();
        return;
      }
      var id = ids[i++];
      var entry = queue[id];
      if (!entry) { next(); return; }
      var sentSeq = entry.seq;
      request('POST', BASE + '/items/' + encodeURIComponent(id), {
        checked: !!entry.checked,
        note: entry.note || '',
        updated_by: entry.updated_by || ''
      }).then(function (r) {
        if (r.ok) {
          if (r.data && r.data.item_id === id) server[id] = r.data;
          else server[id] = { item_id: id, checked: entry.checked, note: entry.note, updated_by: entry.updated_by, updated_at: new Date().toISOString() };
          saveCache();
          if (queue[id] && queue[id].seq === sentSeq) { delete queue[id]; saveQueue(); }
          setOnline(true);
          refreshItem(id);
          refreshCounts();
          next();
        } else if (isPermanentFailure(r.status)) {
          if (queue[id] && queue[id].seq === sentSeq) { delete queue[id]; saveQueue(); }
          refreshItem(id);
          refreshCounts();
          toast('Magazyn odrzucił zmianę punktu ' + id + ' (kod ' + r.status + ').');
          next();
        } else {
          throw new Error('POST ' + r.status);
        }
      }).catch(function () {
        flushing = false;
        setOnline(false);
        scheduleRetry();
      });
    }
    next();
  }

  function scheduleRetry() {
    if (retryTimer) return;
    retryTimer = setTimeout(function () {
      retryTimer = null;
      retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
      load();
    }, retryDelay);
  }

  function retryNow() {
    if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
    retryDelay = RETRY_MIN_MS;
    load();
  }

  function setOnline(v) {
    if (v) retryDelay = RETRY_MIN_MS;
    var changed = online !== v;
    online = v;
    if (changed) refreshAll();
    else updateSync();
  }

  function setItem(id, patch) {
    var cur = effective(id);
    var person = ITEM_PERSON[id];
    queue[id] = {
      checked: 'checked' in patch ? !!patch.checked : cur.checked,
      note: 'note' in patch ? String(patch.note).slice(0, 2000) : cur.note,
      updated_by: person ? person.name : '',
      seq: ++seqN
    };
    saveQueue();
    refreshItem(id);
    refreshCounts();
    if (online === false) { updateSync(); return; }
    flush();
  }

  // ---------- widok ----------
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  function copyText(text) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? 'Skopiowano do schowka.' : 'Nie udało się skopiować — zaznacz tekst ręcznie.');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast('Skopiowano do schowka.'); }, fallback);
    } else {
      fallback();
    }
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    try {
      return d.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return d.toISOString().slice(0, 16).replace('T', ' '); }
  }

  function countsFor(key) {
    var done = 0, total = 0;
    DATA[key].forEach(function (s) {
      s.items.forEach(function (it) {
        total++;
        if (effective(it.id).checked) done++;
      });
    });
    return { done: done, total: total };
  }

  function setBar(bar, done, total) {
    var pct = total ? Math.round((done / total) * 100) : 0;
    bar.firstElementChild.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
  }

  function refreshCounts() {
    var allDone = 0, allTotal = 0;
    PEOPLE.forEach(function (p) {
      var c = countsFor(p.key);
      allDone += c.done;
      allTotal += c.total;
      var tab = document.getElementById('tab-' + p.key);
      if (tab) {
        tab.querySelector('.tc').textContent = c.done + '/' + c.total + ' (' + (c.total ? Math.round(c.done / c.total * 100) : 0) + '%)';
        setBar(tab.querySelector('.progress'), c.done, c.total);
      }
      if (p.key === activeKey) {
        var pb = document.getElementById('personBar');
        if (pb) {
          setBar(pb, c.done, c.total);
          document.getElementById('personCount').textContent = c.done + '/' + c.total;
        }
      }
    });
    setBar(document.getElementById('totalBar'), allDone, allTotal);
    document.getElementById('totalCount').textContent = allDone + '/' + allTotal;

    if (activeKey) {
      DATA[activeKey].forEach(function (s) {
        var sec = document.getElementById('sec-' + activeKey + '-' + s.id);
        if (!sec) return;
        var d = 0;
        s.items.forEach(function (it) { if (effective(it.id).checked) d++; });
        sec.querySelector('.scount').textContent = d + '/' + s.items.length;
        sec.classList.toggle('all-done', d === s.items.length);
      });
    }
  }

  function updateSync() {
    var badge = document.getElementById('sync');
    var banner = document.getElementById('banner');
    var pending = Object.keys(queue).length;
    badge.classList.remove('on', 'off');
    if (online === true) {
      badge.classList.add('on');
      badge.textContent = flushing || pending ? 'Wysyłanie… (' + pending + ')' : 'Zapis wspólny: połączono';
    } else if (online === false) {
      badge.classList.add('off');
      badge.textContent = 'Offline' + (pending ? ' · w kolejce: ' + pending : '');
    } else {
      badge.textContent = 'Łączenie…';
    }
    var show = online === false;
    banner.classList.toggle('show', show);
    if (show) {
      var t = document.getElementById('bannerText');
      t.textContent = '';
      t.appendChild(el('b', null, 'Brak połączenia z magazynem'));
      t.appendChild(document.createTextNode(' — zmiany zapisane lokalnie i zostaną wysłane.' +
        (pending ? ' Czeka: ' + pending + '.' : '') +
        (CONFIGURED ? '' : ' (Adres magazynu nie jest jeszcze ustawiony).')));
    }
  }

  function refreshItem(id) {
    var node = document.getElementById('it-' + id);
    if (!node) return;
    var e = effective(id);
    var cb = node.querySelector('input[type="checkbox"]');
    cb.checked = e.checked;
    node.classList.toggle('done', e.checked);
    node.classList.toggle('has-note', !!e.note);
    var ta = node.querySelector('textarea');
    if (document.activeElement !== ta && !noteTimers[id] && ta.value !== e.note) ta.value = e.note;
    var meta = node.querySelector('.meta');
    meta.textContent = '';
    meta.classList.toggle('pending', e.pending);
    if (e.pending) {
      meta.textContent = online === false ? 'Zapisane lokalnie — czeka na wysłanie.' : 'Wysyłanie…';
    } else if (e.updated_by && e.updated_at) {
      meta.appendChild(document.createTextNode(e.checked ? 'Odznaczył(a): ' : 'Ostatnia zmiana: '));
      meta.appendChild(el('b', null, e.updated_by));
      meta.appendChild(document.createTextNode(' · ' + fmtDate(e.updated_at)));
    }
  }

  function refreshAll() {
    if (activeKey) {
      DATA[activeKey].forEach(function (s) { s.items.forEach(function (it) { refreshItem(it.id); }); });
    }
    refreshCounts();
    updateSync();
  }

  function renderItem(it, sectionNo) {
    var art = el('article', 'item');
    art.id = 'it-' + it.id;

    var head = el('div', 'head');
    var cb = el('input');
    cb.type = 'checkbox';
    cb.id = 'cb-' + it.id;
    cb.addEventListener('change', function () { setItem(it.id, { checked: cb.checked }); });
    var lab = el('label');
    lab.htmlFor = cb.id;
    var h3 = el('h3');
    h3.appendChild(el('span', 'num', sectionNo + '.' + Number(it.num)));
    h3.appendChild(document.createTextNode(it.t));
    lab.appendChild(h3);
    lab.appendChild(el('span', 'acc acc-' + it.acc, D.ROLES[it.acc] || it.acc));
    head.appendChild(cb);
    head.appendChild(lab);
    art.appendChild(head);

    art.appendChild(el('div', 'lab', 'Kroki'));
    var ol = el('ol');
    it.steps.forEach(function (s) { ol.appendChild(el('li', null, s)); });
    art.appendChild(ol);

    art.appendChild(el('div', 'lab', 'Oczekiwany wynik'));
    art.appendChild(el('div', 'exp', it.ok));

    art.appendChild(el('div', 'meta'));

    var nl = el('label', 'lab', 'Uwagi / znaleziony błąd');
    nl.htmlFor = 'nt-' + it.id;
    nl.style.display = 'block';
    art.appendChild(nl);
    var ta = el('textarea', 'note');
    ta.id = 'nt-' + it.id;
    ta.rows = 2;
    ta.maxLength = 2000;
    ta.placeholder = 'Co kliknąłeś, co się stało, czego się spodziewałeś…';
    function commitNote() {
      if (noteTimers[it.id]) { clearTimeout(noteTimers[it.id]); delete noteTimers[it.id]; }
      if (ta.value !== effective(it.id).note) setItem(it.id, { note: ta.value });
    }
    ta.addEventListener('input', function () {
      if (noteTimers[it.id]) clearTimeout(noteTimers[it.id]);
      noteTimers[it.id] = setTimeout(commitNote, NOTE_DEBOUNCE_MS);
    });
    ta.addEventListener('blur', commitNote);
    art.appendChild(ta);
    return art;
  }

  function renderPanel(key) {
    var p = PEOPLE.filter(function (x) { return x.key === key; })[0];
    var panel = document.getElementById('panel');
    panel.textContent = '';
    panel.setAttribute('aria-labelledby', 'tab-' + key);

    var head = el('div', 'box person-head');
    head.appendChild(el('h2', null, p.name + ': scenariusze'));
    head.appendChild(el('p', 'sub', 'Obszar specjalny: ' + p.focus + '.'));
    head.appendChild(el('p', 'sub', 'Rejon Twojego konta TS: ' + p.region + '. Nieruchomości i klientów testowych zakładaj w tym województwie (np. ' + p.city + '), wtedy przekazanie trafi do Twojego TS.'));
    var row = el('div', 'bar-row');
    row.appendChild(el('span', 'lbl', p.name));
    var bar = el('div', 'progress');
    bar.id = 'personBar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Postęp: ' + p.name);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.appendChild(el('i'));
    row.appendChild(bar);
    var pc = el('span', 'pcount', '0/0');
    pc.id = 'personCount';
    row.appendChild(pc);
    head.appendChild(row);
    panel.appendChild(head);

    DATA[key].forEach(function (s, idx) {
      var sec = el('section', 'section');
      sec.id = 'sec-' + key + '-' + s.id;
      var no = String(idx + 1);
      var h2 = el('h2');
      h2.appendChild(document.createTextNode(no + '. ' + s.title));
      h2.appendChild(el('span', 'scount', ''));
      sec.appendChild(h2);
      if (s.lead) sec.appendChild(el('p', 'lead', s.lead));
      sec.appendChild(el('p', 'empty-done', 'Wszystkie punkty tej sekcji są odznaczone.'));
      s.items.forEach(function (it) { sec.appendChild(renderItem(it, no)); });
      panel.appendChild(sec);
    });
  }

  function renderAccounts(p) {
    document.getElementById('accHead').textContent = 'Konta: ' + p.name;
    var box = document.getElementById('accounts');
    box.textContent = '';
    [['SS', p.key + '.sales.support@handshake.pl'],
     ['CL', p.key + '.closer@handshake.pl'],
     ['TS', p.key + '.transaction.specialist@handshake.pl']].forEach(function (a) {
      var row = el('div', 'acct');
      row.appendChild(el('span', 'acc acc-' + a[0], D.ROLES[a[0]]));
      row.appendChild(el('code', null, a[1]));
      var b = el('button', 'act', 'Kopiuj login');
      b.type = 'button';
      b.addEventListener('click', function () { copyText(a[1]); });
      row.appendChild(b);
      box.appendChild(row);
    });
  }

  function selectTab(key, focus) {
    if (!DATA[key]) key = PEOPLE[0].key;
    activeKey = key;
    PEOPLE.forEach(function (p) {
      var t = document.getElementById('tab-' + p.key);
      var sel = p.key === key;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      if (sel && focus) t.focus();
    });
    lsSet(LS_TAB, key);
    if (window.location.hash !== '#' + key) {
      try { history.replaceState(null, '', '#' + key); } catch (e) { /* file:// */ }
    }
    renderAccounts(PEOPLE.filter(function (x) { return x.key === key; })[0]);
    renderPanel(key);
    refreshAll();
  }

  function renderTabs() {
    var tabs = document.getElementById('tabs');
    PEOPLE.forEach(function (p, i) {
      var b = el('button', 'tab');
      b.type = 'button';
      b.id = 'tab-' + p.key;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', 'panel');
      b.appendChild(el('b', null, p.name));
      b.appendChild(el('span', 'tc', ''));
      var bar = el('span', 'progress');
      bar.appendChild(el('i'));
      b.appendChild(bar);
      b.addEventListener('click', function () { selectTab(p.key); });
      b.addEventListener('keydown', function (ev) {
        var dir = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        ev.preventDefault();
        selectTab(PEOPLE[(i + dir + PEOPLE.length) % PEOPLE.length].key, true);
      });
      tabs.appendChild(b);
    });
  }

  function init() {
    renderTabs();

    var appLine = document.getElementById('appLine');
    if (CONFIGURED) {
      appLine.textContent = '';
      var a = el('a', 'act', 'Otwórz CRM v3 ↗');
      a.href = ROOT + '/';
      a.target = '_blank';
      a.rel = 'noopener';
      appLine.appendChild(a);
    }

    document.getElementById('sampleText').textContent = SAMPLE_VALUATION;
    document.getElementById('copySample').addEventListener('click', function () { copyText(SAMPLE_VALUATION); });
    document.getElementById('retryNow').addEventListener('click', retryNow);

    var hide = document.getElementById('hideDone');
    hide.checked = lsGet(LS_HIDE) === '1';
    document.body.classList.toggle('hide-done', hide.checked);
    hide.addEventListener('change', function () {
      document.body.classList.toggle('hide-done', hide.checked);
      lsSet(LS_HIDE, hide.checked ? '1' : '0');
    });

    var fromHash = (window.location.hash || '').replace('#', '');
    selectTab(DATA[fromHash] ? fromHash : (lsGet(LS_TAB) || PEOPLE[0].key));

    window.addEventListener('hashchange', function () {
      var k = (window.location.hash || '').replace('#', '');
      if (DATA[k] && k !== activeKey) selectTab(k);
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) load();
    });
    window.addEventListener('online', retryNow);
    window.addEventListener('pagehide', function () {
      Object.keys(noteTimers).forEach(function (id) {
        var ta = document.getElementById('nt-' + id);
        clearTimeout(noteTimers[id]);
        delete noteTimers[id];
        if (ta && ta.value !== effective(id).note) setItem(id, { note: ta.value });
      });
    });
    setInterval(function () { if (!document.hidden) load(); }, POLL_MS);
    load();
  }

  init();
})();
