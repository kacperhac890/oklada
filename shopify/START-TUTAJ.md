# OKŁADKA → Shopify: instrukcja od zera do startu

Liniowa lista „zrób to, potem to" — od założenia konta do uruchomienia sklepu.
Szczegóły techniczne i mapowanie funkcji są w `SHOPIFY.md`. Pliki do wgrania:
`products_export.csv`, `brand.css`, grafiki w `../assets/`.

> Etykiety przycisków i warunki cenowe Shopify czasem się zmieniają i zależą od regionu —
> jeśli coś nazywa się minimalnie inaczej, kieruj się sensem kroku i podpowiedziami na ekranie.

---

## FAZA 0 — Przygotuj (10 min)

- [ ] E-mail do konta sklepu.
- [ ] Folder `shopify/` (ten) + grafiki `assets/posters/*.jpg` (10 szt.) i `assets/lifestyle/*.jpg`.
- [ ] Nazwa sklepu (np. „OKŁADKA") i pomysł na domenę (np. `oklada.pl`).
- [ ] Dane do rozliczeń i płatności (w Polsce do regularnej sprzedaży zwykle potrzebna
      działalność gospodarcza + konto firmowe). Do aktywacji bramki płatniczej będą potrzebne.

---

## FAZA 1 — Załóż konto (10 min)

1. Wejdź na **shopify.com** → **„Rozpocznij"** / „Start free trial".
2. Odpowiedz na kilka pytań onboardingowych (co sprzedajesz → „produkty/plakaty",
   gdzie → „własny sklep online", czy już sprzedajesz → „dopiero zaczynam").
   Możesz klikać **„Pomiń"**.
3. Podaj **e-mail → hasło → nazwa sklepu**. Dostaniesz tymczasowy adres `nazwa.myshopify.com`
   (własną domenę podłączysz w Fazie 11).
4. Ustaw **kraj: Polska** i **walutę: PLN** (ważne — najlepiej od razu).
5. Wylądujesz w panelu admina: **admin.shopify.com**.

> Aktualne warunki okresu próbnego i ceny planu zobaczysz przy rejestracji — kartę podajesz
> dopiero przy wyborze planu (Faza 12), więc możesz spokojnie wszystko poukładać wcześniej.

---

## FAZA 2 — Podstawy (5 min)

1. **Ustawienia → Dane sklepu**: nazwa, e-mail, **waluta PLN**, strefa czasowa (Europa/Warszawa).
2. **Ustawienia → Języki**: ustaw **polski** jako domyślny.

---

## FAZA 3 — Motyw (5 min)

1. **Sklep online → Motywy → Odkryj darmowe motywy → dodaj „Dawn"**.
2. Na razie zostaw go jako **roboczy** (opublikujesz na końcu). Możesz też od razu „Opublikuj" —
   sklep i tak jest chroniony hasłem do startu.

---

## FAZA 4 — Wgraj produkty z CSV (10 min)

1. **Produkty → Importuj → wybierz `products_export.csv` → Prześlij i podejrzyj → Importuj**.
2. Powstanie **10 plakatów**, każdy z opcją **„Rozmiar" = A4 / A3 / B2** i osobną ceną.
3. Otwórz jeden produkt i sprawdź, czy widać 3 warianty z cenami (np. AMG: 55 / 89 / 145 zł).

---

## FAZA 5 — Dodaj zdjęcia (15 min)

Nazwy plików = uchwyty produktów, więc wiesz, co gdzie idzie.

- [ ] Dla każdego produktu: **Produkty → (wybierz) → Multimedia → Prześlij** plik
      `assets/posters/<uchwyt>.jpg` w pełnej rozdzielczości.
- [ ] Przykłady: `amg-gt` → `amg-gt.jpg`, `porsche-911` → `porsche-911.jpg`,
      `cherry-disco` → `cherry-disco.jpg` … (10 przeciągnięć).

> `assets/lifestyle/*.jpg` (plakaty w ramach) przydadzą się w Fazie 7 do strony głównej.

---

## FAZA 6 — Kolekcje = kategorie (10 min)

Utwórz 4 **kolekcje automatyczne** (CSV dodał kategorie jako tagi):

- [ ] **Produkty → Kolekcje → Utwórz kolekcję → Typ: automatyczna → warunek: Tag = …**
  - Motoryzacja → Tag `Motoryzacja`
  - Typografia → Tag `Typografia`
  - Ilustracja → Tag `Ilustracja`
  - Abstrakcja → Tag `Abstrakcja`
- [ ] (Opcjonalnie) kolekcja „Wszystkie" — warunek „Cena > 0" łapie cały katalog.

---

## FAZA 7 — Wygląd i strona główna (30 min)

**Kolory i fonty** — **Sklep online → Motywy → Dostosuj → Ustawienia motywu**:
- Kolory: tło `#F7F6F2`, tekst `#1A1917`, przycisk `#1A1917`/tekst `#F7F6F2`, akcent `#2C5545`,
  obramowania `#E2DFD6`.
- Typografia: nagłówki **Space Grotesk** (lub „Work Sans"/„Archivo"), tekst **Manrope** (lub „Assistant").
- (Opcjonalnie) wklej `brand.css` do `Assets → base.css` (Edytuj kod).

**Strona główna** — w edytorze „Dodaj sekcję", ułóż jak w demo:
1. Baner obrazkowy → zdjęcie `assets/lifestyle/life-05.jpg`, nagłówek „Plakaty, które robią wnętrze",
   przycisk → kolekcja „Wszystkie".
2. Tekst przewijany → „Błyszczący papier 200 g · Wysyłka 48h · Darmowa dostawa od 200 zł".
3. Lista kolekcji → 4 kategorie.
4. Polecana kolekcja → bestsellery.
5. Galeria multimediów → 3 zdjęcia aranżacyjne („Zobacz je na ścianie").
6. Ikony/tekst → druk / pakowanie / wysyłka.

---

## FAZA 8 — Strony i menu (15 min)

- [ ] **Sklep online → Strony → Dodaj stronę → „O nas"** (wklej treść z zakładki O nas w demo).
- [ ] **Kontakt**: dodaj stronę i przypisz jej szablon **`page.contact`** (Dawn ma go wbudowany) —
      formularz działa natywnie.
- [ ] **Ustawienia → Powiadomienia**: ustaw e-mail, na który mają przychodzić wiadomości i zamówienia.
- [ ] **Sklep online → Nawigacja → Menu główne**: Sklep, Kategorie (4 kolekcje), O nas, Kontakt.

---

## FAZA 9 — Dostawa (10 min)

- [ ] **Ustawienia → Wysyłka i dostawa → strefa Polska**:
  - stawka kurierska (np. **15 zł**),
  - **darmowa dostawa** ze stawką **0 zł** i warunkiem **„minimalna wartość zamówienia 200 zł"**.
- [ ] (Opcjonalnie) InPost/Paczkomaty przez aplikację z App Store.

---

## FAZA 10 — Podatki i strony prawne (15 min)

- [ ] **Ustawienia → Podatki i cła**: skonfiguruj VAT, jeśli jesteś VAT-owcem (albo zwolnienie).
- [ ] **Ustawienia → Zasady/Regulaminy**: Shopify wygeneruje szablony
      (regulamin, prywatność/RODO, zwroty, wysyłka) — dostosuj do siebie.
      W Polsce pamiętaj o **prawie odstąpienia w 14 dni** i danych sprzedawcy.
- [ ] Baner cookies/RODO: aplikacja zgód lub wbudowana funkcja prywatności Shopify.

> To nie jest porada prawna — przy działalności warto raz przejrzeć regulamin z kimś ogarniętym w e-commerce.

---

## FAZA 11 — Płatności (15 min)

- [ ] **Ustawienia → Płatności → dodaj dostawcę**. W Polsce najczęściej:
  **Przelewy24 / Autopay (Blue Media) / PayU** (BLIK, szybkie przelewy) albo **Stripe** (karty, BLIK).
  Jeśli w panelu jest **Shopify Payments** dla Polski — też możesz go użyć.
- [ ] Aktywacja bramki wymaga danych firmy/konta — postępuj wg kreatora dostawcy.

---

## FAZA 12 — Domena (10 min)

- [ ] **Ustawienia → Domeny**: kup domenę w Shopify **albo** podłącz własną (np. `oklada.pl`
      od zewnętrznego rejestratora — Shopify poprowadzi przez rekordy DNS).

---

## FAZA 13 — Test i start 🚀

- [ ] **Podgląd** sklepu (ikona oka przy motywie) — przejdź ścieżkę: produkt → rozmiar → koszyk → kasa.
- [ ] Zrób **zamówienie testowe** (tryb testowy bramki lub „Bogus Gateway" w ustawieniach płatności),
      sprawdź e-mail potwierdzający i czy zamówienie widać w **Zamówienia**.
- [ ] Wybierz **plan** (tu podajesz kartę): **Ustawienia → Plan**.
- [ ] Zdejmij ochronę hasłem: **Sklep online → Preferencje → wyłącz „ochronę hasłem"**.
- [ ] Gotowe — sklep jest publiczny. 🎉

---

## Pamiętaj

- **Znaki towarowe**: plakaty z logo (Mercedes, Porsche, Marlboro) sprzedajesz na własną
  odpowiedzialność — sprawdź prawa do znaków przed publikacją.
- **Zmiana oferty**: po edycji `../js/data.js` odpal `node generate-csv.mjs` i zaimportuj CSV ponownie.
