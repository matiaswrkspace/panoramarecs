// Logo "Panorama": scritta corsiva in neon verde menta.
// Quando arriva il file originale (SVG o PNG trasparente) si sostituisce qui.
export default function Logo({ className = "", as: Tag = "span" }: { className?: string; as?: "span" | "h1" | "p" }) {
  return <Tag className={`logo ${className}`}>Panorama</Tag>;
}
