import { brand, events, experiences, formatDay, socials, stayAndPlay, text, type Lang } from "@/content";
import Carousel from "@/components/Carousel";
import CookieBanner from "@/components/CookieBanner";
import Familia from "@/components/Familia";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Logo from "@/components/Logo";
import PalmArt from "@/components/PalmArt";
import Visual from "@/components/Visual";

export default function Home({ lang }: { lang: Lang }) {
  const t = text[lang];

  return (
    <>
      <Header lang={lang} nav={t.nav} menu={t.menu} langSwitch={t.langSwitch} />
      <main>
        <Hero tagline={t.tagline} />

        <section className="events" id="events">
          <a href="#events" className="promo">
            <strong>{t.promoTitle}</strong>
            <small>{t.promoNote}</small>
          </a>
          <h2 className="section-title section-title--xl">{t.upcoming}</h2>
          <Carousel dots labels={{ prev: t.prev, next: t.next, goTo: t.goTo }}>
            {events.map((e) => (
              <article className="event" key={e.title}>
                <Visual item={e} label={e.title} className="event__poster" />
                <p className="event__date">{formatDay(e.day, lang)} | {e.hours}</p>
                <h3 className="event__title">{e.title}</h3>
                <p className="event__lineup">{t.lineup.toUpperCase()}: {e.lineup}</p>
                <div className="event__actions">
                  <a href="#" className="pill pill--outline">{t.ticketsFrom} €{e.ticketsFrom}</a>
                  <a href="#" className="pill pill--solid">
                    {t.vipFrom} €{e.vipFrom}
                    <small>{t.vipNote}</small>
                  </a>
                </div>
              </article>
            ))}
          </Carousel>
        </section>

        <section className="experiences" id="experiences">
          {experiences.map((x, i) => (
            <a href={x.href} className="experience" key={i}>
              <h2 className="script">{t.experiences[i]}</h2>
              {x.image ? (
                <Visual item={{ image: x.image, tint: ["#000", "#000"] }} className="experience__art" />
              ) : (
                <PalmArt variant={x.art} className="experience__art" />
              )}
            </a>
          ))}
        </section>

        <section className="stay" id="stay">
          <h2 className="section-title">{t.stay}</h2>
          <Carousel dots className="carousel--flush" labels={{ prev: t.prev, next: t.next, goTo: t.goTo }}>
            {stayAndPlay.map((s, i) => (
              <article className="stay__card" key={s.title}>
                <Visual item={s} className="stay__img" />
                <span className="stay__num stay__num--top">{i + 1}</span>
                <h3 className="stay__title script">{s.title}</h3>
                <span className="stay__num stay__num--bottom">{i + 1}</span>
              </article>
            ))}
          </Carousel>
        </section>

        <Familia subtitle={t.familiaSubtitle} />
      </main>

      <footer className="footer" id="footer">
        <div className="footer__brand">
          <Logo as="p" className="footer__logo" />
          <p>{t.address}</p>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </div>
        <div className="footer__cols">
          <ul>{socials.map((s) => <li key={s}><a href="#">{s}</a></li>)}</ul>
          <ul>{t.footerLinks.map((s) => <li key={s}><a href="#">{s}</a></li>)}</ul>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} {brand.name}. {t.rights}</p>
      </footer>

      <CookieBanner c={t.cookie} />
    </>
  );
}
