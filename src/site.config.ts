// Interruttore del sito.
// true  = tutti i visitatori, su qualsiasi indirizzo, vedono la pagina "soon".
// false = sito pubblico normale.
export const comingSoon = true;

// Cosa mostra la pagina "soon":
// "video" = il video a tutto schermo (public/video), orizzontale o verticale secondo lo schermo
// "live"  = la stessa scena animata in CSS/SVG, leggerissima
export const soonMode: "video" | "live" = "video";
