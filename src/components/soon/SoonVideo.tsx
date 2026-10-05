"use client";

import { useMemo, useSyncExternalStore } from "react";
import { brand } from "@/content";
import "./soon-video.css";

// Pagina "soon" con il video di Panorama Records.
// - orizzontale o verticale secondo l'orientamento dello schermo (cambia se si ruota)
// - risoluzione scelta in base ai pixel reali dello schermo: 1080p, 1440p o 4K
// - parte da solo (muto, come richiedono i browser) e alla fine resta fermo
//   sull'ultima scena "Panorama Records — soon"
const query = "(orientation: portrait)";
const subscribe = (fn: () => void) => {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
};

function pickResolution() {
  const longSide = Math.max(screen.width, screen.height, innerWidth, innerHeight) * (devicePixelRatio || 1);
  if (longSide <= 2100) return "1080";
  if (longSide <= 2800) return "1440";
  return "2160";
}

export default function SoonVideo() {
  // Sul server l'orientamento non si conosce: il video si monta solo nel browser.
  const portrait = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => null);
  const format = portrait ? "9x16" : "16x9";
  const resolution = useMemo(() => (portrait === null ? null : pickResolution()), [portrait]);
  const reduceMotion = useMemo(
    () => portrait !== null && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [portrait],
  );

  return (
    <main className="soon-video">
      <h1 className="soon-video__sr">{brand.name} Records — Coming soon</h1>
      {resolution && (
        <video
          key={`${format}-${resolution}`}
          className={`soon-video__player soon-video__player--${format}`}
          src={`/video/soon-${format}-${resolution}.mp4`}
          poster={`/video/soon-${format}.jpg`}
          // con "riduci movimento" niente riproduzione automatica: resta la scena finale
          autoPlay={!reduceMotion}
          muted
          playsInline
          preload="auto"
          aria-label="Panorama Records — soon"
        />
      )}
      <a className="soon-video__mail" href={`mailto:${brand.email}`}>
        {brand.email}
      </a>
    </main>
  );
}
