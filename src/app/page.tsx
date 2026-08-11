import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import {
  FIXLEINTUECHER_SLUG,
  IMAGE_WORLD_SLUG,
  fixleintuchColors,
} from "@/data/fixleintuecher";

const heroFacts = [
  ["32", "Farbtöne"],
  ["4", "Farbfamilien"],
  ["1:1", "Beratung & Offerte"],
] as const;

const teasers = [
  {
    href: `/showroom/${FIXLEINTUECHER_SLUG}`,
    image: { src: "/assets/fixleintuecher/photo-19.jpg", alt: "Gerollte Farbmuster in vier gleichmässigen Spalten", width: 1536, height: 1024 },
    kicker: "01 · Kollektion",
    title: "Die Farbkollektion",
    copy: "32 Töne in vier Familien – als interaktives Musterbuch mit Merkliste, Anfrage und Kommentaren direkt am Produkt.",
  },
  {
    href: `/showroom/${IMAGE_WORLD_SLUG}`,
    image: { src: "/assets/fixleintuecher/beispiele/catalogue-soft-scandi-luxury.webp", alt: "Gerollte Fixleintücher in einer warmen, skandinavisch eingerichteten Umgebung", width: 2528, height: 1696 },
    kicker: "02 · Bildwelt",
    title: "Ein paar Beispiele",
    copy: "Eine erste Bildsprache für die Kollektion, bewusst reduziert inszeniert. Auf Wunsch zeigen wir gerne mehr.",
  },
  {
    href: "/studio",
    image: { src: "/assets/products/hero-folded-sky.png", alt: "Gefaltete hellblaue Textilien mit sichtbarer Webstruktur", width: 1536, height: 1024 },
    kicker: "03 · Studio",
    title: "Eigene Präsentationen",
    copy: "Kuratierte Auswahlen für einzelne Kunden zusammenstellen, prüfen und als persönlichen Link übergeben.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-graphite">
      <header className="site-gutter flex h-20 items-center justify-between border-b border-line">
        <BrandLogo priority />
        <nav aria-label="Hauptnavigation" className="flex items-center gap-7 text-sm">
          <Link className="hidden hover:text-sky-strong sm:block" href={`/showroom/${FIXLEINTUECHER_SLUG}`}>
            Farbkollektion
          </Link>
          <Link className="hidden hover:text-sky-strong sm:block" href={`/showroom/${IMAGE_WORLD_SLUG}`}>
            Beispiele
          </Link>
          <Link className="text-link" href="/studio">
            Showroom Studio <ArrowRight aria-hidden size={15} />
          </Link>
        </nav>
      </header>

      <section className="grid lg:min-h-[calc(100vh-5rem-2.75rem)] lg:grid-cols-[46%_54%]">
        <div className="site-gutter flex flex-col justify-center py-16 lg:py-24">
          <p className="kicker reveal-up">Leon Kremer AG · B2B Showroom</p>
          <h1 className="reveal-up reveal-delay-1 mt-7 font-serif text-[clamp(3.4rem,7vw,7.6rem)] leading-[0.92] tracking-[-0.045em]">
            Das digitale
            <br />
            <span className="serif-accent">Musterbuch.</span>
          </h1>
          <p className="reveal-up reveal-delay-2 mt-8 max-w-md text-base leading-8 text-muted md:text-lg">
            Kuratierte Produktauswahlen, Varianten und persönliche B2B-Anfragen –
            ruhig präsentiert, präzise im Detail.
          </p>
          <div className="reveal-up reveal-delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href={`/showroom/${FIXLEINTUECHER_SLUG}`}>
              Zur Farbkollektion <ArrowRight aria-hidden size={17} />
            </Link>
            <Link className="button-secondary" href={`/showroom/${IMAGE_WORLD_SLUG}`}>
              Beispiele ansehen
            </Link>
          </div>
          <dl className="reveal-up reveal-delay-4 mt-14 grid max-w-md grid-cols-3 divide-x divide-line border-y border-line">
            {heroFacts.map(([value, label]) => (
              <div key={label} className="px-4 py-5 first:pl-0">
                <dt className="text-xs tracking-[0.14em] text-muted">{label}</dt>
                <dd className="mt-1.5 font-serif text-3xl leading-none">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative order-first min-h-[46vh] lg:order-none">
          <div className="absolute inset-0 overflow-hidden bg-pale-blue">
            <Image
              src="/assets/fixleintuecher/photo-09.jpg"
              alt="Vier gestapelte Farbreihen der Fixleintücher"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover"
            />
          </div>
          <div className="reveal-up reveal-delay-3 absolute -bottom-10 left-6 hidden w-[300px] bg-white p-3 lg:block xl:left-[-72px] xl:w-[340px]">
            <div className="image-frame relative aspect-[3/4] overflow-hidden">
              <Image
                src="/assets/fixleintuecher/photo-23.jpg"
                alt="Fächerförmig angeordnete Farbmuster"
                fill
                sizes="340px"
                className="object-cover"
              />
            </div>
            <p className="flex items-baseline justify-between px-1 pb-1 pt-3 text-xs text-muted">
              <span>Fixleintücher & Spannbettlaken</span>
              <span className="font-serif text-base text-graphite">N° 01</span>
            </p>
          </div>
        </div>
      </section>

      <Link
        href={`/showroom/${FIXLEINTUECHER_SLUG}`}
        aria-label="Alle 32 Farbtöne der Kollektion ansehen"
        className="color-strip block h-11 w-full"
        title="Alle 32 Farbtöne ansehen"
      >
        {fixleintuchColors.map((color) => (
          <span key={color.id} style={{ backgroundColor: color.color }} />
        ))}
      </Link>

      <section className="site-gutter py-20 md:py-28">
        <div className="grid items-end gap-8 border-b border-line pb-12 lg:grid-cols-[55%_45%]">
          <h2 className="font-serif text-[clamp(2.6rem,4.6vw,5rem)] leading-[0.96] tracking-[-0.04em]">
            Drei Wege in
            <br />
            den Showroom.
          </h2>
          <p className="max-w-md text-base leading-8 text-muted lg:justify-self-end">
            Vom vollständigen Farbprogramm über die Bildwelt bis zur persönlich
            kuratierten Präsentation – jede Ansicht führt zur direkten Anfrage.
          </p>
        </div>

        <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {teasers.map((teaser, index) => (
            <Link key={teaser.href} href={teaser.href} className={`group block ${index === 1 ? "md:translate-y-10" : ""}`}>
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src={teaser.image.src}
                  alt={teaser.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-sky-strong">{teaser.kicker.toUpperCase()}</p>
              <h3 className="mt-3 flex items-baseline gap-2 font-serif text-3xl">
                {teaser.title}
                <ArrowUpRight aria-hidden size={20} className="translate-y-0.5 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-sky-strong" />
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-muted">{teaser.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
