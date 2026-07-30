# OKŁADKA — Galeria plakatów

Kompletny, działający sklep z plakatami. Projekt jest **samodzielny** (czysty HTML/CSS/JS, bez build-toola)
i jednocześnie przygotowany tak, by łatwo przenieść go na **Shopify**.

Wszystko działa lokalnie: koszyk, wybór rozmiaru (A4/A3/B2), kasa, formularz kontaktowy i panel admina.

---

## 1. Jak uruchomić

Sklep to statyczne pliki. Najprościej odpalić lokalny serwer (koszyk używa `localStorage`, więc
zalecany jest `http://`, a nie otwieranie pliku przez `file://`).

```bash
cd poster-store
npx --yes http-server . -p 5182 -c-1
```

Następnie otwórz `http://localhost:5182`.

Alternatywnie (Python):

```bash
cd poster-store
python -m http.server 5182
```

---

## 2. Struktura projektu

```
poster-store/
├── index.html            # szkielet strony + ładowanie skryptów
├── css/style.css         # cały system wizualny (jasny + ciemny motyw)
├── js/
│   ├── data.js           # DOMYŚLNY katalog i kategorie (seed)
│   ├── store.js          # stan: katalog, koszyk, zamówienia, wiadomości (localStorage)
│   ├── components.js      # nawigacja, stopka, koszyk-drawer, karta produktu, toasty
│   ├── pages.js          # widoki sklepu (home, sklep, produkt, o nas, kontakt, kasa)
│   ├── admin.js          # panel admina (CRUD produktów, zamówienia, wiadomości)
│   └── app.js            # router (hash) + start aplikacji
└── assets/posters/       # 10 plakatów jako SVG + placeholder
```

Strony (routing po `#`):

| Adres | Widok |
|---|---|
| `#/` | Strona główna |
| `#/sklep` | Wszystkie plakaty + filtr + wyszukiwarka |
| `#/kategoria/<slug>` | Kategoria (motoryzacja / typografia / ilustracja / abstrakcja) |
| `#/produkt/<id>` | Karta produktu z wyborem rozmiaru |
| `#/o-nas`, `#/kontakt` | O nas / Kontakt |
| `#/kasa`, `#/potwierdzenie` | Kasa i potwierdzenie zamówienia |
| `#/admin` | Panel sklepu (hasło demo: **admin**) |

---

## 3. Panel admina — dodawanie i edycja plakatów

Wejdź na `#/admin` (link jest też w stopce: „Panel sklepu”). Hasło demo: **admin**.

- **Produkty** — dodawaj, edytuj i usuwaj plakaty. Dla każdego ustawiasz nazwę, kategorię, tagi,
  opis, ceny osobno dla A4 / A3 / B2, wyróżnienie na stronie głównej oraz obrazek.
- **Obrazek** — wpisz ścieżkę (`assets/posters/nazwa.svg`) **albo** wgraj plik z dysku
  (zapisze się w przeglądarce jako data URL — świetne do szybkich testów).
- **Zamówienia** — lista zamówień z kasy. **Kliknij wiersz**, aby otworzyć podgląd:
  dane klienta, adres dostawy, pozycje z miniaturami i ceną za sztukę, podsumowanie kwot
  oraz **zmiana statusu** (Nowe → W realizacji → Wysłane → Zrealizowane / Anulowane).
  Status zapisuje się i widać go na liście jako kolorową etykietę.
- **Wiadomości** — treści z formularza kontaktowego. Przycisk **„Odpowiedz"** otwiera
  kompozytor z cytatem wiadomości klienta i gotowym wstępem. Po wysłaniu odpowiedź
  **zapisuje się przy wiadomości** (z datą), wątek dostaje status **„Odpowiedziano"**,
  a licznik „bez odpowiedzi" spada. Zaznaczona opcja otwiera program pocztowy z gotową
  treścią (realna wysyłka do klienta); w wersji online rolę tę przejmuje skrzynka sklepu.
- **Przywróć katalog** — wraca do 10 domyślnych plakatów z `data.js`.

> Dane admina siedzą w `localStorage` przeglądarki. To wersja demonstracyjna panelu —
> na produkcji rolę panelu przejmuje natywny panel Shopify (patrz sekcja 6).

---

## 4. Zdjęcia produktów

W sklepie są **Twoje prawdziwe grafiki**:

- `assets/posters/*.jpg` — 10 gotowych plakatów (kadr produktowy, proporcja serii A 1:1,414).
  Nazwy plików odpowiadają `id` produktu, np. `porsche-911.jpg`.
- `assets/lifestyle/life-01…10.jpg` — zdjęcia aranżacyjne (plakaty w ramach, w ciepłym wnętrzu).
  Używane w hero, w sekcji „Zobacz je na ścianie" i na stronie „O nas". Proporcja 3:4.

Aby dodać kolejne plakaty (masz ich więcej):

1. Wrzuć plik do `assets/posters/` — najlepiej pionowo, w proporcji **1:1,414** (jak A4/A3/B2).
2. W panelu admina kliknij **Dodaj plakat**, wpisz ścieżkę `assets/posters/nazwa.jpg`
   albo użyj **„Wgraj z dysku"**.
3. Ustaw kategorię, ceny A4/A3/B2 i ewentualnie „wyróżniony".

> Karty produktów i strona produktu pokazują **cały plakat bez przycinania** (kadr dopasowany do
> proporcji serii A), więc napisy przy krawędziach grafiki nie są obcinane.

---

## 5. Formularz kontaktowy — realne maile

Domyślnie formularz działa w trybie demo: **zapisuje wiadomość w panelu admina** i otwiera klienta
poczty z gotową treścią. Aby wysyłał realne maile bez własnego backendu:

1. Załóż darmowe konto na [Formspree](https://formspree.io) (lub Getform / Basin).
2. Skopiuj swój endpoint (np. `https://formspree.io/f/xxxxxxx`).
3. W `js/pages.js` ustaw:

```js
const CONTACT_ENDPOINT = "https://formspree.io/f/xxxxxxx";
```

Od tej chwili wysyłka idzie POST-em na Formspree i wiadomość trafia na Twój e-mail.

---

## 6. Przeniesienie na Shopify

> **Gotowy pakiet migracyjny jest w folderze [`shopify/`](shopify/SHOPIFY.md).**
> Zawiera `products_export.csv` (10 plakatów × warianty A4/A3/B2, gotowe do importu),
> generator CSV, `brand.css` i przewodnik krok po kroku `SHOPIFY.md`.
> Poniżej skrót koncepcji; szczegóły w tym folderze.


Shopify daje z automatu to, co tu jest zasymulowane: **prawdziwy koszyk, bramkę płatności
(Przelewy24 / Stripe / BLIK), realizację zamówień i panel administracyjny**. Ten projekt służy jako
gotowy **projekt wizualny (design) + logika UX**, którą przenosisz do motywu.

Ścieżka wdrożenia:

1. **Załóż sklep i produkty.** W panelu Shopify utwórz produkt dla każdego plakatu.
   Rozmiary **A4 / A3 / B2** dodaj jako **warianty** (opcja „Rozmiar”) — to bezpośredni
   odpowiednik selektora rozmiaru z karty produktu. Ceny per wariant jak w `data.js`.
2. **Kategorie = kolekcje.** Utwórz kolekcje `Motoryzacja`, `Typografia`, `Ilustracja`, `Abstrakcja`
   i przypisz produkty. To zastępuje filtr kategorii.
3. **Motyw.** Zacznij od motywu Dawn (darmowy). Przenieś warstwę wizualną z `css/style.css`
   (zmienne kolorów, typografia Space Grotesk + Manrope, komponenty kart/przycisków, animacje reveal)
   do sekcji i szablonów Liquid:
   - `sections/` — hero, siatka produktów, bento kategorii, pasek zaufania, stopka
   - `templates/product.*` — układ karty produktu (media + warianty + akordeon)
   - `snippets/` — karta produktu, wiersz koszyka
4. **Koszyk i kasa.** Używasz natywnego koszyka Shopify (`/cart`) i Shopify Checkout —
   nic nie kodujesz. Logika z `store.js` była tylko po to, żeby zademonstrować UX.
5. **Kontakt.** W Shopify jest gotowy szablon `templates/page.contact.liquid` z działającym
   formularzem (`{% form 'contact' %}`) — wysyła na e-mail sklepu.
6. **O nas.** Zwykła strona (Pages) z układem z `#/o-nas`.
7. **Płatności.** W Ustawienia → Płatności włącz Przelewy24/BLIK (przez Autopay/PayU/Stripe).
   Bramka i bezpieczeństwo są po stronie Shopify.

Mapowanie 1:1:

| Tu (prototyp) | Shopify |
|---|---|
| Selektor rozmiaru A4/A3/B2 | Warianty produktu |
| Kategorie | Kolekcje |
| Koszyk (`store.js`) | Natywny koszyk `/cart` |
| Kasa (`#/kasa`) | Shopify Checkout |
| Panel admina | Panel Shopify Admin |
| Formularz kontaktu | `{% form 'contact' %}` |
| `css/style.css` | Style motywu (Liquid + CSS) |

> Alternatywy, jeśli nie chcesz Shopify: ten sam front działa też z **Snipcart** lub **Stripe
> Payment Links** (dodajesz koszyk/płatność jako skrypt) albo jako headless z Shopify Storefront API.

---

## 7. Uwagi

- **Prawa do grafik/logo.** Dołączone plakaty to stylizowane wersje demonstracyjne.
  Sprzedając grafiki z logo marek (Mercedes, Porsche itd.) upewnij się co do praw/znaków towarowych —
  używaj własnych, finalnych plików druku.
- **Motyw jasny/ciemny** przełącza ikona w nawigacji; wybór jest zapamiętywany.
- **Dostępność:** kontrast AA, obsługa klawiatury, `prefers-reduced-motion` (animacje wyłączają się
  dla osób, które tego chcą).
```
