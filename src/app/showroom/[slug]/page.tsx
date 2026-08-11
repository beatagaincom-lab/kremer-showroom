import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { FixleintuecherShowroom } from "@/components/showroom/fixleintuecher-showroom";
import { ImageWorld } from "@/components/showroom/image-world";
import { ShowroomExperience } from "@/components/showroom/showroom-experience";
import {
  FIXLEINTUECHER_SLUG,
  IMAGE_WORLD_SLUG,
  LEGACY_IMAGE_WORLD_SLUG,
} from "@/data/fixleintuecher";
import { catalogRepository } from "@/lib/catalog-repository";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === FIXLEINTUECHER_SLUG) {
    return {
      title: "Fixleintücher in 32 Farben",
      description: "Die vollständige KREMER Farbkollektion für Fixleintücher und Spannbettlaken – mit Kommentaren direkt am Produkt.",
    };
  }
  if (slug === IMAGE_WORLD_SLUG) {
    return {
      title: "Beispiele & Bildwelt",
      description: "Eine erste Auswahl an Beispielen für die Bildsprache der Fixleintücher-Kollektion – auf Wunsch zeigen wir mehr.",
    };
  }
  const bundle = await catalogRepository.getShowroomBySlug(slug);
  return bundle
    ? { title: `Für ${bundle.client.name} kuratiert`, description: bundle.client.introduction }
    : { title: "Showroom nicht gefunden" };
}

export default async function ShowroomPage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === FIXLEINTUECHER_SLUG) return <FixleintuecherShowroom />;
  if (slug === IMAGE_WORLD_SLUG) return <ImageWorld />;
  if (slug === LEGACY_IMAGE_WORLD_SLUG) permanentRedirect(`/showroom/${IMAGE_WORLD_SLUG}`);
  const bundle = await catalogRepository.getShowroomBySlug(slug);
  if (!bundle) notFound();
  return <ShowroomExperience bundle={bundle} />;
}
