/*
 * Przeklik Handshake CRM v3 — wspólna treść checklisty i logika strony.
 * Podstrony osób (jakub.html, karol.html, …) różnią się wyłącznie atrybutem
 * data-person na <body>; cała treść punktów żyje tutaj.
 * Identyfikatory punktów (id) są kluczami zapisu w localStorage — nie zmieniaj
 * ich po rozesłaniu linków, bo zapisany stan przestanie pasować.
 */
(function () {
  'use strict';

  var APP_URL = 'https://handshake-crm-v3-production.up.railway.app';

  var PEOPLE = {
    jakub: 'Jakub Jungiewicz',
    karol: 'Karol Jaworski',
    mateusz: 'Mateusz Molczan',
    maciej: 'Maciej Krawiecki'
  };

  var SECTIONS = [
    {
      id: 'wspolne',
      num: '0',
      title: 'Wspólne',
      lead: 'Na koncie Sales support. Punkt 0.1 sprawdź na każdym z trzech kont.',
      items: [
        {
          id: 'w-logowanie',
          t: 'Logowanie na trzy konta',
          do: 'Otwórz adres systemu i wpisz e-mail oraz hasło konta testowego → „Zaloguj się”. Powtórz dla kont Sales support, Closer i TS (najwygodniej: każde konto w innej przeglądarce albo w oknie prywatnym). Na koniec „Wyloguj się” z menu użytkownika.',
          ok: 'Każde konto wchodzi na „Dashboard”, w menu użytkownika widać właściwą osobę. Po wylogowaniu wracasz do ekranu „Zaloguj się”.'
        },
        {
          id: 'w-kokpit',
          t: 'Kokpit (Dashboard)',
          do: 'Menu „Dashboard”. Przełącz okres liczników: „Dzisiaj” → „Bieżący tydzień”. Przewiń karty: „Agenda”, „Kalendarz”, „Wymaga uwagi”, „Nowe od klientów”.',
          ok: 'Strona ładuje się bez błędu, liczniki zmieniają się z okresem. Karty, które nie mają treści, pokazują pusty stan (np. „Czysto — nic nie czeka”), a nie błąd.'
        },
        {
          id: 'w-szukaj',
          t: 'Wyszukiwanie na górze ekranu',
          do: 'Kliknij pole „Szukaj po nazwie, telefonie albo w notatkach…” (na komputerze także ⌘K) i wpisz kilka liter nazwiska albo fragment numeru telefonu znanego Ci klienta.',
          ok: 'Wyniki są pogrupowane: „Klienci”, „Nieruchomości”, „Poszukiwania”, „Szanse sprzedażowe”. Kliknięcie wyniku otwiera właściwy rekord.'
        },
        {
          id: 'w-karta-klienta',
          t: 'Karta klienta',
          do: 'Menu „Klienci” → otwórz dowolnego klienta. Sprawdź dane, panel „Powiązania” (nieruchomości, poszukiwania, szanse) i oś czasu. Otwórz też klienta, którego prowadzi ktoś inny.',
          ok: 'Karta wczytuje się w całości. Przy cudzym kliencie widać pasek „Tryb przeglądania — klienta prowadzi …” i nie da się niczego zmienić.'
        },
        {
          id: 'w-telefon',
          t: 'Sprawdzenie telefonu (anty-duplikacja)',
          do: 'Na karcie dowolnego klienta kliknij „Kopiuj telefon klienta”. Potem „Klienci” → „Dodaj klienta” i wklej ten numer w pole telefonu. NIE zapisuj — zamknij okno.',
          ok: 'Pod polem pojawia się „Ten numer jest już w bazie” z „Właściciel rekordu” i przyciskiem „Otwórz kartę klienta” — także gdy klient należy do innej osoby. Wymyślony numer daje „Numer wolny — możesz dodać klienta.”'
        },
        {
          id: 'w-miasto',
          t: 'Filtr nieruchomości po mieście',
          do: 'Menu „Nieruchomości” → filtr „Miasto: wszystkie” → wpisz początek nazwy miasta (np. „Rzesz”) i wybierz z podpowiedzi. Potem „Wyczyść filtr miasta”.',
          ok: 'Podpowiedzi pokazują miasta z liczbą nieruchomości, lista zawęża się tylko do wybranego miasta. Po wyczyszczeniu wraca pełna lista.'
        },
        {
          id: 'w-kalendarz',
          t: 'Kalendarz',
          do: 'Menu „Kalendarz”: przełącz „Miesiąc” / „Tydzień” / „Dzień” i „Dziś”. Kliknij dowolne wydarzenie. Dodaj „Nowe wydarzenie” (np. „Test przeklik”) → „Dodaj wydarzenie”, a potem je usuń („Usuń wydarzenie”).',
          ok: 'Widoki się przełączają, szczegóły wydarzenia otwierają się w „Szczegóły wydarzenia”. Własne wydarzenie pojawia się, a po usunięciu znika („Wydarzenie usunięte.”).'
        },
        {
          id: 'w-symulacje',
          t: 'Symulacje',
          do: 'Menu „Symulacje”. Otwórz listę i — jeśli jest — dowolną zapisaną symulację.',
          ok: 'Lista się wczytuje (pusta pokazuje „Brak symulacji”). Cudza symulacja otwiera się z dopiskiem „Tylko do odczytu…”.'
        },
        {
          id: 'w-rejestrator',
          t: 'Rejestrator spotkań (jeśli prowadzisz spotkania online)',
          do: 'Menu „Rejestrator spotkań”. Sprawdź tylko, czy strona się otwiera — nie musisz niczego instalować, jeśli nie nagrywasz spotkań online.',
          ok: 'Strona otwiera się z wersją do pobrania, wymaganiami (macOS, słuchawki USB) i instrukcją „Jak uruchomić”.'
        }
      ]
    },
    {
      id: 'ss',
      num: '1',
      title: 'Sales support — lejek sprzedającego',
      lead: 'Na koncie Sales support. Pracuj na kliencie testowym, którego dodasz w 1.1 — nie na prawdziwych rekordach. Punkty idą po kolei: jeden prowadzi do następnego.',
      items: [
        {
          id: 'ss-nowy-klient',
          t: 'Dodanie klienta testowego',
          do: '„Klienci” → „Dodaj klienta”. Imię „Test”, nazwisko = Twoje imię, wymyślony numer (np. 500 000 1xx). Zapisz.',
          ok: 'Najpierw „Numer wolny — możesz dodać klienta.”, potem karta nowego klienta. „Właściciel rekordu” = Twoje konto Sales support.'
        },
        {
          id: 'ss-rozmowa',
          t: 'Rozmowa prospectingowa („Zaktualizuj”)',
          do: 'Na karcie klienta testowego kliknij „Zaktualizuj” i przejdź okno rozmowy do końca. W kroku „Film dla klienta” wybierz „Nie wysyłam” i powód z listy.',
          ok: 'Okno prowadzi pytaniami i nie pozwala zapisać bez odpowiedzi o filmie. Po zapisie status klienta odpowiada rozmowie, a rozmowa jest na osi czasu.'
        },
        {
          id: 'ss-nieruchomosc',
          t: 'Nieruchomość klienta testowego',
          do: '„Nieruchomości” → „Dodaj nieruchomość”: wybierz klienta testowego, typ, adres (prawdziwa ulica w Rzeszowie albo Warszawie), cenę. Zapisz.',
          ok: 'Nieruchomość powstaje w statusie „Potencjalna”, Właścicielem rekordu jesteś Ty, a na karcie klienta widać ją w „Powiązania”.'
        },
        {
          id: 'ss-followup',
          t: 'Follow up po telefonie',
          do: 'Na karcie nieruchomości „Zmień status nieruchomości” → „Nie teraz, wracamy” → podaj termin kontaktu (np. jutro) i zapisz.',
          ok: 'Status zmienia się na „Follow up po telefonie”, w historii statusów jest jeden nowy wpis, a termin pojawia się w „Agenda” na kokpicie.'
        },
        {
          id: 'ss-umow-closer',
          t: 'Umówienie spotkania z closerem',
          do: '„Zmień status nieruchomości” → „Umawiam spotkanie”. Przy pytaniu „Kto poprowadzi spotkanie?” wybierz SWOJE testowe konto Closer, ustaw termin (np. jutro 10:00) i zapisz.',
          ok: 'Przy wyborze closera widać jego zajętość („… ma tego dnia zajęte:” albo „Tego dnia bez spotkań.”). Status: „Umówiono na pozyskanie”; spotkanie trafia do kalendarza CLOSERA, z dopiskiem „Spotkanie prowadzi …”.'
        },
        {
          id: 'ss-kolizja',
          t: 'Kolizja terminów closera',
          do: 'Spróbuj umówić drugie spotkanie (na innej nieruchomości testowej albo przez „Zmień closera”) u tego samego closera dokładnie w tym samym terminie.',
          ok: 'Okno ostrzega: „Ten termin nachodzi na inne spotkanie closera — zapis zostanie odrzucony.” i zapis nie przechodzi.'
        },
        {
          id: 'ss-potwierdzenie',
          t: 'Potwierdzenie spotkania',
          do: 'Na karcie nieruchomości z umówionym pozyskaniem kliknij „Potwierdź termin” (udajesz, że zadzwoniłeś do klienta).',
          ok: 'Komunikat „Termin spotkania potwierdzony.”, przy spotkaniu „Potwierdził <Ty> telefonem, …”. Status nieruchomości się NIE zmienia.'
        },
        {
          id: 'ss-portal-link',
          t: 'Link do portalu klienta',
          do: 'Na karcie klienta testowego, w karcie „Portal klienta”, kliknij „Skopiuj link” (→ „Utwórz link”). Skopiuj adres. Kliknij też „Wyślij link” → „Wyślij”.',
          ok: 'Adres linku pokazuje się jeden raz z ostrzeżeniem i datą „Link działa do …” (7 dni). Wysyłka kończy się statusem „nie wysłano” albo zostaje „w kolejce” — w próbie generalnej to NORMALNE.'
        },
        {
          id: 'ss-portal-zdjecia',
          t: 'Zdjęcia od klienta przez link',
          do: 'Otwórz skopiowany link w oknie prywatnym albo na telefonie (bez logowania). „Dodaj zdjęcia” → wgraj 1–2 neutralne zdjęcia (np. ściana, biurko — bez ludzi i dokumentów). Wróć do CRM i odśwież kartę klienta.',
          ok: 'Portal wita „Dzień dobry, Test!” i pokazuje „Przekazane zdjęcia: …”. W CRM w teczce „Zdjęcia od klienta” są te pliki; „Przenieś do galerii” przenosi zdjęcie do nieruchomości.'
        },
        {
          id: 'ss-portal-termin',
          t: 'Rezerwacja terminu przez klienta',
          do: 'W tym samym linku: „Wybierz termin spotkania” → godzina i forma → „Rezerwuję termin”. W CRM sprawdź „Rezerwacje terminu” na karcie klienta.',
          ok: 'Klient widzi „Zarezerwowany termin: …”. W CRM rezerwacja ma stan „Zarezerwowany” i przycisk „Umów spotkanie z tej rezerwacji” (rezerwacja sama jeszcze nie jest spotkaniem).'
        },
        {
          id: 'ss-nowe-od-klientow',
          t: 'Kolejka „Nowe od klientów”',
          do: '„Dashboard” → karta „Nowe od klientów”. Przy pozycji klienta testowego kliknij „Obsłużone”.',
          ok: 'Widać pozycje „Wgrał(a) zdjęcia” i „Zarezerwował(a) termin …”. Po „Obsłużone” pozycja znika („Pozycja obsłużona.”).'
        },
        {
          id: 'ss-uniewaznij',
          t: 'Unieważnienie linku',
          do: 'Na karcie klienta: „Unieważnij linki” → „Unieważnij”. Odśwież stronę portalu w oknie prywatnym.',
          ok: 'CRM: „Unieważniono linki: …”. Portal pokazuje „Link jest nieaktywny”.'
        },
        {
          id: 'ss-przekazanie',
          t: 'Umowa podpisana → przekazanie do TS',
          do: 'Na nieruchomości testowej w „Umówiono na pozyskanie”: „Zmień status nieruchomości” → „Czy podpisano umowę pośrednictwa?” → „Umowa podpisana”. Okno poprosi o dane umowy (data, termin, cena, prowizja) i brakujące pola — uzupełnij wymyślonymi wartościami. Zapisz i odśwież kartę.',
          ok: 'Status „Fotograf do umówienia”. „Właściciel rekordu” zmienia się na specjalistę transakcyjnego z rejonu nieruchomości (klient przechodzi razem z nią). Ty widzisz już „Tryb przeglądania — …” bez możliwości zmian.'
        }
      ]
    },
    {
      id: 'closer',
      num: '2',
      title: 'Closer',
      lead: 'Na koncie Closer. Potrzebujesz spotkania umówionego w punkcie 1.5 (najlepiej zrób sekcję 1 do punktu 1.7 przed tą).',
      items: [
        {
          id: 'cl-moje-spotkania',
          t: 'Moje spotkania',
          do: '„Kalendarz” → dzień spotkania z punktu 1.5. Zajrzyj też na „Dashboard”: „Kalendarz” i „Wymaga uwagi”.',
          ok: 'Spotkanie „Spotkanie pozyskaniowe” jest w Twoim kalendarzu. Jeśli jest na dziś, widać je w „Twoje spotkania — do potwierdzenia dziś” z przyciskiem „Potwierdzone”.'
        },
        {
          id: 'cl-szczegoly',
          t: 'Szczegóły spotkania z lejka',
          do: 'Kliknij spotkanie w kalendarzu i spróbuj je przeciągnąć na inną godzinę.',
          ok: '„Szczegóły wydarzenia” pokazują rodzaj, termin, formę, miejsce, „Powiązany rekord” i stan potwierdzenia. Spotkania z lejka nie da się przesunąć ani rozstrzygnąć w kalendarzu — termin wynika ze statusu rekordu.'
        },
        {
          id: 'cl-dostep',
          t: 'Dostęp do rekordu przez spotkanie',
          do: 'W szczegółach spotkania „Otwórz nieruchomość”, potem z niej kartę klienta.',
          ok: 'Karta otwiera się do pracy (możesz zmienić status i dodać notatkę), ale „Właściciel rekordu” to dalej Sales support — closer nigdy nie zostaje właścicielem.'
        },
        {
          id: 'cl-bez-dostepu',
          t: 'Brak zapisu bez spotkania',
          do: 'Przez wyszukiwanie na górze otwórz nieruchomość albo klienta, z którym NIE masz spotkania.',
          ok: 'Widzisz co najwyżej podgląd („Tryb przeglądania — …”) albo brak dostępu — nie da się niczego zmienić.'
        },
        {
          id: 'cl-wycena',
          t: 'Przygotowanie — zakładka „Wycena”',
          do: 'Na nieruchomości ze spotkania otwórz zakładkę „Wycena”. NIE klikaj „Wyceń” (liczy kilka minut i zużywa model AI).',
          ok: 'Zakładka się wczytuje: historia wycen albo „Brak wycen”, przyciski „Wyceń” i „Symulacja sprzedaży” są widoczne.'
        },
        {
          id: 'cl-symulacja',
          t: 'Symulacja sprzedaży',
          do: 'Zakładka „Wycena” → „Symulacja sprzedaży”. Zmień cenę albo scenariusz, poczekaj na „Zapisano”, potem „Otwórz podgląd dla klienta”.',
          ok: 'Ustawienia zapisują się same („Zapisano”), podgląd pokazuje gotową symulację. Symulacja pojawia się na liście w menu „Symulacje”.'
        },
        {
          id: 'cl-zajetosc',
          t: 'Twoja zajętość widoczna dla umawiającego',
          do: 'Dodaj w swoim kalendarzu „Nowe wydarzenie” na jutro po południu. Na koncie Sales support zacznij umawiać spotkanie z Tobą na ten dzień (bez zapisu).',
          ok: 'Umawiający widzi „<Ty> ma tego dnia zajęte:” z Twoim wydarzeniem. Po teście usuń wydarzenie.'
        },
        {
          id: 'cl-rozstrzygniecie',
          t: 'Rozstrzygnięcie spotkania pozyskaniowego',
          do: 'Na DRUGIEJ nieruchomości testowej (umów ją z kontem Sales support tak jak w 1.5) — „Zmień status nieruchomości” → „Czy podpisano umowę pośrednictwa?” → „Klient się zastanawia” (albo „Decyzja na tak, umowa do podpisania”).',
          ok: 'Status zmienia się na „Follow up po pozyskaniu” (albo „Zgoda, umowa do podpisania”). Spotkanie w kalendarzu jest rozstrzygnięte i znika z „Spotkania bez rozstrzygnięcia”.'
        },
        {
          id: 'cl-po-zamknieciu',
          t: 'Tylko odczyt po zamknięciu tematu',
          do: 'Otwórz nieruchomość przekazaną do TS w punkcie 1.13 (umowa podpisana).',
          ok: 'Karta jest dostępna wyłącznie do wglądu („Tryb przeglądania — …”), bez przycisku zmiany statusu.'
        },
        {
          id: 'cl-spotkanie-kupujacy',
          t: 'Spotkanie z kupującym',
          do: 'W kalendarzu znajdź „Pozyskanie kupującego” umówione z konta TS w punkcie 3.4 → „Otwórz poszukiwanie”.',
          ok: 'Spotkanie jest w Twoim kalendarzu, poszukiwanie kupującego otwiera się z kryteriami i obszarem.'
        },
        {
          id: 'cl-wynik-kupujacy',
          t: 'Wynik spotkania z kupującym',
          do: 'Na karcie poszukiwania „Wynik spotkania z closerem” → wybierz np. „Płatna usługa” → „Zapisz wynik”.',
          ok: 'Komunikat „Zapisano wynik spotkania — kupujący: W obsłudze.” (albo inny etap dla innej odpowiedzi). Etap w „Lejek kupującego” na karcie klienta się zgadza.'
        }
      ]
    },
    {
      id: 'ts',
      num: '3',
      title: 'Specjalista transakcyjny (TS)',
      lead: 'Na koncie TS. Kupującego testowego dodaj sam (jak w 1.1, ale np. nazwisko „Kupujący”). Szanse zakładaj tylko na rekordach testowych.',
      items: [
        {
          id: 'ts-przejety',
          t: 'Przejęta nieruchomość po umowie',
          do: '„Nieruchomości” → znajdź nieruchomość przekazaną w 1.13 (jeśli trafiła do innego TS z rejonu — sprawdź na jego karcie, kto jest właścicielem). „Zmień status nieruchomości” → „Umówiono fotografa” → termin.',
          ok: 'Nieruchomość ma Ciebie (albo TS z rejonu) jako „Właściciel rekordu”. Status „Oczekiwanie na zdjęcia”, w kalendarzu pojawia się „Sesja zdjęciowa”.'
        },
        {
          id: 'ts-lejek',
          t: 'Lejek kupującego',
          do: 'Karta kupującego testowego → panel „Lejek kupującego”. Wybierz „Wysłano landing page — follow-up” z terminem, potem „Klient otwarty na rozmowę”.',
          ok: 'Etap zmienia się na „Follow-up” (termin widać w „Agenda”), a potem na „Aktywny”. Każdy krok potwierdza komunikat „Zapisano — etap: …”.'
        },
        {
          id: 'ts-poszukiwanie',
          t: 'Poszukiwanie i dopasowania',
          do: '„Poszukiwania” → „Dodaj poszukiwanie” dla kupującego testowego: typ, budżet, „Dodaj obszar” na mapie (np. Rzeszów). Zapisz i otwórz kartę poszukiwania.',
          ok: 'Karta pokazuje dopasowania w grupach „Pozyskane”, „Procesowane”, „Potencjalne” (archiwum schowane). Brak danych w polu nieruchomości nie wyrzuca jej z listy.'
        },
        {
          id: 'ts-umow-closer',
          t: 'Umówienie kupującego z closerem',
          do: 'W „Lejek kupującego” kliknij „Umów spotkanie z closerem” → wybierz SWOJE testowe konto Closer i termin → zapisz.',
          ok: 'Etap „Umówiony z closerem”, w panelu „Spotkanie z closerem: …”. U closera w kalendarzu pojawia się „Pozyskanie kupującego” (sprawdzisz w 2.10).'
        },
        {
          id: 'ts-status-pary',
          t: 'Status dopasowania',
          do: 'Na karcie poszukiwania zmień status jednej pary na „Do wysłania”, a innej na „Nie dotyczy”.',
          ok: 'Komunikat „Status dopasowania: …”. Para „Nie dotyczy” znika z głównej listy (jest w schowanych / archiwum).'
        },
        {
          id: 'ts-druga-strona',
          t: 'Para widziana od strony nieruchomości',
          do: 'Otwórz nieruchomość z jednej z par → sekcja „Pasujące poszukiwania”.',
          ok: 'Twój kupujący jest na liście z „W dopasowaniach od …” i tym samym statusem pary co na poszukiwaniu.'
        },
        {
          id: 'ts-kolejka',
          t: 'Kolejka dopasowań na kokpicie',
          do: '„Dashboard” → karta „Nowe dopasowania do przeprocesowania”. Oznacz jedną parę (np. „Nie dotyczy”).',
          ok: 'Karta pokazuje „Czeka …, z tego … od dziś”, oznaczona para znika. Pusta kolejka („Wszystkie dopasowania przeprocesowane.”) też jest OK — dopisz wtedy „pusta”.'
        },
        {
          id: 'ts-oferty',
          t: 'Wysyłka ofert kupującemu',
          do: 'Na poszukiwaniu zaznacz 1–2 oferty → „Skopiuj link do ofert” (opcjonalnie też „Wyślij klientowi”). Otwórz link w oknie prywatnym i przy jednej ofercie kliknij „Interesuje mnie”.',
          ok: 'Kupujący widzi „Oferty wybrane dla Ciebie”. Status pary zmienia się na „Zainteresowany”, a w „Nowe od klientów” prowadzącego nieruchomość pojawia się „Zainteresowany(-a) ofertą: …”. Wysyłka e-mail/SMS nie wychodzi — to normalne.'
        },
        {
          id: 'ts-szansa',
          t: 'Szansa sprzedażowa z dopasowania',
          do: 'Przy parze kupujący testowy × nieruchomość testowa kliknij „Umów prezentację” → termin, „Prezentacja online?” → „Utwórz szansę”.',
          ok: 'Powstaje szansa w statusie „Umówiona prezentacja”, prezentacja jest w Twoim kalendarzu.'
        },
        {
          id: 'ts-zmiana-statusu',
          t: 'Zmiana statusu szansy',
          do: 'Na szansie „Zmień status szansy” → „Co dalej?” → „Prezentacja odbyta, bez umowy” → termin następnego kontaktu → „Zapisz zmianę statusu”.',
          ok: 'Przed zapisem okno pokazuje „Status po zapisie: Follow up (po prezentacji)”. Po zapisie: „Status zmieniony na „Follow up (po prezentacji)”.” i nowy wpis w historii statusów.'
        },
        {
          id: 'ts-termin-kontaktu',
          t: '„Umówiono termin kontaktu — Status: bez zmian”',
          do: 'Na szansie w „Follow up (po prezentacji)” wybierz „Umówiono termin kontaktu” → podaj „Termin kontaktu” i krótką „Notatka” → „Zapisz termin”.',
          ok: 'Komunikat „Termin kontaktu zapisany. Status szansy bez zmian.” Status dalej „Follow up (po prezentacji)”, w historii statusów NIE ma nowego wpisu, notatka jest na osi czasu, nowy termin w „Agenda”.'
        },
        {
          id: 'ts-umowa-pieniadz',
          t: 'Umowa rezerwacyjna i pytanie o pieniądz',
          do: 'Przeprowadź szansę: „Umówiono rezerwacyjną/przedwstępną” (odpowiedz na „Jak ma być płacona prowizja?”), potem „Umowa podpisana, notariusz do umówienia”. Przy pieniądzach jednej stronie dodaj „Dodaj fakturę do wystawienia”.',
          ok: 'Bez odpowiedzi na pytanie o prowizję i „co z pieniędzmi” okno nie pozwala zapisać. Faktura trafia na kokpit do „Faktury do wystawienia”; tam „Wystawiono” → numer i data → znika z listy.'
        },
        {
          id: 'ts-wplywy',
          t: 'Płatności / wpływy prowizji',
          do: 'Doprowadź szansę do „Oczekiwanie na płatność” (notariusz umówiony → „Podpisano akt notarialny”). Potem „Płatność wykonana” → w „Wpływy prowizji” wpisz kwotę MNIEJSZĄ niż pełna prowizja → zapisz. Następnie dopisz resztę.',
          ok: 'Przy niepełnej kwocie przycisk „Zapisz wpływ — szansa zostaje otwarta” i szansa zostaje w „Oczekiwanie na płatność”. Po dopisaniu reszty szansa przechodzi w „Sfinalizowana”, nieruchomość także.'
        }
      ]
    }
  ];

  /* ---------- wspólne narzędzia ---------- */

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
  }
  function storageRemove(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* tryb prywatny / zablokowane */ }
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'className') node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function copyText(text, fallbackArea) {
    function fallback() {
      fallbackArea.value = text;
      fallbackArea.focus();
      fallbackArea.select();
      try { fallbackArea.setSelectionRange(0, text.length); } catch (e) { /* stare przeglądarki */ }
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      toast(ok ? 'Skopiowano do schowka.' : 'Tekst zaznaczony — skopiuj go ręcznie (Kopiuj).');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        toast('Skopiowano do schowka.');
      }, fallback);
    } else {
      fallback();
    }
  }

  function wireUrlCopy() {
    var btn = document.getElementById('copyUrl');
    var input = document.getElementById('appUrl');
    if (!btn || !input) return;
    input.value = APP_URL;
    btn.addEventListener('click', function () { copyText(APP_URL, input); });
  }

  /* ---------- strona startowa: lista osób ---------- */

  function renderIndex() {
    var list = document.getElementById('people');
    if (!list) return;
    var total = SECTIONS.reduce(function (n, s) { return n + s.items.length; }, 0);
    Object.keys(PEOPLE).forEach(function (key) {
      var state = loadState(key);
      var done = 0;
      Object.keys(state.items).forEach(function (id) { if (state.items[id].v) done += 1; });
      var info = done > 0 ? 'Na tym urządzeniu: ' + done + ' z ' + total : total + ' punktów';
      list.appendChild(el('a', { className: 'person', href: key + '.html' }, [
        el('b', { text: PEOPLE[key] }),
        el('span', { text: info })
      ]));
    });
    var counts = document.getElementById('sectionCounts');
    if (counts) {
      SECTIONS.forEach(function (s) {
        counts.appendChild(el('li', { text: s.num + ') ' + s.title + ' — ' + s.items.length + ' pkt' }));
      });
    }
  }

  /* ---------- strona osoby ---------- */

  function storageKey(person) { return 'przeklik-v3:' + person; }

  function loadState(person) {
    var raw = storageGet(storageKey(person));
    if (!raw) return { items: {} };
    try {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed.items === 'object' && parsed.items !== null) return parsed;
    } catch (e) { /* uszkodzony zapis — zaczynamy od zera */ }
    return { items: {} };
  }

  function renderPerson(person) {
    var name = PEOPLE[person];
    var root = document.getElementById('checklist');
    if (!name || !root) return;

    document.title = 'Przeklik v3 — ' + name;
    var nameNode = document.getElementById('personName');
    if (nameNode) nameNode.textContent = name;

    var state = loadState(person);
    var saveWarned = false;
    var allItems = [];

    function save() {
      state.updated = new Date().toISOString();
      if (!storageSet(storageKey(person), JSON.stringify(state)) && !saveWarned) {
        saveWarned = true;
        toast('Przeglądarka nie zapisuje stanu — przed zamknięciem skopiuj raport.');
      }
    }

    function entry(id) {
      if (!state.items[id]) state.items[id] = { v: '', note: '' };
      return state.items[id];
    }

    function paint(itemNode, id) {
      var e = state.items[id] || { v: '' };
      itemNode.classList.toggle('is-ok', e.v === 'ok');
      itemNode.classList.toggle('is-err', e.v === 'err');
      var ok = itemNode.querySelector('.v-ok');
      var err = itemNode.querySelector('.v-err');
      ok.classList.toggle('on', e.v === 'ok');
      err.classList.toggle('on', e.v === 'err');
      ok.querySelector('input').checked = e.v === 'ok';
      err.querySelector('input').checked = e.v === 'err';
    }

    SECTIONS.forEach(function (section) {
      var countNode = el('span', { className: 'scount' });
      var sec = el('section', { className: 'section', id: 'sekcja-' + section.id }, [
        el('h2', null, [el('span', { text: section.num + ') ' + section.title }), countNode]),
        el('p', { className: 'lead', text: section.lead })
      ]);
      section.countNode = countNode;

      section.items.forEach(function (item, idx) {
        var number = section.num + '.' + (idx + 1);
        item.number = number;
        allItems.push({ section: section, item: item });

        var okInput = el('input', { type: 'checkbox', 'aria-label': number + ' OK' });
        var errInput = el('input', { type: 'checkbox', 'aria-label': number + ' Problem' });
        var note = el('textarea', {
          className: 'note',
          placeholder: 'Opisz problem: co kliknąłeś, co się stało, co powinno się stać.',
          'aria-label': 'Opis problemu ' + number
        });
        note.value = (state.items[item.id] && state.items[item.id].note) || '';

        var node = el('article', { className: 'item', id: 'p-' + item.id }, [
          el('h3', null, [el('span', { className: 'num', text: number }), document.createTextNode(item.t)]),
          el('div', { className: 'lab', text: 'Co kliknąć' }),
          el('p', { text: item.do }),
          el('div', { className: 'lab', text: 'Co ma się stać' }),
          el('p', { className: 'exp', text: item.ok }),
          el('div', { className: 'verdict' }, [
            el('label', { className: 'v-ok' }, [okInput, el('span', { text: 'OK' })]),
            el('label', { className: 'v-err' }, [errInput, el('span', { text: 'Problem' })])
          ]),
          note
        ]);

        function setVerdict(value, checked) {
          var e = entry(item.id);
          e.v = checked ? value : '';
          save();
          paint(node, item.id);
          updateProgress();
          if (value === 'err' && checked) note.focus();
        }
        okInput.addEventListener('change', function () { setVerdict('ok', okInput.checked); });
        errInput.addEventListener('change', function () { setVerdict('err', errInput.checked); });
        note.addEventListener('input', function () {
          entry(item.id).note = note.value;
          save();
        });

        paint(node, item.id);
        sec.appendChild(node);
      });
      root.appendChild(sec);
    });

    function counts(items) {
      var ok = 0, err = 0;
      items.forEach(function (x) {
        var e = state.items[x.item.id];
        if (e && e.v === 'ok') ok += 1;
        if (e && e.v === 'err') err += 1;
      });
      return { ok: ok, err: err, total: items.length };
    }

    function updateProgress() {
      var c = counts(allItems);
      var pOk = document.getElementById('barOk');
      var pErr = document.getElementById('barErr');
      var label = document.getElementById('barCount');
      if (pOk) pOk.style.width = (100 * c.ok / c.total) + '%';
      if (pErr) pErr.style.width = (100 * c.err / c.total) + '%';
      if (label) label.textContent = (c.ok + c.err) + ' / ' + c.total + ' · OK ' + c.ok + ' · Problem ' + c.err;
      SECTIONS.forEach(function (s) {
        var sc = counts(allItems.filter(function (x) { return x.section === s; }));
        s.countNode.textContent = (sc.ok + sc.err) + ' / ' + sc.total;
      });
    }

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function buildReport() {
      var now = new Date();
      var stamp = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) +
        ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
      var c = counts(allItems);
      var lines = [
        'Przeklik Handshake CRM v3 — raport',
        'Osoba: ' + name,
        'Data: ' + stamp,
        'Wynik: OK ' + c.ok + ' · Problem ' + c.err + ' · nie sprawdzono ' + (c.total - c.ok - c.err) + ' (z ' + c.total + ')',
        ''
      ];
      SECTIONS.forEach(function (s) {
        var sc = counts(allItems.filter(function (x) { return x.section === s; }));
        lines.push(s.num + ') ' + s.title + ': OK ' + sc.ok + ', Problem ' + sc.err + ', z ' + sc.total);
      });
      var problems = allItems.filter(function (x) {
        var e = state.items[x.item.id];
        return e && e.v === 'err';
      });
      lines.push('');
      lines.push(problems.length ? 'PROBLEMY:' : 'PROBLEMY: brak');
      problems.forEach(function (x) {
        var note = (state.items[x.item.id].note || '').trim();
        lines.push('- ' + x.item.number + ' ' + x.item.t);
        lines.push('  ' + (note ? note.replace(/\n/g, '\n  ') : '(bez opisu)'));
      });
      var skipped = allItems.filter(function (x) {
        var e = state.items[x.item.id];
        return !e || !e.v;
      });
      if (skipped.length) {
        lines.push('');
        lines.push('NIESPRAWDZONE: ' + skipped.map(function (x) { return x.item.number; }).join(', '));
      }
      return lines.join('\n');
    }

    var reportBox = document.getElementById('reportBox');
    var reportText = document.getElementById('reportText');

    document.getElementById('copyReport').addEventListener('click', function () {
      var text = buildReport();
      reportText.value = text;
      reportBox.classList.add('show');
      copyText(text, reportText);
    });

    document.getElementById('clearAll').addEventListener('click', function () {
      if (!window.confirm('Wyczyścić wszystkie odpowiedzi i opisy na tej stronie? Tego nie da się cofnąć.')) return;
      state = { items: {} };
      storageRemove(storageKey(person));
      allItems.forEach(function (x) {
        var node = document.getElementById('p-' + x.item.id);
        node.querySelector('textarea').value = '';
        paint(node, x.item.id);
      });
      reportBox.classList.remove('show');
      reportText.value = '';
      updateProgress();
      toast('Wyczyszczono.');
    });

    updateProgress();
  }

  function init() {
    wireUrlCopy();
    var person = document.body.getAttribute('data-person');
    if (person) renderPerson(person);
    else renderIndex();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
