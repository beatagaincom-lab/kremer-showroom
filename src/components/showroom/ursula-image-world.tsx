"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { fixleintuchGallery, type FixleintuchGalleryImage } from "@/data/fixleintuecher";

const premiumEase = [0.22, 1, 0.36, 1] as const;

const heroImage: FixleintuchGalleryImage = {
  src: "/assets/fixleintuecher/hero-soft-colors.png",
  alt: "Gefaltete Fixleintücher in Blau-, Rosa- und Naturtönen",
  width: 1536,
  height: 1024,
};

const ursulaAdditionalGallery: FixleintuchGalleryImage[] = [
  {
    src: "/assets/fixleintuecher/ursula-new/authentic-studio-textile-catalogue.webp",
    alt: "Gerollte Fixleintücher in vier harmonischen Farbgruppen auf einem Studiotisch",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/catalogue-architectural-loft.webp",
    alt: "Sortierte Fixleintücher auf einem langen Holztisch in einem hellen Loft",
    width: 2752,
    height: 1536,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/catalogue-bright-horizon.webp",
    alt: "Gestapelte Fixleintücher in kräftigen und natürlichen Farbtönen vor hellem Hintergrund",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/catalogue-dynamic-top-down.webp",
    alt: "Fixleintücher in allen Kollektionstönen kreisförmig aus der Vogelperspektive arrangiert",
    width: 2048,
    height: 2048,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/catalogue-low-angle-majesty.webp",
    alt: "Dicht gestapelte Fixleintücher aus tiefer Perspektive fotografiert",
    width: 1792,
    height: 2400,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/catalogue-ordered-symmetry.webp",
    alt: "Symmetrisch geordnete Fixleintücher in zwanzig Farben",
    width: 2400,
    height: 1792,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/catalogue-soft-scandi-luxury.webp",
    alt: "Gerollte Fixleintücher in einer warmen, skandinavisch eingerichteten Umgebung",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/definitive-textile-authority-shoot.webp",
    alt: "Fixleintücher als präzise Farbmatrix vor neutralem Studiohintergrund",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/natural-saturation-textile-shoot.webp",
    alt: "Natürlich beleuchteter Stapel gerollter Fixleintücher in der gesamten Farbpalette",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/radically-honest-textile-photography.webp",
    alt: "Authentisch inszenierte Fixleintücher auf einer gebrauchten Studiofläche",
    width: 2528,
    height: 1696,
  },
  {
    src: "/assets/fixleintuecher/ursula-new/the-swiss-studio-truth.webp",
    alt: "Sachlich fotografierte Fixleintücher in klaren Reihen auf Beton",
    width: 2528,
    height: 1696,
  },
];

const galleryImages = [...ursulaAdditionalGallery, ...fixleintuchGallery];
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

export function UrsulaImageWorld() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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
      <section className="mx-auto grid min-h-[76svh] w-full max-w-[1540px] items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-14 lg:py-28 xl:gap-28 xl:px-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: premiumEase }}
          className="max-w-[610px]"
        >
          <h1 className="font-serif text-[clamp(3.25rem,5.8vw,5.8rem)] leading-[0.98] tracking-[-0.055em] text-graphite">
            Hallo Ursula,
            <br />
            hier ein paar Versionen.
          </h1>
          <p className="mt-8 max-w-[540px] text-[1.02rem] leading-[1.75] tracking-[-0.015em] text-[#74797d] sm:mt-10 sm:text-[1.12rem]">
            Eine erste Richtung für die Kollektion – als Ausgangspunkt gedacht. Bildsprache, Aufbau und Wirkung können wir selbstverständlich auch anders entwickeln.
          </p>
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
      </section>

      <motion.section
        className="flex min-h-[300px] items-center justify-center bg-graphite px-8 py-24"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.2, ease: premiumEase }}
      >
        <Image
          src="/assets/brand/b2b-logo.svg"
          alt="B2B"
          width={500}
          height={214}
          unoptimized
          className="h-auto w-full max-w-[330px]"
        />
      </motion.section>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Vollansicht Bild ${activeIndex + 1} von ${imageWorld.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: premiumEase }}
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

            <AnimatePresence mode="wait">
              <motion.figure
                key={imageWorld[activeIndex].src}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: premiumEase }}
                className="relative h-[74svh] w-[88vw] sm:h-[86svh] sm:w-[82vw]"
              >
                <Image
                  src={imageWorld[activeIndex].src}
                  alt={imageWorld[activeIndex].alt}
                  fill
                  unoptimized
                  loading="eager"
                  sizes="90vw"
                  className="object-contain drop-shadow-[0_26px_70px_rgba(0,0,0,0.32)]"
                />
              </motion.figure>
            </AnimatePresence>

            <button
              type="button"
              aria-label="Nächstes Bild"
              onClick={showNext}
              className="absolute bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.07] text-white transition-colors duration-300 hover:bg-white hover:text-graphite focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:bottom-auto sm:right-7 sm:top-1/2 sm:-translate-y-1/2"
            >
              <ArrowIcon direction="next" />
            </button>

            <p aria-live="polite" className="absolute bottom-[1.15rem] left-1/2 -translate-x-1/2 text-[0.68rem] font-medium tracking-[0.2em] text-white/60 sm:bottom-6">
              {String(activeIndex + 1).padStart(2, "0")} / {String(imageWorld.length).padStart(2, "0")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
