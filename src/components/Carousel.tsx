"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";

// Scorrimento orizzontale con snap, frecce e (opzionale) pallini.
// Con il mouse si trascina tenendo premuto; sul touch scorre nativamente.
export default function Carousel({ children, dots = false, className = "" }: { children: ReactNode[]; dots?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0, lastX: 0, lastT: 0, velocity: 0 });

  // Le "fermate" sono le posizioni in cui il carosello può davvero fermarsi:
  // le ultime card non possono andare a sinistra oltre la fine, quindi
  // condividono l'ultima fermata. Un pallino per ogni fermata.
  const [stops, setStops] = useState(1);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      let count = 1;
      while (count < el.children.length && offsetOf(el, count) < max - 2) count++;
      if (count < el.children.length && max > 2) count++;
      let nearest = 0;
      for (let i = 1; i < count; i++) {
        const o = Math.min(offsetOf(el, i), max);
        if (Math.abs(o - el.scrollLeft) < Math.abs(Math.min(offsetOf(el, nearest), max) - el.scrollLeft)) nearest = i;
      }
      setStops(count);
      setIndex(nearest);
      setAtEnd(el.scrollLeft >= max - 2);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function offsetOf(el: HTMLDivElement, i: number) {
    const child = el.children[i] as HTMLElement;
    return child.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft);
  }

  function goTo(i: number) {
    const el = track.current;
    if (el && el.children[i]) el.scrollTo({ left: Math.min(offsetOf(el, i), el.scrollWidth - el.clientWidth), behavior: "smooth" });
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const el = track.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft, lastX: e.clientX, lastT: e.timeStamp, velocity: 0 };

    const onMove = (ev: globalThis.PointerEvent) => {
      const d = drag.current;
      const dx = ev.clientX - d.startX;
      if (!d.moved && Math.abs(dx) > 5) {
        d.moved = true;
        el.classList.add("carousel__track--dragging");
      }
      if (!d.moved) return;
      const dt = ev.timeStamp - d.lastT;
      if (dt > 0) d.velocity = (ev.clientX - d.lastX) / dt;
      d.lastX = ev.clientX;
      d.lastT = ev.timeStamp;
      el.scrollLeft = d.startScroll - dx;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const d = drag.current;
      d.active = false;
      if (!d.moved) return;
      // Slancio: una trascinata veloce porta avanti di qualche card in più.
      const target = el.scrollLeft - d.velocity * 250;
      let nearest = 0;
      for (let i = 1; i < el.children.length; i++) {
        if (Math.abs(offsetOf(el, i) - target) < Math.abs(offsetOf(el, nearest) - target)) nearest = i;
      }
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: Math.min(offsetOf(el, nearest), max), behavior: "smooth" });
      // Lo snap torna attivo quando lo scorrimento animato è finito.
      setTimeout(() => el.classList.remove("carousel__track--dragging"), 450);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  // Dopo una trascinata il rilascio non deve aprire il link sotto il mouse.
  function onClickCapture(e: MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  return (
    <div className={`carousel ${className}`}>
      <div
        className="carousel__track"
        ref={track}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <div className="carousel__controls">
        {dots && (
          <div className="carousel__dots">
            {Array.from({ length: stops }, (_, i) => (
              <button key={i} aria-label={`Vai a ${i + 1}`} className={i === index ? "active" : ""} onClick={() => goTo(i)} />
            ))}
          </div>
        )}
        <div className="carousel__arrows">
          <button aria-label="Precedente" disabled={index === 0} onClick={() => goTo(Math.max(0, index - 1))}>‹</button>
          <button aria-label="Successivo" disabled={atEnd} onClick={() => goTo(Math.min(stops - 1, index + 1))}>›</button>
        </div>
      </div>
    </div>
  );
}
