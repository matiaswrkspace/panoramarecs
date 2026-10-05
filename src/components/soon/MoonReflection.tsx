"use client";

import { useEffect, useRef } from "react";

// Riflesso della luna sull'acqua, animato: righe di luce spezzate che scorrono
// piano di lato e brillano, con un'onda lenta che viaggia verso chi guarda.
// Leggero: disegna solo nella zona sotto la luna, ogni tratto è la copia di un
// tratto sfumato preparato una volta sola. Coordinate dello stesso viewBox 1600×900
// "a riempire" degli altri livelli, così resta allineato alla luna su ogni schermo.
const ROWS = 29;
const SEGS = 3;

export default function MoonReflection() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // tratto di luce: capsula orizzontale sfumata ai bordi, colore chiaro di luna
    const sprite = document.createElement("canvas");
    sprite.width = 128;
    sprite.height = 16;
    const sctx = sprite.getContext("2d")!;
    const gx = sctx.createLinearGradient(0, 0, 128, 0);
    gx.addColorStop(0, "rgba(227, 246, 234, 0)");
    gx.addColorStop(0.2, "rgba(227, 246, 234, 0.85)");
    gx.addColorStop(0.5, "rgba(240, 252, 244, 1)");
    gx.addColorStop(0.8, "rgba(227, 246, 234, 0.85)");
    gx.addColorStop(1, "rgba(227, 246, 234, 0)");
    sctx.fillStyle = gx;
    sctx.fillRect(0, 4, 128, 8);
    sctx.globalCompositeOperation = "destination-in";
    const gy = sctx.createLinearGradient(0, 0, 0, 16);
    gy.addColorStop(0, "rgba(0,0,0,0)");
    gy.addColorStop(0.5, "rgba(0,0,0,1)");
    gy.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = gy;
    sctx.fillRect(0, 0, 128, 16);

    // righe fisse (posizioni pseudo-casuali ma stabili)
    const rnd = (n: number) => Math.sin(n * 12.9898 + 78.233) * 0.5 + 0.5;
    const rows = Array.from({ length: ROWS }, (_, i) => {
      const y = 646 + i * 6;
      const k = 1 - (y - 646) / 205;
      return {
        y,
        k,
        h: 2 + rnd(i) * 2.5,
        alpha: 0.42 * k + 0.05,
        segs: Array.from({ length: SEGS }, (_, j) => ({
          pos: (j - 1) * 0.55 + (rnd(i * 7 + j) - 0.5) * 0.3, // posizione nella colonna (-1..1)
          len: 0.45 + rnd(i * 3 + j * 5) * 0.5, // lunghezza relativa
          speed: 0.18 + rnd(i * 11 + j) * 0.22, // scorrimento laterale lento
          phase: rnd(i * 13 + j * 3) * Math.PI * 2,
        })),
      };
    });

    let W = 0;
    let H = 0;
    let frame = 0;
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (ms: number) => {
      const t = ms / 1000;
      const s = Math.max(W / 1600, H / 900);
      const portrait = H > W;
      const sx = portrait ? 0.6 : 0.7; // l'acqua si restringe come il resto (vedi CSS)
      const X = (x: number) => W / 2 + (x - 800) * s;
      const Y = (y: number) => H / 2 + (y - 450) * s;
      ctx.clearRect(0, Y(640), W, H - Y(640));
      for (let i = 0; i < ROWS; i++) {
        const r = rows[i];
        const half = (385 * r.k ** 0.92 * sx) / 2; // metà larghezza della colonna di luce
        // onda lenta che viaggia verso chi guarda: ogni riga respira con un piccolo ritardo
        const wave = Math.sin(t * 0.9 - i * 0.55);
        const sway = Math.sin(t * 0.35 + i * 0.3) * 10 * sx; // la colonna ondeggia appena
        for (const g of r.segs) {
          const drift = Math.sin(t * g.speed + g.phase); // scorrimento laterale di ogni tratto
          const cx = 800 + sway + (g.pos + drift * 0.22) * half;
          const len = half * g.len * (0.85 + 0.15 * wave);
          const twinkle = 0.5 + 0.5 * Math.sin(t * (0.5 + g.speed) + g.phase * 1.7); // brillio lento
          const a = r.alpha * (0.5 + 0.3 * twinkle + 0.2 * wave);
          if (a <= 0.01) continue;
          ctx.globalAlpha = Math.min(1, a);
          // lo sprite sfuma ai bordi: lo allargo un po' perché la parte piena sia lunga "len"
          ctx.drawImage(sprite, X(cx - len * 0.65), Y(r.y) - r.h * s, len * 1.3 * s, r.h * 2 * s);
        }
      }
      ctx.globalAlpha = 1;
      if (!still) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const onVisibility = () => (document.hidden ? cancelAnimationFrame(frame) : start());
    const onResize = () => {
      resize();
      if (still) requestAnimationFrame(draw);
    };

    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="soon-layer soon-reflection-canvas" aria-hidden="true" />;
}
