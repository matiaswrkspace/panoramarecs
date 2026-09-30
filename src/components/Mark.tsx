// Simbolo segnaposto del marchio (un disco): va sostituito con il tuo logo.
export default function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#9e3b3f" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="#fff" strokeOpacity=".35" />
      <circle cx="20" cy="20" r="4" fill="#fff" />
    </svg>
  );
}
