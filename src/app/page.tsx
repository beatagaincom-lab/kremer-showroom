import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { FIXLEINTUECHER_SLUG } from "@/data/fixleintuecher";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-graphite">
      <header className="site-gutter flex h-20 items-center justify-between border-b border-line">
        <BrandLogo priority />
        <Link className="text-link" href="/studio">
          Showroom Studio <ArrowRight aria-hidden size={15} />
        </Link>
      </header>

      <section className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-[44%_56%]">
        <div className="site-gutter flex flex-col justify-center py-20 lg:py-28">
          <p className="mb-7 text-sm tracking-[0.16em] text-muted">KREMER SHOWROOM</p>
          <h1 className="font-serif text-[clamp(3.3rem,7.1vw,7.5rem)] leading-[0.92] tracking-[-0.045em]">
            Persönlich
            <br />
            präsentiert.
          </h1>
          <p className="mt-8 max-w-md text-base leading-7 text-muted md:text-lg">
            Ein digitales Musterbuch für kuratierte Produktauswahlen, Varianten
            und persönliche B2B-Anfragen.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href={`/showroom/${FIXLEINTUECHER_SLUG}`}>
              Neue Farbkollektion <ArrowRight aria-hidden size={17} />
            </Link>
            <Link className="button-secondary" href="/studio">
              Präsentation erstellen
            </Link>
          </div>
        </div>
        <div className="relative min-h-[48vh] overflow-hidden bg-pale-blue lg:min-h-full">
          <Image
            src="/assets/fixleintuecher/photo-09.jpg"
            alt="Vier gestapelte Farbreihen der Fixleintücher"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}
