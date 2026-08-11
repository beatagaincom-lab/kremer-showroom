"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, Eye, Minus } from "lucide-react";
import type { Product, Variant } from "@/types/catalog";

type ProductChapterProps = {
  product: Product;
  index: number;
  total: number;
  selectedVariantId: string;
  isSaved: boolean;
  showPrices: boolean;
  materialEnabled: boolean;
  onVariantChange: (variantId: string) => void;
  onToggleSelection: () => void;
  onOpenMaterial: (variant: Variant) => void;
};

export function ProductChapter({
  product,
  index,
  total,
  selectedVariantId,
  isSaved,
  showPrices,
  materialEnabled,
  onVariantChange,
  onToggleSelection,
  onOpenMaterial,
}: ProductChapterProps) {
  const variant = product.variants.find((entry) => entry.id === selectedVariantId) ?? product.variants[0];
  const productNumber = String(index + 1).padStart(2, "0");

  return (
    <section id={`product-${product.id}`} className="content-auto scroll-mt-20 border-t border-line bg-white py-16 md:py-24">
      <div className="site-gutter mb-8 flex items-center gap-4 text-xs text-muted">
        <span className="text-sky-strong">{productNumber} / {String(total).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-line"><span className="block h-px bg-sky" style={{ width: `${((index + 1) / total) * 100}%` }} /></span>
        <span>{product.category}</span>
      </div>

      <div className="grid lg:grid-cols-[53%_47%]">
        <div className="relative min-h-[52svh] overflow-hidden bg-surface lg:sticky lg:top-[72px] lg:h-[calc(100svh-72px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={variant.id}
              initial={{ opacity: 0.15, scale: 1.008 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.15 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={variant.productImages[0].src}
                alt={variant.productImages[0].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 53vw"
                className="object-cover"
                style={{ filter: variant.imageFilter }}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 bg-white px-5 py-3 text-xs text-muted">
            Abbildung: Demo · {variant.colorName}
          </div>
        </div>

        <div className="flex min-h-[calc(100svh-72px)] items-center px-5 py-14 sm:px-10 lg:px-[clamp(3.5rem,6vw,7rem)] lg:py-24">
          <div className="w-full max-w-2xl">
            <h2 className="font-serif text-[clamp(3.5rem,6vw,6.8rem)] leading-[0.92] tracking-[-0.05em]">{product.name}</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted">{product.description}</p>

            <dl className="mt-9 border-t border-line text-sm">
              {[
                ["Kollektion", product.collection],
                ["Material", product.material],
                ["Grössen", `${product.sizes[0]} – ${product.sizes.at(-1)}`],
                ["Pflege", product.care],
                ["Lieferbarkeit", variant.availability],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[36%_64%] border-b border-line py-3.5">
                  <dt className="text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-3xl">Farbe wählen</h3>
                  <p aria-live="polite" className="mt-2 text-sm"><span className="text-sky-strong">{variant.colorName}</span> · {variant.sku}</p>
                </div>
                {showPrices ? <p className="text-sm text-muted">Preis auf Anfrage</p> : null}
              </div>

              <div className="hide-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-5 pt-1" role="list" aria-label={`Farbvarianten für ${product.name}`}>
                {product.variants.map((entry) => {
                  const active = entry.id === variant.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => onVariantChange(entry.id)}
                      className="w-[96px] shrink-0 snap-start text-left"
                      aria-pressed={active}
                    >
                      <motion.span
                        animate={{ y: active ? -3 : 0 }}
                        className={`textile-swatch block h-[118px] w-full border-2 ${active ? "border-sky-strong" : "border-transparent"}`}
                        style={{ "--swatch-color": entry.colorCode } as CSSProperties}
                      />
                      <span className={`mt-3 block text-xs ${active ? "font-semibold text-sky-strong" : "text-muted"}`}>{entry.colorName}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" className={isSaved ? "button-secondary" : "button-primary"} onClick={onToggleSelection}>
                  {isSaved ? <Minus aria-hidden size={17} /> : <Bookmark aria-hidden size={17} />}
                  {isSaved ? "Aus Auswahl entfernen" : "Variante merken"}
                </button>
                {materialEnabled ? (
                  <button type="button" className="button-secondary" onClick={() => onOpenMaterial(variant)}>
                    <Eye aria-hidden size={17} /> Material ansehen
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
