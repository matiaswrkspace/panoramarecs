"use client";

import { useEffect, useState } from "react";
import { brand, menu, nav } from "@/content";
import Mark from "./Mark";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <a href="#top" className="header__logo" aria-label={brand.name}>
          <Mark />
        </a>
        <nav className="header__nav">
          {nav.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <button className={`burger ${open ? "burger--open" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </header>

      <div className={`menu ${open ? "menu--open" : ""}`} onClick={() => setOpen(false)}>
        <ul>
          {menu.map((l, i) => (
            <li key={l.label} style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
