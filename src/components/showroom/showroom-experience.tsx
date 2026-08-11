"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Columns2, Eye, RotateCcw, X } from "lucide-react";
import { contacts } from "@/data/catalog";
import { copyText, loadSelections, loadStudioConfiguration, saveSelections } from "@/lib/client-storage";
import type { Product, Selection, ShowroomBundle, StudioConfiguration, Variant } from "@/types/catalog";
import { ProductChapter } from "./product-chapter";
import { SelectionSummary } from "./selection-summary";
import { EditorialOverview, ShowroomHeader, ShowroomHero } from "./showroom-static";

type ShowroomExperienceProps = {
  bundle: ShowroomBundle;
  previewMode?: boolean;
};

function encodeSelections(selections: Selection[]) {
  const json = JSON.stringify(selections);
  return window.btoa(unescape(encodeURIComponent(json)));
}

function decodeSelections(encoded: string) {
  try {
    const json = decodeURIComponent(escape(window.atob(encoded)));
    const parsed = JSON.parse(json) as Selection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getVariant(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];
}

export function ShowroomExperience({ bundle, previewMode = false }: ShowroomExperienceProps) {
  const [previewConfig, setPreviewConfig] = useState<StudioConfiguration | null>(null);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [selectionReady, setSelectionReady] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [material, setMaterial] = useState<{ product: Product; variant: Variant } | null>(null);
  const [notice, setNotice] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      bundle.products.map((product) => [
        product.id,
        product.variants.find((variant) => bundle.showroom.highlightedVariantIds.includes(variant.id))?.id ?? product.variants[0].id,
      ]),
    ),
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (previewMode) {
        const stored = loadStudioConfiguration();
        if (stored) {
          setPreviewConfig(stored);
          setSelectedVariants((current) => {
            const next = { ...current };
            for (const product of bundle.products) {
              next[product.id] = product.variants.find((variant) => stored.highlightedVariantIds.includes(variant.id))?.id ?? next[product.id];
            }
            return next;
          });
        }
      }

      const shared = new URLSearchParams(window.location.search).get("s");
      setSelections(shared ? decodeSelections(shared) : loadSelections());
      setSelectionReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [bundle.products, previewMode]);

  useEffect(() => {
    if (selectionReady) saveSelections(selections);
  }, [selectionReady, selections]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const showroom = previewConfig
    ? {
        ...bundle.showroom,
        title: previewConfig.title,
        selectedProductIds: previewConfig.selectedProductIds,
        highlightedVariantIds: previewConfig.highlightedVariantIds,
        showPrices: previewConfig.showPrices,
        sections: previewConfig.sections,
      }
    : bundle.showroom;

  const client = previewConfig
    ? { ...bundle.client, name: previewConfig.customerName, introduction: previewConfig.introduction, logo: previewConfig.customerLogo }
    : bundle.client;

  const contact = previewConfig
    ? contacts.find((entry) => entry.id === previewConfig.contactPersonId) ?? bundle.contact
    : bundle.contact;

  const visibleProducts = useMemo(() => {
    const selectedIds = previewConfig?.selectedProductIds ?? bundle.showroom.selectedProductIds;
    const hiddenIds = new Set(previewConfig?.hiddenProductIds ?? []);
    const order = new Map(selectedIds.map((id, index) => [id, index]));
    return bundle.products
      .filter((product) => selectedIds.includes(product.id) && !hiddenIds.has(product.id))
      .toSorted((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  }, [bundle.products, bundle.showroom.selectedProductIds, previewConfig?.selectedProductIds, previewConfig?.hiddenProductIds]);

  const toggleSelection = (product: Product) => {
    const variant = getVariant(product, selectedVariants[product.id]);
    setSelections((current) => {
      const exists = current.findIndex((item) => item.productId === product.id && item.variantId === variant.id);
      if (exists >= 0) return current.filter((_, index) => index !== exists);
      return [...current, { productId: product.id, variantId: variant.id, size: product.sizes[0], quantity: 1, note: "" }];
    });
  };

  const updateSelection = (index: number, patch: Partial<Selection>) => {
    setSelections((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const openCompare = () => {
    if (selections.length < 2) {
      setNotice("Wählen Sie mindestens zwei Varianten für den Vergleich.");
      return;
    }
    setCompareOpen(true);
  };

  const shareSelection = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", encodeSelections(selections));
    url.hash = "auswahl";
    await copyText(url.toString());
    setNotice("Auswahllink kopiert.");
  };

  const requestSelection = (kind: "sample" | "quote") => {
    const lines = selections.map((selection) => {
      const product = visibleProducts.find((entry) => entry.id === selection.productId);
      const variant = product?.variants.find((entry) => entry.id === selection.variantId);
      return `• ${product?.name ?? selection.productId} — ${variant?.colorName ?? selection.variantId}, ${selection.size}, Menge ${selection.quantity}${selection.note ? `, Notiz: ${selection.note}` : ""}`;
    });
    const subject = kind === "sample" ? "Musteranfrage aus dem Kremer Showroom" : "Offertanfrage aus dem Kremer Showroom";
    const body = `Guten Tag ${contact.name}\n\n${subject}:\n\n${lines.join("\n")}\n\nFreundliche Grüsse`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="min-h-screen bg-white pb-20 text-graphite print:pb-0">
      {previewMode ? (
        <div className="sticky top-0 z-50 flex items-center justify-between bg-graphite px-4 py-2 text-xs text-white print:hidden">
          <span>Studio-Vorschau</span>
          <a href="/studio" className="underline underline-offset-4">Zurück zum Studio</a>
        </div>
      ) : null}

      <ShowroomHeader selectionCount={selections.length} />
      <ShowroomHero client={client} contact={contact} />
      {showroom.sections.overview ? <EditorialOverview showroom={showroom} products={visibleProducts} /> : null}

      <div>
        {visibleProducts.map((product, index) => {
          const variantId = selectedVariants[product.id] ?? product.variants[0].id;
          const isSaved = selections.some((item) => item.productId === product.id && item.variantId === variantId);
          return (
            <ProductChapter
              key={product.id}
              product={product}
              index={index}
              total={visibleProducts.length}
              selectedVariantId={variantId}
              isSaved={isSaved}
              showPrices={showroom.showPrices}
              materialEnabled={showroom.sections.materialDetails}
              onVariantChange={(variantIdValue) => setSelectedVariants((current) => ({ ...current, [product.id]: variantIdValue }))}
              onToggleSelection={() => toggleSelection(product)}
              onOpenMaterial={(variant) => setMaterial({ product, variant })}
            />
          );
        })}
      </div>

      <SelectionSummary
        selections={selections}
        products={visibleProducts}
        contact={contact}
        showPrices={showroom.showPrices}
        comparisonEnabled={showroom.sections.comparison}
        contactEnabled={showroom.sections.contact}
        onUpdate={updateSelection}
        onRemove={(index) => setSelections((current) => current.filter((_, itemIndex) => itemIndex !== index))}
        onCompare={openCompare}
        onShare={shareSelection}
        onRequest={requestSelection}
        onPrint={() => window.print()}
      />

      <AnimatePresence>
        {selections.length > 0 ? (
          <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 shadow-[0_-12px_35px_rgba(37,41,45,.08)] backdrop-blur-md print:hidden">
            <div className="site-gutter flex min-h-16 items-center justify-between gap-4">
              <p className="text-sm font-semibold">{selections.length} {selections.length === 1 ? "Variante ausgewählt" : "Varianten ausgewählt"}</p>
              <div className="flex items-center gap-1 sm:gap-4">
                <a href="#auswahl" className="button-quiet hidden sm:inline-flex">Auswahl ansehen</a>
                {showroom.sections.comparison ? <button type="button" className="button-quiet" onClick={openCompare}><Columns2 aria-hidden size={16} /> <span className="hidden sm:inline">Vergleichen</span></button> : null}
                <button type="button" className="button-quiet text-sky-strong" onClick={() => setSelections([])}><RotateCcw aria-hidden size={16} /> <span className="hidden sm:inline">Zurücksetzen</span></button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {compareOpen ? (
          <motion.div className="fixed inset-0 z-[70] bg-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="compare-title">
            <div className="site-gutter flex h-full flex-col py-6 md:py-10">
              <div className="flex items-center justify-between border-b border-line pb-5">
                <div>
                  <p className="text-sm text-sky-strong">Visueller Vergleich</p>
                  <h2 id="compare-title" className="mt-2 font-serif text-4xl md:text-6xl">Varianten nebeneinander</h2>
                </div>
                <button type="button" onClick={() => setCompareOpen(false)} className="flex h-12 w-12 items-center justify-center border border-line" aria-label="Vergleich schliessen"><X aria-hidden /></button>
              </div>
              <div className="hide-scrollbar grid flex-1 auto-cols-[76vw] grid-flow-col gap-5 overflow-x-auto py-8 sm:auto-cols-[45vw] lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-4">
                {selections.slice(0, 4).map((selection, index) => {
                  const product = visibleProducts.find((entry) => entry.id === selection.productId);
                  const variant = product?.variants.find((entry) => entry.id === selection.variantId);
                  if (!product || !variant) return null;
                  return (
                    <article key={`${selection.productId}-${selection.variantId}`} className="min-w-0 border-b border-line pb-6">
                      <div className="textile-swatch aspect-[4/3] w-full" style={{ "--swatch-color": variant.colorCode } as CSSProperties} />
                      <h3 className="mt-6 font-serif text-3xl">{product.name} — {variant.colorName}</h3>
                      <p className="mt-2 text-sm text-muted">{variant.sku}</p>
                      <dl className="mt-6 border-t border-line text-sm">
                        {[["Grösse", selection.size], ["Material", product.material], ["Lieferbarkeit", variant.availability]].map(([label, value]) => (
                          <div key={label} className="grid grid-cols-2 border-b border-line py-3"><dt className="text-muted">{label}</dt><dd>{value}</dd></div>
                        ))}
                      </dl>
                      <button type="button" className="button-quiet mt-4" onClick={() => setSelections((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Variante entfernen</button>
                    </article>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {material ? (
          <motion.div className="fixed inset-0 z-[80] grid bg-graphite/95 text-white lg:grid-cols-[65%_35%]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="material-title">
            <div className="relative min-h-[58svh] overflow-hidden">
              <Image src={material.variant.textureImage} alt={`Materialstruktur ${material.variant.colorName}`} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" style={{ filter: material.variant.imageFilter }} />
            </div>
            <div className="relative flex flex-col justify-center p-7 md:p-12">
              <button type="button" onClick={() => setMaterial(null)} className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center border border-white/30" aria-label="Materialansicht schliessen"><X aria-hidden /></button>
              <Eye aria-hidden className="mb-6 text-sky" />
              <h2 id="material-title" className="font-serif text-5xl">{material.product.name}</h2>
              <p className="mt-3 text-lg text-white/70">{material.variant.colorName} · {material.variant.sku}</p>
              <p className="mt-8 max-w-md leading-7 text-white/70">Die vergrösserte Ansicht dient der visuellen Orientierung. Verbindliche Materialangaben werden aus dem Produktstamm übernommen.</p>
              <button type="button" className="button-primary mt-8 self-start" onClick={() => setMaterial(null)}>Ansicht schliessen</button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {notice ? (
          <motion.div className="fixed bottom-24 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 border border-line bg-white px-5 py-3 text-sm shadow-[var(--shadow-soft)] print:hidden" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status">
            <Check aria-hidden size={16} className="text-sky-strong" /> {notice}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
