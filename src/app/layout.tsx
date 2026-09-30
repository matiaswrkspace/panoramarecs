import type { Metadata } from "next";
import { Jost, Mrs_Saint_Delafield, Yellowtail } from "next/font/google";
import { brand } from "@/content";
import "./globals.css";

// Sans geometrica per titoli e testo, corsivo per le parole in script,
// Yellowtail per la scritta del logo "Panorama".
const sans = Jost({ variable: "--font-sans", subsets: ["latin"] });
const script = Mrs_Saint_Delafield({ variable: "--font-script", weight: "400", subsets: ["latin"] });
const logo = Yellowtail({ variable: "--font-logo", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${sans.variable} ${script.variable} ${logo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
