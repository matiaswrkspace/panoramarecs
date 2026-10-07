import type { ReactNode } from "react";
import Logo from "../Logo";
import MoonReflection from "./MoonReflection";
import Particles from "./Particles";
import "./soon.css";

// Pagina "coming soon": titoli di testa da film anni '70-'80 visti su videocassetta,
// tutto in CSS/SVG (nitido a ogni risoluzione, nessun file video da scaricare).
//
// Apertura: la scena, già composta, emerge dal nero in un'unica ripresa (0.2–3.6 s:
// carrellata in avanti, messa a fuoco, luce che sale) · 2.6 si accende l'insegna ·
// 3.6 arriva SOON · 4.8 contatti.
//
// PRESTAZIONI — la scena è divisa in livelli, come in un programma di grafica:
// tutto ciò che è pesante da disegnare (trame della luna, acqua deformata) sta in
// livelli FERMI, disegnati una volta sola. Le parti vive (alone che pulsa, etichetta
// che gira, riflesso che ondeggia) sono livelli separati che si muovono solo con
// trasformazioni e trasparenza: le gestisce la scheda grafica senza ridisegnare nulla.
// Niente ritagli SVG annidati né filtri CSS sull'SVG (lenti e fragili su Safari).
const BPM = 124;

// Tutti i livelli condividono lo stesso spazio: viewBox 1600×900 adattato "a riempire".
const HORIZON = 640;
const MOON = { x: 800, y: 600, r: 240 };

function Layer({ className, children }: { className: string; children: ReactNode }) {
  return (
    <svg className={`soon-layer ${className}`} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {children}
    </svg>
  );
}

const ripples = [640, 656, 676, 700, 728, 760, 796, 836];

// Crateri lunari (posizioni fisse, nella metà visibile sopra l'orizzonte).
const craters = [
  { x: 702, y: 452, r: 16 }, { x: 893, y: 431, r: 11 }, { x: 958, y: 528, r: 20 },
  { x: 640, y: 560, r: 13 }, { x: 760, y: 392, r: 8 }, { x: 905, y: 590, r: 9 }, { x: 676, y: 505, r: 6 },
];

// Solchi del vinile, dall'etichetta al bordo.
const grooves = Array.from({ length: 52 }, (_, i) => 88 + i * 2.9);

export default function SoonScene() {
  return (
    <main className="soon" style={{ ["--beat" as string]: `${60 / BPM}s` }}>
      <div className="soon-stage">
        {/* ---------- Livello fermo: cielo, luna-vinile, orizzonte, acqua ---------- */}
        <Layer className="soon-sky">
          <defs>
            {/* stessa sfumatura per cielo e acqua (coordinate assolute): l'acqua può
                coprire la parte bassa della luna senza bisogno di ritagli */}
            <radialGradient id="soon-sky" gradientUnits="userSpaceOnUse" cx="800" cy="558" r="1200" gradientTransform="translate(800 558) scale(1 0.5625) translate(-800 -558)">
              <stop offset="0" stopColor="#15402c" />
              <stop offset=".45" stopColor="#08190f" />
              <stop offset="1" stopColor="#050a07" />
            </radialGradient>
            {/* superficie lunare chiara, bordo un po' più scuro */}
            <radialGradient id="soon-moon" cx="44%" cy="40%" r="62%">
              <stop offset="0" stopColor="#e4ede0" />
              <stop offset=".55" stopColor="#c8d9cb" />
              <stop offset=".85" stopColor="#a6bfae" />
              <stop offset="1" stopColor="#84a190" />
            </radialGradient>
            {/* trame lunari ("mari" e grana) confinate nel disco dal filtro stesso */}
            <filter id="soon-moon-surface" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0075" numOctaves="3" seed="23" result="m" />
              <feColorMatrix in="m" values="0 0 0 0 0.33  0 0 0 0 0.42  0 0 0 0 0.38  0 0 0 -3.6 2.15" result="maria" />
              <feGaussianBlur in="maria" stdDeviation="2" result="mariaSoft" />
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="g" />
              <feColorMatrix in="g" values="0 0 0 0 0.3  0 0 0 0 0.38  0 0 0 0 0.34  0 0 0 -1.6 1.02" result="grain" />
              <feComponentTransfer in="mariaSoft" result="mariaA"><feFuncA type="linear" slope="0.85" /></feComponentTransfer>
              <feComponentTransfer in="grain" result="grainA"><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
              <feMerge result="tex"><feMergeNode in="mariaA" /><feMergeNode in="grainA" /></feMerge>
              <feComposite in="tex" in2="SourceAlpha" operator="in" result="texIn" />
              <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="texIn" /></feMerge>
            </filter>
            <radialGradient id="soon-crater" cx="45%" cy="40%" r="60%">
              <stop offset="0" stopColor="#7f998a" stopOpacity=".55" />
              <stop offset=".75" stopColor="#8fa999" stopOpacity=".3" />
              <stop offset="1" stopColor="#ffffff" stopOpacity=".35" />
            </radialGradient>
            <radialGradient id="soon-label">
              <stop offset="0" stopColor="#e9f1e6" />
              <stop offset="1" stopColor="#c6d8cb" />
            </radialGradient>
            {/* chiaro di luna stretto attorno al disco (fermo) */}
            <radialGradient id="soon-glow" gradientUnits="userSpaceOnUse" cx={MOON.x} cy={MOON.y} r="480">
              <stop offset=".5" stopColor="#e9fbef" stopOpacity=".24" />
              <stop offset=".6" stopColor="#bdf1d4" stopOpacity=".12" />
              <stop offset="1" stopColor="#8fe3b8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="soon-haze" gradientUnits="userSpaceOnUse" cx="800" cy={HORIZON} r="520" gradientTransform={`translate(800 ${HORIZON}) scale(1 0.09) translate(-800 -${HORIZON})`}>
              <stop offset="0" stopColor="#e9fbef" stopOpacity=".2" />
              <stop offset=".4" stopColor="#bdf1d4" stopOpacity=".07" />
              <stop offset="1" stopColor="#8fe3b8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="soon-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#cdeedb" stopOpacity=".5" />
              <stop offset="1" stopColor="#cdeedb" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect width="1600" height="900" fill="url(#soon-sky)" />

          {/* la luna-vinile tramonta sull'orizzonte; su telefono si rimpicciolisce (vedi CSS) */}
          <g className="soon-sun-wrap">
            <rect x="320" y="120" width="960" height="960" fill="url(#soon-glow)" />
            <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill="url(#soon-moon)" filter="url(#soon-moon-surface)" />
            {craters.map((c) => (
              <circle key={`${c.x}-${c.y}`} cx={c.x} cy={c.y} r={c.r} fill="url(#soon-crater)" />
            ))}
            {/* solchi del vinile incisi nella superficie */}
            {grooves.map((r, i) => (
              <circle key={r} cx={MOON.x} cy={MOON.y} r={r} fill="none" stroke="#3f5a4b" strokeOpacity={i % 4 === 0 ? 0.16 : 0.07} strokeWidth="0.9" />
            ))}
            {/* etichetta in rilievo (la scritta che gira è su un livello a parte) */}
            <circle cx={MOON.x} cy={MOON.y} r="80" fill="url(#soon-label)" />
            <circle cx={MOON.x} cy={MOON.y} r="80" fill="none" stroke="#5d7a69" strokeOpacity=".45" strokeWidth="1.5" />
            <circle cx={MOON.x} cy={MOON.y} r="74" fill="none" stroke="#ffffff" strokeOpacity=".35" strokeWidth="1" />
            <circle cx={MOON.x} cy={MOON.y} r="6" fill="#0b1a12" />
            {/* bordo illuminato */}
            <circle cx={MOON.x} cy={MOON.y} r="239.5" fill="none" stroke="#f3f8ef" strokeOpacity=".55" strokeWidth="1.5" className="soon-vinyl-rim" />
          </g>

          {/* acqua: copre la parte bassa della luna, con la stessa sfumatura del cielo */}
          <rect x="0" y={HORIZON} width="1600" height={900 - HORIZON} fill="url(#soon-sky)" />
          <g className="soon-water">
            {ripples.map((y, i) => (
              <line key={y} x1={800 - 220 + i * 14} x2={800 + 220 - i * 14} y1={y} y2={y} stroke="url(#soon-water)" strokeWidth={3 - i * 0.25} opacity="0.8" />
            ))}
          </g>
          <line x1="0" y1={HORIZON} x2="1600" y2={HORIZON} className="soon-horizon" />
          <g className="soon-sun-wrap">
            <rect x="280" y={HORIZON - 47} width="1040" height="94" fill="url(#soon-haze)" />
          </g>
        </Layer>

        {/* ---------- Livelli vivi (si muovono solo con trasformazioni/trasparenza) ---------- */}
        {/* riflesso della luna che si muove sull'acqua (canvas leggero, solo sotto la luna) */}
        <MoonReflection />

        {/* alone che pulsa sul battere: anello attorno alla luna, solo sopra l'orizzonte */}
        <div className="soon-above">
          <Layer className="soon-halo">
            <defs>
              <radialGradient id="soon-halo" gradientUnits="userSpaceOnUse" cx={MOON.x} cy={MOON.y} r="460">
                <stop offset=".5" stopColor="#d8f5e4" stopOpacity="0" />
                <stop offset=".54" stopColor="#d8f5e4" stopOpacity=".12" />
                <stop offset="1" stopColor="#8fe3b8" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g className="soon-sun-wrap">
              <rect x="340" y="140" width="920" height="920" fill="url(#soon-halo)" />
            </g>
          </Layer>
        </div>

        {/* scritta dell'etichetta che gira lentamente, solo sopra l'orizzonte */}
        <div className="soon-above">
          <Layer className="soon-label">
            <defs>
              <path id="soon-label-path" d={`M${MOON.x} ${MOON.y} m-56 0 a56 56 0 1 1 112 0 a56 56 0 1 1 -112 0`} />
            </defs>
            <g className="soon-sun-wrap">
              <text className="soon-vinyl-text">
                <textPath href="#soon-label-path" startOffset="0">PANORAMA RECORDS · PANORAMA RECORDS ·</textPath>
              </text>
            </g>
          </Layer>
        </div>

        <Particles />

        <div className="soon-content">
          <h1 className="soon-title">
            <Logo className="soon-logo" />
            <span className="soon-records">Records</span>
          </h1>
          <p className="soon-word" aria-label="Soon">
            {"SOON".split("").map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </p>
        </div>

        {/* Riga d'informazioni in basso, come su un poster */}
        <div className="soon-info">
          <p className="soon-contacts">Coming soon</p>
        </div>
      </div>

      {/* Videocassetta: righe CRT, viraggio caldo, grana ferma; poi bande cinema e intestazione */}
      <div className="soon-scanlines" aria-hidden="true" />
      <div className="soon-vhs" aria-hidden="true" />
      <div className="soon-grain" aria-hidden="true" />
      <div className="soon-bars" aria-hidden="true"><i /><i /></div>
      <header className="soon-hud">
        <span>Panorama Records</span>
        <span className="soon-hud__rec"><i aria-hidden="true" />Recording</span>
      </header>
    </main>
  );
}
