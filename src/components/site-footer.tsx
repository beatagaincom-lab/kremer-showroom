import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { contacts } from "@/data/catalog";
import { FIXLEINTUECHER_SLUG, IMAGE_WORLD_SLUG } from "@/data/fixleintuecher";

const footerNav = [
  { href: "/", label: "Startseite" },
  { href: `/showroom/${FIXLEINTUECHER_SLUG}`, label: "Farbkollektion" },
  { href: `/showroom/${IMAGE_WORLD_SLUG}`, label: "Beispiele" },
  { href: "/studio", label: "Showroom Studio" },
];

export function SiteFooter() {
  return (
    <footer id="kontakt" className="scroll-mt-24 bg-graphite text-white">
      <div className="site-gutter grid gap-14 py-20 md:py-28 lg:grid-cols-[1.25fr_1fr_.7fr]">
        <div>
          <p className="kicker kicker-dark">Leon Kremer AG · B2B</p>
          <p className="mt-7 max-w-md font-serif text-[clamp(2.4rem,4vw,4rem)] leading-[1.02] tracking-[-0.035em]">
            Persönlich beraten, präzise geliefert.
          </p>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
            Muster, Offerten und kuratierte Präsentationen für den Fachhandel –
            direkt aus dem digitalen Musterbuch.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-white/45">IHRE ANSPRECHPERSONEN</p>
          <ul className="mt-7 space-y-8">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <p className="font-serif text-2xl">{contact.name}</p>
                <p className="mt-1 text-sm text-white/55">{contact.role}</p>
                <p className="mt-3 text-sm leading-6">
                  <a className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  <br />
                  <a className="text-white/75 transition-colors hover:text-white" href={`tel:${contact.phone.replaceAll(" ", "")}`}>
                    {contact.phone}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer Navigation">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/45">SHOWROOM</p>
          <ul className="mt-7 space-y-4 text-sm">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                  <ArrowUpRight aria-hidden size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-gutter flex flex-col items-start justify-between gap-6 border-t border-white/12 py-8 md:flex-row md:items-center">
        <Image
          src="/assets/brand/b2b-logo.svg"
          alt="Leon Kremer B2B"
          width={500}
          height={214}
          unoptimized
          className="h-auto w-[120px]"
        />
        <p className="text-xs text-white/45">
          © {new Date().getFullYear()} Leon Kremer AG Switzerland · Digitales Musterbuch
        </p>
      </div>
    </footer>
  );
}
