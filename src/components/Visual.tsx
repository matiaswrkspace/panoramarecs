import type { Placeholder } from "@/content";

// Mostra la foto se c'è, altrimenti un segnaposto sfumato con un'etichetta.
export default function Visual({ item, label, className = "" }: { item: Placeholder; label?: string; className?: string }) {
  if (item.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.image} alt={label ?? ""} className={`visual ${className}`} />;
  }
  const [a, b] = item.tint;
  return (
    <div className={`visual visual--placeholder ${className}`} style={{ background: `radial-gradient(120% 90% at 30% 20%, ${a}, ${b})` }}>
      {label && <span>{label}</span>}
    </div>
  );
}
