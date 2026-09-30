"use client";

import { useEffect, useState } from "react";
import { brand, menuHrefs, navHrefs, type Lang, type Text } from "@/content";
import Logo from "./Logo";

type Props = { lang: Lang; nav: Text["nav"]; menu: Text["menu"]; langSwitch: string };

export default function Header({ lang, nav, menu, langSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(onScroll);
    };
    onScroll();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
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
            <a key={i} href={href}>{nav[i]}</a>
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
              <a href={href}>{menu[i]}</a>
            </li>
          ))}
          {/* Mostra la lingua in cui passare: "IT" sul sito inglese, "ENG" su quello italiano. */}
          <li className="menu__lang" style={{ transitionDelay: open ? `${80 + menuHrefs.length * 50}ms` : "0ms" }}>
            <a href={lang === "en" ? "/it" : "/"} hrefLang={lang === "en" ? "it" : "en"}>
              {langSwitch}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
