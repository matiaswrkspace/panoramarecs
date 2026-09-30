// Tutti i contenuti del sito stanno qui: testi, eventi e immagini.
// Per sostituire un segnaposto con una foto, mettila in /public/images
// e scrivi il percorso nel campo `image` (es. "/images/evento-1.jpg").

export type Placeholder = { image?: string; tint: [string, string] };

export const brand = {
  name: "Panorama",
  // Il logo è la scritta "Panorama" in corsivo neon (vedi components/Logo.tsx).
  logoSubtitle: "city heartbeat",
  tagline: "Electronic music",
};

export const nav = [
  { label: "Buy tickets", href: "#events" },
  { label: "Book VIP zone", href: "#experiences" },
  { label: "Restaurant", href: "#experiences" },
  { label: "Collection", href: "#familia" },
];

export const menu = [
  { label: "Events", href: "#events" },
  { label: "VIP", href: "#experiences" },
  { label: "Restaurant", href: "#experiences" },
  { label: "Stay & Play", href: "#stay" },
  { label: "La Familia", href: "#familia" },
  { label: "Contact", href: "#footer" },
];

export const promo = {
  title: "Save up to 70% on drinks & water",
  note: "*Available only online",
};

export type Event = Placeholder & {
  date: string;
  title: string;
  lineup: string;
  ticketsFrom: number;
  vipFrom: number;
};

export const events: Event[] = [
  { date: "Wed, 30 Sept 2026 | 23:00 - 06:00", title: "Opening Night", lineup: "Artista A, Artista B, Artista C", ticketsFrom: 30, vipFrom: 175, tint: ["#d9f5e6", "#6fae8c"] },
  { date: "Thu, 01 Oct 2026 | 23:00 - 06:00", title: "Disco Fever | Closing Party", lineup: "Artista D, Artista E, Artista F, Artista G", ticketsFrom: 30, vipFrom: 150, tint: ["#16c47a", "#04301c"] },
  { date: "Fri, 02 Oct 2026 | 23:00 - 06:00", title: "Deep Sessions", lineup: "Artista H, Artista I, Artista L", ticketsFrom: 85, vipFrom: 450, tint: ["#1e5a50", "#03110e"] },
  { date: "Sat, 03 Oct 2026 | 23:00 - 06:00", title: "Season Closing Party", lineup: "Artista M, Artista N, Artista O", ticketsFrom: 30, vipFrom: 220, tint: ["#8ee04a", "#1a3a06"] },
  { date: "Sun, 04 Oct 2026 | 23:00 - 06:00", title: "Sunday Social", lineup: "Artista P, Artista Q", ticketsFrom: 25, vipFrom: 150, tint: ["#1f8a70", "#062a22"] },
  { date: "Thu, 08 Oct 2026 | 23:00 - 06:00", title: "House Anthems", lineup: "Artista R, Artista S", ticketsFrom: 30, vipFrom: 175, tint: ["#d63a7a", "#3a0822"] },
  { date: "Fri, 09 Oct 2026 | 23:00 - 06:00", title: "Techno Rituals", lineup: "Artista T, Artista U, Artista V", ticketsFrom: 40, vipFrom: 300, tint: ["#555", "#0a0a0a"] },
  { date: "Sat, 10 Oct 2026 | 23:00 - 06:00", title: "Grand Finale", lineup: "Artista Z, Special guests", ticketsFrom: 50, vipFrom: 400, tint: ["#c8a24a", "#3a2a06"] },
];

export const experiences: (Placeholder & { title: string; href: string })[] = [
  { title: "Vip", href: "#", tint: ["#39ff8f", "#03331a"] },
  { title: "Dine", href: "#", tint: ["#0f8a4f", "#021a0e"] },
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
  subtitle: "Become a part of the family",
  items: [
    { title: "Beach Club", tint: ["#9fd3e6", "#e9dcbc"] },
    { title: "Hotel", tint: ["#b86a6a", "#1a1020"] },
    { title: "Restaurante", tint: ["#c7802e", "#2a1506"] },
    { title: "Icons", tint: ["#6b7a2a", "#15180a"] },
    { title: "Collection", tint: ["#7d6bb8", "#120d24"] },
    { title: "New York", tint: ["#4a5a7a", "#0b0f1c"] },
  ] as (Placeholder & { title: string })[],
};

export const footer = {
  address: "Indirizzo del locale, Città",
  email: "info@example.com",
  socials: ["Instagram", "TikTok", "Facebook", "YouTube", "Spotify"],
  links: ["Privacy policy", "Cookie policy", "Terms & conditions", "Work with us"],
};
