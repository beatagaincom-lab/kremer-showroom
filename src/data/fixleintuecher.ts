export type FixleintuchColor = {
  id: string;
  code: string;
  name: string;
  color: string;
  family: "blue" | "green" | "rose" | "warm";
};

export type FixleintuchGalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const FIXLEINTUECHER_SLUG = "fixleintuecher-farbkollektion";
export const IMAGE_WORLD_SLUG = "bildwelt-beispiele";
/** Alter Link aus früheren Präsentationen; leitet auf IMAGE_WORLD_SLUG um. */
export const LEGACY_IMAGE_WORLD_SLUG = "ursula-bildwelt";

export const fixleintuchColors: FixleintuchColor[] = [
  { id: "04-hellblau", code: "04", name: "Hellblau", color: "#b8d5ee", family: "blue" },
  { id: "15-stahlblau", code: "15", name: "Stahlblau", color: "#7899b5", family: "blue" },
  { id: "navy", code: "Navy", name: "Navy", color: "#132c4f", family: "blue" },
  { id: "21-tuerkis", code: "21", name: "Türkis", color: "#0aa9c4", family: "blue" },
  { id: "46-royal", code: "46", name: "Royal", color: "#1258bd", family: "blue" },
  { id: "60-marine", code: "60", name: "Marine", color: "#17263d", family: "blue" },
  { id: "13-braun", code: "13", name: "Braun", color: "#57331f", family: "blue" },
  { id: "70-taupe", code: "70", name: "Taupe", color: "#a99b8c", family: "blue" },

  { id: "11-weiss", code: "11", name: "Weiss", color: "#f8f7f1", family: "green" },
  { id: "10-hellgruen", code: "10", name: "Hellgrün", color: "#d9edb4", family: "green" },
  { id: "44-kiwi", code: "44", name: "Kiwi", color: "#91bd19", family: "green" },
  { id: "11-olive", code: "11", name: "Olive", color: "#72754b", family: "green" },
  { id: "neu-17", code: "Neu (17)", name: "Salbeigrün", color: "#91a69b", family: "green" },
  { id: "31-petrol", code: "31", name: "Petrol", color: "#00696c", family: "green" },
  { id: "neu-5209-aqua", code: "Neu 5209", name: "Aqua", color: "#9ddde1", family: "green" },
  { id: "neu-dunkelgruen", code: "Neu", name: "Dunkelgrün", color: "#164f43", family: "green" },

  { id: "neu-coral-rose", code: "Neu", name: "Coral Rose", color: "#e7aaa5", family: "rose" },
  { id: "22-lila", code: "22", name: "Lila", color: "#a884b8", family: "rose" },
  { id: "73-brombeer", code: "73", name: "Brombeer", color: "#6e224b", family: "rose" },
  { id: "neu-hell", code: "Neu", name: "Naturweiss", color: "#efefec", family: "rose" },
  { id: "38-hellgrau", code: "38", name: "Hellgrau", color: "#d2d3d3", family: "rose" },
  { id: "71-graphit", code: "71", name: "Graphit", color: "#626466", family: "rose" },
  { id: "37-anthrazit", code: "37", name: "Anthrazit", color: "#383a3b", family: "rose" },
  { id: "15-schwarz", code: "15", name: "Schwarz", color: "#171819", family: "rose" },

  { id: "23-offwhite", code: "23", name: "Offwhite", color: "#f0e9dc", family: "warm" },
  { id: "52-sand", code: "52", name: "Sand", color: "#d5bda0", family: "warm" },
  { id: "41-caramel", code: "41", name: "Caramel", color: "#ad7543", family: "warm" },
  { id: "01-gelb", code: "01", name: "Gelb", color: "#f5be27", family: "warm" },
  { id: "30-mandarine", code: "30", name: "Mandarine", color: "#ed7513", family: "warm" },
  { id: "02-rot", code: "02", name: "Rot", color: "#c51420", family: "warm" },
  { id: "05-bordeaux", code: "05", name: "Bordeaux", color: "#731b28", family: "warm" },
  { id: "08-altrosa", code: "08", name: "Altrosa", color: "#ce9291", family: "warm" },
];

export const fixleintuchFamilies = [
  { id: "blue" as const, title: "Blaue Reihe", description: "Von Hellblau bis Marine, ergänzt durch ruhige Braun- und Taupetöne." },
  { id: "green" as const, title: "Grüne Reihe", description: "Frische, natürliche Nuancen von Weiss und Hellgrün bis Petrol und Dunkelgrün." },
  { id: "rose" as const, title: "Rosa, Violett und Grau", description: "Sanfte Rosétöne treffen auf Lila, Brombeer und eine präzise Grauskala." },
  { id: "warm" as const, title: "Natur- und warme Farben", description: "Offwhite, Sand und Caramel führen zu Gelb, Rot, Bordeaux und Altrosa." },
];

export const bildweltGallery: FixleintuchGalleryImage[] = [
  {
    src: "/assets/fixleintuecher/beispiele/authentic-studio-textile-catalogue.webp",
    alt: "Gerollte Fixleintücher in vier harmonischen Farbgruppen auf einem Studiotisch",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/beispiele/catalogue-architectural-loft.webp",
    alt: "Sortierte Fixleintücher auf einem langen Holztisch in einem hellen Loft",
    width: 2752,
    height: 1536,
  },
  {
    src: "/assets/fixleintuecher/beispiele/catalogue-bright-horizon.webp",
    alt: "Gestapelte Fixleintücher in kräftigen und natürlichen Farbtönen vor hellem Hintergrund",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/beispiele/catalogue-dynamic-top-down.webp",
    alt: "Fixleintücher in allen Kollektionstönen kreisförmig aus der Vogelperspektive arrangiert",
    width: 2048,
    height: 2048,
  },
  {
    src: "/assets/fixleintuecher/beispiele/catalogue-low-angle-majesty.webp",
    alt: "Dicht gestapelte Fixleintücher aus tiefer Perspektive fotografiert",
    width: 1792,
    height: 2400,
  },
  {
    src: "/assets/fixleintuecher/beispiele/catalogue-ordered-symmetry.webp",
    alt: "Symmetrisch geordnete Fixleintücher in zwanzig Farben",
    width: 2400,
    height: 1792,
  },
  {
    src: "/assets/fixleintuecher/beispiele/catalogue-soft-scandi-luxury.webp",
    alt: "Gerollte Fixleintücher in einer warmen, skandinavisch eingerichteten Umgebung",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/beispiele/definitive-textile-authority-shoot.webp",
    alt: "Fixleintücher als präzise Farbmatrix vor neutralem Studiohintergrund",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/beispiele/natural-saturation-textile-shoot.webp",
    alt: "Natürlich beleuchteter Stapel gerollter Fixleintücher in der gesamten Farbpalette",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/beispiele/radically-honest-textile-photography.webp",
    alt: "Authentisch inszenierte Fixleintücher auf einer gebrauchten Studiofläche",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/beispiele/the-swiss-studio-truth.webp",
    alt: "Sachlich fotografierte Fixleintücher in klaren Reihen auf Beton",
    width: 2528,
    height: 1696,
  },
];

export const fixleintuchGallery: FixleintuchGalleryImage[] = [
  { src: "/assets/fixleintuecher/photo-01.jpg", alt: "Farbposter mit gerollten Fixleintüchern in 32 Farbtönen", width: 896, height: 1200 },
  { src: "/assets/fixleintuecher/photo-02.jpg", alt: "Vollständige Farbkollektion mit vier Farbfamilien", width: 1200, height: 1800 },
  { src: "/assets/fixleintuecher/photo-03.jpg", alt: "Übersicht der Fixleintücher und Spannbettlaken nach Farbreihen", width: 1024, height: 1536 },
  { src: "/assets/fixleintuecher/photo-04.jpg", alt: "Vertikale Farbkollektion aus gefalteten Stoffmustern", width: 1182, height: 1330 },
  { src: "/assets/fixleintuecher/photo-05.jpg", alt: "32 gefaltete Stoffmuster auf weissem Hintergrund", width: 1024, height: 1536 },
  { src: "/assets/fixleintuecher/photo-06.jpg", alt: "Nahansichten elastischer Säume in vier Farbfamilien", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-07.jpg", alt: "Quadratische Stoffmuster in 32 Farbtönen", width: 1448, height: 1086 },
  { src: "/assets/fixleintuecher/photo-08.jpg", alt: "Farbkollektion mit gestapelten Stoffmustern und Farbnamen", width: 1149, height: 1369 },
  { src: "/assets/fixleintuecher/photo-09.jpg", alt: "Vier gestapelte Farbreihen der Spannbettlaken", width: 1448, height: 1086 },
  { src: "/assets/fixleintuecher/photo-10.jpg", alt: "Gerollte Fixleintücher mit Farbcodes in vier Reihen", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-11.jpg", alt: "Flach ausgelegte Stoffmuster nach Farbgruppen", width: 1491, height: 1055 },
  { src: "/assets/fixleintuecher/photo-12.jpg", alt: "Schmale Farbkollektion aus gestapelten Stoffmustern", width: 1024, height: 1536 },
  { src: "/assets/fixleintuecher/photo-13.jpg", alt: "Breite Übersicht der vier Farbfamilien", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-14.jpg", alt: "Gerollte Stoffmuster mit Farbcodes in vier Gruppen", width: 1055, height: 1491 },
  { src: "/assets/fixleintuecher/photo-15.jpg", alt: "Farbvarianten der Spannbettlaken auf hellem Hintergrund", width: 1055, height: 1491 },
  { src: "/assets/fixleintuecher/photo-16.jpg", alt: "Aufgeschlagene Farbmuster-Kollektion mit 32 Tönen", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-17.jpg", alt: "Minimalistische Farbkarte mit quadratischen Mustern", width: 1024, height: 1536 },
  { src: "/assets/fixleintuecher/photo-18.jpg", alt: "Farbkollektion mit Stoffmustern und Produktdetails", width: 1024, height: 1536 },
  { src: "/assets/fixleintuecher/photo-19.jpg", alt: "Gerollte Farbmuster in vier gleichmässigen Spalten", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-20.jpg", alt: "Locker gerollte Stoffmuster mit Farbnamen", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-21.jpg", alt: "Vier Farbreihen aus flach gelegten Stoffproben", width: 1024, height: 1536 },
  { src: "/assets/fixleintuecher/photo-22.jpg", alt: "Gefaltete Stoffmuster in blauen, grünen, grauen und warmen Tönen", width: 1122, height: 1402 },
  { src: "/assets/fixleintuecher/photo-23.jpg", alt: "Fächerförmig angeordnete Farbmuster", width: 1055, height: 1491 },
  { src: "/assets/fixleintuecher/photo-24.jpg", alt: "Vier vertikale Stapel der vollständigen Farbkollektion", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-25.jpg", alt: "Fixleintücher und Spannbettlaken als gestapelte Farbkollektion", width: 1055, height: 1491 },
  { src: "/assets/fixleintuecher/photo-26.jpg", alt: "Gefaltete Farbmuster mit Bezeichnungen in vier Reihen", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-27.jpg", alt: "Reduzierte Ansicht von vier schmalen Farbreihen", width: 1448, height: 1086 },
  { src: "/assets/fixleintuecher/photo-28.jpg", alt: "Stoffbahnen in Blau, Grün, Violett, Grau und warmen Farben", width: 1536, height: 1024 },
  { src: "/assets/fixleintuecher/photo-29.jpg", alt: "Gestapelte Spannbettlaken in 32 Farbtönen", width: 1055, height: 1491 },
  { src: "/assets/fixleintuecher/photo-30.jpg", alt: "Freigestellte gerollte Stoffmuster der gesamten Kollektion", width: 1055, height: 1491 },
  { src: "/assets/fixleintuecher/photo-31.jpg", alt: "Editoriale Farbkollektion mit Stoffstapeln und Naturdetails", width: 1024, height: 1536 },
];
