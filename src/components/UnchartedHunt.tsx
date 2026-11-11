"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./UnchartedHunt.module.css";

const artifacts = {
  portal: { name: "The Portal", clue: "I connect two places without being a road. What am I?", answer: "portal", url: "#gallery" },
  signal: { name: "The Signal", clue: "I carry an invitation across distance. I can be sent, received, or missed. What am I?", answer: "signal", url: "#contact" },
  walker: { name: "Desert Walker", clue: "Go fast alone. Go far…", answer: "together", url: "https://portal-artifacts-production.up.railway.app/desert-walker/" },
} as const;
type Key = keyof typeof artifacts;
const keys = Object.keys(artifacts) as Key[];
const storageKey = "raidguild.uncharted.v1";
const hints: Record<Key, string> = {
  portal: "A doorway between worlds. You just opened one.",
  signal: "A beacon sends one. So does a conversation.",
  walker: "Alone is fast. ________ is far.",
};
const welcome = String.raw`
 __        __ _____  _      ____   ___   __  __  _____
 \ \      / /| ____|| |    / ___| / _ \ |  \/  || ____|
  \ \ /\ / / |  _|  | |   | |    | | | || |\/| ||  _|
   \ V  V /  | |___ | |___| |___ | |_| || |  | || |___
    \_/\_/   |_____||_____|\____| \___/ |_|  |_||_____|

       A D V E N T U R E R
       ──────────────────
 Looking beneath the surface? You might be one of us.
 Three destinations. One uncharted path.

 raidguild.help()                 Start here
 raidguild.clue("portal")         Ask for a clue
 raidguild.clue("signal")         Find the second clue
 raidguild.hint("portal")         Get a stronger hint
 raidguild.solve("portal", "…")   Try an answer
 raidguild.progress()             Check your discoveries
 raidguild.reset()                Start again

 No downloads, wallets, or pasted scripts required.
 Prefer to explore visually? Open The Portal in the gallery, then find the ✧ signal and the ✧ mark further down the page.
 Meet the Guild: https://portal.raidguild.org
`;

type Hunt = { found: Key[]; solve: (key: Key, answer: string) => string; reset: () => void };
const HuntContext = createContext<Hunt | null>(null);
const normalizeKey = (key: string): Key | undefined => key === "ship" ? "signal" : keys.find(item => item === key);

export function UnchartedHunt({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<Key[]>([]);
  const foundRef = useRef<Key[]>([]);
  function save(next: Key[]) {
    foundRef.current = next;
    setFound(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Play still works without storage. */ }
  }
  function solve(key: Key, answer: string) {
    if (!keys.includes(key) || typeof answer !== "string") return 'Try raidguild.clue("portal"), "signal", or "walker".';
    if (answer.trim().toLowerCase() !== artifacts[key].answer) return "Not quite. Follow the clue and try again.";
    if (!foundRef.current.includes(key)) save([...foundRef.current, key]);
    if (key === "portal") return "Discovered: The Portal. Find the ✧ signal further down the page next.";
    if (key === "signal") return "Discovered: The Signal. Look for the final ✧ mark near the end of the page.";
    return `Discovered: ${artifacts[key].name}. ${artifacts[key].url}`;
  }
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) {
        const valid = keys.filter(key => saved.includes(key) || (key === "signal" && saved.includes("ship")));
        foundRef.current = valid;
        setFound(valid);
        if (saved.includes("ship")) localStorage.setItem(storageKey, JSON.stringify(valid));
      }
    } catch { /* Ignore invalid or unavailable storage. */ }
    const api = {
      help: () => 'Open The Portal in the gallery and follow the rabbit. Next, find the ✧ signal and the ✧ mark further down the page. Glowing pixels offer extra hints. Commands: clue(key), hint(key), solve(key, answer), progress(), reset(). Keys: portal, signal, walker.',
      clue: (key: string) => { const normalized = normalizeKey(key); return normalized ? artifacts[normalized].clue : "Choose portal, signal, or walker."; },
      hint: (key: string) => { const normalized = normalizeKey(key); return normalized ? hints[normalized] : "Choose portal, signal, or walker."; },
      solve: (key: string, answer: string) => { const normalized = normalizeKey(key); return normalized ? solve(normalized, answer) : 'Try raidguild.clue("portal"), "signal", or "walker".'; },
      progress: () => `${foundRef.current.length}/3 discovered: ${foundRef.current.join(", ") || "none yet"}`,
      reset: () => { save([]); return "The path is uncharted again."; },
    };
    const host = window as typeof window & { raidguild?: typeof api; __raidguildGreeting?: boolean };
    const previous = host.raidguild;
    host.raidguild = api;
    if (!host.__raidguildGreeting) { console.info(welcome); host.__raidguildGreeting = true; }
    return () => { if (host.raidguild === api) host.raidguild = previous; };
    // Commands read current discoveries through the ref, not a captured render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HuntContext.Provider value={{ found, solve, reset: () => save([]) }}>{children}</HuntContext.Provider>;
}

export function HuntMarker({ artifact, label, rabbit = false }: { artifact: Key; label: string; rabbit?: boolean }) {
  const hunt = useContext(HuntContext);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  if (!hunt) return null;
  const unlocked = hunt.found.includes(artifact);
  return <details className={`${styles.marker} ${rabbit ? styles.rabbit : ""}`}>
    <summary aria-label={label}>
      {rabbit ? <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true" fill="currentColor">
        <path d="M14 24C9 19 8 5 12 4c4-1 7 11 8 17 1-7 4-17 8-16 4 2-1 14-5 19 5 2 7 6 6 10 5 0 10 3 10 6H15C7 40 5 34 8 29c1-2 3-4 6-5Z" />
        <circle cx="8" cy="35" r="5" />
        <circle cx="22" cy="28" r="1.3" fill="#102d2c" />
      </svg> : "✧"} <span>{label}</span>
    </summary>
    <div className={styles.note}>
      <strong>{artifact === "portal" ? "The Portal · First clue" : artifact === "signal" ? "The Signal · Second clue" : "The Walker · Final clue"}</strong>
      {rabbit && <p>Some trails begin beneath the surface. Inspect closely. Or follow the clues right here.</p>}
      <p>{artifacts[artifact].clue}</p>
      {!unlocked && <details className={styles.extraHint}>
        <summary>Another hint?</summary>
        <p>{hints[artifact]}</p>
      </details>}
      {!unlocked ? <form onSubmit={event => { event.preventDefault(); setMessage(hunt.solve(artifact, answer)); }}>
        <label>Your answer<input value={answer} onChange={event => setAnswer(event.target.value)} autoComplete="off" /></label>
        <button type="submit">Try the signal</button>
      </form> : artifact === "portal" ? <p>First clue found. A ✧ signal waits further down the page.</p> : artifact === "signal" ? <p>Second clue found. The final ✧ mark lies near the end of the page.</p> : <a href={artifacts[artifact].url} target="_blank" rel="noopener noreferrer">Explore {artifacts[artifact].name} ↗</a>}
      <p role="status">{unlocked ? `Artifact discovered. ${hunt.found.length}/3 found.` : message}</p>
      <small>{artifact === "walker" ? "The linked experiment opens in another tab. Visiting is optional." : "The trail stays on this page."} Progress stays on this device.</small>
      {hunt.found.length === 3 && <p>The uncharted path is yours. <a href="https://portal.raidguild.org/modules?view=arcade" target="_blank" rel="noopener noreferrer">Discover the arcade ↗</a> Games may require Portal membership.</p>}
      <button type="button" onClick={() => { hunt.reset(); setMessage(""); setAnswer(""); }}>Reset discoveries</button>
    </div>
  </details>;
}

export function HuntPixel({ artifact }: { artifact: Key }) {
  return <details className={`${styles.marker} ${styles.pixel}`}>
    <summary aria-label={`Reveal a hint for the ${artifact} puzzle`} title="A faint signal">
      <span aria-hidden="true" />
    </summary>
    <div className={styles.note}>
      <strong>A faint signal</strong>
      <p>{hints[artifact]}</p>
      <small>Try this clue at the nearby {artifact === "portal" ? "rabbit" : "✧ mark"}. Tap the glowing pixel again to close.</small>
    </div>
  </details>;
}
