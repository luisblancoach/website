"use client";

import { Fragment, createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Copy, ReviewReason } from "@/lib/narrative/types";
import styles from "../venture.module.css";

const ReviewFlagsContext = createContext(false);

export function ReviewFlagsProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return <ReviewFlagsContext.Provider value={enabled}>{children}</ReviewFlagsContext.Provider>;
}

// Renders "**strong**" segments; everything else is plain text. Whitespace
// before a strong segment stays a separate text node, matching the original
// hand-written markup so existing pages render pixel-identically.
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\s+(?=\*\*))/g).filter(Boolean).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <Fragment key={index}>{part}</Fragment>);
}

type FlagProps = { id: string; reason: ReviewReason; note?: string; children: ReactNode; block?: boolean };

// Outlines unresolved content in development and preview; renders children
// unchanged everywhere else.
export function ReviewFlag({ id, reason, note, children, block = false }: FlagProps) {
  const enabled = useContext(ReviewFlagsContext);
  if (!enabled) return <>{children}</>;
  const Tag = block ? "div" : "span";
  return (
    <Tag className={`${styles.reviewFlag} ${block ? styles.reviewFlagBlock : ""}`} data-review-id={id} data-review-reason={reason} data-review-note={note} title={note}>
      {children}
      <sup className={styles.reviewMark} aria-hidden="true">{reason === "claim" ? "⚑" : "✎"}</sup>
    </Tag>
  );
}

// `before` / `after` join adjacent literal spacing into the same text node.
export function CopyText({ copy, before = "", after = "" }: { copy: Copy; before?: string; after?: string }) {
  if (copy.status === "approved") return <>{rich(before + copy.text + after)}</>;
  return <>{before}<ReviewFlag id={copy.id} reason={copy.reason ?? "claim"} note={copy.note}>{rich(copy.text)}</ReviewFlag>{after}</>;
}

type Entry = { id: string; reason: ReviewReason; note: string; text: string };

// Lists every flag rendered on the current page so reviewers can walk them.
export function ReviewPanel() {
  const enabled = useContext(ReviewFlagsContext);
  const pathname = usePathname();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    // Drop the previous route's list at once; collect after the new route renders.
    setEntries([]);
    setOpen(false);
    const collect = () => {
      const seen = new Map<string, Entry>();
      document.querySelectorAll<HTMLElement>("[data-review-id]").forEach((el) => {
        const id = el.dataset.reviewId!;
        if (!seen.has(id)) seen.set(id, {
          id,
          reason: el.dataset.reviewReason === "wording" ? "wording" : "claim",
          note: el.dataset.reviewNote ?? "",
          text: (el.textContent ?? "").replace(/[⚑✎]$/, "").trim().slice(0, 90),
        });
      });
      setEntries([...seen.values()].sort((a, b) => (a.reason === b.reason ? 0 : a.reason === "claim" ? -1 : 1)));
    };
    const timer = window.setTimeout(collect, 300);
    return () => window.clearTimeout(timer);
  }, [enabled, pathname]);

  if (!enabled || entries.length === 0) return null;
  const claims = entries.filter((entry) => entry.reason === "claim").length;

  const reveal = (id: string) => {
    const target = document.querySelector<HTMLElement>(`[data-review-id="${CSS.escape(id)}"]`);
    if (!target) return;
    target.scrollIntoView({ block: "center" });
    target.classList.add(styles.reviewFlagFocus);
    window.setTimeout(() => target.classList.remove(styles.reviewFlagFocus), 1600);
  };

  return (
    <aside className={styles.reviewPanel} aria-label="Content review">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        ⚑ {claims} {claims === 1 ? "claim" : "claims"} · ✎ {entries.length - claims} wording
      </button>
      {open && (
        <ol>
          {entries.map((entry) => (
            <li key={entry.id} data-reason={entry.reason}>
              <button type="button" onClick={() => reveal(entry.id)}>
                <b>{entry.reason === "claim" ? "⚑" : "✎"} {entry.text}</b>
                <small>{entry.note}</small>
              </button>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

const SURFACE_EXPERIMENT_KEY = "raidguild-surface-experiment";

// Development/preview only: "?surface=deep-navy" tries the #12163B alternate dark
// surface for this browser session; "?surface=default" turns it off. Inert when
// review flags are disabled, so production can never enable it.
export function SurfaceExperiment() {
  const enabled = useContext(ReviewFlagsContext);
  const pathname = usePathname();
  useEffect(() => {
    if (!enabled) return;
    const requested = new URLSearchParams(window.location.search).get("surface");
    try {
      if (requested === "deep-navy") sessionStorage.setItem(SURFACE_EXPERIMENT_KEY, "deep-navy");
      if (requested === "default") sessionStorage.removeItem(SURFACE_EXPERIMENT_KEY);
      const active = sessionStorage.getItem(SURFACE_EXPERIMENT_KEY) === "deep-navy";
      if (active) document.documentElement.dataset.surfaceExperiment = "deep-navy";
      else delete document.documentElement.dataset.surfaceExperiment;
    } catch {
      // Without storage the experiment simply stays off.
    }
  }, [enabled, pathname]);
  return null;
}
