"use client";

import { useSyncExternalStore } from "react";
import { text } from "@/content";

// Lingua del sito: inglese di base, italiano a scelta dal menu.
// La scelta resta salvata nel browser.
export type Lang = "en" | "it";

const KEY = "lang";
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "it" ? "it" : "en";
  } catch {
    return "en";
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
  document.documentElement.lang = lang;
  listeners.forEach((fn) => fn());
}

export function useLang() {
  const lang = useSyncExternalStore(subscribe, read, () => "en" as Lang);
  return { lang, t: text[lang] };
}
