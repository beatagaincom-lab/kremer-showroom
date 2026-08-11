"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Eye,
  GripVertical,
  Link2,
  Monitor,
  Plus,
  RotateCcw,
  Send,
  Smartphone,
  Trash2,
  Upload,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { defaultStudioConfiguration } from "@/data/catalog";
import { copyText, loadStudioConfiguration, saveStudioConfiguration } from "@/lib/client-storage";
import type { ContactPerson, Product, StudioConfiguration } from "@/types/catalog";

type StudioEditorProps = {
  products: Product[];
  contacts: ContactPerson[];
};

const steps = [
  [1, "Kunde"],
  [2, "Inhalt"],
  [3, "Produkte"],
  [4, "Varianten"],
  [5, "Teilen"],
] as const;

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 py-2.5 text-sm">
      <span>{label}</span>
      <input className="peer sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="relative h-6 w-11 shrink-0 border border-[#aeb9bf] bg-white transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-4 after:w-4 after:bg-[#7b858c] after:transition-transform peer-checked:border-sky peer-checked:bg-sky peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-sky-strong" aria-hidden />
    </label>
  );
}

export function StudioEditor({ products, contacts }: StudioEditorProps) {
  const [config, setConfig] = useState<StudioConfiguration>(defaultStudioConfiguration);
  const [activeStep, setActiveStep] = useState(2);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const [status, setStatus] = useState("Entwurf gespeichert");
  const [hydrated, setHydrated] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [productToAdd, setProductToAdd] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = loadStudioConfiguration();
      if (stored) setConfig(stored);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(() => {
      saveStudioConfiguration(config);
      setStatus("Entwurf gespeichert");
    }, 260);
    return () => window.clearTimeout(timeout);
  }, [config, hydrated]);

  const selectedProducts = useMemo(() => {
    const byId = new Map(products.map((product) => [product.id, product]));
    return config.selectedProductIds.flatMap((id) => {
      const product = byId.get(id);
      return product ? [product] : [];
    });
  }, [config.selectedProductIds, products]);

  const availableProducts = products.filter((product) => !config.selectedProductIds.includes(product.id));
  const showroomPath = `/showroom/${config.slug || "neue-praesentation"}`;

  const update = <Key extends keyof StudioConfiguration>(key: Key, value: StudioConfiguration[Key]) => {
    setStatus("Speichern …");
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const copyShowroomLink = async () => {
    saveStudioConfiguration(config);
    await copyText(`${window.location.origin}${showroomPath}`);
    setStatus("Link kopiert");
  };

  const moveProduct = (productId: string, direction: -1 | 1) => {
    setConfig((current) => {
      const ids = [...current.selectedProductIds];
      const index = ids.indexOf(productId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= ids.length) return current;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return { ...current, selectedProductIds: ids };
    });
  };

  const dropProduct = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setConfig((current) => {
      const ids = current.selectedProductIds.filter((id) => id !== draggedId);
      const targetIndex = ids.indexOf(targetId);
      ids.splice(targetIndex, 0, draggedId);
      return { ...current, selectedProductIds: ids };
    });
    setDraggedId(null);
  };

  const toggleHighlight = (variantId: string) => {
    setConfig((current) => ({
      ...current,
      highlightedVariantIds: current.highlightedVariantIds.includes(variantId)
        ? current.highlightedVariantIds.filter((id) => id !== variantId)
        : [...current.highlightedVariantIds, variantId],
    }));
  };

  const handleLogo = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => update("customerLogo", String(reader.result)));
    reader.readAsDataURL(file);
  };

  const resetPresentation = () => {
    setConfig({ ...defaultStudioConfiguration, customerName: "Neuer Kunde", slug: "neue-praesentation", hiddenProductIds: [] });
    setActiveStep(1);
    setStatus("Neue Präsentation erstellt");
  };

  const leadProduct = selectedProducts.find((product) => !config.hiddenProductIds.includes(product.id)) ?? selectedProducts[0];

  return (
    <main className="min-h-screen bg-white text-graphite">
      <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between border-b border-line bg-white px-4 md:px-7">
        <div className="flex items-center gap-5">
          <BrandLogo compact priority />
          <span className="hidden border-l border-line pl-5 text-xs font-semibold tracking-[.12em] md:block">SHOWROOM STUDIO</span>
        </div>
        <div className="flex items-center gap-1 md:gap-3">
          <button type="button" className="button-quiet hidden lg:inline-flex" onClick={resetPresentation}><RotateCcw aria-hidden size={15} /> Neue Präsentation</button>
          <Link className="button-quiet" href={`/studio/preview/${config.slug || "demo"}`} target="_blank"><Eye aria-hidden size={17} /> <span className="hidden sm:inline">Vorschau</span></Link>
          <button type="button" className="button-quiet" onClick={copyShowroomLink}><Link2 aria-hidden size={17} /> <span className="hidden sm:inline">Link kopieren</span></button>
          <button type="button" className="button-primary !min-h-11" onClick={() => { saveStudioConfiguration(config); setStatus("Präsentation veröffentlicht"); }}><Send aria-hidden size={16} /> <span className="hidden md:inline">Veröffentlichen</span></button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[176px_minmax(0,1fr)_330px]">
        <nav aria-label="Studio Schritte" className="hidden border-r border-line lg:block">
          <ol className="sticky top-[72px] py-4">
            {steps.map(([number, label]) => (
              <li key={number}>
                <button type="button" onClick={() => setActiveStep(number)} className={`w-full border-l-2 px-7 py-5 text-left transition-colors ${activeStep === number ? "border-sky bg-pale-blue" : "border-transparent hover:bg-surface"}`}>
                  <span className="block text-sm text-sky-strong">{String(number).padStart(2, "0")}</span>
                  <span className="mt-1 block text-sm font-medium">{label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <section className="min-w-0 px-5 py-8 sm:px-8 md:py-12 xl:px-14">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col justify-between gap-3 border-b border-line pb-7 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-sky-strong">Schritt {String(activeStep).padStart(2, "0")}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">Präsentation bearbeiten</h1>
              </div>
              <p className="flex items-center gap-2 text-sm text-sky-strong" aria-live="polite"><Check aria-hidden size={16} /> {status}</p>
            </div>

            <div className="mt-9">
              {activeStep === 1 ? (
                <div className="grid gap-8">
                  <label className="grid gap-2 text-sm"><span>Kundenname</span><input className="h-12 border border-[#b9c2c7] px-4" value={config.customerName} onChange={(event) => update("customerName", event.target.value)} /></label>
                  <div className="grid gap-3">
                    <span className="text-sm">Kundenlogo <span className="text-muted">(optional)</span></span>
                    <div className="flex min-h-28 items-center gap-5 border border-dashed border-[#aeb9bf] p-5">
                      {config.customerLogo ? <Image src={config.customerLogo} alt="Kundenlogo Vorschau" width={128} height={72} unoptimized className="max-h-[72px] w-auto object-contain" /> : <Upload aria-hidden className="text-muted" />}
                      <label className="button-secondary cursor-pointer"><Upload aria-hidden size={16} /> Logo auswählen<input type="file" accept="image/*" className="sr-only" onChange={(event) => handleLogo(event.target.files?.[0])} /></label>
                      {config.customerLogo ? <button type="button" className="button-quiet" onClick={() => update("customerLogo", undefined)}>Entfernen</button> : null}
                    </div>
                  </div>
                  <button type="button" className="button-primary justify-self-start" onClick={() => setActiveStep(2)}>Weiter zu Inhalt</button>
                </div>
              ) : null}

              {activeStep === 2 ? (
                <div className="grid gap-7">
                  <label className="grid gap-2 text-sm"><span>Präsentationstitel</span><input className="h-12 border border-sky px-4 font-serif text-lg" value={config.title} onChange={(event) => update("title", event.target.value)} /></label>
                  <label className="grid gap-2 text-sm"><span>Persönliche Einleitung</span><textarea className="min-h-28 resize-y border border-[#b9c2c7] p-4" value={config.introduction} onChange={(event) => update("introduction", event.target.value)} /></label>
                  <label className="grid gap-2 text-sm"><span>Ansprechpartner</span><select className="h-12 border border-[#b9c2c7] bg-white px-4" value={config.contactPersonId} onChange={(event) => update("contactPersonId", event.target.value)}>{contacts.map((contact) => <option key={contact.id} value={contact.id}>{contact.name} — {contact.role}</option>)}</select></label>
                  <button type="button" className="button-primary justify-self-start" onClick={() => setActiveStep(3)}>Weiter zu Produkten</button>
                </div>
              ) : null}

              {activeStep === 3 ? (
                <div>
                  <div className="flex flex-col gap-3 border-b border-line pb-7 sm:flex-row">
                    <select className="h-12 flex-1 border border-[#b9c2c7] bg-white px-4" value={productToAdd} onChange={(event) => setProductToAdd(event.target.value)} aria-label="Produkt auswählen"><option value="">Produkt auswählen</option>{availableProducts.map((product) => <option key={product.id} value={product.id}>{product.name} — {product.collection}</option>)}</select>
                    <button type="button" className="button-primary" disabled={!productToAdd} onClick={() => { update("selectedProductIds", [...config.selectedProductIds, productToAdd]); setProductToAdd(""); }}><Plus aria-hidden size={16} /> Produkt hinzufügen</button>
                  </div>
                  <div className="mt-6">
                    <p className="mb-3 text-sm text-muted">Ziehen Sie Produkte oder verwenden Sie die Pfeile für die Reihenfolge.</p>
                    {selectedProducts.map((product, index) => {
                      const hidden = config.hiddenProductIds.includes(product.id);
                      return (
                        <article key={product.id} draggable onDragStart={() => setDraggedId(product.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropProduct(product.id)} className={`grid grid-cols-[34px_62px_1fr_auto] items-center gap-3 border-b border-line py-4 ${draggedId === product.id ? "bg-pale-blue" : ""}`}>
                          <GripVertical aria-hidden size={18} className="text-muted" />
                          <div className="relative aspect-square overflow-hidden bg-surface"><Image src={product.media[0].src} alt="" fill sizes="62px" className="object-cover" /></div>
                          <div><p className="font-serif text-xl">{product.name}</p><p className="mt-1 text-xs text-muted">{product.collection} · {hidden ? "Ausgeblendet" : "Sichtbar"}</p></div>
                          <div className="flex items-center gap-1">
                            <button type="button" className="flex h-9 w-9 items-center justify-center" onClick={() => moveProduct(product.id, -1)} disabled={index === 0} aria-label={`${product.name} nach oben`}><ArrowUp aria-hidden size={16} /></button>
                            <button type="button" className="flex h-9 w-9 items-center justify-center" onClick={() => moveProduct(product.id, 1)} disabled={index === selectedProducts.length - 1} aria-label={`${product.name} nach unten`}><ArrowDown aria-hidden size={16} /></button>
                            <button type="button" className="flex h-9 w-9 items-center justify-center text-sky-strong" onClick={() => update("hiddenProductIds", hidden ? config.hiddenProductIds.filter((id) => id !== product.id) : [...config.hiddenProductIds, product.id])} aria-label={`${product.name} ${hidden ? "einblenden" : "ausblenden"}`}><Eye aria-hidden size={16} className={hidden ? "opacity-35" : ""} /></button>
                            <button type="button" className="flex h-9 w-9 items-center justify-center text-muted hover:text-red-700" onClick={() => update("selectedProductIds", config.selectedProductIds.filter((id) => id !== product.id))} aria-label={`${product.name} entfernen`}><Trash2 aria-hidden size={16} /></button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {activeStep === 4 ? (
                <div className="grid gap-10">
                  {selectedProducts.map((product) => (
                    <fieldset key={product.id} className="border-b border-line pb-8">
                      <legend className="font-serif text-2xl">{product.name}</legend>
                      <p className="mt-2 text-sm text-muted">Hervorgehobene Varianten</p>
                      <div className="hide-scrollbar mt-5 flex gap-3 overflow-x-auto pb-4">
                        {product.variants.map((variant) => {
                          const active = config.highlightedVariantIds.includes(variant.id);
                          return <button type="button" key={variant.id} onClick={() => toggleHighlight(variant.id)} className={`w-24 shrink-0 text-left ${active ? "text-sky-strong" : "text-muted"}`} aria-pressed={active}><span className={`textile-swatch block h-24 w-full border-2 ${active ? "border-sky-strong" : "border-transparent"}`} style={{ "--swatch-color": variant.colorCode } as CSSProperties} /><span className="mt-3 block text-xs">{variant.colorName}</span></button>;
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              ) : null}

              {activeStep === 5 ? (
                <div className="grid gap-8">
                  <label className="grid gap-2 text-sm"><span>Persönlicher Link</span><div className="flex"><span className="flex h-12 items-center border border-r-0 border-[#b9c2c7] bg-surface px-4 text-muted">/showroom/</span><input className="h-12 min-w-0 flex-1 border border-[#b9c2c7] px-4" value={config.slug} onChange={(event) => update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} /></div></label>
                  <div className="flex flex-wrap gap-3"><button type="button" className="button-primary" onClick={copyShowroomLink}><Copy aria-hidden size={16} /> Link kopieren</button><Link className="button-secondary" target="_blank" href={`/studio/preview/${config.slug || "demo"}`}><Eye aria-hidden size={16} /> Vorschau öffnen</Link></div>
                  <div className="border-y border-line py-6 text-sm text-muted">Die Konfiguration ist lokal gespeichert und kann später über dieselben Datenmodelle an Supabase, PIM oder ERP angebunden werden.</div>
                </div>
              ) : null}
            </div>

            <div className="mt-10 flex gap-2 overflow-x-auto border-t border-line pt-5 lg:hidden">
              {steps.map(([number, label]) => <button key={number} type="button" onClick={() => setActiveStep(number)} className={`shrink-0 px-3 py-2 text-sm ${activeStep === number ? "bg-pale-blue text-sky-strong" : ""}`}>{String(number).padStart(2, "0")} {label}</button>)}
            </div>
          </div>
        </section>

        <aside className="border-l border-line bg-white px-5 py-8 lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] lg:overflow-y-auto">
          <h2 className="text-sm font-semibold">Darstellung</h2>
          <div className="mt-4 border-b border-line pb-5">
            <Toggle checked={config.showPrices} onChange={(checked) => update("showPrices", checked)} label="Preise anzeigen" />
            <Toggle checked={config.sections.comparison} onChange={(checked) => update("sections", { ...config.sections, comparison: checked })} label="Vergleich aktivieren" />
            <Toggle checked={config.sections.materialDetails} onChange={(checked) => update("sections", { ...config.sections, materialDetails: checked })} label="Materialdetails" />
            <Toggle checked={config.sections.contact} onChange={(checked) => update("sections", { ...config.sections, contact: checked })} label="Kontaktabschluss" />
          </div>

          <div className="mt-6 flex border-b border-line">
            <button type="button" onClick={() => setPreviewDevice("desktop")} className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm ${previewDevice === "desktop" ? "border-sky text-sky-strong" : "border-transparent text-muted"}`}><Monitor aria-hidden size={17} /> Desktop</button>
            <button type="button" onClick={() => setPreviewDevice("mobile")} className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm ${previewDevice === "mobile" ? "border-sky text-sky-strong" : "border-transparent text-muted"}`}><Smartphone aria-hidden size={17} /> Mobile</button>
          </div>

          <div className={`mx-auto mt-6 overflow-hidden border border-[#aeb9bf] bg-white shadow-[var(--shadow-soft)] transition-all ${previewDevice === "mobile" ? "w-[220px]" : "w-full"}`}>
            <div className="flex h-10 items-center justify-between border-b border-line px-3 text-[9px] font-semibold tracking-[.12em]"><span>KREMER SHOWROOM</span><span>☰</span></div>
            <div className="p-4"><p className="font-serif text-[clamp(1.25rem,2vw,1.8rem)] leading-tight">{config.title}</p><p className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted">{config.introduction}</p></div>
            {leadProduct ? <div className="relative aspect-[4/3] bg-surface"><Image src={leadProduct.media[0].src} alt="" fill sizes="300px" className="object-cover" /></div> : null}
            <div className="p-4"><p className="text-[9px] text-sky-strong">Für {config.customerName}</p><p className="mt-1 text-xs">{selectedProducts.filter((product) => !config.hiddenProductIds.includes(product.id)).length} Produktfamilien</p></div>
          </div>
        </aside>
      </div>
    </main>
  );
}
