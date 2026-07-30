# Eksport OKŁADKA → Shopify

Ten folder to **pakiet migracyjny**. Sklep demo (HTML/JS) pokazywał UX i design;
na Shopify prawdziwy koszyk, kasę, płatności i panel dostajesz natywnie.
Ścieżka poniżej to sprawdzony sposób na uruchomienie małego sklepu z plakatami:
**motyw Dawn + import CSV + ustawienia** — prawie bez kodu.

Finalny import robisz w swoim panelu Shopify (nie mam do niego dostępu).

## Zawartość folderu

| Plik | Do czego |
|---|---|
| `products_export.csv` | Import 10 plakatów z wariantami A4/A3/B2 i cenami |
| `generate-csv.mjs` | Generator CSV z katalogu (`node generate-csv.mjs`) — odpal po zmianach w ofercie |
| `brand.css` | Opcjonalne wykończenie wizualne dla Dawn |
| `SHOPIFY.md` | Ten przewodnik |

Zdjęcia plakatów: `../assets/posters/*.jpg` (10 szt.), aranżacje: `../assets/lifestyle/*.jpg`.

---

## Krok 1 — Sklep i motyw

1. Załóż sklep na [shopify.com](https://www.shopify.com) (14 dni testów).
2. **Sklep online → Motywy → Odkryj motywy → dodaj „Dawn”** (darmowy, oficjalny, minimalistyczny — pasuje do naszego kierunku).
3. Ustaw język: **Ustawienia → Języki → zmień domyślny na polski** (możesz też zainstalować „Translate & Adapt”).

## Krok 2 — Import produktów (CSV)

1. **Produkty → Importuj → wgraj `products_export.csv` → Prześlij i podejrzyj → Importuj**.
2. Powstanie **10 produktów**, każdy z opcją **„Rozmiar” = A4 / A3 / B2** i osobną ceną
   (np. AMG: 55 / 89 / 145 zł). Dawn automatycznie pokaże na karcie produktu przełącznik rozmiaru — **nie trzeba nic kodować**.
3. Stan magazynowy jest nieśledzony (druk na zamówienie), więc produkty są zawsze dostępne.

> Kolumna `Image Src` jest celowo pusta (czysty import bez błędów) — zdjęcia dodajesz w Kroku 3.

## Krok 3 — Zdjęcia

Nazwy plików = uchwyty (handle) produktów, więc dopasowanie jest oczywiste:

| Produkt (handle) | Plik |
|---|---|
| `amg-gt` | `assets/posters/amg-gt.jpg` |
| `porsche-911` | `assets/posters/porsche-911.jpg` |
| … | `assets/posters/<handle>.jpg` |

Dla każdego produktu: **Produkty → (wybierz) → sekcja Multimedia → prześlij** odpowiedni plik.
To 10 przeciągnięć. (Alternatywa: wystaw folder `assets` publicznie i wpisz URL-e w kolumnie
`Image Src` w CSV — wtedy import zaciągnie zdjęcia sam.)

## Krok 4 — Kolekcje (kategorie)

Utwórz 4 **kolekcje automatyczne** (warunek: **Tag = nazwa**), bo CSV dodał kategorie jako tagi:

| Kolekcja | Warunek |
|---|---|
| Motoryzacja | Tag = `Motoryzacja` |
| Typografia | Tag = `Typografia` |
| Ilustracja | Tag = `Ilustracja` |
| Abstrakcja | Tag = `Abstrakcja` |

**Produkty → Kolekcje → Utwórz kolekcję → Typ: automatyczna**. To zastępuje filtr kategorii z demo.

## Krok 5 — Wygląd (kolory + fonty)

W **Sklep online → Motywy → Dostosuj → (u góry) Ustawienia motywu**:

**Kolory** — utwórz schemat zgodny z marką:
| Rola | HEX |
|---|---|
| Tło | `#F7F6F2` |
| Tekst | `#1A1917` |
| Przyciski (tło / tekst) | `#1A1917` / `#F7F6F2` |
| Akcent | `#2C5545` |
| Obramowania | `#E2DFD6` |

**Typografia** — wyszukaj i ustaw:
- Nagłówki: **Space Grotesk** (jeśli brak w bibliotece: „Work Sans” lub „Archivo”)
- Tekst: **Manrope** (jeśli brak: „Assistant”)

**Opcjonalnie `brand.css`** (cyfry tabelaryczne, ziarno papieru, oprawa miniatur):
`Motywy → ⋯ → Edytuj kod → Assets → base.css` — wklej zawartość `brand.css` na końcu pliku.

## Krok 6 — Strona główna

W edytorze motywu ułóż sekcje (Dawn: „Dodaj sekcję”), tak jak w demo:
1. **Slajd/Baner obrazkowy** — użyj zdjęcia aranżacyjnego (`assets/lifestyle/life-05.jpg`), nagłówek „Plakaty, które robią wnętrze”, przycisk → kolekcja „Wszystkie”.
2. **Tekst przewijany** — „Błyszczący papier 200 g · Wysyłka 48h · Darmowa dostawa od 200 zł”.
3. **Kolekcje na liście** — 4 kategorie z Kroku 4.
4. **Polecana kolekcja** — bestsellery.
5. **Galeria multimediów** — 3 zdjęcia aranżacyjne („Zobacz je na ścianie”).
6. **Grupa/Ikony z tekstem** — druk / pakowanie / wysyłka.

## Krok 7 — Strony: O nas i Kontakt

- **Sklep online → Strony → Dodaj stronę → „O nas”** (wklej treść z zakładki O nas w demo).
- **Kontakt**: dodaj stronę i przypisz jej szablon **`page.contact`** (Dawn ma go wbudowany).
  Formularz `{% form 'contact' %}` **działa natywnie** — wiadomości przychodzą na e-mail sklepu
  (Ustawienia → Powiadomienia → adres). To zastępuje panel „Wiadomości” z demo.

## Krok 8 — Nawigacja

**Sklep online → Nawigacja → Menu główne**: Sklep (kolekcja „Wszystkie”), Kategorie (4 kolekcje),
O nas, Kontakt. Panel administracyjny to natywny **admin Shopify** (nie robimy własnego).

## Krok 9 — Dostawa i koszyk

- Koszyk i kasa: **natywne Shopify** (nic nie kodujesz — to zastępuje `store.js` z demo).
- **Darmowa dostawa od 200 zł**: Ustawienia → Wysyłka i dostawa → strefa Polska →
  dodaj stawkę **0 zł z warunkiem „minimalna wartość zamówienia 200 zł”**, obok stawki kurierskiej (np. 15 zł).

## Krok 10 — Płatności (Przelewy24 / BLIK / karty)

**Ustawienia → Płatności**. W Polsce najczęściej:
- **Przelewy24** lub **Autopay/Blue Media** (BLIK, szybkie przelewy) — z App Store Shopify,
- **PayU**,
- **Stripe** (karty; BLIK w Stripe też jest),
- (jeśli dostępne w Twoim regionie) **Shopify Payments**.

Bramka, bezpieczeństwo i zgodność są po stronie dostawcy — nic nie kodujesz.

---

## Mapowanie: demo → Shopify

| Demo (ten projekt) | Shopify |
|---|---|
| Wybór rozmiaru A4/A3/B2 | Warianty produktu (opcja „Rozmiar”) — w CSV |
| Kategorie | Kolekcje automatyczne po tagu |
| Koszyk (`store.js`) | Natywny koszyk `/cart` |
| Kasa (`#/kasa`) | Shopify Checkout |
| Panel admina | Natywny admin Shopify |
| Wiadomości + odpowiedzi | Formularz kontaktowy → e-mail sklepu |
| Ceny per rozmiar | Cena per wariant — w CSV |
| Papier 200 g błysk, tuba | W opisie produktu (Body HTML) — w CSV |
| Design (kolory/typografia) | Ustawienia motywu + `brand.css` |

## Aktualizacja oferty

Zmieniłeś plakaty w `js/data.js`? Wygeneruj CSV ponownie i zaimportuj (Shopify nadpisze po handle):

```bash
cd shopify
node generate-csv.mjs
```

## Uwagi

- **Znaki towarowe.** Plakaty z logo marek (Mercedes, Porsche, Marlboro) sprzedajesz na własną
  odpowiedzialność — sprawdź prawa do znaków przed publikacją.
- **Alternatywa bez Shopify.** Ten sam front działa też ze **Snipcart** lub **Stripe Payment Links**
  (koszyk/płatność jako skrypt), albo jako headless przez **Storefront API**.
