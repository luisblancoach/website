"use client";

// Editorial Mode (local prototype, 2026-11-07): edit the narrative copy of
// the enabled sections directly on the rendered page. Local development only:
// VentureShell mounts this component only when NODE_ENV is "development", and
// it never writes source files or calls a server. Drafts stay in this
// browser (store.ts) until exported for review; nothing is approved here.
//
// Enter: the "Edit copy" button, Alt+Shift+E, or ?editorial=1.
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { EDITORIAL_SECTIONS, fieldLabel, sectionFor, sectionTitle, type EditorialPage } from "@/lib/editorial/config";
import { itemContext, originals, sourceOrder } from "@/lib/editorial/catalog";
import { conflictOf, fromExport, normalizeText, rebase, revert, setComment, sortedDrafts, toExport, toMarkdown, type Draft } from "@/lib/editorial/drafts";
import { editorial, useEditorial } from "./store";

const PAGES = new Set<string>(EDITORIAL_SECTIONS.map((section) => section.page));
const FOCUS_KEY = "raidguild-editorial-focus";
const SELECTOR = "rg-copy[data-editable]";

// The page text of an editable element, back in the narrative format:
// <strong>/<b> become "**…**" (Cmd/Ctrl+B adds bold), everything else is text.
function serialize(element: HTMLElement) {
  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
    if (!(node instanceof HTMLElement)) return "";
    if (node.tagName === "BR") return " ";
    const inner = [...node.childNodes].map(walk).join("");
    return node.tagName === "STRONG" || node.tagName === "B" ? (inner.trim() ? `**${inner}**` : inner) : inner;
  };
  return normalizeText([...element.childNodes].map(walk).join("").replace(/\*\*\*\*/g, ""));
}

const editableOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>(SELECTOR) : null);
const inEditorUi = (target: EventTarget | null) => target instanceof Element && target.closest("[data-editorial-ui]") !== null;
const plain = (text: string) => text.replace(/\*\*/g, "");

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Word-level comparison of two short texts for the Changes panel.
function wordDiff(before: string, after: string) {
  const a = plain(before).split(/(\s+)/);
  const b = plain(after).split(/(\s+)/);
  const table = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const removed: ReactNode[] = [], added: ReactNode[] = [];
  let i = 0, j = 0, k = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { removed.push(a[i]); added.push(b[j]); i++; j++; }
    else if (j < b.length && (i >= a.length || table[i][j + 1] >= table[i + 1][j])) { added.push(/\s/.test(b[j]) ? b[j] : <ins key={k++}>{b[j]}</ins>); j++; }
    else { removed.push(/\s/.test(a[i]) ? a[i] : <del key={k++}>{a[i]}</del>); i++; }
  }
  return { removed, added };
}

function reveal(id: string) {
  const element = document.querySelector<HTMLElement>(`rg-copy[data-copy-id="${CSS.escape(id)}"]`);
  if (!element) return false;
  // Expandable text (Why RaidGuild): open its row through its own button.
  const region = element.closest("[hidden]");
  const opener = region?.getAttribute("aria-labelledby");
  if (opener) document.getElementById(opener)?.click();
  window.requestAnimationFrame(() => {
    element.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    element.setAttribute("data-flash", "");
    window.setTimeout(() => element.removeAttribute("data-flash"), 1700);
  });
  return true;
}

// The editor's chrome renders in the browser only: nothing of it is in the
// server HTML, so it can never cause a hydration mismatch.
const noSubscription = () => () => {};

export default function EditorialMode() {
  const mounted = useSyncExternalStore(noSubscription, () => true, () => false);
  const state = useEditorial();
  const pathname = usePathname();
  const onEditorialPage = PAGES.has(pathname);
  const [panelOpen, setPanelOpen] = useState(false);
  const [focused, setFocused] = useState<{ label: string; rect: DOMRect } | null>(null);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef(0);
  const notify = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3200);
  }, []);
  const active = state.active && onEditorialPage;

  // Styling hook for the page: html[data-editorial="draft" | "original"].
  useEffect(() => {
    const root = document.documentElement;
    if (active) root.dataset.editorial = state.view;
    else delete root.dataset.editorial;
    return () => { delete root.dataset.editorial; };
  }, [active, state.view]);

  // Alt+Shift+E toggles the mode anywhere on the editable pages.
  useEffect(() => {
    if (!onEditorialPage) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.code === "KeyE") { event.preventDefault(); editorial.setActive(!editorial.getSnapshot().active); }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onEditorialPage]);

  // Editing and its guards. Listeners run in the capture phase on window, before
  // the page's own handlers: a click on editable text edits it and activates
  // nothing (link, disclosure button); links do not navigate while the mode is
  // on; other buttons (gallery arrows, a row's chevron) work as usual.
  useEffect(() => {
    if (!active) return;
    const starts = new WeakMap<HTMLElement, string>();
    let tracking = 0;
    const track = (element: HTMLElement) => {
      const update = () => {
        if (document.activeElement !== element) return;
        setFocused({ label: element.dataset.copyLabel ?? "", rect: element.getBoundingClientRect() });
        tracking = window.requestAnimationFrame(update);
      };
      window.cancelAnimationFrame(tracking);
      update();
    };
    const onClick = (event: MouseEvent) => {
      if (inEditorUi(event.target)) return;
      if (editableOf(event.target)) { event.preventDefault(); event.stopPropagation(); return; }
      // A keyboard-made click (detail 0) on the control that holds the text being
      // edited: the browser's own activation of a <button> or <summary> while typing.
      const editing = editableOf(document.activeElement);
      if (editing && event.detail === 0 && event.target instanceof Node && event.target.contains(editing)) { event.preventDefault(); event.stopPropagation(); return; }
      if (event.target instanceof Element && event.target.closest("a[href]")) {
        event.preventDefault();
        event.stopPropagation();
        notify("Links are paused in Editorial Mode. Exit the mode to follow them.");
      }
    };
    const onPress = (event: Event) => { if (!inEditorUi(event.target) && editableOf(event.target)) event.stopPropagation(); };
    const onKey = (event: KeyboardEvent) => {
      const element = editableOf(event.target);
      if (!element) return;
      event.stopPropagation();
      if (event.key === "Enter") { event.preventDefault(); element.blur(); }
      if (event.key === "Escape") {
        event.preventDefault();
        editorial.cancel(element.dataset.copyId!, starts.get(element) ?? serialize(element), element.dataset.copySource ?? "");
        element.blur();
      }
    };
    // Space types a space; on key-up a <button> or <summary> around the text
    // would activate (expand a row). Cancelling key-up stops only that.
    const onKeyUp = (event: KeyboardEvent) => {
      if (!editableOf(event.target)) return;
      event.stopPropagation();
      if (event.key === " ") event.preventDefault();
    };
    const onBeforeInput = (event: InputEvent) => {
      if (editableOf(event.target) && (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak")) event.preventDefault();
    };
    const onInput = (event: Event) => {
      const element = editableOf(event.target);
      if (element) editorial.type(element.dataset.copyId!, serialize(element), element.dataset.copySource ?? "");
    };
    const onPaste = (event: ClipboardEvent) => {
      if (!editableOf(event.target)) return;
      event.preventDefault();
      document.execCommand("insertText", false, normalizeText(event.clipboardData?.getData("text/plain") ?? ""));
    };
    const onDrop = (event: DragEvent) => { if (editableOf(event.target)) event.preventDefault(); };
    const onFocusIn = (event: FocusEvent) => {
      const element = editableOf(event.target);
      if (!element) return;
      starts.set(element, serialize(element));
      element.spellcheck = true;
      track(element);
    };
    const onFocusOut = (event: FocusEvent) => {
      const element = editableOf(event.target);
      if (!element) return;
      element.spellcheck = false;
      window.cancelAnimationFrame(tracking);
      setFocused(null);
      editorial.commit(element.dataset.copyId!);
    };
    const listeners: [string, EventListener][] = [
      ["click", onClick as EventListener], ["auxclick", onClick as EventListener],
      ["pointerdown", onPress], ["mousedown", onPress], ["touchstart", onPress],
      ["keydown", onKey as EventListener], ["keyup", onKeyUp as EventListener], ["beforeinput", onBeforeInput as EventListener], ["input", onInput],
      ["paste", onPaste as EventListener], ["drop", onDrop as EventListener],
      ["focusin", onFocusIn as EventListener], ["focusout", onFocusOut as EventListener],
    ];
    listeners.forEach(([type, listener]) => window.addEventListener(type, listener, true));
    return () => {
      listeners.forEach(([type, listener]) => window.removeEventListener(type, listener, true));
      window.cancelAnimationFrame(tracking);
      editorial.commitAll();
      setFocused(null);
    };
  }, [active, notify]);

  // "Show" for a change on the other page: reveal it once that page renders.
  useEffect(() => {
    if (!active) return;
    let id: string | null = null;
    try { id = sessionStorage.getItem(FOCUS_KEY); sessionStorage.removeItem(FOCUS_KEY); } catch { /* no storage, nothing to reveal */ }
    if (!id) return;
    const timer = window.setTimeout(() => reveal(id!), 400);
    return () => window.clearTimeout(timer);
  }, [active, pathname]);

  const changes = useMemo(() => sortedDrafts(state.drafts, sourceOrder), [state.drafts]);
  const conflicts = changes.filter((draft) => conflictOf(draft, originals)).length;

  if (!mounted || !onEditorialPage) return null;

  return (
    <>
      <style>{EDITOR_CSS}</style>
      {active && focused && (
        <div className="rgx-chip" data-editorial-ui="" aria-hidden="true" style={{ left: Math.max(8, Math.min(focused.rect.left, window.innerWidth - 320)), top: focused.rect.top > 44 ? focused.rect.top - 34 : focused.rect.bottom + 8 }}>
          <b>{focused.label}</b> <span>Enter saves · Esc undoes</span>
        </div>
      )}
      <div className="rgx-bar" data-editorial-ui="" role="region" aria-label="Editorial Mode">
        {!state.active ? (
          <button type="button" className="rgx-enter" onClick={() => editorial.setActive(true)} title="Editorial Mode (Alt+Shift+E)">✎ Edit copy</button>
        ) : (
          <>
            <span className="rgx-title">Editorial Mode</span>
            <span className="rgx-segment" role="group" aria-label="Preview">
              <button type="button" aria-pressed={state.view === "original"} onClick={() => editorial.setView("original")}>Original</button>
              <button type="button" aria-pressed={state.view === "draft"} onClick={() => editorial.setView("draft")}>Draft</button>
            </span>
            <button type="button" className="rgx-changes" aria-expanded={panelOpen} onClick={() => setPanelOpen((open) => !open)}>
              Changes <b>{changes.length}</b>{conflicts > 0 && <i title="Conflicts"> · {conflicts} ⚠</i>}
            </button>
            <button type="button" onClick={() => { setPanelOpen(false); editorial.setActive(false); }}>Exit</button>
            <p className="rgx-hint" aria-live="polite">
              {notice || (!state.storage ? "This browser blocks local storage: drafts will be lost on reload. Export them."
                : state.view === "original" ? "Showing the published copy. Switch to Draft to edit."
                : focused ? <>Editing <b>{focused.label}</b> · Enter saves · Esc undoes</>
                : "Click outlined text to edit. Drafts save in this browser automatically.")}
            </p>
          </>
        )}
      </div>
      {state.active && panelOpen && <ChangesPanel changes={changes} conflicts={conflicts} pathname={pathname} onClose={() => setPanelOpen(false)} notify={notify} />}
    </>
  );
}

function ChangesPanel({ changes, conflicts, pathname, onClose, notify }: { changes: Draft[]; conflicts: number; pathname: string; onClose: () => void; notify: (message: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [message, setMessage] = useState("");
  const stamp = () => new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  const exported = () => toExport(Object.fromEntries(changes.map((draft) => [draft.id, draft])), originals, { context: itemContext, order: sourceOrder });

  const show = (draft: Draft) => {
    const page = sectionFor(draft.id)?.page as EditorialPage | undefined;
    if (page && page !== pathname) {
      try { sessionStorage.setItem(FOCUS_KEY, draft.id); } catch { /* the page still opens */ }
      window.location.assign(page);
      return;
    }
    if (window.matchMedia("(max-width: 700px)").matches) onClose();
    if (!reveal(draft.id)) notify("That text is not on this page.");
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = fromExport(await file.text(), editorial.getSnapshot().drafts, originals);
      editorial.replaceDrafts(() => result.drafts);
      setMessage(`Imported ${result.added + result.replaced} ${result.added + result.replaced === 1 ? "change" : "changes"}: ${result.added} new, ${result.replaced} replaced${result.conflicts ? `, ${result.conflicts} with conflicts` : ""}${result.skipped ? `, ${result.skipped} skipped (malformed)` : ""}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The file could not be imported.");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  let section = "";
  return (
    <aside className="rgx-panel" data-editorial-ui="" role="dialog" aria-label="Editorial changes" onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}>
      <header>
        <div>
          <h2>Changes</h2>
          <p>{changes.length} proposed{conflicts > 0 ? ` · ${conflicts} in conflict` : ""} · saved in this browser · not approved, not published</p>
        </div>
        <button type="button" className="rgx-close" onClick={onClose} aria-label="Close changes">×</button>
      </header>
      <div className="rgx-actions">
        <button type="button" disabled={!changes.length} onClick={() => download(`raidguild-editorial-${stamp()}.json`, `${JSON.stringify(exported(), null, 2)}\n`, "application/json")}>Export JSON</button>
        <button type="button" disabled={!changes.length} onClick={() => download(`raidguild-editorial-${stamp()}.md`, toMarkdown(exported()), "text/markdown")}>Export Markdown</button>
        <button type="button" onClick={() => fileRef.current?.click()}>Import JSON</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(event) => importFile(event.target.files?.[0])} />
      </div>
      {message && <p className="rgx-message" role="status">{message}</p>}
      {changes.length === 0 && <p className="rgx-empty">No changes yet. Click outlined text on the page to edit it; your drafts appear here.</p>}
      <ol>
        {changes.map((draft) => {
          const meta = sectionFor(draft.id);
          const heading = meta ? sectionTitle(meta) : "Not editable any more";
          const showHeading = heading !== section;
          section = heading;
          return (
            <li key={draft.id}>
              {showHeading && <h3>{heading}</h3>}
              <ChangeRow draft={draft} onShow={() => show(draft)} />
            </li>
          );
        })}
      </ol>
      {changes.length > 0 && (
        <footer>
          {confirmAll ? (
            <><span>Revert all {changes.length} changes?</span><button type="button" className="rgx-danger" onClick={() => { editorial.replaceDrafts(() => ({})); setConfirmAll(false); setMessage("All changes reverted."); }}>Revert all</button><button type="button" onClick={() => setConfirmAll(false)}>Keep</button></>
          ) : (
            <button type="button" onClick={() => setConfirmAll(true)}>Revert all…</button>
          )}
        </footer>
      )}
    </aside>
  );
}

function ChangeRow({ draft, onShow }: { draft: Draft; onShow: () => void }) {
  const source = originals.get(draft.id);
  const conflict = conflictOf(draft, originals);
  const [comment, setCommentText] = useState(draft.comment ?? "");
  useEffect(() => { setCommentText(draft.comment ?? ""); }, [draft.comment]);
  const saveComment = () => {
    if ((draft.comment ?? "") !== comment) editorial.replaceDrafts((drafts) => setComment(drafts, draft.id, comment, source ?? draft.base));
  };
  const diff = wordDiff(draft.base, draft.text);
  const unchanged = draft.text === draft.base;
  return (
    <article className="rgx-change" data-conflict={conflict ?? undefined}>
      <div className="rgx-field">
        <b>{fieldLabel(draft.id, itemContext(draft.id))}</b>
        <span>{sectionFor(draft.id)?.page ?? ""}</span>
      </div>
      {conflict === "source-changed" && (
        <div className="rgx-conflict">
          <b>Source changed since this edit.</b> The site now reads: “{plain(source ?? "")}”
          <span><button type="button" onClick={() => editorial.replaceDrafts((drafts) => rebase(drafts, draft.id, source ?? draft.base))}>Keep my proposal</button></span>
        </div>
      )}
      {conflict === "unknown-id" && <div className="rgx-conflict"><b>This text is no longer editable on the site.</b> Keep it for the record, or revert it.</div>}
      <dl>
        <dt>Original</dt><dd className="rgx-original">{diff.removed}</dd>
        <dt>Proposed</dt><dd className="rgx-proposed">{unchanged ? <em>No change (comment only)</em> : diff.added}</dd>
      </dl>
      <label className="rgx-comment">
        <span>Comment</span>
        <textarea rows={2} value={comment} placeholder="Why this change, or a question for review" onChange={(event) => setCommentText(event.target.value)} onBlur={saveComment} />
      </label>
      <div className="rgx-row-actions">
        <button type="button" onClick={onShow}>Show on page</button>
        <button type="button" onClick={() => editorial.replaceDrafts((drafts) => revert(drafts, draft.id))}>Revert</button>
      </div>
    </article>
  );
}

const EDITOR_CSS = `
html[data-editorial="draft"] rg-copy[data-editable] {
  border-radius: 2px; cursor: text; outline: 1px dashed color-mix(in srgb, currentColor 32%, transparent); outline-offset: 2px;
  transition: outline-color .15s ease, background-color .15s ease;
}
html[data-editorial="draft"] rg-copy[data-editable]:hover { outline-color: #ee3c78; }
html[data-editorial="draft"] rg-copy[data-editable]:focus {
  background: color-mix(in srgb, #ee3c78 10%, transparent); caret-color: #ee3c78; outline: 2px solid #ee3c78; outline-offset: 3px;
}
html[data-editorial="draft"] rg-copy[data-changed] {
  -webkit-box-decoration-break: clone; box-decoration-break: clone; background: color-mix(in srgb, #ee3c78 18%, transparent);
}
html[data-editorial="draft"] rg-copy[data-commented]:not([data-changed]) { background: color-mix(in srgb, #3aa0ff 14%, transparent); }
html[data-editorial="draft"] rg-copy[data-conflict] { outline: 2px dotted #f5a524; }
html[data-editorial="draft"] rg-copy[data-editable]:empty::before { content: "(empty: type to add text)"; opacity: .55; }
html[data-editorial] rg-copy[data-flash] { animation: rgx-flash 1.6s ease-out; }
@keyframes rgx-flash { 0%, 30% { background: color-mix(in srgb, #ee3c78 40%, transparent); } }
@media (prefers-reduced-motion: reduce) { html[data-editorial] rg-copy { transition: none; } html[data-editorial] rg-copy[data-flash] { animation: none; outline: 3px solid #ee3c78; } }

.rgx-bar, .rgx-panel, .rgx-chip { color: #f4f4f5; font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; letter-spacing: normal; text-transform: none; }
.rgx-bar button, .rgx-panel button { background: #262a33; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; color: inherit; cursor: pointer; font: inherit; padding: 6px 12px; }
.rgx-bar button:hover, .rgx-panel button:hover:not(:disabled) { background: #323743; }
.rgx-bar button:focus-visible, .rgx-panel button:focus-visible, .rgx-panel textarea:focus-visible { outline: 2px solid #ee3c78; outline-offset: 2px; }
.rgx-panel button:disabled { cursor: default; opacity: .45; }
.rgx-bar {
  align-items: center; background: #15171c; border: 1px solid rgba(255,255,255,.12); border-radius: 16px; bottom: 16px; box-shadow: 0 10px 30px rgba(0,0,0,.35);
  display: flex; flex-wrap: wrap; gap: 8px; max-width: min(560px, calc(100vw - 32px)); padding: 8px; position: fixed; right: 16px; z-index: 2147483000;
}
.rgx-bar:has(.rgx-enter) { background: transparent; border: 0; box-shadow: none; padding: 0; }
.rgx-bar .rgx-enter { background: #15171c; box-shadow: 0 6px 20px rgba(0,0,0,.3); font-weight: 600; padding: 8px 14px; }
.rgx-title { font-weight: 700; padding: 0 4px 0 6px; }
.rgx-segment { background: #262a33; border-radius: 999px; display: inline-flex; padding: 2px; }
.rgx-segment button { background: transparent; border: 0; padding: 4px 10px; }
.rgx-segment button[aria-pressed="true"] { background: #ee3c78; color: #fff; }
.rgx-changes b { color: #ff8fb5; }
.rgx-changes i { color: #f5a524; font-style: normal; }
.rgx-hint { color: #b9bcc6; flex-basis: 100%; font-size: 12px; margin: 0; padding: 0 6px 2px; }
.rgx-hint b { color: #f4f4f5; font-weight: 600; }
.rgx-chip {
  background: #15171c; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,.35); font-size: 12px; max-width: 320px; overflow: hidden; padding: 5px 9px;
  pointer-events: none; position: fixed; text-overflow: ellipsis; white-space: nowrap; z-index: 2147483000;
}
.rgx-chip span { color: #b9bcc6; }
.rgx-panel {
  background: #15171c; border-left: 1px solid rgba(255,255,255,.12); bottom: 0; box-shadow: -10px 0 30px rgba(0,0,0,.35); display: flex; flex-direction: column;
  overflow: auto; position: fixed; right: 0; top: 0; width: min(440px, 100vw); z-index: 2147483001;
}
.rgx-panel header { align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,.1); display: flex; gap: 12px; justify-content: space-between; padding: 16px 16px 12px; }
.rgx-panel h2 { font-size: 16px; margin: 0 0 2px; }
.rgx-panel header p { color: #b9bcc6; font-size: 12px; margin: 0; }
.rgx-panel .rgx-close { font-size: 18px; line-height: 1; padding: 4px 10px; }
.rgx-actions { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 16px; }
.rgx-message, .rgx-empty { color: #d6d8de; margin: 0; padding: 0 16px 12px; }
.rgx-panel ol { list-style: none; margin: 0; padding: 0 16px 16px; }
.rgx-panel h3 { color: #ff8fb5; font-size: 11px; letter-spacing: .08em; margin: 14px 0 6px; text-transform: uppercase; }
.rgx-change { background: #1d2027; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; margin-bottom: 8px; padding: 10px 12px; }
.rgx-change[data-conflict] { border-color: #f5a524; }
.rgx-field { display: flex; gap: 8px; justify-content: space-between; }
.rgx-field span { color: #8d919c; font-size: 11px; white-space: nowrap; }
.rgx-change dl { display: grid; gap: 4px 10px; grid-template-columns: auto 1fr; margin: 8px 0; }
.rgx-change dt { color: #8d919c; font-size: 11px; padding-top: 2px; text-transform: uppercase; }
.rgx-change dd { margin: 0; }
.rgx-original { color: #b9bcc6; }
.rgx-original del { background: rgba(255,90,90,.18); color: #ffb4b4; }
.rgx-proposed ins { background: rgba(80,220,140,.2); color: #b6f5cf; text-decoration: none; }
.rgx-conflict { background: rgba(245,165,36,.12); border-radius: 8px; color: #ffd9a0; margin-top: 8px; padding: 8px; }
.rgx-conflict span { display: block; margin-top: 6px; }
.rgx-comment { display: grid; gap: 4px; }
.rgx-comment span { color: #8d919c; font-size: 11px; text-transform: uppercase; }
.rgx-comment textarea { background: #262a33; border: 1px solid rgba(255,255,255,.14); border-radius: 8px; color: inherit; font: inherit; padding: 6px 8px; resize: vertical; }
.rgx-row-actions { display: flex; gap: 6px; margin-top: 8px; }
.rgx-panel footer { align-items: center; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; padding: 12px 16px; }
.rgx-panel .rgx-danger { background: #8f1d3f; }
@media (max-width: 700px) {
  .rgx-bar { bottom: 8px; gap: 6px; left: 8px; max-width: none; padding: 6px; right: 8px; }
  .rgx-bar button { padding: 5px 10px; }
  .rgx-title { display: none; }
  .rgx-hint { font-size: 11px; }
  /* Phones: the field name shows in the bar; a floating label would cover the text above. */
  .rgx-chip { display: none; }
  .rgx-bar:has(.rgx-enter) { left: auto; }
  .rgx-panel { border-left: 0; border-radius: 16px 16px 0 0; border-top: 1px solid rgba(255,255,255,.12); height: 78vh; top: auto; width: 100vw; }
}
`;
