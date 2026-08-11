"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mail,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { contacts } from "@/data/catalog";
import {
  fixleintuchColors,
  fixleintuchFamilies,
  fixleintuchGallery,
} from "@/data/fixleintuecher";
import { copyText } from "@/lib/client-storage";

type ColorSelection = {
  colorId: string;
  quantity: number;
  note: string;
};

const STORAGE_KEY = "kremer-fixleintuecher-selection:v1";

function parseSharedSelection(value: string | null): ColorSelection[] {
  if (!value) return [];
  const validIds = new Set(fixleintuchColors.map((color) => color.id));
  return value
    .split(",")
    .filter((id, index, values) => validIds.has(id) && values.indexOf(id) === index)
    .map((colorId) => ({ colorId, quantity: 1, note: "" }));
}

function loadStoredSelection(): ColorSelection[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as ColorSelection[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FixleintuecherShowroom() {
  const [selections, setSelections] = useState<ColorSelection[]>([]);
  const [ready, setReady] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const contact = contacts[0];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const shared = parseSharedSelection(new URLSearchParams(window.location.search).get("farben"));
      setSelections(shared.length > 0 ? shared : loadStoredSelection());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  }, [ready, selections]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => current === null ? null : (current - 1 + fixleintuchGallery.length) % fixleintuchGallery.length);
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => current === null ? null : (current + 1) % fixleintuchGallery.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const selectedIds = useMemo(() => new Set(selections.map((selection) => selection.colorId)), [selections]);

  const toggleColor = (colorId: string) => {
    setSelections((current) => current.some((selection) => selection.colorId === colorId)
      ? current.filter((selection) => selection.colorId !== colorId)
      : [...current, { colorId, quantity: 1, note: "" }]);
  };

  const updateSelection = (colorId: string, patch: Partial<ColorSelection>) => {
    setSelections((current) => current.map((selection) => selection.colorId === colorId ? { ...selection, ...patch } : selection));
  };

  const shareSelection = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("farben", selections.map((selection) => selection.colorId).join(","));
    url.hash = "auswahl";
    await copyText(url.toString());
    setNotice("Auswahllink kopiert.");
  };

  const requestSelection = (kind: "sample" | "quote") => {
    const lines = selections.map((selection) => {
      const color = fixleintuchColors.find((entry) => entry.id === selection.colorId);
      return `• ${color?.code ?? ""} ${color?.name ?? selection.colorId} · Menge ${selection.quantity}${selection.note ? ` · ${selection.note}` : ""}`;
    });
    const subject = kind === "sample"
      ? "Musteranfrage Fixleintücher / Spannbettlaken"
      : "Offertanfrage Fixleintücher / Spannbettlaken";
    const body = `Guten Tag ${contact.name}\n\nIch interessiere mich für folgende Farben:\n\n${lines.join("\n")}\n\nFreundliche Grüsse`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main className="min-h-screen bg-white pb-20 text-graphite print:pb-0">
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-sm print:hidden">
        <div className="site-gutter flex h-[72px] items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <BrandLogo compact priority />
            <span className="hidden border-l border-line pl-5 text-[12px] font-semibold tracking-[0.18em] text-muted md:block">SHOWROOM</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm lg:flex" aria-label="Showroom Navigation">
            <a href="#farben" className="hover:text-sky-strong">32 Farben</a>
            <a href="#galerie" className="hover:text-sky-strong">Galerie</a>
            <a href="#auswahl" className="hover:text-sky-strong">Auswahl{selections.length ? ` (${selections.length})` : ""}</a>
            <a href="#kontakt" className="hover:text-sky-strong">B2B</a>
            <Link href="/studio" className="text-sky-strong">Studio</Link>
          </nav>
          <details className="group relative lg:hidden">
            <summary className="flex h-11 w-11 list-none items-center justify-center border border-line" aria-label="Navigation öffnen">
              <Menu aria-hidden size={20} />
            </summary>
            <nav className="absolute right-0 top-14 grid min-w-52 border border-line bg-white p-2 shadow-[var(--shadow-soft)]" aria-label="Mobile Navigation">
              <a className="px-4 py-3" href="#farben">32 Farben</a>
              <a className="px-4 py-3" href="#galerie">Galerie</a>
              <a className="px-4 py-3" href="#auswahl">Auswahl ({selections.length})</a>
              <a className="px-4 py-3" href="#kontakt">B2B</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="book-reveal grid min-h-[calc(100svh-72px)] lg:grid-cols-[46%_54%]">
        <div className="order-2 flex flex-col justify-center px-5 py-16 sm:px-10 lg:order-1 lg:px-[clamp(4rem,6vw,6.5rem)] lg:py-24">
          <h1 className="max-w-[700px] font-serif text-[clamp(3.5rem,6.5vw,7.5rem)] leading-[0.9] tracking-[-0.055em]">
            Eine Richtung.<br />Geht auch anders.
          </h1>
          <p className="mt-8 max-w-xl text-[clamp(1rem,1.25vw,1.2rem)] leading-8 text-muted">
            Hallo Ursula, hier ein paar Versionen.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#farben" className="button-primary">Farben entdecken <ArrowDown aria-hidden size={17} /></a>
            <a href="#galerie" className="button-secondary">Bildwelt ansehen</a>
          </div>
        </div>
        <div className="relative order-1 min-h-[52svh] overflow-hidden bg-surface lg:order-2 lg:min-h-0">
          <Image
            src="/assets/fixleintuecher/hero-soft-colors.png"
            alt="Gefaltete Fixleintücher in Blau-, Rosa- und Naturtönen"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 54vw"
            className="object-cover object-right"
          />
        </div>
      </section>

      <section className="site-gutter border-y border-line py-8">
        <ul className="grid gap-5 text-sm md:grid-cols-4 md:divide-x md:divide-line">
          {["Hochwertige Baumwolle", "Perfekter Sitz", "60° waschbar", "Langlebig & formstabil"].map((item) => (
            <li key={item} className="flex items-center gap-3 md:px-6 first:md:pl-0">
              <Check aria-hidden size={16} className="shrink-0 text-sky-strong" /> {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="farben" className="site-gutter scroll-mt-24 py-20 md:py-32">
        <div className="grid gap-10 border-b border-line pb-14 lg:grid-cols-[54%_46%] lg:items-end">
          <h2 className="font-serif text-[clamp(3rem,5.8vw,6.5rem)] leading-[0.92] tracking-[-0.05em]">Ihre Farbwelt,<br />präzise abgestimmt.</h2>
          <p className="max-w-xl text-base leading-8 text-muted lg:justify-self-end">
            Wählen Sie einzelne Töne für eine Muster- oder Offertanfrage. Jede Auswahl bleibt im Browser gespeichert und lässt sich als Link teilen.
          </p>
        </div>

        <div className="divide-y divide-line">
          {fixleintuchFamilies.map((family, familyIndex) => {
            const colors = fixleintuchColors.filter((color) => color.family === family.id);
            return (
              <section key={family.id} className="grid gap-8 py-14 lg:grid-cols-[25%_75%] lg:gap-12">
                <div>
                  <p className="text-sm text-sky-strong">{String(familyIndex + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-serif text-3xl md:text-4xl">{family.title}</h3>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-muted">{family.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 xl:grid-cols-8">
                  {colors.map((color) => {
                    const selected = selectedIds.has(color.id);
                    return (
                      <button
                        key={color.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleColor(color.id)}
                        className="group text-left"
                      >
                        <span className={`relative block aspect-[4/5] overflow-hidden border p-2 transition-all ${selected ? "border-sky-strong shadow-[0_8px_24px_rgba(79,167,216,.2)]" : "border-line group-hover:border-[#aeb9bf]"}`}>
                          <span className="textile-swatch block h-full w-full" style={{ "--swatch-color": color.color } as React.CSSProperties} />
                          {selected ? <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-sky-strong text-white"><Check aria-hidden size={15} /></span> : null}
                        </span>
                        <span className="mt-3 block text-xs text-muted">{color.code}</span>
                        <span className="mt-1 block text-sm font-semibold">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section id="galerie" className="scroll-mt-24 bg-surface py-20 md:py-32">
        <div className="site-gutter">
          <div className="grid gap-8 border-b border-line pb-12 lg:grid-cols-[60%_40%] lg:items-end">
            <h2 className="font-serif text-[clamp(3rem,6vw,7rem)] leading-[0.92] tracking-[-0.05em]">Die Kollektion<br />im Überblick.</h2>
            <p className="max-w-lg leading-8 text-muted lg:justify-self-end">31 eigenständige Ansichten der vollständigen Farbkollektion. Klicken Sie auf ein Motiv, um es gross zu betrachten.</p>
          </div>
          <div className="mt-12 columns-1 gap-5 md:columns-2 xl:columns-3">
            {fixleintuchGallery.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className="group mb-5 block w-full break-inside-avoid overflow-hidden bg-white text-left"
                onClick={() => setLightboxIndex(index)}
                aria-label={`${image.alt} vergrössern`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="auswahl" className="site-gutter scroll-mt-24 py-20 md:py-32">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-sky-strong">Ihre Zusammenstellung</p>
            <h2 className="mt-4 font-serif text-[clamp(3rem,5.5vw,6rem)] leading-none">Farbauswahl</h2>
            <p className="mt-5 text-muted">{selections.length === 0 ? "Noch keine Farbe ausgewählt." : `${selections.length} ${selections.length === 1 ? "Farbe" : "Farben"} für Ihre Anfrage.`}</p>
          </div>
          {selections.length > 0 ? <button type="button" className="button-quiet self-start md:self-auto" onClick={() => setSelections([])}><RotateCcw aria-hidden size={16} /> Auswahl zurücksetzen</button> : null}
        </div>

        {selections.length === 0 ? (
          <div className="mt-8 grid min-h-64 place-items-center bg-pale-blue px-6 text-center">
            <div>
              <p className="font-serif text-3xl">Ihre Auswahl beginnt bei der Farbe.</p>
              <a className="text-link mt-5" href="#farben">Zur Farbkollektion <ArrowDown aria-hidden size={15} /></a>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {selections.map((selection) => {
              const color = fixleintuchColors.find((entry) => entry.id === selection.colorId);
              if (!color) return null;
              return (
                <article key={selection.colorId} className="grid gap-5 py-6 lg:grid-cols-[1.1fr_.55fr_1fr_48px] lg:items-center">
                  <div className="flex items-center gap-5">
                    <div className="textile-swatch h-20 w-20 shrink-0" style={{ "--swatch-color": color.color } as React.CSSProperties} />
                    <div><p className="font-serif text-2xl">{color.name}</p><p className="mt-1 text-sm text-muted">Farbcode {color.code}</p></div>
                  </div>
                  <div className="flex h-11 w-36 border border-[#b9c2c7]">
                    <button type="button" className="flex w-11 items-center justify-center" onClick={() => updateSelection(color.id, { quantity: Math.max(1, selection.quantity - 1) })} aria-label="Menge verringern"><Minus aria-hidden size={14} /></button>
                    <output className="flex flex-1 items-center justify-center text-sm">{selection.quantity}</output>
                    <button type="button" className="flex w-11 items-center justify-center" onClick={() => updateSelection(color.id, { quantity: selection.quantity + 1 })} aria-label="Menge erhöhen"><Plus aria-hidden size={14} /></button>
                  </div>
                  <input className="h-11 w-full border border-[#b9c2c7] px-3 text-sm placeholder:text-[#90989d]" value={selection.note} onChange={(event) => updateSelection(color.id, { note: event.target.value })} placeholder="Notiz hinzufügen" aria-label={`Notiz für ${color.name}`} />
                  <button type="button" className="flex h-11 w-11 items-center justify-center text-muted hover:text-graphite" onClick={() => toggleColor(color.id)} aria-label={`${color.name} entfernen`}><X aria-hidden size={18} /></button>
                </article>
              );
            })}
          </div>
        )}

        {selections.length > 0 ? (
          <div className="mt-9 flex flex-wrap gap-3 print:hidden">
            <button type="button" className="button-primary" onClick={() => requestSelection("sample")}><Mail aria-hidden size={17} /> Muster anfragen</button>
            <button type="button" className="button-secondary" onClick={() => requestSelection("quote")}>Offerte anfragen</button>
            <button type="button" className="button-quiet" onClick={shareSelection}><Share2 aria-hidden size={16} /> Auswahl teilen</button>
            <button type="button" className="button-quiet" onClick={() => window.print()}><FileText aria-hidden size={16} /> Als PDF</button>
          </div>
        ) : null}
      </section>

      <section id="kontakt" className="scroll-mt-24 bg-graphite">
        <div className="site-gutter flex min-h-[360px] items-center justify-center py-16 md:min-h-[520px] md:py-24">
          <Image
            src="/assets/brand/b2b-logo.svg"
            alt="B2B"
            width={500}
            height={214}
            unoptimized
            className="h-auto w-full max-w-[760px]"
          />
        </div>
      </section>

      <AnimatePresence>
        {selections.length > 0 ? (
          <motion.div initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 shadow-[0_-12px_35px_rgba(37,41,45,.08)] backdrop-blur-md print:hidden">
            <div className="site-gutter flex min-h-16 items-center justify-between gap-4">
              <p className="text-sm font-semibold">{selections.length} {selections.length === 1 ? "Farbe ausgewählt" : "Farben ausgewählt"}</p>
              <a href="#auswahl" className="button-primary !min-h-10">Auswahl ansehen</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxIndex !== null ? (
          <motion.div className="fixed inset-0 z-[80] bg-graphite/98 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Bildansicht">
            <div className="relative h-full w-full p-4 md:p-10">
              <Image src={fixleintuchGallery[lightboxIndex].src} alt={fixleintuchGallery[lightboxIndex].alt} fill sizes="100vw" className="object-contain p-5 md:p-12" priority />
              <button type="button" onClick={() => setLightboxIndex(null)} className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center border border-white/30 bg-graphite/75" aria-label="Bildansicht schliessen"><X aria-hidden /></button>
              <button type="button" onClick={() => setLightboxIndex((lightboxIndex - 1 + fixleintuchGallery.length) % fixleintuchGallery.length)} className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-graphite/75" aria-label="Vorheriges Bild"><ChevronLeft aria-hidden /></button>
              <button type="button" onClick={() => setLightboxIndex((lightboxIndex + 1) % fixleintuchGallery.length)} className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-graphite/75" aria-label="Nächstes Bild"><ChevronRight aria-hidden /></button>
              <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 bg-graphite/75 px-4 py-2 text-xs">{lightboxIndex + 1} / {fixleintuchGallery.length}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {notice ? <motion.div className="fixed bottom-24 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 border border-line bg-white px-5 py-3 text-sm shadow-[var(--shadow-soft)]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status"><Check aria-hidden size={16} className="text-sky-strong" /> {notice}</motion.div> : null}
      </AnimatePresence>
    </main>
  );
}
