import type { Metadata } from "next";
import { Bagel_Fat_One, Jost, Mrs_Saint_Delafield } from "next/font/google";
import { brand } from "@/content";
import "./globals.css";

// Sans geometrica per titoli e testo, corsivo per le parole in script,
// display tondeggiante per la parola gigante dell'hero.
const sans = Jost({ variable: "--font-sans", subsets: ["latin"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", weight: "400", subsets: ["latin"] });
const display = Bagel_Fat_One({ variable: "--font-display", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${sans.variable} ${script.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
