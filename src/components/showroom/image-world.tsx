"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Presence, useLastPresent } from "@/components/presence";
import { ArrowRight, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { contacts } from "@/data/catalog";
import {
  FIXLEINTUECHER_SLUG,
  bildweltGallery,
  fixleintuchGallery,
  type FixleintuchGalleryImage,
} from "@/data/fixleintuecher";

const premiumEase = [0.22, 1, 0.36, 1] as const;

const heroImage: FixleintuchGalleryImage = {
  src: "/assets/fixleintuecher/hero-soft-colors.png",
  alt: "Gefaltete Fixleintücher in Blau-, Rosa- und Naturtönen",
  width: 1536,
  height: 1024,
};

const galleryImages = [...bildweltGallery, ...fixleintuchGallery];
const imageWorld = [heroImage, ...galleryImages];

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path d="M5 5 19 19M19 5 5 19" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "previous" | "next" }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className="h-6 w-6" fill="none">
      <path
        d={direction === "previous" ? "M17.5 5.5 9 14l8.5 8.5" : "M10.5 5.5 19 14l-8.5 8.5"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ImageWorld() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const shownIndex = useLastPresent(activeIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const contact = contacts[0];

  const requestMoreHref = `mailto:${contact.email}?subject=${encodeURIComponent("Weitere Beispiele Bildwelt Fixleintücher")}&body=${encodeURIComponent(`Guten Tag ${contact.name}\n\nGerne würden wir weitere Beispiele der Bildwelt sehen.\n\nFreundliche Grüsse`)}`;

  const closeLightbox = () => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  };

  const openLightbox = (index: number) => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveIndex(index);
  };

  const showPrevious = () => {
    setActiveIndex((current) => current === null ? null : (current - 1 + imageWorld.length) % imageWorld.length);
  };

  const showNext = () => {
    setActiveIndex((current) => current === null ? null : (current + 1) % imageWorld.length);
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <header className="site-gutter flex h-[72px] items-center justify-between border-b border-line">
        <div className="flex items-center gap-5">
          <BrandLogo compact priority />
          <span className="hidden border-l border-line pl-5 text-[12px] font-semibold tracking-[0.18em] text-muted md:block">BILDWELT</span>
        </div>
        <Link href={`/showroom/${FIXLEINTUECHER_SLUG}`} className="text-link">
          Zur Farbkollektion <ArrowRight aria-hidden size={15} />
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-[1540px] items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:min-h-[76svh] lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-14 lg:py-28 xl:gap-28 xl:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: premiumEase }}
          className="max-w-[610px]"
        >
          <p className="kicker">Bildwelt Fixleintücher</p>
          <h1 className="mt-7 font-serif text-[clamp(3.25rem,5.8vw,5.8rem)] leading-[0.98] tracking-[-0.055em] text-graphite">
            Ein paar Beispiele.
            <br />
            <span className="serif-accent">Auf Wunsch mehr.</span>
          </h1>
          <p className="mt-8 max-w-[540px] text-[1.02rem] leading-[1.75] tracking-[-0.015em] text-[#74797d] sm:mt-10 sm:text-[1.12rem]">
            Eine erste Richtung für die Bildsprache der Kollektion – als
            Ausgangspunkt gedacht. Aufbau, Stimmung und Umfang entwickeln wir
            gerne nach Ihren Vorstellungen weiter.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={requestMoreHref} className="button-primary">
              <Mail aria-hidden size={16} /> Weitere Beispiele anfragen
            </a>
            <Link href={`/showroom/${FIXLEINTUECHER_SLUG}`} className="button-secondary">
              Zur Farbkollektion
            </Link>
          </div>
        </motion.div>

        <motion.button
          type="button"
          aria-label="Leitbild in der Vollansicht öffnen"
          onClick={() => openLightbox(0)}
          initial={reduceMotion ? false : { opacity: 0.92, scale: 1.008 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={reduceMotion ? undefined : { y: -4, scale: 1.004 }}
          whileTap={reduceMotion ? undefined : { scale: 0.998 }}
          transition={{ duration: 1.35, ease: premiumEase }}
          className="group relative aspect-[3/2] w-full cursor-zoom-in overflow-hidden bg-white shadow-[0_24px_70px_rgba(37,41,45,0.09)] ring-1 ring-black/[0.045] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4fa7d8]"
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.012]"
          />
        </motion.button>
      </section>

      <section className="bg-[#f7f7f5] px-3 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1540px] grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {galleryImages.map((image, index) => (
            <motion.button
              type="button"
              key={image.src}
              aria-label={`Bild ${index + 1} von ${galleryImages.length} in der Vollansicht öffnen`}
              onClick={() => openLightbox(index + 1)}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              whileTap={reduceMotion ? undefined : { scale: 0.995 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.8, delay: (index % 4) * 0.045, ease: premiumEase }}
              className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-white p-2 shadow-[0_8px_30px_rgba(37,41,45,0.045)] ring-1 ring-black/[0.04] transition-shadow duration-500 hover:shadow-[0_22px_55px_rgba(37,41,45,0.11)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4fa7d8] sm:p-3 lg:p-4"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
                className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.015] sm:p-3"
              />
            </motion.button>
          ))}
        </div>
        <div className="mx-auto mt-14 flex w-full max-w-[1540px] flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
          <p className="max-w-md text-sm leading-7 text-muted">
            Diese Auswahl ist bewusst kompakt gehalten. Weitere Motive, Formate
            und Stimmungen zeigen wir gerne auf Anfrage.
          </p>
          <a href={requestMoreHref} className="button-secondary shrink-0">
            <Mail aria-hidden size={16} /> Mehr Beispiele anfragen
          </a>
        </div>
      </section>

      <SiteFooter />

      <Presence open={activeIndex !== null}>
        {shownIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Vollansicht Bild ${shownIndex + 1} von ${imageWorld.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex !== null ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: premiumEase }}
            style={{ pointerEvents: activeIndex !== null ? undefined : "none" }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeLightbox();
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#181b1e]/[0.96] px-4 py-16 backdrop-blur-sm sm:px-16 sm:py-12"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Vollansicht schliessen"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white transition-colors duration-300 hover:bg-white hover:text-graphite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-7 sm:top-7"
            >
              <CloseIcon />
            </button>

            <button
              type="button"
              aria-label="Vorheriges Bild"
              onClick={showPrevious}
              className="absolute bottom-4 left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white transition-colors duration-300 hover:bg-white hover:text-graphite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:bottom-auto sm:left-7 sm:top-1/2 sm:-translate-y-1/2"
            >
              <ArrowIcon direction="previous" />
            </button>

            <motion.figure
              key={imageWorld[shownIndex].src}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: premiumEase }}
              className="relative h-[74svh] w-[88vw] sm:h-[86svh] sm:w-[82vw]"
            >
              <Image
                src={imageWorld[shownIndex].src}
                alt={imageWorld[shownIndex].alt}
                fill
                unoptimized
                loading="eager"
                sizes="90vw"
                className="object-contain drop-shadow-[0_26px_70px_rgba(0,0,0,0.32)]"
              />
            </motion.figure>

            <button
              type="button"
              aria-label="Nächstes Bild"
              onClick={showNext}
              className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white transition-colors duration-300 hover:bg-white hover:text-graphite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:bottom-auto sm:right-7 sm:top-1/2 sm:-translate-y-1/2"
            >
              <ArrowIcon direction="next" />
            </button>

            <p aria-live="polite" className="absolute bottom-[1.15rem] left-1/2 -translate-x-1/2 text-[0.68rem] font-medium tracking-[0.2em] text-white/60 sm:bottom-6">
              {String(shownIndex + 1).padStart(2, "0")} / {String(imageWorld.length).padStart(2, "0")}
            </p>
          </motion.div>
        )}
      </Presence>
    </main>
  );
}
