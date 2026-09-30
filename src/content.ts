// Tutti i contenuti del sito stanno qui: testi, eventi e immagini.
// Per sostituire un segnaposto con una foto, mettila in /public/images
// e scrivi il percorso nel campo `image` (es. "/images/evento-1.jpg").

export type Placeholder = { image?: string; tint: [string, string] };

export const brand = { name: "Panorama", email: "info@panoramarecs.com" };

// Collegamenti di barra e menu; le etichette sono in `text` qui sotto.
export const navHrefs = ["#events", "#experiences", "#experiences", "#familia"];
export const menuHrefs = ["#events", "#experiences", "#experiences", "#stay", "#familia", "#footer"];

export type Event = Placeholder & {
  day: string; // AAAA-MM-GG, il giorno della settimana si calcola da solo
  hours: string;
  title: string;
  lineup: string;
  ticketsFrom: number;
  vipFrom: number;
};

export const events: Event[] = [
  { day: "2026-09-30", hours: "23:00 - 06:00", title: "Opening Night", lineup: "Artista A, Artista B, Artista C", ticketsFrom: 30, vipFrom: 175, tint: ["#d9f5e6", "#6fae8c"] },
  { day: "2026-10-01", hours: "23:00 - 06:00", title: "Disco Fever | Closing Party", lineup: "Artista D, Artista E, Artista F, Artista G", ticketsFrom: 30, vipFrom: 150, tint: ["#16c47a", "#04301c"] },
  { day: "2026-10-02", hours: "23:00 - 06:00", title: "Deep Sessions", lineup: "Artista H, Artista I, Artista L", ticketsFrom: 85, vipFrom: 450, tint: ["#1e5a50", "#03110e"] },
  { day: "2026-10-03", hours: "23:00 - 06:00", title: "Season Closing Party", lineup: "Artista M, Artista N, Artista O", ticketsFrom: 30, vipFrom: 220, tint: ["#8ee04a", "#1a3a06"] },
  { day: "2026-10-04", hours: "23:00 - 06:00", title: "Sunday Social", lineup: "Artista P, Artista Q", ticketsFrom: 25, vipFrom: 150, tint: ["#1f8a70", "#062a22"] },
  { day: "2026-10-08", hours: "23:00 - 06:00", title: "House Anthems", lineup: "Artista R, Artista S", ticketsFrom: 30, vipFrom: 175, tint: ["#d63a7a", "#3a0822"] },
  { day: "2026-10-09", hours: "23:00 - 06:00", title: "Techno Rituals", lineup: "Artista T, Artista U, Artista V", ticketsFrom: 40, vipFrom: 300, tint: ["#555", "#0a0a0a"] },
  { day: "2026-10-10", hours: "23:00 - 06:00", title: "Grand Finale", lineup: "Artista Z, Special guests", ticketsFrom: 50, vipFrom: 400, tint: ["#c8a24a", "#3a2a06"] },
];

// I titoli di queste due card sono in `text` (experiences).
// `art` sceglie l'illustrazione a palme; con `image` si usa invece una foto.
export const experiences: { href: string; art: "vip" | "dine"; image?: string }[] = [
  { href: "#", art: "vip" },
  { href: "#", art: "dine" },
];

export const stayAndPlay: (Placeholder & { title: string })[] = [
  { title: "Beach Club", tint: ["#5fb2d9", "#e8d8b0"] },
  { title: "Icons", tint: ["#6b7a2a", "#15180a"] },
  { title: "Restaurante", tint: ["#c7802e", "#2a1506"] },
  { title: "Hotel", tint: ["#b86a6a", "#1a1020"] },
  { title: "Collection", tint: ["#7d6bb8", "#120d24"] },
];

export const familia = {
  title: "La Familia",
  items: [
    { title: "Beach Club", tint: ["#9fd3e6", "#e9dcbc"] },
    { title: "Hotel", tint: ["#b86a6a", "#1a1020"] },
    { title: "Restaurante", tint: ["#c7802e", "#2a1506"] },
    { title: "Icons", tint: ["#6b7a2a", "#15180a"] },
    { title: "Collection", tint: ["#7d6bb8", "#120d24"] },
    { title: "New York", tint: ["#4a5a7a", "#0b0f1c"] },
  ] as (Placeholder & { title: string })[],
};

export const socials = ["Instagram", "TikTok", "Facebook", "YouTube", "Spotify"];

// Tutti i testi del sito nelle due lingue. Nomi propri (eventi, artisti,
// locali) restano uguali e stanno nei dati sopra.
const en = {
  langSwitch: "IT",
  tagline: "Electronic music",
  nav: ["Buy tickets", "Book VIP zone", "Restaurant", "Collection"],
  menu: ["Events", "VIP", "Restaurant", "Stay & Play", "La Familia", "Contact"],
  promoTitle: "Save up to 70% on drinks & water",
  promoNote: "*Available only online",
  upcoming: "Upcoming events",
  lineup: "Lineup",
  ticketsFrom: "Buy tickets from",
  vipFrom: "Book VIP zone from",
  vipNote: "Receive complimentary drinks equal to the booking value",
  experiences: ["Vip", "Dine"],
  stay: "Stay & Play",
  familiaSubtitle: "Become a part of the family",
  address: "Italy, Brescia",
  footerLinks: ["Privacy policy", "Cookie policy", "Terms & conditions", "Work with us"],
  rights: "All rights reserved.",
  prev: "Previous",
  next: "Next",
  goTo: "Go to",
  cookie: {
    title: "Before the night starts",
    body: "We use cookies to make the site work, remember your preferences and understand how it is used. Choose what to allow.",
    policy: "Cookie policy",
    customise: "Customise",
    categories: ["Necessary", "Preferences", "Statistics", "Marketing"],
    reject: "Deny",
    acceptSelected: "Allow selection",
    acceptAll: "Allow all",
  },
};

const it: typeof en = {
  langSwitch: "ENG",
  tagline: "Musica elettronica",
  nav: ["Biglietti", "Prenota area VIP", "Ristorante", "Collection"],
  menu: ["Eventi", "VIP", "Ristorante", "Stay & Play", "La Familia", "Contatti"],
  promoTitle: "Risparmia fino al 70% su drink e acqua",
  promoNote: "*Disponibile solo online",
  upcoming: "Prossimi eventi",
  lineup: "Lineup",
  ticketsFrom: "Biglietti da",
  vipFrom: "Area VIP da",
  vipNote: "Ricevi drink omaggio pari al valore della prenotazione",
  experiences: ["Vip", "Cena"],
  stay: "Stay & Play",
  familiaSubtitle: "Entra a far parte della famiglia",
  address: "Italia, Brescia",
  footerLinks: ["Privacy policy", "Cookie policy", "Termini e condizioni", "Lavora con noi"],
  rights: "Tutti i diritti riservati.",
  prev: "Precedente",
  next: "Successivo",
  goTo: "Vai a",
  cookie: {
    title: "Prima che inizi la notte",
    body: "Usiamo i cookie per far funzionare il sito, ricordare le tue preferenze e capire come viene usato. Scegli cosa consentire.",
    policy: "Cookie policy",
    customise: "Personalizza",
    categories: ["Necessari", "Preferenze", "Statistiche", "Marketing"],
    reject: "Rifiuta",
    acceptSelected: "Accetta selezionati",
    acceptAll: "Accetta tutti",
  },
};

export const text = { en, it };
export type Lang = keyof typeof text;
export type Text = typeof en;

// "Wed, 30 Sept 2026" / "Mer, 30 Set 2026"
export function formatDay(day: string, lang: Lang) {
  const parts = new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  }).formatToParts(new Date(`${day}T12:00:00Z`));
  const get = (type: string) => parts.find((p) => p.type === type)?.value.replace(".", "") ?? "";
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
  return `${cap(get("weekday"))}, ${get("day")} ${cap(get("month"))} ${get("year")}`;
}
