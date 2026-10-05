import { brand } from "@/content";
import { crown, trunk } from "../PalmArt";
import Logo from "../Logo";
import Particles from "./Particles";
import "./soon.css";

// Pagina "coming soon": una sequenza animata da titoli di testa, tutta in CSS/SVG
// (nitida a ogni risoluzione, nessun file video da scaricare).
//
// Timeline (secondi): 0.2 si aprono le bande nere · 0.6 orizzonte · 1.2 sole e
// riflesso · 2.0 palme · 3.2 insegna neon · 4.2 laser · 4.8 SOON · 5.8 contatti.
// Poi resta viva: palme che ondeggiano, sole che pulsa, polvere luminosa, laser.

function Palm({ side }: { side: "left" | "right" }) {
  const c = crown([60, 62], 1);
  return (
    <svg viewBox="-40 -40 260 260" className={`soon-palm soon-palm--${side}`} aria-hidden="true">
      <g className="soon-palm__sway">
        <path d={trunk([118, 220], [104, 130], [60, 62])} className="soon-line soon-line--thin" />
        <path d="M118 220Q104 130 60 62" className="soon-line" />
        <g transform="translate(60 62) scale(1.45) translate(-60 -62)">
          <path d={c.blade} className="soon-line soon-leaf" />
          <path d={c.rib} className="soon-line soon-line--thin" />
          <circle cx="56" cy="70" r="3" className="soon-line" />
          <circle cx="64" cy="71" r="3" className="soon-line" />
        </g>
      </g>
    </svg>
  );
}

export default function SoonScene() {
  const stripes = [520, 548, 572, 593, 611, 626];
  const ripples = [640, 656, 676, 700, 728, 760, 796, 836];

  return (
    <main className="soon">
      {/* Cielo, sole al tramonto, orizzonte e riflesso sull'acqua */}
      <svg className="soon-sky" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="soon-sky" cx="50%" cy="62%" r="75%">
            <stop offset="0" stopColor="#0c3a26" />
            <stop offset=".45" stopColor="#05170f" />
            <stop offset="1" stopColor="#010302" />
          </radialGradient>
          <linearGradient id="soon-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9ffec" />
            <stop offset=".55" stopColor="#39ff8f" />
            <stop offset="1" stopColor="#0f8a4f" />
          </linearGradient>
          <radialGradient id="soon-halo">
            <stop offset="0" stopColor="#39ff8f" stopOpacity=".35" />
            <stop offset="1" stopColor="#39ff8f" stopOpacity="0" />
          </radialGradient>
          <clipPath id="soon-above">
            <rect x="0" y="0" width="1600" height="640" />
          </clipPath>
          <clipPath id="soon-disc">
            <circle cx="800" cy="600" r="240" />
          </clipPath>
          <linearGradient id="soon-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#39ff8f" stopOpacity=".55" />
            <stop offset="1" stopColor="#39ff8f" stopOpacity="0" />
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
                <rect key={y} x="540" y={y - 4 - i} width="520" height={4 + i * 1.8} fill="#03110a" />
              ))}
            </g>
            <circle cx="800" cy="600" r="240" fill="none" stroke="#b8ffd9" strokeOpacity=".5" strokeWidth="1.5" />
          </g>
        </g>
        </g>

        <line x1="0" y1="640" x2="1600" y2="640" className="soon-horizon" />

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
        </g>
      </svg>

      {/* Laser dal soffitto */}
      <div className="soon-lasers" aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <Particles />

      <Palm side="left" />
      <Palm side="right" />

      <div className="soon-content">
        <Logo as="h1" className="soon-logo" />
        <p className="soon-word" aria-label="Soon">
          {"SOON".split("").map((l, i) => (
            <span key={i} style={{ animationDelay: `${4.8 + i * 0.09}s` }}>{l}</span>
          ))}
        </p>
      </div>

      {/* Riga d'informazioni in basso, sull'acqua, come su un poster */}
      <div className="soon-info">
        <p className="soon-sub">
          <span>Il nuovo sito sta arrivando</span>
          <span className="soon-sub__dot" aria-hidden="true">·</span>
          <span>The new website is coming</span>
        </p>
        <p className="soon-contacts">
          <span>Brescia, Italia</span>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </p>
      </div>

      {/* Bande cinematografiche, grana e vignettatura */}
      <div className="soon-bars" aria-hidden="true"><i /><i /></div>
      <div className="soon-grain" aria-hidden="true" />
    </main>
  );
}
