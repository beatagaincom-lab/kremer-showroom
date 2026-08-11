import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  compact?: boolean;
};

export function BrandLogo({ className = "", priority = false, compact = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Leon Kremer AG – Startseite"
      className={`inline-flex shrink-0 items-center ${className}`}
    >
      <Image
        src="/assets/brand/leon-kremer-logo.gif"
        alt="Leon Kremer AG Switzerland"
        width={270}
        height={133}
        priority={priority}
        unoptimized
        className={compact ? "h-auto w-[118px]" : "h-auto w-[145px] md:w-[165px]"}
      />
    </Link>
  );
}
