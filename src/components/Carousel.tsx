"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Scorrimento orizzontale con snap, frecce e (opzionale) pallini.
export default function Carousel({ children, dots = false, className = "" }: { children: ReactNode[]; dots?: boolean; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.children[0] as HTMLElement | undefined;
      const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : 1;
      setIndex(Math.round(el.scrollLeft / step));
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(i: number) {
    const el = track.current;
    const child = el?.children[i] as HTMLElement | undefined;
    if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  }

  return (
    <div className={`carousel ${className}`}>
      <div className="carousel__track" ref={track}>
        {children}
      </div>
      <div className="carousel__controls">
        {dots && (
          <div className="carousel__dots">
            {children.map((_, i) => (
              <button key={i} aria-label={`Vai a ${i + 1}`} className={i === index ? "active" : ""} onClick={() => goTo(i)} />
            ))}
          </div>
        )}
        <div className="carousel__arrows">
          <button aria-label="Precedente" disabled={index === 0} onClick={() => goTo(Math.max(0, index - 1))}>‹</button>
          <button aria-label="Successivo" disabled={atEnd} onClick={() => goTo(Math.min(children.length - 1, index + 1))}>›</button>
        </div>
      </div>
    </div>
  );
}
