import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kremer Showroom",
    template: "%s · Kremer Showroom",
  },
  description:
    "Personalisierte B2B-Produktpräsentationen für Leon Kremer AG Switzerland.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${manrope.variable} ${bodoni.variable}`}>
      <body>{children}</body>
    </html>
  );
}
