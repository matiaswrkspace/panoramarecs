import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Document from "@/components/Document";

export const metadata: Metadata = {
  title: "Panorama — Coming soon",
  description: "Panorama · Electronic music · Brescia. Il nuovo sito sta arrivando.",
};

export const viewport: Viewport = { themeColor: "#020604" };

export default function Layout({ children }: { children: ReactNode }) {
  return <Document lang="it">{children}</Document>;
}
