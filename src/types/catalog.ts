export type MediaAsset = {
  src: string;
  alt: string;
};

export type Variant = {
  id: string;
  sku: string;
  colorName: string;
  colorCode: string;
  textureImage: string;
  productImages: MediaAsset[];
  availability: string;
  price?: number;
  imageFilter?: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  collection: string;
  category: string;
  material: string;
  quality: string;
  care: string;
  sizes: string[];
  media: MediaAsset[];
  variants: Variant[];
};

export type ContactPerson = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  message: string;
};

export type Client = {
  id: string;
  name: string;
  logo?: string;
  contactPersonId: string;
  introduction: string;
};

export type ShowroomSections = {
  overview: boolean;
  comparison: boolean;
  materialDetails: boolean;
  contact: boolean;
};

export type Showroom = {
  id: string;
  slug: string;
  title: string;
  clientId: string;
  selectedProductIds: string[];
  highlightedVariantIds: string[];
  showPrices: boolean;
  sections: ShowroomSections;
  sectionOrder: string[];
  expirationDate: string;
  status: "draft" | "published";
};

export type Selection = {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  note: string;
};

export type ShowroomBundle = {
  showroom: Showroom;
  client: Client;
  contact: ContactPerson;
  products: Product[];
};

export type StudioConfiguration = {
  customerName: string;
  customerLogo?: string;
  title: string;
  introduction: string;
  contactPersonId: string;
  slug: string;
  selectedProductIds: string[];
  hiddenProductIds: string[];
  highlightedVariantIds: string[];
  showPrices: boolean;
  sections: ShowroomSections;
};
