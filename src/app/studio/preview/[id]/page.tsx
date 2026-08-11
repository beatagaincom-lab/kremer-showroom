import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowroomExperience } from "@/components/showroom/showroom-experience";
import { catalogRepository } from "@/lib/catalog-repository";

export const metadata: Metadata = { title: "Studio Vorschau" };

export default async function StudioPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  const bundle = await catalogRepository.getShowroomBySlug("wohnatelier-meier");
  if (!bundle) notFound();
  return <ShowroomExperience bundle={bundle} previewMode />;
}
