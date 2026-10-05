"use client";

import { useSyncExternalStore } from "react";
import { brand } from "@/content";
import "./soon-video.css";

// Pagina "soon" con il video: versione orizzontale o verticale secondo lo schermo.
// Il video parte da solo (muto, come richiesto dai browser) e alla fine resta
// fermo sull'ultimo fotogramma, con insegna e SOON.
const query = "(orientation: portrait)";
const subscribe = (fn: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
};

export default function SoonVideo() {
  // Sul server l'orientamento non si conosce: il video si monta solo nel browser.
  const portrait = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => null);
  const format = portrait ? "9x16" : "16x9";

  return (
    <main className="soon-video">
      <h1 className="soon-video__sr">{brand.name} — Coming soon</h1>
      {portrait !== null && (
        <video
          key={format}
          className="soon-video__player"
          src={`/video/soon-${format}.mp4`}
          poster={`/video/soon-${format}-end.jpg`}
          // con "riduci movimento" niente riproduzione automatica: resta la scena finale
          autoPlay={!window.matchMedia("(prefers-reduced-motion: reduce)").matches}
          muted
          playsInline
          preload="auto"
          aria-label="Panorama — Soon"
        />
      )}
      <a className="soon-video__mail" href={`mailto:${brand.email}`}>
        {brand.email}
      </a>
    </main>
  );
}
