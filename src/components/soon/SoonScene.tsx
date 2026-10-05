import { brand } from "@/content";
import Logo from "../Logo";
import Particles from "./Particles";
import "./soon.css";

// Pagina "coming soon": titoli di testa da film anni '70-'80 visti su videocassetta,
// tutto in CSS/SVG (nitido a ogni risoluzione, nessun file video da scaricare).
//
// Timeline (secondi): 0.2 si aprono le bande nere · 0.6 orizzonte · 1.2 sole ·
// 1.8 acqua e riflesso · 3.2 insegna neon · 4.8 SOON cromato · 5.8 contatti.
// Poi resta viva a 124 BPM: il riflesso scivola sull'acqua, il sole pulsa sul battere,
// il puntino BPM lampeggia. Nessun tremolio: solo colori e righe da nastro VHS.
const BPM = 124;

// ---------- Acqua (coordinate del viewBox 1600×900, orizzonte a y=640) ----------
// Prospettiva: le righe sono fitte vicino all'orizzonte e si allargano verso chi guarda.
const HORIZON = 640;
const depth = (i: number, n: number) => HORIZON + 4 + 256 * Math.pow(i / n, 1.7);
const noise = (i: number) => Math.sin(i * 12.9898 + 4.1) * 0.5 + 0.5; // pseudo-casuale ma stabile

// Riflessi del sole: tanti tratti sottili e allungati, sparsi in un cono che si apre
// verso chi guarda (come su acqua appena increspata), più fitti e luminosi all'orizzonte.
const ROWS = 52;
const glints = Array.from({ length: ROWS }, (_, i) => {
  const t = i / ROWS;
  const y = depth(i, ROWS);
  const spread = 150 + 170 * t; // metà larghezza del cono a questa distanza
  const pieces = 2 + Math.round(noise(i) * 2);
  return Array.from({ length: pieces }, (_, k) => {
    const n = noise(i * 5 + k * 1.7);
    const m = noise(i * 9 + k * 3.1);
    const cx = 800 + (n - 0.5) * 2 * spread * (0.35 + 0.65 * m);
    const w = (14 + 70 * (1 - Math.abs(cx - 800) / spread)) * (0.6 + t * 0.9);
    const h = 0.8 + t * 2.6;
    const fade = 1 - Math.abs(cx - 800) / (spread * 1.1); // più deboli ai lati del cono
    return { key: `${i}-${k}`, x: cx - w / 2, y, w, h, o: +Math.max(0.04, 0.8 * (1 - t) ** 1.2 * fade).toFixed(2) };
  });
}).flat();

// Onde su tutta la superficie, sempre con la stessa prospettiva.
const waves = Array.from({ length: 22 }, (_, i) => ({ y: depth(i + 0.5, 22), o: +(0.05 + 0.1 * (i / 22)).toFixed(3) }));

export default function SoonScene() {
  const stripes = [520, 548, 572, 593, 611, 626];

  return (
    <main className="soon" style={{ ["--beat" as string]: `${60 / BPM}s` }}>
      <div className="soon-stage">
        {/* Cielo, sole al tramonto, orizzonte e acqua */}
        <svg className="soon-sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="soon-sky" cx="50%" cy="62%" r="75%">
              <stop offset="0" stopColor="#1d3a2c" />
              <stop offset=".45" stopColor="#0f1d16" />
              <stop offset="1" stopColor="#0a0d0b" />
            </radialGradient>
            <linearGradient id="soon-sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3f0d2" />
              <stop offset=".55" stopColor="#7fd3a2" />
              <stop offset="1" stopColor="#2f6e52" />
            </linearGradient>
            <radialGradient id="soon-halo">
              <stop offset="0" stopColor="#8fdcae" stopOpacity=".3" />
              <stop offset="1" stopColor="#8fdcae" stopOpacity="0" />
            </radialGradient>
            <clipPath id="soon-above">
              <rect x="0" y="0" width="1600" height={HORIZON} />
            </clipPath>
            <clipPath id="soon-below">
              <rect x="0" y={HORIZON} width="1600" height={900 - HORIZON} />
            </clipPath>
            <clipPath id="soon-disc">
              <circle cx="800" cy="600" r="240" />
            </clipPath>
            {/* Acqua mossa: il rumore scivola lentamente di lato e deforma i riflessi */}
            <filter id="soon-ripple" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0025 0.07" numOctaves="2" seed="4" result="noise" />
              <feOffset in="noise" dx="0" result="moving">
                <animate attributeName="dx" dur="14s" values="0;260;0" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />
              </feOffset>
              <feDisplacementMap in="SourceGraphic" in2="moving" scale="13" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="0.7" />
            </filter>
            <filter id="soon-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <radialGradient id="soon-column" cx="50%" cy="0%" r="100%">
              <stop offset="0" stopColor="#cfe9c8" stopOpacity=".34" />
              <stop offset=".45" stopColor="#cfe9c8" stopOpacity=".12" />
              <stop offset="1" stopColor="#cfe9c8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1600" height="900" fill="url(#soon-sky)" />

          {/* su telefono il sole si rimpicciolisce attorno all'orizzonte (vedi CSS) */}
          <g className="soon-sun-wrap">
            <g className="soon-sun">
              <circle cx="800" cy="600" r="460" fill="url(#soon-halo)" className="soon-sun__halo" />
              <g clipPath="url(#soon-above)">
                <g clipPath="url(#soon-disc)">
                  <circle cx="800" cy="600" r="240" fill="url(#soon-sun)" opacity=".5" />
                  {/* tagli orizzontali da tramonto retrò, sempre più spessi verso l'orizzonte */}
                  {stripes.map((y, i) => (
                    <rect key={y} x="540" y={y - 4 - i} width="520" height={4 + i * 1.8} fill="#0d1712" />
                  ))}
                </g>
                <circle cx="800" cy="600" r="240" fill="none" stroke="#e3efd6" strokeOpacity=".45" strokeWidth="1.5" />
              </g>
            </g>
          </g>

          <line x1="0" y1={HORIZON} x2="1600" y2={HORIZON} className="soon-horizon" />

          <g className="soon-water" clipPath="url(#soon-below)">
            {/* onde leggere su tutta la superficie */}
            {waves.map((w) => (
              <line key={w.y} x1="0" x2="1600" y1={w.y} y2={w.y} stroke="#cfe9c8" strokeOpacity={w.o} strokeWidth="1" />
            ))}
            {/* immagine del sole specchiata e sfocata, poi la colonna di luce */}
            <ellipse cx="800" cy={HORIZON + 30} rx="200" ry="60" fill="#8fdcae" opacity=".22" filter="url(#soon-soft)" />
            <ellipse cx="800" cy={HORIZON} rx="230" ry="270" fill="url(#soon-column)" />
            {/* riflessi spezzati dall'acqua */}
            <g filter="url(#soon-ripple)" className="soon-reflection">
              {glints.map((g) => (
                <rect key={g.key} x={g.x} y={g.y} width={g.w} height={g.h} rx={g.h / 2} fill="#eef3da" opacity={g.o} />
              ))}
            </g>
          </g>
        </svg>

        <Particles />

        <div className="soon-content">
          <Logo as="h1" className="soon-logo" />
          <p className="soon-word" aria-label="Soon">
            {"SOON".split("").map((l, i) => (
              <span key={i} style={{ animationDelay: `${4.8 + i * 0.09}s` }}>{l}</span>
            ))}
          </p>
        </div>

        {/* Riga d'informazioni in basso, come su un poster */}
        <div className="soon-info">
          <p className="soon-contacts">
            <span>Brescia, Italia</span>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </p>
        </div>
      </div>

      {/* Videocassetta: righe CRT, viraggio caldo, grana ferma; poi bande cinema e intestazione */}
      <div className="soon-scanlines" aria-hidden="true" />
      <div className="soon-vhs" aria-hidden="true" />
      <div className="soon-grain" aria-hidden="true" />
      <div className="soon-bars" aria-hidden="true"><i /><i /></div>
      <header className="soon-hud">
        <span>Panorama Records</span>
        <span className="soon-hud__bpm"><i aria-hidden="true" />{BPM} BPM</span>
      </header>
    </main>
  );
}
