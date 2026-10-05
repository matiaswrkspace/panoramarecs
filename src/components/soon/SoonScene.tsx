import { brand } from "@/content";
import Logo from "../Logo";
import Particles from "./Particles";
import "./soon.css";

// Pagina "coming soon": titoli di testa da film anni '70-'80 visti su videocassetta,
// tutto in CSS/SVG (nitido a ogni risoluzione, nessun file video da scaricare).
//
// Timeline (secondi): 0.2 si aprono le bande nere · 0.6 orizzonte · 1.2 sole ·
// 1.8 acqua e riflesso · 3.2 insegna neon · 4.8 SOON cromato · 5.8 contatti.
// Poi resta viva a 124 BPM: il riflesso tremola sull'acqua, il sole pulsa sul battere,
// il puntino BPM lampeggia. Nessun tremolio: solo colori e righe da nastro VHS.
const BPM = 124;

// Riflesso del sole: bande luminose sempre più strette e deboli verso il basso,
// spezzate da un'ondulazione animata. Posizioni fisse (niente casuale al render).
const HORIZON = 640;
const reflection = Array.from({ length: 40 }, (_, i) => {
  const y = 646 + i * 6;
  const k = 1 - (y - 646) / 280;
  const jitter = Math.sin(i * 12.9898) * 0.5 + 0.5; // pseudo-casuale ma stabile
  const w = Math.max(18, 300 * k * (0.55 + jitter * 0.6));
  return { y, w, x: 800 - w / 2 + Math.cos(i * 7.31) * 15, h: 2 + jitter * 2.5, o: +(0.55 * k + 0.05).toFixed(2) };
});
const ripples = [640, 656, 676, 700, 728, 760, 796, 836];

export default function SoonScene() {
  const stripes = [520, 548, 572, 593, 611, 626];

  return (
    <main className="soon" style={{ ["--beat" as string]: `${60 / BPM}s` }}>
      <div className="soon-stage">
        {/* Cielo, sole al tramonto, orizzonte e acqua */}
        <svg className="soon-sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <radialGradient id="soon-sky" cx="50%" cy="62%" r="75%">
              <stop offset="0" stopColor="#15402c" />
              <stop offset=".45" stopColor="#08190f" />
              <stop offset="1" stopColor="#050a07" />
            </radialGradient>
            <linearGradient id="soon-sun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#eafff0" />
              <stop offset=".55" stopColor="#4fe8a0" />
              <stop offset="1" stopColor="#14794c" />
            </linearGradient>
            <radialGradient id="soon-halo">
              <stop offset="0" stopColor="#4fe8a0" stopOpacity=".34" />
              <stop offset="1" stopColor="#4fe8a0" stopOpacity="0" />
            </radialGradient>
            <clipPath id="soon-above">
              <rect x="0" y="0" width="1600" height={HORIZON} />
            </clipPath>
            <clipPath id="soon-disc">
              <circle cx="800" cy="600" r="240" />
            </clipPath>
            {/* Acqua: il riflesso tremola deformato da un'ondulazione animata */}
            <filter id="soon-ripple" x="-30%" y="-10%" width="160%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves="2" seed="7">
                <animate attributeName="baseFrequency" dur="8s" values="0.006 0.09;0.009 0.12;0.006 0.09" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="34" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
            <linearGradient id="soon-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4fe8a0" stopOpacity=".55" />
              <stop offset="1" stopColor="#4fe8a0" stopOpacity="0" />
            </linearGradient>
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
                    <rect key={y} x="540" y={y - 4 - i} width="520" height={4 + i * 1.8} fill="#06130c" />
                  ))}
                </g>
                <circle cx="800" cy="600" r="240" fill="none" stroke="#c8ffe0" strokeOpacity=".5" strokeWidth="1.5" />
              </g>
            </g>
          </g>

          <line x1="0" y1={HORIZON} x2="1600" y2={HORIZON} className="soon-horizon" />

          <g className="soon-water">
            {ripples.map((y, i) => (
              <line
                key={y}
                x1={800 - 220 + i * 14}
                x2={800 + 220 - i * 14}
                y1={y}
                y2={y}
                stroke="url(#soon-water)"
                strokeWidth={3 - i * 0.25}
                style={{ animationDelay: `${i * -0.35}s` }}
              />
            ))}
            <g filter="url(#soon-ripple)" className="soon-reflection">
              {reflection.map((b) => (
                <rect key={b.y} x={b.x} y={b.y} width={b.w} height={b.h} fill="#9dffcf" opacity={b.o} />
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
