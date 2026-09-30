"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";

// Scorrimento orizzontale con snap, frecce e (opzionale) pallini.
// Con il mouse si trascina tenendo premuto; sul touch scorre nativamente.
type Labels = { prev: string; next: string; goTo: string };

export default function Carousel({ children, dots = false, className = "", labels }: { children: ReactNode[]; dots?: boolean; className?: string; labels: Labels }) {
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
    // Le fermate si ricalcolano solo quando cambiano le dimensioni:
    // durante lo scorrimento si confronta soltanto la posizione.
    let offsets: number[] = [];
    let max = 0;
    let frame = 0;
    const measure = () => {
      max = el.scrollWidth - el.clientWidth;
      offsets = [0];
      for (let i = 1; i < el.children.length; i++) {
        const o = Math.min(offsetOf(el, i), max);
        if (o - offsets[offsets.length - 1] < 2) break;
        offsets.push(o);
      }
      setStops(offsets.length);
      onScroll();
    };
    const onScroll = () => {
      frame = 0;
      const x = el.scrollLeft;
      let nearest = 0;
      for (let i = 1; i < offsets.length; i++) if (Math.abs(offsets[i] - x) < Math.abs(offsets[nearest] - x)) nearest = i;
      setIndex(nearest);
      setAtEnd(x >= max - 2);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(onScroll);
    };
    measure();
    el.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", schedule);
      ro.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(anim.current);
    };
  }, []);

  function offsetOf(el: HTMLDivElement, i: number) {
    const child = el.children[i] as HTMLElement;
    return child.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft);
  }

  // Animazione di scorrimento propria: parte alla velocità del gesto e rallenta
  // dolcemente (ease-out), invece dello "smooth" del browser che riparte da zero.
  // Lo snap resta spento durante l'animazione e si riaccende a posizione esatta.
  const anim = useRef(0);

  function stopAnim() {
    cancelAnimationFrame(anim.current);
    anim.current = 0;
  }

  function animateTo(el: HTMLDivElement, target: number, speed = 0) {
    stopAnim();
    const from = el.scrollLeft;
    const dist = target - from;
    // Con ease-out cubica la velocità iniziale è 3·dist/durata: scelgo la durata
    // in modo che coincida con quella del gesto (px/ms), entro limiti ragionevoli.
    const sameDirection = speed !== 0 && Math.sign(speed) === Math.sign(dist);
    const duration = Math.min(900, Math.max(380, sameDirection ? (3 * Math.abs(dist)) / Math.abs(speed) : 480));
    el.classList.add("carousel__track--animating");
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      el.scrollLeft = from + dist * (1 - (1 - t) ** 3);
      if (t < 1) {
        anim.current = requestAnimationFrame(step);
      } else {
        anim.current = 0;
        el.classList.remove("carousel__track--animating", "carousel__track--dragging");
      }
    };
    anim.current = requestAnimationFrame(step);
  }

  function nearestStop(el: HTMLDivElement, x: number) {
    const max = el.scrollWidth - el.clientWidth;
    let best = 0;
    for (let i = 0; i < el.children.length; i++) {
      const o = Math.min(offsetOf(el, i), max);
      if (Math.abs(o - x) < Math.abs(best - x)) best = o;
    }
    return best;
  }

  function goTo(i: number) {
    const el = track.current;
    if (el && el.children[i]) animateTo(el, Math.min(offsetOf(el, i), el.scrollWidth - el.clientWidth));
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    const el = track.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    // Afferrare durante un'animazione la ferma lì dov'è.
    if (anim.current) {
      stopAnim();
      el.classList.add("carousel__track--dragging");
    }
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
      // Velocità del gesto (px/ms, verso lo scorrimento), smussata per togliere il rumore del mouse.
      if (dt > 0) d.velocity = 0.7 * (-(ev.clientX - d.lastX) / dt) + 0.3 * d.velocity;
      d.lastX = ev.clientX;
      d.lastT = ev.timeStamp;
      el.scrollLeft = d.startScroll - dx;
    };

    const onUp = (ev: globalThis.PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const d = drag.current;
      d.active = false;
      if (!d.moved) {
        el.classList.remove("carousel__track--dragging");
        return;
      }
      // Se il mouse era fermo prima di rilasciare, niente slancio.
      const speed = ev.timeStamp - d.lastT > 80 ? 0 : d.velocity;
      // Slancio: la distanza in più cresce con la velocità del gesto.
      const projected = el.scrollLeft + speed * 220;
      animateTo(el, nearestStop(el, projected), speed);
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
              <button key={i} aria-label={`${labels.goTo} ${i + 1}`} className={i === index ? "active" : ""} onClick={() => goTo(i)} />
            ))}
          </div>
        )}
        <div className="carousel__arrows">
          <button aria-label={labels.prev} disabled={index === 0} onClick={() => goTo(Math.max(0, index - 1))}>‹</button>
          <button aria-label={labels.next} disabled={atEnd} onClick={() => goTo(Math.min(stops - 1, index + 1))}>›</button>
        </div>
      </div>
    </div>
  );
}
