"use client";

import { useState, useSyncExternalStore } from "react";

const KEY = "cookie-consent";
const tabs = ["Consenso", "Dettagli", "Informazioni sui cookie"];
const categories = [
  { id: "necessary", label: "Necessari", locked: true },
  { id: "preferences", label: "Preferenze" },
  { id: "statistics", label: "Statistiche" },
  { id: "marketing", label: "Marketing" },
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
          {tabs.map((t, i) => (
            <button key={t} className={i === tab ? "active" : ""} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
        <div className="cookie__body">
          {tab === 0 && (
            <>
              <h2>Questo sito web utilizza i cookie</h2>
              <p>
                Utilizziamo i cookie per personalizzare contenuti ed annunci, per fornire funzionalità dei social media
                e per analizzare il nostro traffico. Puoi scegliere quali categorie accettare.
              </p>
            </>
          )}
          {tab === 1 && <p>Qui andrà l&apos;elenco dettagliato dei cookie usati dal sito.</p>}
          {tab === 2 && <p>I cookie sono piccoli file di testo che i siti salvano sul tuo dispositivo.</p>}
        </div>
        <div className="cookie__toggles">
          {categories.map((c) => (
            <label key={c.id}>
              <span>{c.label}</span>
              <input
                type="checkbox"
                className="switch"
                checked={!!chosen[c.id]}
                disabled={c.locked}
                onChange={(e) => setChosen({ ...chosen, [c.id]: e.target.checked })}
              />
            </label>
          ))}
        </div>
        <div className="cookie__actions">
          <button className="btn-outline" onClick={() => save({ necessary: true })}>Rifiuta</button>
          <button className="btn-outline" onClick={() => save(chosen)}>Accetta selezionati</button>
          <button className="btn-solid" onClick={() => save(Object.fromEntries(categories.map((c) => [c.id, true])))}>Accetta tutti</button>
        </div>
      </div>
    </div>
  );
}
