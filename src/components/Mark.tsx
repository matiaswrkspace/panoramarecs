// Simbolo del marchio: la "P" del logo dentro un cerchio verde.
export default function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="mark">
      <circle cx="20" cy="20" r="18.5" fill="#0a5c35" stroke="#39ff8f" strokeOpacity=".6" />
      <text x="19" y="29" textAnchor="middle" fontSize="26" fill="#d9ffec">P</text>
    </svg>
  );
}
