"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { FileText, Mail, Minus, Plus, Share2 } from "lucide-react";
import type { ContactPerson, Product, Selection } from "@/types/catalog";

type SelectionSummaryProps = {
  selections: Selection[];
  products: Product[];
  contact: ContactPerson;
  showPrices: boolean;
  comparisonEnabled: boolean;
  contactEnabled: boolean;
  onUpdate: (index: number, patch: Partial<Selection>) => void;
  onRemove: (index: number) => void;
  onCompare: () => void;
  onShare: () => void;
  onRequest: (kind: "sample" | "quote") => void;
  onPrint: () => void;
};

export function SelectionSummary({
  selections,
  products,
  contact,
  showPrices,
  comparisonEnabled,
  contactEnabled,
  onUpdate,
  onRemove,
  onCompare,
  onShare,
  onRequest,
  onPrint,
}: SelectionSummaryProps) {
  const getProduct = (id: string) => products.find((product) => product.id === id);

  return (
    <section id="auswahl" className="content-auto site-gutter scroll-mt-24 border-t border-line py-16 md:py-20">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mb-4 text-sm text-sky-strong">Ihre Zusammenstellung</p>
          <h2 className="font-serif text-[clamp(3.1rem,5.3vw,5.8rem)] leading-[0.95] tracking-[-0.05em]">Ihre Auswahl</h2>
          <p className="mt-5 text-lg text-muted">
            {selections.length === 0
              ? "Noch keine Variante vorgemerkt."
              : `${selections.length} ${selections.length === 1 ? "Variante" : "Varianten"} für Ihre Anfrage.`}
          </p>
        </div>
        {comparisonEnabled ? (
          <button type="button" className="text-link" onClick={onCompare} disabled={selections.length < 2}>
            Varianten vergleichen
          </button>
        ) : null}
      </div>

      {selections.length === 0 ? (
        <div className="mt-14 border-y border-line py-14">
          <p className="max-w-xl text-muted">Wählen Sie in einem Produktkapitel eine Farbe und fügen Sie sie Ihrer Auswahl hinzu.</p>
          <a className="button-primary mt-7" href="#product-mistral">Zur ersten Produktfamilie</a>
        </div>
      ) : (
        <div className="mt-9">
          <div className={`hidden gap-5 md:grid ${selections.length === 2 ? "grid-cols-2" : selections.length === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
            {selections.slice(0, 4).map((selection) => {
              const product = getProduct(selection.productId);
              const variant = product?.variants.find((entry) => entry.id === selection.variantId);
              if (!product || !variant) return null;
              return (
                <div key={`${selection.productId}-${selection.variantId}`}>
                  <div className="textile-swatch h-28 w-full" style={{ "--swatch-color": variant.colorCode } as CSSProperties} />
                  <p className="mt-3 font-serif text-xl">{product.name} — {variant.colorName}</p>
                  <p className="mt-1 text-xs text-muted">{variant.sku}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 hidden grid-cols-[1.5fr_.75fr_.45fr_1.15fr_40px] gap-6 border-b border-sky pb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted lg:grid">
            <span>Variante</span><span>Grösse</span><span>Menge</span><span>Notiz</span><span className="sr-only">Entfernen</span>
          </div>
          {selections.map((selection, index) => {
            const product = getProduct(selection.productId);
            const variant = product?.variants.find((entry) => entry.id === selection.variantId);
            if (!product || !variant) return null;

            return (
              <article key={`${selection.productId}-${selection.variantId}`} className="grid gap-5 border-b border-line py-5 lg:grid-cols-[1.5fr_.75fr_.45fr_1.15fr_40px] lg:items-center lg:gap-6">
                <div className="grid grid-cols-[92px_1fr] items-center gap-5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                    <Image src={variant.productImages[0].src} alt="" fill sizes="92px" className="object-cover" style={{ filter: variant.imageFilter }} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl">{product.name} — {variant.colorName}</h3>
                    <p className="mt-1 text-sm text-muted">{variant.sku}</p>
                    {showPrices ? <p className="mt-2 text-xs text-muted">Preis auf Anfrage</p> : null}
                  </div>
                </div>

                <label className="grid gap-2 text-xs text-muted lg:block">
                  <span className="lg:sr-only">Grösse für {product.name}</span>
                  <select className="h-11 w-full border border-[#b9c2c7] bg-white px-3 text-sm text-graphite" value={selection.size} onChange={(event) => onUpdate(index, { size: event.target.value })}>
                    {product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>

                <div className="flex h-11 items-center border border-[#b9c2c7]" aria-label={`Menge für ${product.name}`}>
                  <button type="button" className="flex h-full w-10 items-center justify-center" onClick={() => onUpdate(index, { quantity: Math.max(1, selection.quantity - 1) })} aria-label="Menge verringern"><Minus aria-hidden size={14} /></button>
                  <output className="min-w-8 flex-1 text-center text-sm">{selection.quantity}</output>
                  <button type="button" className="flex h-full w-10 items-center justify-center" onClick={() => onUpdate(index, { quantity: selection.quantity + 1 })} aria-label="Menge erhöhen"><Plus aria-hidden size={14} /></button>
                </div>

                <label>
                  <span className="sr-only">Notiz für {product.name}</span>
                  <input className="h-11 w-full border border-[#b9c2c7] px-3 text-sm placeholder:text-[#90989d]" value={selection.note} onChange={(event) => onUpdate(index, { note: event.target.value })} placeholder="Notiz hinzufügen" />
                </label>

                <button type="button" className="flex h-10 w-10 items-center justify-center text-muted hover:text-graphite" onClick={() => onRemove(index)} aria-label={`${product.name} ${variant.colorName} entfernen`}><Minus aria-hidden size={18} /></button>
              </article>
            );
          })}

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="button-primary" onClick={() => onRequest("sample")}><Mail aria-hidden size={17} /> Muster anfragen</button>
            <button type="button" className="button-secondary" onClick={() => onRequest("quote")}>Offerte anfordern</button>
            <button type="button" className="button-quiet" onClick={onShare}><Share2 aria-hidden size={16} /> Auswahl teilen</button>
            <button type="button" className="button-quiet" onClick={onPrint}><FileText aria-hidden size={16} /> Auswahl als PDF</button>
          </div>
        </div>
      )}

      {contactEnabled ? (
        <div id="kontakt" className="mt-20 grid scroll-mt-24 gap-8 bg-pale-blue px-7 py-9 md:grid-cols-[.7fr_1.5fr_1fr] md:items-center md:px-12">
          <div>
            <p className="font-serif text-3xl">{contact.name}</p>
            <p className="mt-1 text-sm text-muted">{contact.role}</p>
          </div>
          <p className="max-w-xl leading-7 text-muted">{contact.message}</p>
          <div className="grid gap-2 text-sm md:justify-self-end">
            <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a>
            <a className="text-link" href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
