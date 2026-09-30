import { brand, events, experiences, footer, promo, stayAndPlay } from "@/content";
import Carousel from "@/components/Carousel";
import CookieBanner from "@/components/CookieBanner";
import Familia from "@/components/Familia";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Logo from "@/components/Logo";
import Mark from "@/components/Mark";
import Visual from "@/components/Visual";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="events" id="events">
          <a href="#events" className="promo">
            <strong>{promo.title}</strong>
            <small>{promo.note}</small>
          </a>
          <h2 className="section-title section-title--xl">Upcoming events</h2>
          <Carousel dots>
            {events.map((e) => (
              <article className="event" key={e.title}>
                <Visual item={e} label={e.title} className="event__poster" />
                <p className="event__date">{e.date}</p>
                <h3 className="event__title">{e.title}</h3>
                <p className="event__lineup">LINEUP: {e.lineup}</p>
                <div className="event__actions">
                  <a href="#" className="pill pill--outline">Buy tickets from €{e.ticketsFrom}</a>
                  <a href="#" className="pill pill--solid">
                    Book VIP zone from €{e.vipFrom}
                    <small>Receive complimentary drinks equal to the booking value</small>
                  </a>
                </div>
              </article>
            ))}
          </Carousel>
        </section>

        <section className="experiences" id="experiences">
          {experiences.map((x) => (
            <a href={x.href} className="experience" key={x.title}>
              <span className="experience__mark"><Mark size={46} /></span>
              <h2 className="script">{x.title}</h2>
              <Visual item={x} className="experience__art" />
            </a>
          ))}
        </section>

        <section className="stay" id="stay">
          <h2 className="section-title">Stay &amp; Play</h2>
          <Carousel className="carousel--flush">
            {stayAndPlay.map((s, i) => (
              <article className="stay__card" key={s.title}>
                <Visual item={s} className="stay__img" />
                <span className="stay__mark"><Mark size={48} /></span>
                <span className="stay__num stay__num--top">{i + 1}</span>
                <h3 className="stay__title script">{s.title}</h3>
                <span className="stay__num stay__num--bottom">{i + 1}</span>
              </article>
            ))}
          </Carousel>
        </section>

        <Familia />
      </main>

      <footer className="footer" id="footer">
        <div className="footer__brand">
          <Logo as="p" className="footer__logo" />
          <p>{footer.address}</p>
          <a href={`mailto:${footer.email}`}>{footer.email}</a>
        </div>
        <div className="footer__cols">
          <ul>{footer.socials.map((s) => <li key={s}><a href="#">{s}</a></li>)}</ul>
          <ul>{footer.links.map((s) => <li key={s}><a href="#">{s}</a></li>)}</ul>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
      </footer>

      <CookieBanner />
    </>
  );
}
