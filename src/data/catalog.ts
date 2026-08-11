import type {
  Client,
  ContactPerson,
  Product,
  Showroom,
  StudioConfiguration,
} from "@/types/catalog";

const productImage = (src: string, alt: string) => [{ src, alt }];

export const contacts: ContactPerson[] = [
  {
    id: "claudia-frei",
    name: "Claudia Frei",
    role: "Verkaufsberatung",
    email: "claudia.frei@kremer.ch",
    phone: "+41 44 748 50 50",
    message:
      "Ich unterstütze Sie gerne bei Varianten, Mengen und Lieferterminen.",
  },
  {
    id: "marco-keller",
    name: "Marco Keller",
    role: "Key Account Beratung",
    email: "marco.keller@kremer.ch",
    phone: "+41 44 748 50 51",
    message: "Gerne begleite ich Ihre Auswahl bis zur passenden Offerte.",
  },
];

export const clients: Client[] = [
  {
    id: "wohnatelier-meier",
    name: "Wohnatelier Meier",
    contactPersonId: "claudia-frei",
    introduction:
      "Eine ausgewählte Kollektion für Ihr Sortiment, zusammengestellt von Claudia Frei.",
  },
];

const mistralVariants = [
  ["mistral-himmel", "LH-4012", "Himmel", "#9bc8e7", "saturate(1.2) contrast(1.04)"],
  ["mistral-nebel", "LH-4006", "Nebel", "#c6c7c5", "grayscale(.65) brightness(1.08)"],
  ["mistral-graphit", "LH-4021", "Graphit", "#42464a", "grayscale(1) brightness(.58)"],
  ["mistral-salbei", "LH-4031", "Salbei", "#87927f", "hue-rotate(62deg) saturate(.55) brightness(.9)"],
  ["mistral-sand", "LH-4044", "Sand", "#c7b9a7", "grayscale(.55) sepia(.35) brightness(1.04)"],
  ["mistral-terra", "LH-4050", "Terracotta", "#a76850", "sepia(.55) saturate(1.35) hue-rotate(325deg)"],
] as const;

export const products: Product[] = [
  {
    id: "mistral",
    sku: "LH-MISTRAL",
    name: "Mistral",
    description: "Eine ruhige Farbwelt für vielseitige Sortimente.",
    collection: "Essentials",
    category: "Schlaftextilien",
    material: "Produktstamm offen",
    quality: "Demokonfiguration",
    care: "Nach Produktetikett",
    sizes: ["90 × 200 cm", "140 × 200 cm", "160 × 200 cm", "180 × 200 cm"],
    media: productImage(
      "/assets/products/mistral-sky.png",
      "Hellblaues Textil auf einem klar inszenierten Bett",
    ),
    variants: mistralVariants.map(([id, sku, colorName, colorCode, imageFilter]) => ({
      id,
      sku,
      colorName,
      colorCode,
      textureImage: "/assets/products/hero-folded-sky.png",
      productImages: productImage(
        "/assets/products/mistral-sky.png",
        `Mistral in der Farbvariante ${colorName}`,
      ),
      availability: "Auf Anfrage",
      imageFilter,
    })),
  },
  {
    id: "linea",
    sku: "LH-LINEA",
    name: "Linea",
    description: "Kissenvarianten als ruhiger Akzent für abgestimmte Räume.",
    collection: "Kissen",
    category: "Wohntextilien",
    material: "Produktstamm offen",
    quality: "Demokonfiguration",
    care: "Nach Produktetikett",
    sizes: ["40 × 60 cm", "50 × 70 cm", "60 × 90 cm"],
    media: productImage(
      "/assets/products/linea-cushions.png",
      "Texturierte Kissen in kühlen Naturfarben",
    ),
    variants: [
      ["linea-nebel", "LN-2084", "Nebel", "#c7c9c8", "grayscale(.7) brightness(1.05)"],
      ["linea-salbei", "LN-2087", "Salbei", "#87927f", "hue-rotate(55deg) saturate(.62)"],
      ["linea-himmel", "LN-2091", "Himmel", "#91bfdf", "none"],
    ].map(([id, sku, colorName, colorCode, imageFilter]) => ({
      id,
      sku,
      colorName,
      colorCode,
      textureImage: "/assets/products/linea-cushions.png",
      productImages: productImage(
        "/assets/products/linea-cushions.png",
        `Linea in der Farbvariante ${colorName}`,
      ),
      availability: "Auf Anfrage",
      imageFilter,
    })),
  },
  {
    id: "aura",
    sku: "LH-AURA",
    name: "Aura",
    description: "Eine kompakte Farbfamilie für textile Badwelten.",
    collection: "Frottier",
    category: "Badtextilien",
    material: "Produktstamm offen",
    quality: "Demokonfiguration",
    care: "Nach Produktetikett",
    sizes: ["30 × 50 cm", "50 × 100 cm", "70 × 140 cm"],
    media: productImage(
      "/assets/products/aura-towels.png",
      "Gefaltete Frottiertücher in vier ruhigen Farben",
    ),
    variants: [
      ["aura-himmel", "AU-7012", "Himmel", "#91bfdf"],
      ["aura-graphit", "AU-7021", "Graphit", "#42464a"],
      ["aura-nebel", "AU-7006", "Nebel", "#d2d3d1"],
      ["aura-salbei", "AU-7031", "Salbei", "#87927f"],
    ].map(([id, sku, colorName, colorCode]) => ({
      id,
      sku,
      colorName,
      colorCode,
      textureImage: "/assets/products/aura-towels.png",
      productImages: productImage(
        "/assets/products/aura-towels.png",
        `Aura in der Farbvariante ${colorName}`,
      ),
      availability: "Auf Anfrage",
    })),
  },
];

export const showrooms: Showroom[] = [
  {
    id: "showroom-wohnatelier-meier",
    slug: "wohnatelier-meier",
    title: "Eine Auswahl mit Ruhe, Farbe und Substanz.",
    clientId: "wohnatelier-meier",
    selectedProductIds: ["mistral", "linea", "aura"],
    highlightedVariantIds: ["mistral-himmel", "linea-nebel", "aura-salbei"],
    showPrices: false,
    sections: {
      overview: true,
      comparison: true,
      materialDetails: true,
      contact: true,
    },
    sectionOrder: ["overview", "products", "selection", "contact"],
    expirationDate: "2027-12-31",
    status: "published",
  },
];

export const defaultStudioConfiguration: StudioConfiguration = {
  customerName: "Wohnatelier Meier",
  title: "Eine Auswahl mit Ruhe, Farbe und Substanz.",
  introduction: "Für Ihr Sortiment zusammengestellt.",
  contactPersonId: "claudia-frei",
  slug: "wohnatelier-meier",
  selectedProductIds: ["mistral", "linea", "aura"],
  hiddenProductIds: [],
  highlightedVariantIds: ["mistral-himmel", "linea-nebel", "aura-salbei"],
  showPrices: false,
  sections: {
    overview: true,
    comparison: true,
    materialDetails: true,
    contact: true,
  },
};
