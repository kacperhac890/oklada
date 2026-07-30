/* ============================================================================
   data.js  —  Domyślny katalog (seed)
   Te dane trafiają do localStorage przy pierwszym uruchomieniu.
   Panel admina edytuje kopię w localStorage, a nie ten plik.
   Aby przywrócić fabryczny katalog: Admin → "Przywróć katalog".
   ========================================================================== */

const SIZES = [
  { code: "A4", label: "A4", dim: "21 × 29,7 cm" },
  { code: "A3", label: "A3", dim: "29,7 × 42 cm" },
  { code: "B2", label: "B2", dim: "50 × 70,7 cm" },
];

const DEFAULT_CATEGORIES = [
  { slug: "motoryzacja", name: "Motoryzacja", desc: "Kultowe auta i motorsport w wersji na ścianę." },
  { slug: "typografia",  name: "Typografia",  desc: "Słowa i liternictwo, które budują charakter wnętrza." },
  { slug: "ilustracja",  name: "Ilustracja",  desc: "Charakterne ilustracje i pop-art z pazurem." },
  { slug: "abstrakcja",  name: "Abstrakcja",  desc: "Kolor, faktura i nastrój bez dosłowności." },
];

const DEFAULT_PRODUCTS = [
  {
    id: "amg-gt",
    title: "AMG GT Black Series",
    category: "motoryzacja",
    tags: ["mercedes", "amg", "sport"],
    image: "assets/posters/amg-gt.jpg",
    featured: true,
    description:
      "Tylny dyfuzor, wielkie skrzydło i typografia rodem z materiałów prasowych AMG. Plakat dla tych, którzy poznają auto po dźwięku V8.",
    prices: { A4: 55, A3: 89, B2: 145 },
  },
  {
    id: "mercedes-190e",
    title: "Mercedes 190E Evolution II",
    category: "motoryzacja",
    tags: ["mercedes", "youngtimer", "dtm"],
    image: "assets/posters/mercedes-190e.jpg",
    featured: false,
    description:
      "Homologacyjna legenda DTM w chromowanej oprawie liczby 190E. Youngtimer, który dziś kosztuje jak nowy samochód.",
    prices: { A4: 55, A3: 89, B2: 145 },
  },
  {
    id: "porsche-911",
    title: "Porsche 911 GT3 RS",
    category: "motoryzacja",
    tags: ["porsche", "911", "tor"],
    image: "assets/posters/porsche-911.jpg",
    featured: true,
    description:
      "Granatowy pas, herb na środku i suchy zestaw danych: 525 KM, 296 km/h, 3,2 s. Techniczny plakat dla fana toru.",
    prices: { A4: 55, A3: 89, B2: 145 },
  },
  {
    id: "cls63",
    title: "Mercedes CLS 63 AMG",
    category: "motoryzacja",
    tags: ["mercedes", "amg", "night"],
    image: "assets/posters/cls63.jpg",
    featured: false,
    description:
      "Czerń, mokry asfalt i biały numer CLS 63 na całą wysokość. Ciemny plakat, który dobrze wygląda przy lampce światła.",
    prices: { A4: 55, A3: 89, B2: 145 },
  },
  {
    id: "cheers",
    title: "Cheers",
    category: "typografia",
    tags: ["kuchnia", "line-art", "impreza"],
    image: "assets/posters/cheers.jpg",
    featured: false,
    description:
      "Uniesione dłonie z kieliszkami i taco w prostym line-arcie. Ciepły akcent do kuchni, jadalni albo domowego baru.",
    prices: { A4: 45, A3: 75, B2: 125 },
  },
  {
    id: "easier",
    title: "Maybe It Is Easier Than You Think",
    category: "typografia",
    tags: ["cytat", "retro", "groovy"],
    image: "assets/posters/easier.jpg",
    featured: true,
    description:
      "Falująca, groovy typografia z lat 70. Motto, które łagodzi każdy poniedziałek i ociepla białą ścianę.",
    prices: { A4: 45, A3: 75, B2: 125 },
  },
  {
    id: "chili-hot",
    title: "Plans For The Year: Be Hot",
    category: "typografia",
    tags: ["kuchnia", "cytat", "chili"],
    image: "assets/posters/chili-hot.jpg",
    featured: false,
    description:
      "Jedno czerwone chili i krótki plan na cały rok. Minimalistyczny żart do kuchni z domieszką ostrości.",
    prices: { A4: 45, A3: 75, B2: 125 },
  },
  {
    id: "aperol",
    title: "Aperol For-Ever",
    category: "ilustracja",
    tags: ["pop-art", "lato", "drink"],
    image: "assets/posters/aperol.jpg",
    featured: true,
    description:
      "Elegancka babcia w okularach, spritz w dłoni i talia kart na stole. Kolorowa ilustracja, która nie traktuje siebie zbyt serio.",
    prices: { A4: 49, A3: 79, B2: 135 },
  },
  {
    id: "marlboro",
    title: "Red Nails",
    category: "ilustracja",
    tags: ["pop-art", "vintage", "grafika"],
    image: "assets/posters/marlboro.jpg",
    featured: false,
    description:
      "Komiksowy pop-art na intensywnym turkusie: czerwone paznokcie i vintage paczka. Mocny, graficzny akcent na jednej ścianie.",
    prices: { A4: 49, A3: 79, B2: 135 },
  },
  {
    id: "cherry-disco",
    title: "Cherry Disco",
    category: "abstrakcja",
    tags: ["lato", "kule-disco", "woda"],
    image: "assets/posters/cherry-disco.jpg",
    featured: true,
    description:
      "Czerwone wiśnie i lustrzane kule disco unoszące się na turkusowej wodzie. Wakacyjny, imprezowy nastrój w formie fotografii.",
    prices: { A4: 49, A3: 85, B2: 139 },
  },
];
