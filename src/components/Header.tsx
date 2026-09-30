"use client";

import { useEffect, useState } from "react";
import { brand, menuHrefs, navHrefs } from "@/content";
import { setLang, useLang } from "@/i18n";
import Logo from "./Logo";

export default function Header() {
  const { lang, t } = useLang();
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
      <header className={`header ${scrolled ? "header--scrolled" : ""} ${open ? "header--menu" : ""}`}>
        <a href="#top" className="header__logo" aria-label={brand.name}>
          <Logo />
        </a>
        <nav className="header__nav">
          {navHrefs.map((href, i) => (
            <a key={i} href={href}>{t.nav[i]}</a>
          ))}
        </nav>
        <button className={`burger ${open ? "burger--open" : ""}`} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </header>

      <div className={`menu ${open ? "menu--open" : ""}`} onClick={() => setOpen(false)}>
        <ul>
          {menuHrefs.map((href, i) => (
            <li key={i} style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}>
              <a href={href}>{t.menu[i]}</a>
            </li>
          ))}
          {/* Mostra la lingua in cui passare: "IT" sul sito inglese, "ENG" su quello italiano.
              Il clic non chiude il menu, così il cambio si vede subito. */}
          <li className="menu__lang" style={{ transitionDelay: open ? `${80 + menuHrefs.length * 50}ms` : "0ms" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLang(lang === "en" ? "it" : "en");
              }}
            >
              {t.langSwitch}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
