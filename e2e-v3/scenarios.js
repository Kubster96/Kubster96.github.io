/*
 * Scenariusze przeklikania E2E Handshake CRM v3 — treść checklisty.
 * Id punktu = "<osoba>.<sekcja>-<nr>" (np. maciej.ss-03) i jest kluczem w magazynie
 * odznaczeń. Nie zmieniaj id ani kolejności istniejących punktów po rozesłaniu linku;
 * nowe punkty dopisuj na końcu sekcji z kolejnym numerem.
 * W tekstach: {N} = imię testera, {k} = login (maciej / karol / mateusz).
 */
(function () {
  'use strict';

  var PEOPLE = [
    { key: 'maciej', name: 'Maciej', focus: 'sprzedający, nieruchomości, umowy, wycena → symulacja', region: 'podkarpackie', city: 'Rzeszów' },
    { key: 'karol', name: 'Karol', focus: 'kupujący, poszukiwania, dopasowania, link do ofert, szansa', region: 'małopolskie', city: 'Kraków' },
    { key: 'mateusz', name: 'Mateusz', focus: 'kalendarz i spotkania, nagrania, anty-duplikacja, przekazania, rejony', region: 'lubelskie', city: 'Lublin' }
  ];

  var ROLES = {
    SS: 'Sales Support',
    CL: 'Closer',
    TS: 'Transaction Specialist',
    ALL: 'wszystkie 3 konta'
  };

  var COMMON = [
    {
      id: 'wsp',
      title: 'Start i rzeczy wspólne',
      lead: 'Logowanie, kokpit, paleta ⌘K, kalendarz i granice każdej roli. Punkt 03 zrób po sekcji Sales Support, gdy masz już rekordy „TEST {N}”.',
      items: [
        {
          acc: 'ALL',
          t: 'Logowanie na trzy konta',
          steps: [
            'Otwórz CRM v3 (link na górze strony). Zaloguj się kontem {k}.sales.support@handshake.pl, hasło dostałeś osobno.',
            'Sprawdź menu użytkownika (prawy górny róg), potem „Wyloguj się”.',
            'Powtórz dla {k}.closer@handshake.pl i {k}.transaction.specialist@handshake.pl. Najwygodniej trzymać każde konto w osobnym profilu przeglądarki albo w osobnym oknie prywatnym.'
          ],
          ok: 'Każde konto wchodzi na „Dashboard”, a menu pokazuje właściwą rolę: Sales support, Closer albo Transaction specialist. Po wylogowaniu widać ekran „Zaloguj się” z komunikatem „Wylogowano.”.'
        },
        {
          acc: 'SS',
          t: 'Kokpit (Dashboard)',
          steps: [
            'Menu „Dashboard”. Przełącz okres liczników „Dzisiaj” → „Bieżący tydzień”.',
            'Przełącz kontekst „Moje dane” ↔ „Cała struktura”.',
            'Przewiń karty „Agenda”, „Kalendarz”, „Wymaga uwagi”, „Nowe od klientów”.'
          ],
          ok: 'Strona ładuje się bez błędów, a liczniki zmieniają się razem z okresem. Pusta karta pokazuje pusty stan (np. „Czysto — nic nie czeka”), nie komunikat o błędzie.'
        },
        {
          acc: 'SS',
          t: 'Paleta wyszukiwania ⌘K',
          steps: [
            'Naciśnij ⌘K (Mac) / Ctrl+K albo kliknij pole „Szukaj po nazwie, telefonie albo w notatkach…”.',
            'Wpisz „kalen”: powinna pojawić się sekcja „Przejdź do” z pozycją menu.',
            'Wpisz „TEST {N}”, potem dopisuj i kasuj litery. Kliknij wynik. Esc zamyka paletę.'
          ],
          ok: 'Wyniki są pogrupowane („Klienci”, „Nieruchomości”, „Poszukiwania”, „Szanse sprzedażowe”), a szanse i poszukiwania mają dopisek statusu albo typu. Paleta nie wisi na „Szukam…”, kliknięcie otwiera właściwą kartę. Sales Support widzi wyłącznie swoje rekordy.'
        },
        {
          acc: 'ALL',
          t: 'Kalendarz — widoki i własne wydarzenie',
          steps: [
            'Menu „Kalendarz”: przełącz „Miesiąc”, „Tydzień”, „Dzień” i „Dziś”.',
            '„Nowe wydarzenie” → tytuł „TEST {N} wydarzenie”, jutro 15:00 → „Dodaj wydarzenie”.',
            'Kliknij je („Szczegóły wydarzenia”) i usuń przyciskiem „Usuń wydarzenie”.'
          ],
          ok: 'Widoki się przełączają, wydarzenie pojawia się („Wydarzenie dodane.”) i po usunięciu znika („Wydarzenie usunięte.”).'
        },
        {
          acc: 'SS',
          t: 'Czego Sales Support NIE może',
          steps: [
            'Na liście „Klienci” wpisz popularne nazwisko (np. „Kowalsk”).',
            'Poproś drugiego testera o link do jego klienta „TEST …” i otwórz go na swoim koncie SS.',
            'Przejrzyj menu boczne.'
          ],
          ok: 'Na liście są wyłącznie Twoje rekordy. Cudzy klient daje „Nie znaleziono klienta. Klient nie istnieje albo nie masz do niego dostępu.”. W menu nie ma pozycji administracyjnych („Użytkownicy”, „Audyt”).'
        },
        {
          acc: 'CL',
          t: 'Czego Closer NIE może',
          steps: [
            'Na koncie Closer otwórz listy „Klienci” i „Nieruchomości” w kontekście „Moje dane” i „Cała struktura”.',
            'W palecie ⌘K wpisz nazwisko klienta, z którym nie masz spotkania (np. „Kowalsk”).',
            'Otwórz link do cudzego rekordu „TEST …” innego testera.'
          ],
          ok: 'Closer widzi tylko rekordy, przy których ma spotkanie. „Moje dane” są puste, bo closer nie zostaje właścicielem rekordu. Cudzy rekord daje podgląd „Tryb przeglądania — …” albo brak dostępu i niczego nie da się w nim zmienić.'
        },
        {
          acc: 'TS',
          t: 'Czego Transaction Specialist NIE może (tylko patrz, nic nie zapisuj)',
          steps: [
            'Na koncie TS otwórz „Nieruchomości” w kontekście „Cała struktura” i otwórz dowolną PRAWDZIWĄ nieruchomość, której nie prowadzisz. Nic w niej nie klikaj.',
            'Na liście nieruchomości i na liście klientów obejrzyj wiersze rekordów, które tylko czytasz.'
          ],
          ok: 'Karta pokazuje pasek „Tryb przeglądania — nieruchomość prowadzi …”, a przyciski w „Co dalej?” są wyłączone. Przy wierszach tylko do odczytu nie ma „Zaktualizuj”, błyskawicy ani menu „⋯”, a pigułka statusu się nie klika. W osi czasu klienta nie ma pola notatki albo widać „Brak dostępu do osi czasu klienta”.'
        }
      ]
    },
    {
      id: 'ss',
      title: 'Sales Support: pozyskanie i kwalifikacja sprzedającego',
      lead: 'Konto {k}.sales.support. Spotkania umawiaj na DZIŚ, ok. 20–60 minut naprzód: closer może rozliczyć spotkanie dopiero po jego rozpoczęciu.',
      items: [
        {
          acc: 'SS',
          t: 'Dodanie klienta testowego',
          steps: [
            '„Klienci” → „Dodaj klienta”: imię „TEST {N}”, nazwisko „Sprzedający”, telefon = Twój własny numer, e-mail = Twój własny adres.',
            'Zanim zapiszesz, popatrz na komunikat pod polem telefonu. Potem zapisz.'
          ],
          ok: 'Najpierw „Numer wolny — możesz dodać klienta.”, potem otwiera się karta nowego klienta z komunikatem „Klient dodany.”. „Właściciel rekordu” to Twoje konto Sales Support. Jeśli Twój numer już jest w bazie, wpisz w uwagach, czyj to rekord, i nie zapisuj.'
        },
        {
          acc: 'SS',
          t: 'Rozmowa prospectingowa („Zaktualizuj”)',
          steps: [
            'Na karcie klienta „Zaktualizuj” → przejdź okno rozmowy do końca (klient odebrał, jest zainteresowany sprzedażą).',
            'W kroku o filmie wybierz „Nie wysyłam” i powód z listy. Zapisz rozmowę.'
          ],
          ok: 'Okno prowadzi pytaniami, a bez odpowiedzi o filmie „Dalej” jest nieaktywne. Po zapisie status sprzedaży to „Aktywny”, a rozmowa jest na osi czasu klienta.'
        },
        {
          acc: 'SS',
          t: 'Nieruchomość z karty klienta',
          steps: [
            'Na karcie klienta: „Powiązania” → „Dodaj nieruchomość”. Na liście „Nieruchomości” tego przycisku nie ma i tak ma być.',
            'Typ „Lokal mieszkalny”, nazwa zaczyna się od „TEST {N}”, adres w województwie Twojego konta TS, metraż, cena (np. 425 000 zł). Zapisz.'
          ],
          ok: 'Nieruchomość startuje w „Follow up po telefonie” z terminem kontaktu. „Właściciel rekordu” to Ty, a nieruchomość widać w „Powiązaniach” klienta.'
        },
        {
          acc: 'SS',
          t: 'Umówienie spotkania z closerem (na miejscu)',
          steps: [
            '„Zmień status nieruchomości” → „Umawiam spotkanie”.',
            'Przy „Kto poprowadzi spotkanie?” wybierz SWOJE konto Closer ({k}.closer), nikogo innego.',
            'Termin: dziś, ok. 20–30 min od teraz; forma „na miejscu”. Zapisz.'
          ],
          ok: 'Przy wyborze closera widać jego zajętość („… ma tego dnia zajęte:” albo „Tego dnia bez spotkań.”). Status: „Umówiono na pozyskanie”, na karcie „Spotkanie prowadzi …”, spotkanie jest w kalendarzu Twojego closera.'
        },
        {
          acc: 'SS',
          t: 'Kolizja terminów i drugie spotkanie (online)',
          steps: [
            'Na karcie klienta dodaj drugą nieruchomość „TEST {N} 2” (jak w punkcie 03).',
            'Umów na niej spotkanie u tego samego closera DOKŁADNIE w tym samym terminie co w punkcie 04.',
            'Po odrzuceniu zmień termin na dziś, ok. 40–60 min od teraz, forma ONLINE. Zapisz.'
          ],
          ok: 'Przy kolizji okno ostrzega „Ten termin nachodzi na inne spotkanie closera — zapis zostanie odrzucony.” i zapis nie przechodzi. Spotkanie online w innym terminie zapisuje się, a status to „Umówiono na pozyskanie”.'
        },
        {
          acc: 'SS',
          t: 'Potwierdzenie terminu',
          steps: [
            'Na nieruchomości „TEST {N}” (spotkanie na miejscu) kliknij „Potwierdź termin”, tak jakbyś potwierdził go telefonicznie z klientem.'
          ],
          ok: 'Komunikat „Termin spotkania potwierdzony.”, przy spotkaniu „Potwierdził … telefonem, <data>”. Status nieruchomości się NIE zmienia.'
        },
        {
          acc: 'SS',
          t: 'Sales Support nie rozlicza nagrania closera (D-V3-49)',
          steps: [
            'Gdy minie godzina spotkania online z punktu 05: na karcie „TEST {N} 2” otwórz „Zmień status nieruchomości” i wybierz wynik odbytego spotkania (np. „Klient się zastanawia”).',
            'NIE zapisuj. Zostaw okno otwarte i przejdź do punktu Closer 03.'
          ],
          ok: 'Sekcja nagrania pokazuje ramkę „Nagranie rozlicza prowadzący spotkanie” z nazwiskiem Twojego closera, bez przycisków wgrania i powodu. „Zapisz zmianę statusu” jest wyłączony. Po rozliczeniu przez closera (Closer 03) okno w ciągu ok. 10 s pokazuje „Nagranie tego spotkania rozliczył(a) …”. Potem zamknij okno bez zapisu, bo spotkanie rozstrzyga closer.'
        }
      ]
    },
    {
      id: 'cl',
      title: 'Closer: spotkanie, nagranie, umowa',
      lead: 'Konto {k}.closer. Pracujesz na spotkaniach umówionych w sekcji Sales Support (punkty 04 i 05).',
      items: [
        {
          acc: 'CL',
          t: 'Moje spotkania',
          steps: [
            '„Kalendarz” → dziś. Zajrzyj też na „Dashboard”: karty „Kalendarz” i „Agenda”.'
          ],
          ok: 'Oba spotkania pozyskaniowe („TEST {N}” na miejscu i „TEST {N} 2” online) są w kalendarzu i na kokpicie. Jeśli kokpit pokazuje „Twoje spotkania — do potwierdzenia dziś”, przycisk „Potwierdzone” działa.'
        },
        {
          acc: 'CL',
          t: 'Szczegóły spotkania i dostęp do rekordu',
          steps: [
            'Kliknij spotkanie „TEST {N}” w kalendarzu i spróbuj przeciągnąć je na inną godzinę.',
            'W szczegółach „Otwórz nieruchomość”, a z niej kartę klienta. Dodaj notatkę „TEST {N} notatka closera”.'
          ],
          ok: '„Szczegóły wydarzenia” pokazują rodzaj, termin, formę, miejsce, „Powiązany rekord” i stan potwierdzenia („Potwierdził … telefonem”). Spotkania z lejka nie da się przeciągnąć. Karta jest dostępna do pracy (notatka się zapisuje), ale „Właściciel rekordu” to dalej Sales Support.'
        },
        {
          acc: 'CL',
          t: 'Rozliczenie nagrania spotkania online',
          steps: [
            'Gdy zacznie się termin spotkania online „TEST {N} 2”: kliknij je w kalendarzu → sekcja nagrania → „Nie mam nagrania” → powód (np. „Klient nie zgodził się na nagrywanie”) → zapisz.',
            'Wróć do okna Sales Support z punktu SS 07.'
          ],
          ok: 'Powód zapisuje się przy spotkaniu. W oknie Sales Support w ciągu ok. 10 s pojawia się „Nagranie tego spotkania rozliczył(a) …”.'
        },
        {
          acc: 'CL',
          t: 'Rozstrzygnięcie spotkania: klient się zastanawia',
          steps: [
            'Na „TEST {N} 2”: „Zmień status nieruchomości” → „Czy podpisano umowę pośrednictwa?” → „Klient się zastanawia”.',
            'Przekonania blokujące: zaznacz kilka albo „Brak przekonań blokujących”. Ceny: agent 370 000, klient 400 000. Termin follow-upu: za 3 dni. Zapisz.'
          ],
          ok: 'Pole „Różnica cen ze spotkania (%)” pokazuje „8,11”, a „Co się stanie po zapisie” mówi „…różnica wyniesie 8,11%”. Bez odpowiedzi o przekonaniach okno nie pozwala zapisać. Po zapisie status to „Follow up po pozyskaniu”, a spotkanie znika z „Spotkania bez rozstrzygnięcia”.'
        },
        {
          acc: 'CL',
          t: 'Umowa podpisana → przekazanie do TS',
          steps: [
            'Gdy minie termin spotkania „TEST {N}” (na miejscu): „Zmień status nieruchomości” → „Czy podpisano umowę pośrednictwa?” → „Umowa podpisana”.',
            'Uzupełnij dane umowy (data, okres, cena, prowizja) i brakujące pola nieruchomości wartościami testowymi. Zapisz i odśwież kartę.'
          ],
          ok: 'Status zmienia się na „Fotograf do umówienia”, a „Właściciel rekordu” na Transaction Specialist z rejonu nieruchomości, razem z klientem. Powinno to być TWOJE konto TS. Jeśli to ktoś inny, zatrzymaj się, wpisz w uwagach, kto przejął rekord, i daj znać Jakubowi.'
        },
        {
          acc: 'CL',
          t: 'Tylko odczyt po przekazaniu',
          steps: [
            'Otwórz ponownie nieruchomość „TEST {N}” po przekazaniu.'
          ],
          ok: 'Pasek „Tryb przeglądania — nieruchomość prowadzi …”, przyciski „Co dalej?” są wyłączone, a oś czasu klienta nie ma pola notatki. Nic nie da się zmienić.'
        },
        {
          acc: 'CL',
          t: 'Zakładka „Wycena” (bez wgrywania)',
          steps: [
            'Na „TEST {N} 2” otwórz zakładkę „Wycena”. Nic nie wgrywaj.'
          ],
          ok: 'Zakładka się wczytuje: „Wgraj wycenę” (Plik / Wklej tekst), „Utwórz symulację z wyceny” i lista „Symulacje tej nieruchomości” (pusta: „Brak symulacji”).'
        }
      ]
    },
    {
      id: 'ts',
      title: 'Transaction Specialist: przejęcie, poszukiwanie, symulacja',
      lead: 'Konto {k}.transaction.specialist. Pracujesz na nieruchomości „TEST {N}” przekazanej w punkcie Closer 05 i na nowym kupującym testowym.',
      items: [
        {
          acc: 'TS',
          t: 'Przejęta nieruchomość: fotograf',
          steps: [
            '„Nieruchomości” → „TEST {N}”. Sprawdź „Właściciel rekordu”.',
            '„Zmień status nieruchomości” → „Umówiono fotografa” → termin (np. jutro 12:00) → zapisz.'
          ],
          ok: 'Właścicielem jest Twoje konto TS. Status zmienia się na „Oczekiwanie na zdjęcia”, a w Twoim kalendarzu pojawia się „Sesja zdjęciowa”.'
        },
        {
          acc: 'TS',
          t: 'Przejęty klient i historia',
          steps: [
            'Otwórz kartę klienta „TEST {N} Sprzedający” z nagłówka nieruchomości.'
          ],
          ok: 'Klient należy teraz do Ciebie. Na osi czasu widać rozmowę SS, notatkę closera, spotkanie i zmianę statusu, bez wpisów „undefined”.'
        },
        {
          acc: 'TS',
          t: 'Kupujący testowy i jego lejek',
          steps: [
            '„Klienci” → „Dodaj klienta”: „TEST {N}” / „Kupujący”, telefon i e-mail TWOJE, inne niż u sprzedającego (drugi numer, nigdy wymyślony).',
            'Panel „Lejek kupującego”: „Wysłano landing page — follow-up” z terminem, potem „Klient otwarty na rozmowę”.'
          ],
          ok: 'Każdy krok potwierdza komunikat „Zapisano — etap: …”: najpierw „Follow-up” (termin widać w „Agendzie”), potem „Aktywny”.'
        },
        {
          acc: 'TS',
          t: 'Poszukiwanie i dopasowania',
          steps: [
            '„Poszukiwania” → „Dodaj poszukiwanie” dla kupującego testowego: typ „Lokal mieszkalny”, budżet powyżej ceny „TEST {N}”, „Dodaj obszar” na mapie obejmujący adres „TEST {N}”. Oznacz kryteria i zapisz.',
            'Otwórz kartę poszukiwania. W uwagach zapisz, ile sekund się ładowała.'
          ],
          ok: 'Karta pokazuje dopasowania w grupach „Pozyskane”, „Procesowane”, „Potencjalne”, a archiwum jest schowane. „TEST {N}” jest na liście. Brak danych w polu nieruchomości nie wyrzuca jej z listy, tylko oznacza „brak danych”.'
        },
        {
          acc: 'TS',
          t: 'Symulacja z wyceny',
          steps: [
            'Na „TEST {N}” zakładka „Wycena” → „Wgraj wycenę” → „Wklej tekst” → wklej wycenę testową (przycisk „Kopiuj wycenę testową” na górze tej strony) → „Utwórz symulację z wyceny”.',
            'Poczekaj kilka minut i odśwież. Wyceny wgrywaj tylko raz, bo każda zużywa model AI.'
          ],
          ok: 'Od razu pojawia się symulacja ze stanem „AI analizuje wycenę i wypełnia symulację”, widoczna w menu „Symulacje”. Po analizie symulacja jest wypełniona (nie „Błąd analizy”), a „Otwórz podgląd dla klienta” pokazuje gotowy podgląd.'
        },
        {
          acc: 'TS',
          t: 'Rejony: kogo widzi TS',
          steps: [
            'W menu użytkownika (albo u Jakuba) sprawdź, jaki rejon ma Twoje konto TS.',
            'Na liście „Klienci” („Cała struktura”) zobacz, czy są tam klienci „TEST …” innych testerów.'
          ],
          ok: 'TS widzi klientów sprzedających ze swojego rejonu. Klient z innego rejonu daje „Nie znaleziono klienta”. W uwagach zapisz swój rejon.'
        }
      ]
    }
  ];

  var SPECIAL = {
    maciej: {
      title: 'Obszar specjalny Macieja: sprzedający, nieruchomości, umowy, wycena → symulacja',
      lead: 'Drugi klient-sprzedający potrzebuje TWOJEGO drugiego numeru telefonu. Jeśli go nie masz, pomiń punkty 01–02 i wpisz to w uwagach.',
      items: [
        {
          acc: 'SS',
          t: 'Nieodebrane telefony: decyzja po trzecim (D-KL-03)',
          steps: [
            'Dodaj klienta „TEST Maciej Sprzedający 2” (Twój drugi numer).',
            'Trzy razy: „Zaktualizuj” → „Nie odebrał” → termin kolejnej próby → zapisz.',
            'Przy trzecim wybierz „Kolejny termin”. Przy czwartym wybierz „Odkładam — „Nie odbiera”” → „Dalej”, obejrzyj podsumowanie i zapisz.'
          ],
          ok: 'Licznik rośnie 1/3, 2/3, 3/3. Od trzeciego okno pyta „To 3. nieodebrany telefon z rzędu. Co dalej z klientem?”. Przy czwartym nagłówek i ostrzeżenie w podsumowaniu mówią to samo: „To 4. nieodebrany telefon z rzędu”. Po odłożeniu status to „Nie odbiera”, jest przycisk „Przywróć klienta”, a klient znika z domyślnej listy i z agendy.'
        },
        {
          acc: 'SS',
          t: 'Film i e-mail po rozmowie (D-MAT-20, D-MAT-21)',
          steps: [
            'Na kliencie z punktu 01 kliknij „Przywróć klienta”, potem „Zaktualizuj” → klient odebrał → w kroku o filmie wybierz „Film o sprzedaży” i „Link do WhatsAppa albo SMS-a”.',
            'W kroku e-mail wybierz „Nie zapytałem”. Zapisz rozmowę.'
          ],
          ok: 'Zapis rozmowy niczego nie wysyła. Ekran wyniku pokazuje „Skopiuj link dla tego klienta”, a link powstaje dopiero po tym kliknięciu. Przy kliencie bez adresu e-mail widać plakietkę „Mail nie zebrany”.'
        },
        {
          acc: 'SS',
          t: 'Formularz nieruchomości: prowizja i pola typu',
          steps: [
            'Edytuj „TEST Maciej 2” (wciąż Twoja): ustaw prowizję procentową (np. 2,5%) przy cenie 425 000 zł.',
            'Zmień typ na „Dom” i z powrotem na „Lokal mieszkalny”, bez zapisu zmiany typu.'
          ],
          ok: 'Wyliczona „Kwota prowizji” jest po polsku: przecinek dziesiętny i odstęp tysięcy (np. „10 625”). Pola formularza zmieniają się z typem, a po powrocie wpisane wartości zostają.'
        },
        {
          acc: 'SS',
          t: 'Portal klienta: link i zdjęcia',
          steps: [
            'Konto SS, klient „TEST Maciej Sprzedający 2” (jeśli pominąłeś 01–02: konto TS, klient „TEST Maciej Sprzedający”): karta „Portal klienta” → „Skopiuj link” → „Utwórz link”.',
            'Otwórz link w oknie prywatnym albo na telefonie. „Dodaj zdjęcia” → 1–2 neutralne zdjęcia (ściana, biurko; bez ludzi i dokumentów).',
            'W CRM odśwież kartę: teczka „Zdjęcia od klienta” → „Przenieś do galerii”.'
          ],
          ok: 'Link pokazuje się raz, z datą „Link działa do …” (7 dni). Portal wita „Dzień dobry, TEST …!” i pokazuje „Przekazane zdjęcia: …”. Pliki są w CRM, a „Przenieś do galerii” daje „Zdjęcie przeniesione do galerii.”.'
        },
        {
          acc: 'SS',
          t: '„Nowe od klientów” i unieważnienie linku',
          steps: [
            '„Dashboard” → „Nowe od klientów” → przy swojej pozycji „Obsłużone”.',
            'Na karcie klienta „Unieważnij linki” → „Unieważnij”. Odśwież portal w oknie prywatnym.'
          ],
          ok: 'Widać pozycję „Wgrał(a) zdjęcia”, która po „Obsłużone” znika („Pozycja obsłużona.”). CRM pokazuje „Unieważniono linki: …”, a portal „Link jest nieaktywny”.'
        },
        {
          acc: 'TS',
          t: 'Umowa: szkic z warunkami',
          steps: [
            'Konto TS, nieruchomość „TEST Maciej” (przejęta): zakładka „Umowa” → „Załóż umowę”.',
            'Wpisz warunki: cena ofertowa, prowizja (np. 2,75%), okres (np. 7 mies.). Danych osobowych właściciela NIE wpisuj.'
          ],
          ok: 'Szkic umowy powstaje, a warunki się zapisują. Na koncie Sales Support zakładka „Umowa” tej nieruchomości jest tylko do odczytu: bez „Załóż umowę” i bez edycji warunków.'
        },
        {
          acc: 'TS',
          t: 'Wzór umowy z warunkami w formularzu klienta (D-UM-18)',
          steps: [
            'Na szkicu umowy otwórz okno wysyłki formularza danych i przeczytaj podpowiedź pod „Dołącz wzór umowy (PDF)”. Wysyłkę rób WYŁĄCZNIE na swój e-mail albo nie wysyłaj.',
            '„Kopiuj link do formularza danych” → otwórz link w oknie prywatnym → „Otwórz wzór umowy (PDF)”.',
            'Formularza NIE odsyłaj: wymaga PESEL i dowodu, a prawdziwych identyfikatorów nie wpisujemy.'
          ],
          ok: 'Podpowiedź mówi o „warunkach wpisanych na umowie (cena ofertowa, prowizja, okres)”, nie o „pustych polach”. Pod przyciskiem PDF jest tekst „Pełna treść umowy z warunkami ustalonymi z agentem…”. PDF zawiera cenę (cyframi i słownie), prowizję i okres, a w miejscu danych osobowych są kropki.'
        },
        {
          acc: 'TS',
          t: 'Symulacja: edycja, autozapis, podgląd',
          steps: [
            'Otwórz symulację z punktu TS 05 („Symulacje” albo zakładka „Wycena”). Zmień cenę albo scenariusz i poczekaj na „Zapisano”.',
            '„Otwórz podgląd dla klienta”. Potem otwórz tę samą symulację na koncie Sales Support (adres z paska).'
          ],
          ok: 'Zmiany zapisują się same („Zapisano”), a podgląd pokazuje zaktualizowane liczby. Na koncie SS symulacja jest tylko do odczytu („Tylko do odczytu — symulację zmienia jej autor albo prowadzący nieruchomość.”) albo w ogóle niedostępna. Wpisz w uwagach, który wariant widzisz.'
        },
        {
          acc: 'TS',
          t: 'Lista nieruchomości: filtr miasta i kolumny',
          steps: [
            '„Nieruchomości” → filtr „Miasto: wszystkie” → wpisz początek nazwy miasta, w którym leży „TEST Maciej” → wybierz z podpowiedzi → „Wyczyść filtr miasta”.',
            'Przełącz widok listy i widok pogrupowany po statusach.'
          ],
          ok: 'Podpowiedzi pokazują miasta z liczbą nieruchomości, a lista zawęża się do wybranego miasta. Po wyczyszczeniu filtra wraca pełna lista. W obu widokach Twoja nieruchomość ma klikalną pigułkę statusu, a cudze (tylko do odczytu) nie.'
        }
      ]
    },
    karol: {
      title: 'Obszar specjalny Karola: kupujący, poszukiwania, dopasowania, link do ofert',
      lead: 'Bazą jest kupujący testowy i poszukiwanie z sekcji TS (punkty 03–04). Link do ofert i szansę rób WYŁĄCZNIE z nieruchomością „TEST Karol”. Kliknięcie na prawdziwej ofercie wysłałoby powiadomienie prawdziwemu agentowi.',
      items: [
        {
          acc: 'TS',
          t: 'Umówienie kupującego z closerem',
          steps: [
            'Karta „TEST Karol Kupujący” → „Lejek kupującego” → „Umów spotkanie z closerem”.',
            'Closer: TWOJE konto {k}.closer. Termin: dziś, ok. 20 min od teraz. Zapisz.'
          ],
          ok: 'Okno pokazuje zajętość closera. Etap to „Umówiony z closerem”, a w panelu widać „Spotkanie z closerem: …”.'
        },
        {
          acc: 'CL',
          t: 'Closer: spotkanie z kupującym',
          steps: [
            'Konto Closer → „Kalendarz” → spotkanie „Pozyskanie kupującego” → „Otwórz poszukiwanie”.'
          ],
          ok: 'Spotkanie jest w kalendarzu closera, a poszukiwanie otwiera się z kryteriami i obszarem na mapie.'
        },
        {
          acc: 'CL',
          t: 'Closer: wynik spotkania z kupującym',
          steps: [
            'Po rozpoczęciu terminu: na karcie poszukiwania „Wynik spotkania z closerem” → „Płatna usługa” → „Zapisz wynik”.'
          ],
          ok: 'Komunikat „Zapisano wynik spotkania — kupujący: W obsłudze.”. Etap w „Lejku kupującego” na karcie klienta się zgadza.'
        },
        {
          acc: 'TS',
          t: 'Statusy par na poszukiwaniu',
          steps: [
            'Na karcie swojego poszukiwania: parę z „TEST Karol” ustaw na „Do wysłania”.',
            'Dowolną inną parę ustaw na „Nie dotyczy”. To bezpieczne, bo status pary należy do Twojego poszukiwania.'
          ],
          ok: 'Za każdym razem widać komunikat „Status dopasowania: …”. Para „Nie dotyczy” znika z głównej listy i trafia do „Schowane w archiwum: 1”. W uwagach wpisz, ile trwało odświeżenie listy.'
        },
        {
          acc: 'TS',
          t: 'Para widziana od strony nieruchomości',
          steps: [
            'Otwórz „TEST Karol” → sekcja / zakładka „Pasujące poszukiwania”.'
          ],
          ok: 'Twój kupujący jest na liście z tym samym statusem pary co na poszukiwaniu („Do wysłania”).'
        },
        {
          acc: 'TS',
          t: 'Link do ofert i „Interesuje mnie”',
          steps: [
            'Na poszukiwaniu zaznacz TYLKO ofertę „TEST Karol” → „Skopiuj link do ofert”. Nie używaj „Wyślij klientowi”, chyba że na własny e-mail/telefon.',
            'Otwórz link w oknie prywatnym → przy ofercie „Interesuje mnie”.',
            'Wróć do CRM: status pary, „Nowe od klientów” na kokpicie i historia poszukiwania.'
          ],
          ok: 'Strona pokazuje „Oferty wybrane dla Ciebie” z opiekunem. Status pary zmienia się na „Zainteresowany”. W „Nowe od klientów” jest „Zainteresowany(-a) ofertą: …”, a w historii poszukiwania „Skopiowano link do ofert” (nie drugie „Poszukiwanie utworzone”).'
        },
        {
          acc: 'TS',
          t: 'Szansa sprzedażowa z dopasowania',
          steps: [
            'Przy parze „TEST Karol Kupujący” × „TEST Karol” kliknij „Umów prezentację” → termin (jutro), „Prezentacja online?” → „Utwórz szansę”.'
          ],
          ok: 'Powstaje szansa w statusie „Umówiona prezentacja”, a prezentacja jest w Twoim kalendarzu. Szansa pojawia się w palecie ⌘K z dopiskiem statusu.'
        },
        {
          acc: 'TS',
          t: 'Zmiana statusu szansy i termin kontaktu',
          steps: [
            '„Zmień status szansy” → „Prezentacja odbyta, bez umowy” → termin następnego kontaktu → „Zapisz zmianę statusu”.',
            'Potem „Umówiono termin kontaktu” → termin + krótka „Notatka” → „Zapisz termin”.'
          ],
          ok: 'Przed zapisem widać „Status po zapisie: Follow up (po prezentacji)”, a po zapisie „Status zmieniony na „Follow up (po prezentacji)”.” z nowym wpisem w historii. Termin kontaktu daje „Termin kontaktu zapisany. Status szansy bez zmian.”, bez nowego wpisu w historii statusów. Notatka jest na osi czasu.'
        },
        {
          acc: 'TS',
          t: 'Bramki pieniędzy przy umowie rezerwacyjnej (bez faktur)',
          steps: [
            '„Zmień status szansy” → „Umówiono rezerwacyjną/przedwstępną”: spróbuj zapisać bez odpowiedzi „Jak ma być płacona prowizja?”.',
            'Dalej, przy „Umowa podpisana, notariusz do umówienia”, spróbuj zapisać bez odpowiedzi „co z pieniędzmi”.',
            'NIE dodawaj faktur i NIE zapisuj wpływów: na produkcji trafiłyby do rozliczeń. Zamknij okno.'
          ],
          ok: 'Bez odpowiedzi okno nie pozwala zapisać i pokazuje „Uzupełnij, żeby zapisać: Jak ma być płacona prowizja?” albo „Odpowiedz, co z pieniędzmi: …”.'
        }
      ]
    },
    mateusz: {
      title: 'Obszar specjalny Mateusza: kalendarz, spotkania, nagrania, anty-duplikacja, przekazania, rejony',
      lead: 'Bazą są rekordy z sekcji wspólnych. Do punktów 01–02 potrzebujesz kupującego i poszukiwania z sekcji TS (03–04), a do 03–05 nieruchomości „TEST Mateusz 2” po punkcie Closer 04.',
      items: [
        {
          acc: 'TS',
          t: 'Szansa z prezentacją',
          steps: [
            'Na poszukiwaniu „TEST Mateusz Kupujący” przy parze z „TEST Mateusz” → „Umów prezentację” → termin (jutro 11:00) → „Utwórz szansę”.'
          ],
          ok: 'Szansa ma status „Umówiona prezentacja”, a prezentacja jest w Twoim kalendarzu.'
        },
        {
          acc: 'TS',
          t: 'Przesunięcie terminu spotkania (D-SPOT-01/02)',
          steps: [
            'Na szansie panel „Co dalej?” → „Przesuń termin: prezentacja”.',
            'Spróbuj zapisać bez powodu, potem podaj nowy termin (pojutrze 11:00) i powód. Zapisz.'
          ],
          ok: 'Bez powodu zapis się nie uda. Po zapisie status szansy jest BEZ ZMIAN („Umówiona prezentacja”), na osi czasu jest wpis o przesunięciu z powodem, prezentacja w kalendarzu ma nowy termin, a potwierdzenie spotkania jest wyzerowane.'
        },
        {
          acc: 'CL',
          t: 'Nieodbyte spotkanie wraca na etap (D-NK-15/16)',
          steps: [
            'SS: „TEST Mateusz 2” stoi po Closer 04 w „Follow up po pozyskaniu”. Umów na niej spotkanie u swojego closera (dziś, ok. 20 min od teraz, na miejscu).',
            'Closer, po rozpoczęciu terminu: „Zmień status nieruchomości” → „Spotkanie się nie odbyło” → powód „przełożone” → nowy termin (za ok. 20 min) i forma → zapisz. Odśwież kartę kilka razy.',
            'Po nowym terminie: znów „Spotkanie się nie odbyło” → „klient się nie pojawił” → termin kontaktu → zapisz.'
          ],
          ok: 'Po „przełożone” oś czasu nieruchomości ma na górze „Follow up po pozyskaniu → Umówiono na pozyskanie”, a pod spodem „Umówiono na pozyskanie → Follow up po pozyskaniu (Powód: przełożone)”. Kolejność nie zmienia się po odświeżeniu, a okno nie pyta o termin kontaktu. Po „klient się nie pojawił” rekord wraca do „Follow up po pozyskaniu”, czyli na etap, z którego umówiono spotkanie, a nie do „Follow up po telefonie”.'
        },
        {
          acc: 'CL',
          t: 'Zajętość closera widoczna dla umawiającego',
          steps: [
            'Closer: „Nowe wydarzenie” jutro 17:00–18:00, tytuł „TEST Mateusz zajęty”.',
            'SS: na „TEST Mateusz 2” zacznij umawiać spotkanie u swojego closera na jutro 17:00. NIE zapisuj.',
            'Po teście usuń wydarzenie closera.'
          ],
          ok: 'Umawiający widzi „… ma tego dnia zajęte:” z tym wydarzeniem, a termin nachodzący na nie dostaje ostrzeżenie o kolizji.'
        },
        {
          acc: 'CL',
          t: 'Nagranie: spotkanie online, które się jeszcze nie zaczęło',
          steps: [
            'SS: na „TEST Mateusz 2” umów spotkanie ONLINE u swojego closera na jutro 10:00.',
            'Closer: kliknij je w kalendarzu → sekcja nagrania → „Nie mam nagrania” → powód → „Zapisz powód”.',
            'Closer: na tej nieruchomości wybierz „Klient się zastanawia”, w nagraniu „Nie mam nagrania” → powód, uzupełnij resztę i zapisz.'
          ],
          ok: 'W obu miejscach pojawia się komunikat „Spotkanie jest umówione na … i jeszcze się nie zaczęło — nie można uznać go za odbyte…”. Powód się NIE zapisuje, a panel spotkania nadal pokazuje brak rozliczenia.'
        },
        {
          acc: 'SS',
          t: 'Sprawdzenie telefonu, anty-duplikacja (bez zapisu)',
          steps: [
            'Konto SS: „Klienci” → „Dodaj klienta” → wpisz numer „TEST Mateusz Sprzedający” (po przekazaniu prowadzi go TS). NIE zapisuj.',
            'Konto TS: to samo okno i ten sam numer (teraz to Twój klient). NIE zapisuj.',
            'Konto SS: numer innego testera (zapytaj go) i Twój numer z jedną zmienioną cyfrą. NIE zapisuj.'
          ],
          ok: 'Dla zajętego numeru widać „Ten numer jest już w bazie”, nazwę klienta, „Właściciel rekordu” i „Numer prowadzi już agent …”, także gdy klient jest cudzy. Przycisk „Otwórz kartę klienta” jest tylko na koncie, które prowadzi klienta (TS). Wolny numer daje „Numer wolny — możesz dodać klienta.”. Zamknij okno bez zapisu.'
        },
        {
          acc: 'ALL',
          t: 'Przekazania między rolami: ślad na rekordzie',
          steps: [
            'Konto TS: otwórz „TEST Mateusz” → historia statusów i oś czasu nieruchomości. Kolejno na SS i Closer otwórz ten sam rekord.'
          ],
          ok: 'W historii widać łańcuch: utworzenie przez SS → „Umówiono na pozyskanie” → „Fotograf do umówienia” (przekazanie, zmiana właściciela) → „Oczekiwanie na zdjęcia”, każdy wpis przy realnej zmianie, bez duplikatów. SS i Closer widzą rekord tylko w „Tryb przeglądania — …”.'
        },
        {
          acc: 'TS',
          t: 'Widoczność między rejonami',
          steps: [
            'Weź nieruchomość TEST Macieja (podkarpackie) albo Karola (małopolskie) — Twoje konto TS ma lubelskie.',
            'Na swoim koncie TS otwórz ich nieruchomość „TEST …” (link od nich) i adres karty ich klienta-sprzedającego.'
          ],
          ok: 'Nieruchomość z innego rejonu otwiera się w „Tryb przeglądania”. Oś czasu klienta pokazuje spokojny stan „Brak dostępu do osi czasu klienta”, bez „Spróbuj ponownie”, a nazwisko sprzedającego nie jest linkiem. Karta klienta daje „Nie znaleziono klienta”. Rejony kont TS: Maciej — podkarpackie, Karol — małopolskie, Mateusz — lubelskie.'
        },
        {
          acc: 'SS',
          t: 'Cudze poszukiwanie tylko do odczytu',
          steps: [
            'Konto SS: otwórz link do poszukiwania „TEST Karol Kupujący” (poproś Karola).'
          ],
          ok: 'Widać „Tryb przeglądania — poszukiwanie prowadzi …” z kryteriami i obszarem, bez kontaktu do kupującego i bez edycji. To świadomy wyjątek anty-duplikacji.'
        }
      ]
    }
  };

  function fill(text, p) {
    return text.replace(/\{N\}/g, p.name).replace(/\{k\}/g, p.key);
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function buildSection(sec, p, idPrefix) {
    return {
      id: idPrefix,
      title: fill(sec.title, p),
      lead: fill(sec.lead || '', p),
      items: sec.items.map(function (it, i) {
        return {
          id: p.key + '.' + idPrefix + '-' + pad(i + 1),
          num: pad(i + 1),
          acc: it.acc,
          t: fill(it.t, p),
          steps: it.steps.map(function (s) { return fill(s, p); }),
          ok: fill(it.ok, p)
        };
      })
    };
  }

  function build(p) {
    var sections = COMMON.map(function (sec) { return buildSection(sec, p, sec.id); });
    sections.push(buildSection(SPECIAL[p.key], p, 'sp'));
    return sections;
  }

  window.E2E_V3 = {
    PEOPLE: PEOPLE,
    ROLES: ROLES,
    build: build
  };
})();
