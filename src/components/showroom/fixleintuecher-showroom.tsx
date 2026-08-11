"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Presence, useLastPresent } from "@/components/presence";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  CommentDrawer,
  CommentList,
  type CommentTarget,
} from "@/components/comments/comment-thread";
import { useProductComments } from "@/components/comments/use-comments";
import { SiteFooter } from "@/components/site-footer";
import { contacts } from "@/data/catalog";
import {
  FIXLEINTUECHER_SLUG,
  IMAGE_WORLD_SLUG,
  fixleintuchColors,
  fixleintuchFamilies,
  fixleintuchGallery,
  type FixleintuchColor,
} from "@/data/fixleintuecher";
import { copyText } from "@/lib/client-storage";

type ColorSelection = {
  colorId: string;
  quantity: number;
  note: string;
};

const STORAGE_KEY = "kremer-fixleintuecher-selection:v1";
const premiumEase = [0.22, 1, 0.36, 1] as const;

const heroClaims = [
  ["01", "Hochwertige Baumwolle"],
  ["02", "Perfekter Sitz"],
  ["03", "60° waschbar"],
  ["04", "Langlebig & formstabil"],
] as const;

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

function colorCommentTarget(color: FixleintuchColor): CommentTarget {
  return {
    itemId: color.id,
    itemLabel: `${color.code} · ${color.name}`,
    label: color.name,
    sublabel: `Farbcode ${color.code}`,
    accentColor: color.color,
  };
}

const generalCommentTarget: CommentTarget = {
  itemId: null,
  itemLabel: null,
  label: "Fixleintücher Kollektion",
  sublabel: "Allgemeines Feedback",
};

export function FixleintuecherShowroom() {
  const reduceMotion = useReducedMotion();
  const [selections, setSelections] = useState<ColorSelection[]>([]);
  const [ready, setReady] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [commentTarget, setCommentTarget] = useState<CommentTarget | null>(null);
  const feedback = useProductComments(FIXLEINTUECHER_SLUG);
  const contact = contacts[0];
  const shownLightboxIndex = useLastPresent(lightboxIndex);
  const shownNotice = useLastPresent(notice || null);

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

  const submitComment = async (author: string, body: string) => {
    if (!commentTarget) return;
    await feedback.submit({
      itemId: commentTarget.itemId,
      itemLabel: commentTarget.itemLabel ?? null,
      author,
      body,
    });
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
            <a href="#feedback" className="hover:text-sky-strong">Feedback{feedback.comments.length ? ` (${feedback.comments.length})` : ""}</a>
            <a href="#auswahl" className="hover:text-sky-strong">Auswahl{selections.length ? ` (${selections.length})` : ""}</a>
            <a href="#kontakt" className="hover:text-sky-strong">Kontakt</a>
            <Link href="/studio" className="text-sky-strong">Studio</Link>
          </nav>
          <details className="group relative lg:hidden">
            <summary className="flex h-11 w-11 list-none items-center justify-center border border-line" aria-label="Navigation öffnen">
              <Menu aria-hidden size={20} />
            </summary>
            <nav className="absolute right-0 top-14 grid min-w-52 border border-line bg-white p-2 shadow-[var(--shadow-soft)]" aria-label="Mobile Navigation">
              <a className="px-4 py-3" href="#farben">32 Farben</a>
              <a className="px-4 py-3" href="#galerie">Galerie</a>
              <a className="px-4 py-3" href="#feedback">Feedback ({feedback.comments.length})</a>
              <a className="px-4 py-3" href="#auswahl">Auswahl ({selections.length})</a>
              <a className="px-4 py-3" href="#kontakt">Kontakt</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="grid min-h-[calc(100svh-72px-2.5rem)] lg:grid-cols-[46%_54%]">
        <div className="order-2 flex flex-col justify-center px-5 py-16 sm:px-10 lg:order-1 lg:px-[clamp(4rem,6vw,6.5rem)] lg:py-24">
          <motion.p
            className="kicker"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: premiumEase }}
          >
            Fixleintücher & Spannbettlaken
          </motion.p>
          <motion.h1
            className="mt-7 max-w-[700px] font-serif text-[clamp(3.4rem,6.2vw,7rem)] leading-[0.92] tracking-[-0.05em]"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.08, ease: premiumEase }}
          >
            Zweiunddreissig Farben.
            <br />
            <span className="serif-accent">Ein</span> perfekter Sitz.
          </motion.h1>
          <motion.p
            className="mt-8 max-w-xl text-[clamp(1rem,1.25vw,1.2rem)] leading-8 text-muted"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.18, ease: premiumEase }}
          >
            Die vollständige Farbkollektion, hier mit einer ersten Auswahl an
            Beispielen inszeniert – auf Wunsch zeigen wir gerne mehr.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.28, ease: premiumEase }}
          >
            <a href="#farben" className="button-primary">Farben entdecken <ArrowDown aria-hidden size={17} /></a>
            <Link href={`/showroom/${IMAGE_WORLD_SLUG}`} className="button-secondary">
              Beispiele ansehen <ArrowRight aria-hidden size={16} />
            </Link>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => setCommentTarget(generalCommentTarget)}
            className="text-link mt-7 self-start"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.42, ease: premiumEase }}
          >
            <MessageCircle aria-hidden size={15} /> Feedback zur Kollektion geben
          </motion.button>
        </div>

        <div className="relative order-1 min-h-[52svh] overflow-hidden bg-surface lg:order-2 lg:min-h-0">
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.035, opacity: 0.65 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: premiumEase }}
          >
            <Image
              src="/assets/fixleintuecher/hero-soft-colors.png"
              alt="Gefaltete Fixleintücher in Blau-, Rosa- und Naturtönen"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover object-right"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-6 left-6 hidden items-center gap-4 bg-white/95 py-3 pl-3 pr-5 backdrop-blur-sm md:flex"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: premiumEase }}
          >
            <span className="flex h-9 overflow-hidden">
              {fixleintuchColors.slice(0, 8).map((color) => (
                <span key={color.id} className="w-2.5" style={{ backgroundColor: color.color }} />
              ))}
            </span>
            <span className="text-xs leading-4 text-muted">
              <strong className="block font-serif text-base font-normal text-graphite">32 Töne · 4 Familien</strong>
              aus einer laufenden Kollektion
            </span>
          </motion.div>
        </div>
      </section>

      <a
        href="#farben"
        aria-label="Direkt zur Farbübersicht"
        className="color-strip block h-10 w-full print:hidden"
        title="Direkt zur Farbübersicht"
      >
        {fixleintuchColors.map((color) => (
          <span key={color.id} style={{ backgroundColor: color.color }} />
        ))}
      </a>

      <section className="site-gutter border-y border-line py-9">
        <ul className="grid gap-6 text-sm md:grid-cols-4 md:divide-x md:divide-line">
          {heroClaims.map(([number, claim]) => (
            <li key={claim} className="flex items-baseline gap-4 md:px-7 first:md:pl-0">
              <span className="text-xs text-sky-strong">{number}</span>
              <span className="font-medium tracking-[0.01em]">{claim}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="farben" className="site-gutter scroll-mt-24 py-20 md:py-32">
        <div className="grid gap-10 border-b border-line pb-14 lg:grid-cols-[54%_46%] lg:items-end">
          <div>
            <p className="kicker">Die Kollektion</p>
            <h2 className="mt-6 font-serif text-[clamp(3rem,5.8vw,6.5rem)] leading-[0.92] tracking-[-0.05em]">Ihre Farbwelt,<br />präzise abgestimmt.</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-muted lg:justify-self-end">
            Wählen Sie einzelne Töne für eine Muster- oder Offertanfrage – oder
            hinterlassen Sie einen Kommentar direkt an der Farbe. Jede Auswahl
            bleibt gespeichert und lässt sich als Link teilen.
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4 xl:grid-cols-8">
                  {colors.map((color) => {
                    const selected = selectedIds.has(color.id);
                    const commentCount = feedback.countByItem.get(color.id) ?? 0;
                    return (
                      <div key={color.id} className="group">
                        <button
                          type="button"
                          aria-pressed={selected}
                          aria-label={`${color.name} ${selected ? "aus der Auswahl entfernen" : "zur Auswahl hinzufügen"}`}
                          onClick={() => toggleColor(color.id)}
                          className="block w-full text-left"
                        >
                          <span className={`relative block aspect-[4/5] overflow-hidden border p-2 transition-all ${selected ? "border-sky-strong shadow-[0_8px_24px_rgba(79,167,216,.2)]" : "border-line group-hover:border-[#aeb9bf]"}`}>
                            <span className="textile-swatch block h-full w-full" style={{ "--swatch-color": color.color } as React.CSSProperties} />
                            {selected ? <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-sky-strong text-white"><Check aria-hidden size={15} /></span> : null}
                          </span>
                          <span className="mt-3 block text-xs text-muted">{color.code}</span>
                          <span className="mt-1 block text-sm font-semibold">{color.name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCommentTarget(colorCommentTarget(color))}
                          className="comment-chip mt-2.5"
                          data-active={commentCount > 0}
                          aria-label={`Kommentare zu ${color.name}${commentCount ? ` (${commentCount})` : ""}`}
                        >
                          <MessageCircle aria-hidden size={13} />
                          {commentCount > 0 ? commentCount : "Kommentar"}
                        </button>
                      </div>
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
            <div>
              <p className="kicker">Beispiele aus der Bildwelt</p>
              <h2 className="mt-6 font-serif text-[clamp(3rem,6vw,7rem)] leading-[0.92] tracking-[-0.05em]">Die Kollektion<br />im Überblick.</h2>
            </div>
            <div className="max-w-lg lg:justify-self-end">
              <p className="leading-8 text-muted">
                {fixleintuchGallery.length} Ansichten der vollständigen Farbkollektion –
                als erste Beispiele gedacht. Klicken Sie auf ein Motiv für die Grossansicht.
              </p>
              <Link href={`/showroom/${IMAGE_WORLD_SLUG}`} className="text-link mt-5">
                Weitere Beispiele ansehen <ArrowRight aria-hidden size={15} />
              </Link>
            </div>
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

      <section id="feedback" className="site-gutter scroll-mt-24 border-b border-line py-20 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[42%_52%] lg:justify-between">
          <div>
            <p className="kicker">Direkt am Produkt</p>
            <h2 className="mt-6 font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[0.94] tracking-[-0.045em]">
              Ihre Anmerkungen,
              <br />
              festgehalten.
            </h2>
            <p className="mt-7 max-w-md text-base leading-8 text-muted">
              Kommentare werden zentral gespeichert und erscheinen direkt bei der
              jeweiligen Farbe – so bleibt jede Rückmeldung dort, wo sie hingehört.
            </p>
            <button
              type="button"
              className="button-primary mt-9"
              onClick={() => setCommentTarget(generalCommentTarget)}
            >
              <MessageCircle aria-hidden size={17} /> Kommentar schreiben
            </button>
          </div>
          <div className="min-w-0">
            <p className="border-b border-line pb-4 text-xs font-semibold tracking-[0.18em] text-muted">
              {feedback.comments.length === 0
                ? "NOCH KEINE KOMMENTARE"
                : `${feedback.comments.length} ${feedback.comments.length === 1 ? "KOMMENTAR" : "KOMMENTARE"}`}
            </p>
            <div className="max-h-[460px] overflow-y-auto pr-2">
              <CommentList
                comments={feedback.comments}
                status={feedback.status}
                showItemLabel
                emptyText="Noch keine Kommentare. Schreiben Sie die erste Anmerkung – allgemein oder direkt an einer Farbe."
              />
            </div>
          </div>
        </div>
      </section>

      <section id="auswahl" className="site-gutter scroll-mt-24 py-20 md:py-32">
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-10 md:flex-row md:items-end">
          <div>
            <p className="kicker">Ihre Zusammenstellung</p>
            <h2 className="mt-6 font-serif text-[clamp(3rem,5.5vw,6rem)] leading-none">Farbauswahl</h2>
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

      <SiteFooter />

      <CommentDrawer
        target={commentTarget}
        comments={commentTarget ? feedback.commentsFor(commentTarget.itemId) : []}
        status={feedback.status}
        onClose={() => setCommentTarget(null)}
        onSubmit={submitComment}
      />

      <Presence open={selections.length > 0}>
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: selections.length > 0 ? 0 : 90 }}
          style={{ pointerEvents: selections.length > 0 ? undefined : "none" }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/97 shadow-[0_-12px_35px_rgba(37,41,45,.08)] backdrop-blur-md print:hidden"
        >
          <div className="site-gutter flex min-h-16 items-center justify-between gap-4">
            <p className="text-sm font-semibold">{selections.length} {selections.length === 1 ? "Farbe ausgewählt" : "Farben ausgewählt"}</p>
            <a href="#auswahl" className="button-primary !min-h-10">Auswahl ansehen</a>
          </div>
        </motion.div>
      </Presence>

      <Presence open={lightboxIndex !== null}>
        {shownLightboxIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-[80] bg-graphite/98 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: lightboxIndex !== null ? 1 : 0 }}
            style={{ pointerEvents: lightboxIndex !== null ? undefined : "none" }}
            role="dialog"
            aria-modal="true"
            aria-label="Bildansicht"
          >
            <div className="relative h-full w-full p-4 md:p-10">
              <Image src={fixleintuchGallery[shownLightboxIndex].src} alt={fixleintuchGallery[shownLightboxIndex].alt} fill sizes="100vw" className="object-contain p-5 md:p-12" priority />
              <button type="button" onClick={() => setLightboxIndex(null)} className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center border border-white/30 bg-graphite/75" aria-label="Bildansicht schliessen"><X aria-hidden /></button>
              <button type="button" onClick={() => setLightboxIndex((shownLightboxIndex - 1 + fixleintuchGallery.length) % fixleintuchGallery.length)} className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-graphite/75" aria-label="Vorheriges Bild"><ChevronLeft aria-hidden /></button>
              <button type="button" onClick={() => setLightboxIndex((shownLightboxIndex + 1) % fixleintuchGallery.length)} className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/30 bg-graphite/75" aria-label="Nächstes Bild"><ChevronRight aria-hidden /></button>
              <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 bg-graphite/75 px-4 py-2 text-xs">{shownLightboxIndex + 1} / {fixleintuchGallery.length}</p>
            </div>
          </motion.div>
        ) : null}
      </Presence>

      <Presence open={!!notice}>
        {shownNotice ? (
          <motion.div
            className="fixed bottom-24 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 border border-line bg-white px-5 py-3 text-sm shadow-[var(--shadow-soft)]"
            initial={{ opacity: 0, y: 12 }}
            animate={notice ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            style={{ pointerEvents: notice ? undefined : "none" }}
            role="status"
          >
            <Check aria-hidden size={16} className="text-sky-strong" /> {shownNotice}
          </motion.div>
        ) : null}
      </Presence>
    </main>
  );
}
