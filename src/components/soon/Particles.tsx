"use client";

import { useEffect, useRef } from "react";

// Polvere luminosa che sale lentamente, come nell'aria di un club illuminato.
// Leggera: ogni granello è la copia di un puntino sfumato disegnato una volta sola
// (niente ombre calcolate a ogni fotogramma), risoluzione contenuta, si ferma quando
// la scheda non è visibile o con "riduci movimento".
export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    // puntino luminoso con alone, disegnato una volta sola
    const SPRITE = 32;
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = SPRITE;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
    g.addColorStop(0, "rgba(225, 255, 238, 1)");
    g.addColorStop(0.18, "rgba(200, 255, 225, 0.9)");
    g.addColorStop(0.45, "rgba(79, 232, 160, 0.28)");
    g.addColorStop(1, "rgba(79, 232, 160, 0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, SPRITE, SPRITE);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.round(Math.min(70, (w * h) / 20000));
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 4 + Math.random() * 9, // diametro del puntino con il suo alone
      vy: 0.08 + Math.random() * 0.35,
      drift: Math.random() * Math.PI * 2,
      a: 0.15 + Math.random() * 0.55,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y -= d.vy;
        d.x += Math.sin(t / 1800 + d.drift) * 0.15;
        if (d.y < -10) {
          d.y = h + 10;
          d.x = Math.random() * w;
        }
        ctx.globalAlpha = d.a * (0.6 + 0.4 * Math.sin(t / 600 + d.drift * 3));
        ctx.drawImage(sprite, d.x - d.size / 2, d.y - d.size / 2, d.size, d.size);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="soon-particles" aria-hidden="true" />;
}
