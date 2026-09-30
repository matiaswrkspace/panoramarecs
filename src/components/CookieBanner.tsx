"use client";

import { useState, useSyncExternalStore } from "react";
import type { Text } from "@/content";
import Logo from "./Logo";

const KEY = "cookie-consent";
const categories = [
  { id: "necessary", locked: true },
  { id: "preferences" },
  { id: "statistics" },
  { id: "marketing" },
];

const noop = () => () => {};
function readConsent() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// Banner cookie Panorama: pannello scuro in basso al centro, la pagina resta usabile.
export default function CookieBanner({ c }: { c: Text["cookie"] }) {
  const [dismissed, setDismissed] = useState(false);
  // Sul server risulta "già scelto", così il banner compare solo nel browser.
  const stored = useSyncExternalStore(noop, readConsent, () => "server");
  const [custom, setCustom] = useState(false);
  const [chosen, setChosen] = useState<Record<string, boolean>>({ necessary: true });

  function save(value: Record<string, boolean>) {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {}
    setDismissed(true);
  }

  if (dismissed || stored !== null) return null;

  return (
    <div className="cookie" role="dialog" aria-label={c.title}>
      <div className="cookie__head">
        <Logo className="cookie__logo" />
        <div>
          <h2>{c.title}</h2>
          <p>
            {c.body} <a href="#footer">{c.policy}</a>
          </p>
        </div>
      </div>

      {custom && (
        <div className="cookie__toggles">
          {categories.map((cat, i) => (
            <label key={cat.id}>
              <input
                type="checkbox"
                className="switch"
                checked={!!chosen[cat.id]}
                disabled={cat.locked}
                onChange={(e) => setChosen({ ...chosen, [cat.id]: e.target.checked })}
              />
              <span>{c.categories[i]}</span>
            </label>
          ))}
        </div>
      )}

      <div className="cookie__actions">
        <button className="cookie__btn" onClick={() => save({ necessary: true })}>{c.reject}</button>
        {custom ? (
          <button className="cookie__btn" onClick={() => save(chosen)}>{c.acceptSelected}</button>
        ) : (
          <button className="cookie__btn" onClick={() => setCustom(true)}>{c.customise}</button>
        )}
        <button className="cookie__btn cookie__btn--solid" onClick={() => save(Object.fromEntries(categories.map((cat) => [cat.id, true])))}>
          {c.acceptAll}
        </button>
      </div>
    </div>
  );
}
