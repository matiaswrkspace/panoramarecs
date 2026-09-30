import Image from "next/image";
import type { Placeholder } from "@/content";

// Mostra la foto se c'è (ottimizzata da next/image), altrimenti un segnaposto
// sfumato con un'etichetta. Il contenitore deve essere posizionato.
export default function Visual({ item, label, className = "", sizes = "(max-width: 900px) 90vw, 30vw" }: { item: Placeholder; label?: string; className?: string; sizes?: string }) {
  if (item.image) {
    return (
      <div className={`visual ${className}`}>
        <Image src={item.image} alt={label ?? ""} fill sizes={sizes} />
      </div>
    );
  }
  const [a, b] = item.tint;
  return (
    <div className={`visual visual--placeholder ${className}`} style={{ background: `radial-gradient(120% 90% at 30% 20%, ${a}, ${b})` }}>
      {label && <span>{label}</span>}
    </div>
  );
}
