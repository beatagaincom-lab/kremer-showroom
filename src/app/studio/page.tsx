import type { Metadata } from "next";
import { StudioEditor } from "@/components/studio/studio-editor";
import { contacts } from "@/data/catalog";
import { catalogRepository } from "@/lib/catalog-repository";

export const metadata: Metadata = {
  title: "Showroom Studio",
  description: "Interner Presentation Builder für personalisierte Kremer Showrooms.",
};

export default async function StudioPage() {
  const products = await catalogRepository.getProducts();
  return <StudioEditor products={products} contacts={contacts} />;
}
