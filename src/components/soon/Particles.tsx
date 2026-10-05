"use client";

import { useEffect, useRef } from "react";

// Polvere luminosa che sale lentamente, come nell'aria di un club illuminato.
// Canvas leggero: si ferma quando la scheda non è visibile o con "riduci movimento".
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.round(Math.min(90, (w * h) / 16000));
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 1.6,
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
        const twinkle = 0.6 + 0.4 * Math.sin(t / 600 + d.drift * 3);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 240, 214, ${d.a * twinkle * 0.8})`;
        ctx.shadowColor = "rgba(143, 220, 174, 0.7)";
        ctx.shadowBlur = d.r * 6;
        ctx.fill();
      }
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
