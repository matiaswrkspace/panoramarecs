"use client";

import { useState, useSyncExternalStore } from "react";
import { useLang } from "@/i18n";

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

export default function CookieBanner() {
  const { t } = useLang();
  const c = t.cookie;
  const [dismissed, setDismissed] = useState(false);
  // Sul server risulta "già scelto", così il banner compare solo nel browser.
  const stored = useSyncExternalStore(noop, readConsent, () => "server");
  const [tab, setTab] = useState(0);
  const [chosen, setChosen] = useState<Record<string, boolean>>({ necessary: true });

  function save(value: Record<string, boolean>) {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {}
    setDismissed(true);
  }

  if (dismissed || stored !== null) return null;

  return (
    <div className="cookie-overlay">
      <div className="cookie" role="dialog" aria-modal="true" aria-label="Cookie">
        <div className="cookie__tabs">
          {c.tabs.map((label, i) => (
            <button key={i} className={i === tab ? "active" : ""} onClick={() => setTab(i)}>{label}</button>
          ))}
        </div>
        <div className="cookie__body">
          {tab === 0 && (
            <>
              <h2>{c.title}</h2>
              <p>{c.body}</p>
            </>
          )}
          {tab === 1 && <p>{c.details}</p>}
          {tab === 2 && <p>{c.about}</p>}
        </div>
        <div className="cookie__toggles">
          {categories.map((cat, i) => (
            <label key={cat.id}>
              <span>{c.categories[i]}</span>
              <input
                type="checkbox"
                className="switch"
                checked={!!chosen[cat.id]}
                disabled={cat.locked}
                onChange={(e) => setChosen({ ...chosen, [cat.id]: e.target.checked })}
              />
            </label>
          ))}
        </div>
        <div className="cookie__actions">
          <button className="btn-outline" onClick={() => save({ necessary: true })}>{c.reject}</button>
          <button className="btn-outline" onClick={() => save(chosen)}>{c.acceptSelected}</button>
          <button className="btn-solid" onClick={() => save(Object.fromEntries(categories.map((cat) => [cat.id, true])))}>{c.acceptAll}</button>
        </div>
      </div>
    </div>
  );
}
