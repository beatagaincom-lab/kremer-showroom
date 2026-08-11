import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FixleintuecherShowroom } from "@/components/showroom/fixleintuecher-showroom";
import { ShowroomExperience } from "@/components/showroom/showroom-experience";
import { UrsulaImageWorld } from "@/components/showroom/ursula-image-world";
import { FIXLEINTUECHER_SLUG, URSULA_IMAGE_WORLD_SLUG } from "@/data/fixleintuecher";
import { catalogRepository } from "@/lib/catalog-repository";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === FIXLEINTUECHER_SLUG) {
    return {
      title: "Fixleintücher in 32 Farben",
      description: "Die vollständige KREMER Farbkollektion für Fixleintücher und Spannbettlaken.",
    };
  }
  if (slug === URSULA_IMAGE_WORLD_SLUG) {
    return {
      title: "Bildwelt Fixleintücher",
      description: "Eine reduzierte Bildpräsentation der Fixleintücher-Kollektion.",
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
  if (slug === URSULA_IMAGE_WORLD_SLUG) return <UrsulaImageWorld />;
  const bundle = await catalogRepository.getShowroomBySlug(slug);
  if (!bundle) notFound();
  return <ShowroomExperience bundle={bundle} />;
}
