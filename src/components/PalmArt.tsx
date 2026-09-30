// Illustrazioni neon a tema palme per le card Vip e Cena.
// Disegnate in SVG: leggere, nitide a ogni dimensione, colori dal CSS.

type P = [number, number];
const r = (n: number) => Math.round(n * 10) / 10;

function bezier(p0: P, c: P, p1: P, t: number): { pt: P; n: P } {
  const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0];
  const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1];
  const tx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
  const ty = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
  const m = Math.hypot(tx, ty) || 1;
  return { pt: [x, y], n: [-ty / m, tx / m] };
}

// Una fronda: lama curva e affusolata con il bordo frastagliato (le foglioline),
// più la nervatura centrale.
function frond(p0: P, c: P, p1: P, width = 9, teeth = 7) {
  const steps = teeth * 2;
  const upper: string[] = [];
  const lower: string[] = [];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const { pt, n } = bezier(p0, c, p1, t);
    const w = width * Math.sin(Math.PI * t) ** 0.6 * (1 - 0.3 * t) * (i % 2 ? 1 : 0.45);
    upper.push(`${r(pt[0] + n[0] * w)} ${r(pt[1] + n[1] * w)}`);
    lower.push(`${r(pt[0] - n[0] * w * 0.9)} ${r(pt[1] - n[1] * w * 0.9)}`);
  }
  const blade = `M${p0[0]} ${p0[1]}L${upper.join("L")}L${p1[0]} ${p1[1]}L${lower.reverse().join("L")}Z`;
  const rib = `M${p0[0]} ${p0[1]}Q${c[0]} ${c[1]} ${r(p1[0])} ${r(p1[1])}`;
  return { blade, rib };
}

// Chioma di una palma attorno al punto `top`, con fronde arcuate che ricadono.
function crown(top: P, flip = 1) {
  const ends: P[] = [[-56, 30], [-54, -6], [-24, -36], [14, -40], [40, -16]];
  const parts = ends.map(([dx, dy]) => {
    const end: P = [top[0] + dx * flip, top[1] + dy];
    const ctrl: P = [top[0] + dx * 0.45 * flip, top[1] + dy * 0.45 - 20];
    return frond(top, ctrl, end, 8, 6);
  });
  return { blade: parts.map((p) => p.blade).join(""), rib: parts.map((p) => p.rib).join("") };
}

// Tronco leggermente curvo con gli anelli tipici della palma.
function trunk(base: P, ctrl: P, top: P) {
  let d = `M${base[0]} ${base[1]}Q${ctrl[0]} ${ctrl[1]} ${top[0]} ${top[1]}`;
  for (let i = 1; i < 8; i++) {
    const t = i / 8;
    const x = (1 - t) ** 2 * base[0] + 2 * (1 - t) * t * ctrl[0] + t ** 2 * top[0];
    const y = (1 - t) ** 2 * base[1] + 2 * (1 - t) * t * ctrl[1] + t ** 2 * top[1];
    d += `M${r(x - 3.5)} ${r(y + 1)}L${r(x + 3.5)} ${r(y - 1)}`;
  }
  return d;
}

function Sun({ id }: { id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-sun`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#39ff8f" stopOpacity=".45" />
          <stop offset="1" stopColor="#39ff8f" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <circle cx="100" cy="112" r="56" />
        </clipPath>
      </defs>
      <circle cx="100" cy="112" r="56" fill={`url(#${id}-sun)`} className="palm-art__soft" />
      {/* strisce da tramonto nella parte bassa del sole */}
      <g clipPath={`url(#${id}-clip)`} className="palm-art__soft">
        {[128, 138, 147, 155, 162].map((y, i) => (
          <line key={y} x1="30" x2="170" y1={y} y2={y} strokeWidth={4 - i * 0.6} className="palm-art__cut" />
        ))}
      </g>
      <circle cx="100" cy="112" r="56" className="palm-art__line palm-art__soft" />
    </>
  );
}

function Vip() {
  return (
    <>
      <Sun id="vip" />
      <path d={trunk([96, 192], [88, 130], [62, 78])} className="palm-art__line palm-art__thin" />
      <path d="M96 192Q88 130 62 78M104 192Q112 130 138 78" className="palm-art__line" />
      <path d={trunk([104, 192], [112, 130], [138, 78])} className="palm-art__line palm-art__thin" />
      {[crown([62, 78], 1), crown([138, 78], -1)].map((c, i) => (
        <g key={i}>
          <path d={c.blade} className="palm-art__line palm-art__leaf" />
          <path d={c.rib} className="palm-art__line palm-art__thin" />
        </g>
      ))}
      <circle cx="58" cy="86" r="3.2" className="palm-art__line" />
      <circle cx="66" cy="87" r="3.2" className="palm-art__line" />
      <circle cx="142" cy="86" r="3.2" className="palm-art__line" />
      <circle cx="134" cy="87" r="3.2" className="palm-art__line" />
      {/* scintilla sopra le chiome */}
      <path d="M100 18Q102 32 114 34Q102 36 100 50Q98 36 86 34Q98 32 100 18Z" className="palm-art__fill" />
    </>
  );
}

function Dine() {
  return (
    <>
      <Sun id="dine" />
      {/* fronda che esce dal bordo del bicchiere */}
      {[frond([118, 98], [124, 44], [172, 26], 12, 8), frond([112, 98], [96, 58], [70, 40], 8, 6)].map((f, i) => (
        <g key={i}>
          <path d={f.blade} className="palm-art__line palm-art__leaf" />
          <path d={f.rib} className="palm-art__line palm-art__thin" />
        </g>
      ))}
      {/* coppa da cocktail */}
      <path d="M58 98H142Q138 132 100 136Q62 132 58 98Z" className="palm-art__line" />
      <path d="M66 108Q100 114 134 108" className="palm-art__line palm-art__thin" />
      <path d="M100 136V172" className="palm-art__line" />
      <ellipse cx="100" cy="174" rx="26" ry="5" className="palm-art__line" />
      {/* bollicine */}
      <circle cx="86" cy="120" r="2.2" className="palm-art__fill" />
      <circle cx="104" cy="124" r="1.8" className="palm-art__fill" />
      <circle cx="116" cy="117" r="1.4" className="palm-art__fill" />
      {/* fetta di lime sul bordo */}
      <path d="M56 98A14 14 0 0 1 72 84" className="palm-art__line" />
      <path d="M58 96L70 86M62 97L66 88" className="palm-art__line palm-art__thin" />
    </>
  );
}

export default function PalmArt({ variant, className = "" }: { variant: "vip" | "dine"; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`palm-art ${className}`} aria-hidden="true">
      {variant === "vip" ? <Vip /> : <Dine />}
    </svg>
  );
}
