import { brand } from "@/content";
import Mark from "./Mark";

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
        <p className="hero__kicker script">{brand.heroKicker}</p>
        <h1 className="hero__word">{brand.heroWord}</h1>
        <p className="hero__tagline">{brand.tagline}</p>
        <div className="hero__mark"><Mark size={140} /></div>
      </div>
    </section>
  );
}
