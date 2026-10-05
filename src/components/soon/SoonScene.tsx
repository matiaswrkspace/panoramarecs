import { brand } from "@/content";
import Logo from "../Logo";
import Particles from "./Particles";
import "./soon.css";

// Pagina "coming soon": titoli di testa da film anni '70-'80 visti su videocassetta,
// tutto in CSS/SVG (nitido a ogni risoluzione, nessun file video da scaricare).
//
// Apertura: la scena, già composta, emerge dal nero in un'unica ripresa (0.2–3.6 s:
// carrellata in avanti, messa a fuoco, luce che sale) · 2.6 si accende l'insegna ·
// 3.6 arriva SOON · 4.8 contatti.
// Poi resta viva a 124 BPM: il riflesso ondeggia piano sull'acqua, il sole pulsa sul battere,
// la spia rossa "Recording" lampeggia. Nessun tremolio: solo colori e righe da nastro VHS.
const BPM = 124;

// Riflesso del sole: bande luminose sempre più strette e deboli verso il basso,
// spezzate da un'ondulazione animata. Posizioni fisse (niente casuale al render).
const HORIZON = 640;
// Misura intermedia in larghezza; in lunghezza sfuma a circa due terzi dell'acqua,
// così sotto i contatti resta acqua scura.
const reflection = Array.from({ length: 29 }, (_, i) => {
  const y = 646 + i * 6;
  const k = 1 - (y - 646) / 205;
  const jitter = Math.sin(i * 12.9898) * 0.5 + 0.5; // pseudo-casuale ma stabile
  const w = Math.max(21, 385 * k ** 0.92 * (0.58 + jitter * 0.55));
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
            <radialGradient id="soon-sun" cx="50%" cy="42%" r="58%">
              <stop offset="0" stopColor="#fbfff4" />
              <stop offset=".35" stopColor="#d6fbe4" />
              <stop offset=".72" stopColor="#7ee9b4" />
              <stop offset="1" stopColor="#2fae74" />
            </radialGradient>
            {/* bagliore stretto attorno al disco */}
            <radialGradient id="soon-corona">
              <stop offset=".5" stopColor="#d6fbe4" stopOpacity=".55" />
              <stop offset=".62" stopColor="#7ee9b4" stopOpacity=".22" />
              <stop offset="1" stopColor="#4fe8a0" stopOpacity="0" />
            </radialGradient>
            {/* superficie: macchie leggere, come visto attraverso l'atmosfera */}
            <filter id="soon-surface" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" seed="11" />
              <feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 -1.4 1.05" />
            </filter>
            {/* foschia dove il sole tocca l'acqua */}
            <radialGradient id="soon-haze">
              <stop offset="0" stopColor="#e6fff1" stopOpacity=".42" />
              <stop offset=".4" stopColor="#9ef0c6" stopOpacity=".16" />
              <stop offset="1" stopColor="#4fe8a0" stopOpacity="0" />
            </radialGradient>
            <filter id="soon-blur-stripes" x="-5%" y="-50%" width="110%" height="200%">
              <feGaussianBlur stdDeviation="0 1.2" />
            </filter>
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
                <animate attributeName="baseFrequency" dur="20s" values="0.006 0.09;0.0075 0.105;0.006 0.09" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" />
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
                <circle cx="800" cy="600" r="480" fill="url(#soon-corona)" />
                <g clipPath="url(#soon-disc)">
                  <circle cx="800" cy="600" r="240" fill="url(#soon-sun)" opacity=".82" />
                  <rect x="560" y="360" width="480" height="480" filter="url(#soon-surface)" opacity=".35" />
                  {/* tagli orizzontali da tramonto retrò, sfumati e sempre più spessi verso l'orizzonte */}
                  <g filter="url(#soon-blur-stripes)">
                    {stripes.map((y, i) => (
                      <rect key={y} x="540" y={y - 4 - i} width="520" height={3.5 + i * 1.7} fill="#06130c" opacity=".88" />
                    ))}
                  </g>
                </g>
              </g>
            </g>
          </g>

          <line x1="0" y1={HORIZON} x2="1600" y2={HORIZON} className="soon-horizon" />
          <g className="soon-sun-wrap">
            <ellipse cx="800" cy={HORIZON} rx="520" ry="46" fill="url(#soon-haze)" />
          </g>

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
              <span key={i}>{l}</span>
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
        <span className="soon-hud__rec"><i aria-hidden="true" />Recording</span>
      </header>
    </main>
  );
}
