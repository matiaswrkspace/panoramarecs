import { brand } from "@/content";
import Logo from "./Logo";

export default function Hero() {
  return (
    <section className="hero" id="top">
      {/* Sfondo segnaposto: fasci di luce animati. Può diventare un <video>. */}
      <div className="hero__bg" aria-hidden="true">
        <div className="beam beam--1" />
        <div className="beam beam--2" />
        <div className="beam beam--3" />
        <div className="beam beam--4" />
        <div className="laser" />
        <div className="laser laser--2" />
        <div className="laser laser--3" />
      </div>
      <div className="hero__content">
        <Logo as="h1" className="hero__logo" />
        <p className="hero__subtitle">{brand.logoSubtitle}</p>
        <p className="hero__tagline">{brand.tagline}</p>
      </div>
    </section>
  );
}
