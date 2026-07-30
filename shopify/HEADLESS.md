# Podpięcie strony pod Shopify (headless)

Twoja strona zostaje jako front (wygląd, animacje, karty, koszyk). Shopify robi tylko
**produkty, koszyk i kasę** (płatności, adres, zamówienie → panel Shopify).
Integracja jest już wbudowana (`js/shopify.js`). Do uruchomienia zostają **2 pola + hosting**.

Dopóki pola są puste — strona działa w trybie demo (kasa poglądowa). Po uzupełnieniu —
przycisk „Przejdź do kasy" i „Kup teraz" prowadzą do prawdziwej kasy Shopify.

---

## Krok 1 — Produkty w Shopify

Zaimportuj `products_export.csv` (patrz `SHOPIFY.md`, Kroki 1–4). W trybie headless w Shopify
ustawiasz też **płatności, wysyłkę, podatki i regulaminy** (Kroki 9–11) — bo to kasa Shopify.
Zdjęć w Shopify możesz nie dodawać (front pokazuje Twoje z `assets/`); przydają się tylko
jako miniatury na kasie/w potwierdzeniu.

## Krok 2 — Pobierz token Storefront API

1. **Ustawienia → Aplikacje i kanały sprzedaży → Twórz aplikacje → Utwórz aplikację** (nazwa np. „Front OKŁADKA").
2. **Konfiguruj Storefront API** → zaznacz zakresy:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
3. **Zainstaluj aplikację** → zakładka **Dane logowania API → Storefront API access token** → skopiuj.

> To token **publiczny** (Storefront) — bezpieczny w przeglądarce. **Nie** używaj „Admin API" tokena.

## Krok 3 — Wklej 2 wartości

Otwórz `js/shopify.js` i uzupełnij:

```js
const CONFIG = {
  domain: "twoj-sklep.myshopify.com",   // adres .myshopify.com (NIE domena własna)
  token:  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Storefront API access token
  apiVersion: "2025-01",
};
```

To wszystko po stronie kodu — reszta jest już podłączona.

> **Tryb produkcyjny (domyślnie włączony).** W `js/shopify.js` jest `hideDemo: true`, co ukrywa
> demową kasę `#/kasa` i panel admina `#/admin` (dane i tak są w Shopify). Stany:
> - `domain`+`token` uzupełnione → „Przejdź do kasy" prowadzi do **kasy Shopify**.
> - puste, `hideDemo: true` → strona `#/kasa` pokazuje komunikat „Kasę obsługuje Shopify" (stan przejściowy).
> - `hideDemo: false` → wraca pełne demo (własny formularz kasy + panel admina) — przydatne na localhoście.

## Krok 4 — Postaw stronę w sieci (hosting)

Strona to statyczne pliki (bez budowania), więc hosting jest banalny. Najprościej:

- **Netlify Drop** — wejdź na **app.netlify.com/drop** i **przeciągnij cały folder `poster-store`**
  na stronę. Dostajesz od razu działający adres. (Konto zakładasz, żeby to zachować — darmowe.)
- Alternatywy: **Vercel**, **Cloudflare Pages**, **GitHub Pages** — też darmowe.

## Krok 5 — Domena własna

Domenę (np. `oklada.pl`) podłączasz **w panelu hostingu** (Netlify/Vercel), a nie w Shopify —
bo front nie stoi na Shopify. Shopify hostuje tylko kasę (osobny adres `checkout...`).

## Krok 6 — Test

1. Na swojej stronie: dodaj plakat do koszyka → **Przejdź do kasy**.
2. Powinieneś wylądować na **kasie Shopify**. Zrób zamówienie testowe (tryb testowy płatności).
3. Sprawdź, że zamówienie pojawiło się w **Shopify → Zamówienia**.

Gotowe — sprzedaż idzie przez Shopify, a klient widzi Twój front.

---

## Dodawanie i edycja produktów (jedno miejsce: Shopify)

Strona **pobiera produkty automatycznie ze Shopify** (Storefront API) przy każdym wejściu/odświeżeniu.
Nie ruszasz kodu — wszystko robisz w panelu Shopify:

**Shopify → Produkty → Dodaj produkt:**
- **Tytuł** i **opis**.
- **Zdjęcie** (to ono pokaże się na stronie — wgraj plakat w pełnej rozdzielczości).
- **Warianty → opcja „Rozmiar"** z wartościami **A4, A3, B2** i ceną dla każdego. (To ważne — po tych
  nazwach strona buduje selektor rozmiaru i podłącza kasę. Zawsze dodaj wszystkie trzy.)
- **Typ produktu** albo **tag** = nazwa kategorii: `Motoryzacja`, `Typografia`, `Ilustracja` lub `Abstrakcja`
  (po tym trafia do właściwej sekcji na stronie).
- (Opcjonalnie) tag **`wyróżniony`** → pokaże się w „Bestsellery" na stronie głównej.

Zapisz → odśwież stronę → plakat jest, z działającą kasą. Żadnych commitów.

> Zmiana ceny, opisu, zdjęcia albo usunięcie produktu w Shopify od razu widać na stronie po odświeżeniu.
> Lokalny `js/data.js` służy już tylko jako awaryjny katalog, gdyby Shopify nie odpowiedziało.

## Co jest gdzie (headless)

| Element | Gdzie |
|---|---|
| Wygląd, karty, koszyk, „O nas", kontakt | Ten front (`poster-store`, Twój hosting) |
| Zdjęcia i opisy na stronie | Ten front (`assets/`, `js/data.js`) |
| Koszyk → kasa, płatności, zamówienia | Shopify |
| Produkty, ceny, warianty A4/A3/B2 | Shopify (import CSV) |
| Wysyłka, podatki, regulaminy | Shopify (ustawienia) |

## Ważne

- **Ceny muszą się zgadzać.** Front pokazuje ceny z `js/data.js`, a kasa liczy po cenach z Shopify.
  Oba pochodzą z tego samego CSV, więc są zgodne. Zmieniasz cenę → zmień w `data.js` **i** w Shopify
  (albo zregeneruj CSV: `node generate-csv.mjs` i zaimportuj ponownie).
- **Dopasowanie produktów** działa automatycznie: uchwyt produktu w Shopify = `id` u nas,
  a rozmiar A4/A3/B2 = wartość opcji „Rozmiar". Nic nie przepisujesz ręcznie.
- **Panel „Wiadomości"/„Zamówienia" z demo** jest tylko poglądowy — realne zamówienia są w Shopify.
  Formularz kontaktu na froncie możesz podpiąć pod Formspree (patrz `js/pages.js`, `CONTACT_ENDPOINT`).
- **Wersja API** w `js/shopify.js` to `2025-01`. Jeśli Shopify kiedyś zgłosi, że jest przestarzała,
  podbij ją na aktualną (jedna linia).
