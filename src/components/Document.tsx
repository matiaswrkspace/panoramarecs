import type { ReactNode } from "react";
import { Jost, Mrs_Saint_Delafield, Yellowtail } from "next/font/google";
import "@/app/globals.css";

// Sans geometrica per titoli e testo, corsivo per le parole in script,
// Yellowtail per la scritta del logo "Panorama".
const sans = Jost({ variable: "--font-sans", subsets: ["latin"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", weight: "400", subsets: ["latin"] });
const logo = Yellowtail({ variable: "--font-logo", weight: "400", subsets: ["latin"] });

// Ogni lingua ha il suo layout radice (app/(en) e app/(it)) così <html lang>
// è corretto e le due pagine sono HTML statico già pronto.
export default function Document({ lang, children }: { lang: "en" | "it"; children: ReactNode }) {
  return (
    <html lang={lang} className={`${sans.variable} ${script.variable} ${logo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
