import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import type { Client, ContactPerson, Product, Showroom } from "@/types/catalog";

type ShowroomHeaderProps = { selectionCount: number };

export function ShowroomHeader({ selectionCount }: ShowroomHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm print:hidden">
      <div className="site-gutter flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <BrandLogo compact priority />
          <span className="hidden border-l border-line pl-5 text-[12px] font-semibold tracking-[0.18em] text-muted md:block">
            SHOWROOM
          </span>
        </div>
        <nav aria-label="Showroom Navigation" className="hidden items-center gap-8 text-sm lg:flex">
          <a href="#kollektion" className="hover:text-sky-strong">Kollektion</a>
          <a href="#auswahl" className="hover:text-sky-strong">
            Auswahl{selectionCount > 0 ? ` (${selectionCount})` : ""}
          </a>
          <a href="#kontakt" className="hover:text-sky-strong">Kontakt</a>
          <Link href="/studio" className="text-sky-strong">Studio</Link>
        </nav>
        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 list-none items-center justify-center border border-line" aria-label="Navigation öffnen">
            <Menu aria-hidden size={20} />
          </summary>
          <nav className="absolute right-0 top-14 grid min-w-52 border border-line bg-white p-2 shadow-[var(--shadow-soft)]" aria-label="Mobile Navigation">
            <a className="px-4 py-3" href="#kollektion">Kollektion</a>
            <a className="px-4 py-3" href="#auswahl">Auswahl ({selectionCount})</a>
            <a className="px-4 py-3" href="#kontakt">Kontakt</a>
            <Link className="px-4 py-3 text-sky-strong" href="/studio">Studio</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

type HeroProps = {
  client: Client;
  contact: ContactPerson;
};

export function ShowroomHero({ client, contact }: HeroProps) {
  return (
    <section className="book-reveal grid min-h-[calc(100svh-72px)] bg-white lg:min-h-[calc(78svh-72px)] lg:grid-cols-[54%_46%]">
      <div className="order-2 flex min-h-[54svh] flex-col justify-center px-5 py-14 sm:px-10 lg:order-1 lg:min-h-0 lg:px-[clamp(4rem,6vw,6.5rem)]">
        <div className="relative max-w-[690px] lg:pl-12">
          <div className="absolute bottom-2 left-0 top-2 hidden w-px bg-line lg:block">
            <span className="absolute left-[-1px] top-1/3 h-28 w-[2px] bg-sky" />
            <span className="absolute -left-2 bottom-0 text-xs text-sky-strong">01</span>
          </div>
          <h1 className="font-serif text-[clamp(3.2rem,5.6vw,6.5rem)] leading-[0.94] tracking-[-0.05em]">Für {client.name} kuratiert</h1>
          <p className="mt-7 max-w-xl text-[clamp(1rem,1.25vw,1.2rem)] leading-8 text-muted">
            Eine ausgewählte Kollektion für Ihr Sortiment, zusammengestellt von {contact.name}.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="button-primary" href="#kollektion">
              Kollektion entdecken <ArrowDown aria-hidden size={17} />
            </a>
            <a className="button-secondary" href="#auswahl">
              Direkt zur Auswahl <ArrowRight aria-hidden size={17} />
            </a>
          </div>
        </div>
      </div>
      <div className="relative order-1 min-h-[48svh] overflow-hidden bg-pale-blue lg:order-2 lg:min-h-0">
        <Image
          src="/assets/products/hero-folded-sky.png"
          alt="Gefaltete hellblaue Textilien mit sichtbarer Webstruktur"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 46vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

type EditorialOverviewProps = {
  showroom: Showroom;
  products: Product[];
};

export function EditorialOverview({ showroom, products }: EditorialOverviewProps) {
  const [lead, second, third] = products;
  if (!lead) return null;

  return (
    <section id="kollektion" className="content-auto site-gutter scroll-mt-24 py-20 md:py-32">
      <div className="grid items-end gap-12 border-b border-line pb-16 lg:grid-cols-[40%_60%]">
        <div>
          <p className="mb-4 text-sm text-sky-strong">01 / Kollektion</p>
          <h2 className="max-w-2xl font-serif text-[clamp(2.8rem,5vw,5.7rem)] leading-[0.98] tracking-[-0.045em]">
            {showroom.title}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-muted lg:justify-self-end">
          Drei Produktfamilien, bewusst in wechselndem Rhythmus präsentiert. Farben, Bilder und Varianten bleiben unabhängig von der Produktgruppe datengetrieben.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.45fr_.72fr_.72fr] lg:items-end">
        <a href={`#product-${lead.id}`} className="group relative block aspect-[4/3] overflow-hidden bg-surface">
          <Image src={lead.media[0].src} alt={lead.media[0].alt} fill sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
          <span className="absolute bottom-0 left-0 bg-white px-5 py-4 text-sm font-semibold">{lead.name} · {lead.collection}</span>
        </a>
        {second ? (
          <a href={`#product-${second.id}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <Image src={second.media[0].src} alt={second.media[0].alt} fill sizes="(max-width: 1024px) 100vw, 23vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <p className="mt-4 font-serif text-2xl">{second.name}</p>
            <p className="mt-1 text-sm text-muted">{second.category}</p>
          </a>
        ) : null}
        {third ? (
          <a href={`#product-${third.id}`} className="group block lg:translate-y-12">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface">
              <Image src={third.media[0].src} alt={third.media[0].alt} fill sizes="(max-width: 1024px) 100vw, 23vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <p className="mt-4 font-serif text-2xl">{third.name}</p>
            <p className="mt-1 text-sm text-muted">{third.category}</p>
          </a>
        ) : null}
      </div>

      <div className="mt-24 grid gap-8 bg-pale-blue p-7 md:p-12 lg:grid-cols-[36%_64%] lg:items-center">
        <p className="font-serif text-[clamp(2.3rem,4vw,4.8rem)] leading-[1.02] tracking-[-0.04em]">
          Stoff wird zur gemeinsamen Sprache.
        </p>
        <div className="relative min-h-64 overflow-hidden md:min-h-80">
          <Image src="/assets/products/hero-folded-sky.png" alt="Makroansicht einer hellblauen Textilstruktur" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
