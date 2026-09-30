import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Document from "@/components/Document";
import { brand } from "@/content";

export const metadata: Metadata = {
  title: brand.name,
  description: "Musica elettronica",
  alternates: { languages: { en: "/", it: "/it" } },
};

export const viewport: Viewport = { themeColor: "#040806" };

export default function Layout({ children }: { children: ReactNode }) {
  return <Document lang="it">{children}</Document>;
}
