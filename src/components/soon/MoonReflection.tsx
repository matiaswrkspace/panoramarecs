"use client";

import { useEffect, useRef } from "react";

// Riflesso della luna sull'acqua, animato come nella realtà: una scia di tante
// scintille che si accendono e si spengono sulle onde, con creste di luce che
// rotolano lente verso chi guarda e il bagliore morbido della luna riflessa.
// Leggero: disegna solo nella zona sotto la luna, ogni tratto è la copia di un
// tratto sfumato preparato una volta sola. Coordinate dello stesso viewBox 1600×900
// "a riempire" degli altri livelli, così resta allineato alla luna su ogni schermo.

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

    // Scia di scintille: tante, minuscole e fitte all'orizzonte, più grandi e rade
    // verso chi guarda; la scia si allarga avvicinandosi (prospettiva).
    const rnd = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    const COUNT = 440;
    const glints = Array.from({ length: COUNT }, (_, i) => {
      const d = rnd(i) ** 1.35; // profondità 0 = orizzonte, 1 = fine della scia
      const u = (rnd(i + 1000) + rnd(i + 2000) + rnd(i + 3000)) / 3 - 0.5; // più fitte al centro
      return {
        d,
        u: u * 2, // posizione nella larghezza della scia (-1..1)
        len: 0.6 + rnd(i + 4000) * 0.9,
        rate: 0.5 + rnd(i + 5000) * 0.9, // ritmo con cui la scintilla si accende e si spegne
        phase: rnd(i + 6000) * Math.PI * 2,
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
      const top = Y(640);
      ctx.clearRect(0, top, W, H - top);

      // bagliore morbido dell'immagine della luna riflessa, che respira piano
      const glowW = 240 * sx * s;
      const glowH = 120 * s;
      const glow = ctx.createRadialGradient(X(800), top, 0, X(800), top, glowW);
      glow.addColorStop(0, "rgba(220, 245, 230, 0.26)");
      glow.addColorStop(0.5, "rgba(190, 235, 210, 0.07)");
      glow.addColorStop(1, "rgba(190, 235, 210, 0)");
      ctx.save();
      ctx.translate(X(800), top);
      ctx.scale(1, glowH / glowW);
      ctx.translate(-X(800), -top);
      ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 0.6);
      ctx.fillStyle = glow;
      ctx.fillRect(X(800) - glowW, top, glowW * 2, glowW);
      ctx.restore();

      // scintille
      for (const g of glints) {
        const y = 646 + g.d * 170; // fino a circa due terzi dell'acqua
        const half = 120 * sx * (0.55 + 0.75 * g.d); // la scia si allarga verso chi guarda
        const crest = 0.55 + 0.45 * Math.sin(t * 1.0 - g.d * 9); // creste che rotolano verso di noi
        const flash = Math.max(0, Math.sin(t * g.rate + g.phase)) ** 2; // si accende e si spegne
        const center = Math.exp(-(g.u * g.u) * 1.6); // più luce al centro della scia
        const fade = g.d < 0.7 ? 1 : 1 - (g.d - 0.7) / 0.3; // sfuma in fondo
        const a = 1.25 * flash * crest * center * fade * (0.95 - g.d * 0.35);
        if (a < 0.02) continue;
        const x = 800 + g.u * half + Math.sin(t * 0.45 + g.d * 7 + g.phase) * 5 * (0.4 + g.d);
        const len = (5 + 26 * g.d) * g.len;
        const h = 0.7 + 2.2 * g.d;
        ctx.globalAlpha = Math.min(1, a);
        ctx.drawImage(sprite, X(x - len * 0.65), Y(y) - h * s, len * 1.3 * s, h * 2 * s);
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
