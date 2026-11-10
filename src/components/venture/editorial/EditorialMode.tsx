"use client";

// Editorial Mode (v0.1, 2026-11-07; opt-in production build 2026-11-08; v0.3
// full coverage 2026-11-09): edit every registered copy item of /agency and
// /community directly on the rendered page; copy that is not shown as text (alt
// text, screen-reader names, search and sharing) from the panel's Hidden text tab.
// Loaded by EditorialEntry in local development and in opt-in builds (see
// lib/editorial/config.ts). It never writes source files or calls a server:
// drafts stay in this browser (store.ts) until exported for review; nothing is
// approved or published here.
//
// Enter: ?editorial=1 (any build); in local development also the "Edit copy"
// button and Alt+Shift+E. Leave: Exit, Alt+Shift+E or ?editorial=0.
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { EDITORIAL_DEV, EDITORIAL_PAGES, KIND_LABEL, OPERATION_LABEL, SCOPE_LABEL, componentOf, exclusionReason, fieldLabel, formattingFor, kindOf, removalTarget, sectionFor, sectionTitle, structuralReason, type Operation, type RemoveScope } from "@/lib/editorial/config";
import { hiddenIds, itemContext, originals, sourceOrder } from "@/lib/editorial/catalog";
import { EXPORT_FILES, applyEdit, conflictOf, fromExport, normalizeText, rebase, revert, setComment, sortedDrafts, toExport, toMarkdown, warningsOf, type Draft, type Drafts } from "@/lib/editorial/drafts";
import { hasFormatting, plainText, safeHref } from "@/lib/narrative/inline";
import { rich } from "../primitives/Review";
import { editorial, useEditorial } from "./store";

const PAGES = new Set<string>(EDITORIAL_PAGES);
const FOCUS_KEY = "raidguild-editorial-focus";
const SELECTOR = "rg-copy[data-editable]";
// The commit the site was built from, for the export (next.config.ts).
const SOURCE_REVISION = process.env.NEXT_PUBLIC_EDITORIAL_SOURCE_REVISION || "unknown";

// The page text of an editable element, back in the narrative format
// (lib/narrative/inline.ts): <strong>/<b> → "**…**", <em>/<i> → "_…_",
// <u> → "++…++", <a href> → "[…](href)" when the address is safe. Only in fields
// that take formatting (config.ts `formattingFor`); anything else the browser
// inserts (spans, fonts, styles, other tags) keeps its words and loses its markup.
// Spaces at the edge of a mark move outside it.
const MARKS: Record<string, string> = { STRONG: "**", B: "**", EM: "_", I: "_", U: "++" };
function serialize(element: HTMLElement) {
  const policy = formattingFor(element.dataset.copyId ?? "");
  const wrap = (inner: string, open: string, close: string) => {
    const core = inner.trim();
    if (!core) return inner;
    const lead = inner.slice(0, inner.length - inner.trimStart().length);
    const trail = inner.slice(inner.trimEnd().length);
    return `${lead}${open}${core}${close}${trail}`;
  };
  const walk = (node: Node, inLink: boolean): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
    if (!(node instanceof HTMLElement)) return "";
    if (node.tagName === "BR") return " ";
    const link = node.tagName === "A" && !inLink && policy.links ? safeHref(node.getAttribute("href") ?? "") : null;
    const inner = [...node.childNodes].map((child) => walk(child, inLink || Boolean(link))).join("");
    if (link) return wrap(inner, "[", `](${link})`);
    const marker = policy.marks ? MARKS[node.tagName] : undefined;
    return marker ? wrap(inner, marker, marker) : inner;
  };
  return normalizeText([...element.childNodes].map((child) => walk(child, false)).join("").replace(/\*\*\*\*|\+\+\+\+/g, ""));
}

// Character offsets of the selection inside an element, and back: the editor
// re-renders a text after each commit, so a saved DOM range would not survive.
function offsetsIn(element: HTMLElement): { start: number; end: number } | null {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!element.contains(range.startContainer) || !element.contains(range.endContainer)) return null;
  const before = document.createRange();
  before.selectNodeContents(element);
  before.setEnd(range.startContainer, range.startOffset);
  const start = before.toString().length;
  return { start, end: start + range.toString().length };
}
function selectOffsets(element: HTMLElement, start: number, end: number) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let seen = 0, startSet = false;
  range.selectNodeContents(element);
  range.collapse(false);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.nodeValue?.length ?? 0;
    if (!startSet && start <= seen + length) { range.setStart(node, start - seen); startSet = true; }
    if (startSet && end <= seen + length) { range.setEnd(node, end - seen); break; }
    seen += length;
  }
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}
const editableById = (id: string) => document.querySelector<HTMLElement>(`rg-copy[data-editable][data-copy-id="${CSS.escape(id)}"]`);

const editableOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>(SELECTOR) : null);
// Any item in the Draft view, editable or not (a removed item is chosen, not typed into).
const selectableOf = (target: EventTarget | null) => (target instanceof Element ? target.closest<HTMLElement>("rg-copy[data-selectable]") : null);
const inEditorUi = (target: EventTarget | null) => target instanceof Element && target.closest("[data-editorial-ui]") !== null;
const plain = (text: string) => plainText(text);

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

// Preview of removals. A removed text leaves a hidden, empty <rg-copy> marker
// (EditableCopy); here each marker folds away the elements that held nothing
// else (its paragraph, its button), a whole item folds from the smallest element
// holding all its texts, and a whole section hides its <section>. Folding stops
// at page landmarks. Returns what was hidden, to restore it.
const LANDMARKS = "section, main, header, footer, nav, body, [data-editorial-ui]";
const isEmpty = (element: Element) => (element.textContent ?? "").trim() === "";
function foldRemovals(drafts: Drafts): HTMLElement[] {
  const folded: HTMLElement[] = [];
  const hide = (element: Element | null | undefined) => {
    if (!(element instanceof HTMLElement) || element.hasAttribute("data-rgx-folded")) return;
    element.setAttribute("data-rgx-folded", "");
    folded.push(element);
  };
  const fold = (start: Element) => {
    let element = start;
    while (element.parentElement && !element.parentElement.matches(LANDMARKS) && isEmpty(element.parentElement)) element = element.parentElement;
    if (element !== start) hide(element);
  };
  const inside = (target: string) => [...document.querySelectorAll<HTMLElement>(`rg-copy[data-copy-id^="${CSS.escape(target)}."], rg-copy[data-copy-id="${CSS.escape(target)}"]`)];
  for (const draft of Object.values(drafts)) {
    if (draft.op !== "REMOVE" || !draft.scope || draft.scope === "item") continue;
    const items = inside(removalTarget(draft.id, draft.scope));
    if (!items.length) continue;
    if (draft.scope === "section") { hide(items[0].closest("section") ?? common(items)); continue; }
    const holder = common(items);
    if (holder) { hide(holder); fold(holder); }
  }
  document.querySelectorAll("rg-copy[data-removed][hidden]").forEach(fold);
  return folded;
}
function common(elements: Element[]): Element | null {
  let candidate: Element | null = elements[0] ?? null;
  while (candidate && !elements.every((element) => candidate!.contains(element))) candidate = candidate.parentElement;
  return candidate;
}

const STATE_LABEL: Record<Operation, string> = { REPLACE: "Rewritten", SHORTEN: "Shortened", REMOVE: "Removed", KEEP: "Kept as is" };

// The decisions for the chosen item, in plain words. Buttons keep the focus in
// the text being edited (pointer-down is cancelled), so typed text is saved first.
function ItemActions({ item, draft, notify }: { item: { id: string; label: string }; draft: Draft | undefined; notify: (message: string) => void }) {
  const [removing, setRemoving] = useState(false);
  const source = originals.get(item.id) ?? draft?.base ?? "";
  const hold = (event: { preventDefault: () => void }) => event.preventDefault();
  const component = componentOf(item.id);
  const operate = (op: Operation, scope?: RemoveScope) => {
    editorial.operate(item.id, op, source, scope);
    setRemoving(false);
    const after = editorial.getSnapshot().drafts[item.id];
    if ((op === "REPLACE" || op === "SHORTEN") && after?.op !== op) { notify(`Edit the text first, then mark it as “${OPERATION_LABEL[op]}”.`); return; }
    const structural = structuralReason(item.id, op, scope);
    const shared = sectionFor(item.id)?.page === "shared" ? " It is on both pages." : "";
    if (op === "REMOVE") notify(structural ? `Marked for removal. ${structural} This needs separate approval.${shared}` : `Marked for removal. Restore brings it back.${shared}`);
    if (op === "KEEP") notify("Marked as reviewed: keep as is.");
  };
  const removed = draft?.op === "REMOVE";
  const status = draft ? (removed ? `Removed: ${SCOPE_LABEL[draft.scope ?? "item"]}` : STATE_LABEL[draft.op]) : "Unchanged";
  return (
    <div className="rgx-item" role="group" aria-label={`Decision for ${item.label}`}>
      <span className="rgx-item-name"><b>{item.label}</b> · {status}</span>
      {!removed && (
        <span className="rgx-segment" role="group" aria-label="Kind of change">
          <button type="button" aria-pressed={draft?.op === "REPLACE"} onPointerDown={hold} onMouseDown={hold} onClick={() => operate("REPLACE")} title="New wording">Rewrite</button>
          <button type="button" aria-pressed={draft?.op === "SHORTEN"} onPointerDown={hold} onMouseDown={hold} onClick={() => operate("SHORTEN")} title="A shorter version">Shorten</button>
        </span>
      )}
      {!removed && draft?.op !== "KEEP" && <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => operate("KEEP")}>Keep as is</button>}
      {!removed && (removing ? (
        <span className="rgx-remove" role="group" aria-label="Remove">
          <span>Remove:</span>
          <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => operate("REMOVE", "item")}>This text</button>
          {component && <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => operate("REMOVE", "component")}>Whole item</button>}
          <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => operate("REMOVE", "section")}>Whole section</button>
          <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => setRemoving(false)}>Cancel</button>
        </span>
      ) : (
        <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => setRemoving(true)}>Remove…</button>
      ))}
      {draft && (
        <button type="button" onPointerDown={hold} onMouseDown={hold} onClick={() => { editorial.replaceDrafts((drafts) => revert(drafts, item.id)); notify(removed ? "Restored." : "Back to the published text."); }}>
          {removed ? "Restore" : "Undo"}
        </button>
      )}
    </div>
  );
}

// Formatting toolbar (November 10, rich text) for the text being edited:
// Bold, Italic, Underline and Link in fields that take formatting
// (config.ts `formattingFor`), Undo and Redo everywhere. Pointer presses keep
// the focus and the selection in the text; from the keyboard, Alt+F10 moves
// into the toolbar (arrows move between its buttons, Escape goes back to the
// text) and Cmd/Ctrl+B, I, U and K work in the text itself. Every action first
// puts the focus and the selection back (by character offsets), so it also
// works after the text was re-rendered. The browser's own editing commands do
// the work, so Cmd/Ctrl+Z undoes them like typing.
type FormatTarget = { id: string; label: string };
const FORMAT_KEYS = { bold: "Mod+B", italic: "Mod+I", underline: "Mod+U", link: "Mod+K" } as const;
const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const shortcut = (keys: string) => keys.replace("Mod", isMac() ? "⌘" : "Ctrl");

function FormatBar({ target, linkRequest, notify, onLeave }: { target: FormatTarget; linkRequest: number; notify: (message: string) => void; onLeave: () => void }) {
  const policy = formattingFor(target.id);
  const bar = useRef<HTMLDivElement>(null);
  const saved = useRef<{ start: number; end: number } | null>(null);
  const [marks, setMarks] = useState({ bold: false, italic: false, underline: false, link: null as string | null });
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => {
      setNarrow(media.matches);
      const element = editableById(target.id);
      if (!element) return;
      setRect(element.getBoundingClientRect());
      const offsets = offsetsIn(element);
      if (!offsets) return;
      saved.current = offsets;
      const anchor = window.getSelection()?.anchorNode ?? null;
      const link = (anchor instanceof Element ? anchor : anchor?.parentElement)?.closest("a");
      setMarks({
        bold: document.queryCommandState("bold"), italic: document.queryCommandState("italic"), underline: document.queryCommandState("underline"),
        link: link && element.contains(link) ? link.getAttribute("href") : null,
      });
    };
    update();
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => { document.removeEventListener("selectionchange", update); window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
  }, [target.id]);

  // Cmd/Ctrl+K in the text opens the link field.
  useEffect(() => {
    if (!linkRequest || !policy.links) return;
    setLinkDraft(marks.link ?? "https://");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkRequest]);

  const restore = () => {
    const element = editableById(target.id);
    if (!element) { notify("This text is no longer on the page."); return null; }
    if (document.activeElement !== element) element.focus();
    if (saved.current) selectOffsets(element, saved.current.start, saved.current.end);
    return element;
  };
  const run = (command: "bold" | "italic" | "underline" | "undo" | "redo") => {
    if (!restore()) return;
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand(command);
  };
  const selectLinkAround = (element: HTMLElement) => {
    const selection = window.getSelection();
    const anchor = selection?.anchorNode ?? null;
    const link = (anchor instanceof Element ? anchor : anchor?.parentElement)?.closest("a");
    if (!selection || !link || !element.contains(link)) return false;
    const range = document.createRange();
    range.selectNodeContents(link);
    selection.removeAllRanges();
    selection.addRange(range);
    return true;
  };
  const applyLink = () => {
    const href = safeHref(linkDraft ?? "");
    if (!href) { notify("Use an address that starts with https://, mailto:, / (a page of this site) or # (a section)."); return; }
    const element = restore();
    if (!element) return;
    const selection = window.getSelection();
    if (selection?.isCollapsed && !selectLinkAround(element)) {
      // No words selected: the address itself becomes the linked text.
      const start = saved.current?.start ?? 0;
      document.execCommand("insertText", false, href);
      selectOffsets(element, start, start + href.length);
    }
    document.execCommand("createLink", false, href);
    setLinkDraft(null);
    notify("Link added. Enter saves the text.");
  };
  const removeLink = () => {
    const element = restore();
    if (!element) return;
    if (window.getSelection()?.isCollapsed) selectLinkAround(element);
    document.execCommand("unlink");
    setLinkDraft(null);
    notify("Link removed.");
  };
  const backToText = () => { setLinkDraft(null); restore(); };
  const hold = (event: { preventDefault: () => void }) => event.preventDefault();
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); backToText(); return; }
    if (event.target instanceof HTMLInputElement) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const buttons = [...(bar.current?.querySelectorAll<HTMLButtonElement>(".rgx-format-tools button:not(:disabled)") ?? [])];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    buttons[(index + (event.key === "ArrowRight" ? 1 : buttons.length - 1)) % buttons.length].focus();
  };
  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && (bar.current?.contains(next) || editableById(target.id)?.contains(next))) return;
    if (linkDraft === null) onLeave();
  };

  const style = narrow || !rect ? undefined : { left: Math.max(8, Math.min(rect.left, window.innerWidth - 470)), top: rect.top > 60 ? rect.top - 52 : rect.bottom + 8 };
  const tool = (name: "bold" | "italic" | "underline", text: ReactNode, label: string) => (
    <button type="button" aria-pressed={marks[name]} aria-keyshortcuts={FORMAT_KEYS[name].replace("Mod", isMac() ? "Meta" : "Control")} title={`${label} (${shortcut(FORMAT_KEYS[name])})`} aria-label={label} disabled={!policy.marks} onPointerDown={hold} onMouseDown={hold} onClick={() => run(name)}>{text}</button>
  );
  return (
    <div ref={bar} className="rgx-format" data-editorial-ui="" data-narrow={narrow ? "" : undefined} role="toolbar" aria-label={`Formatting: ${target.label}`} style={style} onKeyDown={onKeyDown} onBlur={onBlur}>
      <span className="rgx-format-label" title={target.label}>{target.label}</span>
      <span className="rgx-format-tools">
        {tool("bold", <b>B</b>, "Bold")}
        {tool("italic", <i>I</i>, "Italic")}
        {tool("underline", <u>U</u>, "Underline")}
        <button type="button" aria-pressed={marks.link !== null} aria-expanded={linkDraft !== null} aria-keyshortcuts={isMac() ? "Meta+K" : "Control+K"} title={`Link (${shortcut(FORMAT_KEYS.link)})`} aria-label="Link" disabled={!policy.links} onPointerDown={hold} onMouseDown={hold} onClick={() => setLinkDraft(marks.link ?? "https://")}>Link</button>
        <span className="rgx-format-sep" aria-hidden="true" />
        <button type="button" title={`Undo (${shortcut("Mod+Z")})`} aria-label="Undo" onPointerDown={hold} onMouseDown={hold} onClick={() => run("undo")}>↶</button>
        <button type="button" title={`Redo (${shortcut(isMac() ? "Mod+Shift+Z" : "Mod+Y")})`} aria-label="Redo" onPointerDown={hold} onMouseDown={hold} onClick={() => run("redo")}>↷</button>
      </span>
      {!policy.marks && <span className="rgx-format-note">Plain text in this field</span>}
      {linkDraft !== null && (
        <form className="rgx-format-link" onSubmit={(event) => { event.preventDefault(); applyLink(); }}>
          <label>
            <span>Link address</span>
            <input type="text" inputMode="url" autoComplete="off" spellCheck={false} value={linkDraft} autoFocus onChange={(event) => setLinkDraft(event.target.value)} aria-describedby="rgx-link-help" />
          </label>
          <button type="submit">{marks.link ? "Update" : "Add link"}</button>
          {marks.link && <button type="button" onClick={removeLink}>Remove link</button>}
          <button type="button" onClick={backToText}>Cancel</button>
          <small id="rgx-link-help">https://, mailto:, a page of this site (/agency) or a section (#faq). Other sites open in a new tab.</small>
        </form>
      )}
    </div>
  );
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
  // The text the formatting toolbar acts on: kept while the focus is in the toolbar.
  const [formatTarget, setFormatTarget] = useState<FormatTarget | null>(null);
  const [linkRequest, setLinkRequest] = useState(0);
  // The item the operations apply to: the last text clicked or edited.
  const [selected, setSelected] = useState<{ id: string; label: string } | null>(null);
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
      const chosen = selectableOf(event.target);
      if (chosen) setSelected({ id: chosen.dataset.copyId!, label: chosen.dataset.copyLabel ?? "" });
      if (editableOf(event.target) || chosen) { event.preventDefault(); event.stopPropagation(); return; }
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
    const onPress = (event: Event) => { if (!inEditorUi(event.target) && selectableOf(event.target)) event.stopPropagation(); };
    const onKey = (event: KeyboardEvent) => {
      const element = editableOf(event.target);
      if (!element) return;
      event.stopPropagation();
      // Formatting shortcuts (November 10): only the approved marks, only where the field takes them.
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && !event.altKey && ["b", "i", "u", "k"].includes(key)) {
        event.preventDefault();
        const policy = formattingFor(element.dataset.copyId ?? "");
        if (key === "k") { if (policy.links) setLinkRequest((n) => n + 1); else notify("Links cannot be added to this field."); return; }
        if (!policy.marks) { notify("This field takes plain text only."); return; }
        document.execCommand("styleWithCSS", false, "false");
        document.execCommand(key === "b" ? "bold" : key === "i" ? "italic" : "underline");
        return;
      }
      if (event.altKey && event.key === "F10") {
        event.preventDefault();
        document.querySelector<HTMLButtonElement>(".rgx-format .rgx-format-tools button:not(:disabled)")?.focus();
        return;
      }
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
      const element = editableOf(event.target);
      if (!element) return;
      if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") event.preventDefault();
      // The browser's own formatting (context menu, touch bar): bold, italic and
      // underline where the field takes them; nothing else (strikethrough, colours, fonts).
      if (event.inputType.startsWith("format") && (!formattingFor(element.dataset.copyId ?? "").marks || !["formatBold", "formatItalic", "formatUnderline"].includes(event.inputType))) event.preventDefault();
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
      setSelected({ id: element.dataset.copyId!, label: element.dataset.copyLabel ?? "" });
      setFormatTarget((previous) => previous?.id === element.dataset.copyId ? previous : { id: element.dataset.copyId!, label: element.dataset.copyLabel ?? "" });
      element.spellcheck = true;
      track(element);
    };
    const onFocusOut = (event: FocusEvent) => {
      const element = editableOf(event.target);
      if (!element) return;
      element.spellcheck = false;
      window.cancelAnimationFrame(tracking);
      setFocused(null);
      // Into the toolbar: it keeps acting on this text.
      if (!(event.relatedTarget instanceof Element && event.relatedTarget.closest(".rgx-format"))) setFormatTarget(null);
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

  // Preview: fold away what only held removed text (a paragraph, a button), whole
  // items and whole sections, so the page reads as it would with the decisions applied.
  useEffect(() => {
    if (!active || state.view !== "preview") return;
    const folded = foldRemovals(state.drafts);
    return () => folded.forEach((element) => element.removeAttribute("data-rgx-folded"));
  }, [active, state.view, state.drafts, pathname]);

  // A new page or view: the chosen item is no longer on screen.
  useEffect(() => { setSelected(null); }, [pathname, state.view]);

  const changes = useMemo(() => sortedDrafts(state.drafts, sourceOrder), [state.drafts]);
  const conflicts = changes.filter((draft) => conflictOf(draft, originals)).length;

  // Opt-in builds show nothing until the mode is on: no "Edit copy" button for visitors.
  if (!mounted || !onEditorialPage || (!state.active && !EDITORIAL_DEV)) return null;

  return (
    <>
      <style>{EDITOR_CSS}</style>
      {active && state.view === "draft" && formatTarget && <FormatBar key={formatTarget.id} target={formatTarget} linkRequest={linkRequest} notify={notify} onLeave={() => setFormatTarget(null)} />}
      <div className="rgx-bar" data-editorial-ui="" role="region" aria-label="Editorial Mode">
        {!state.active ? (
          <button type="button" className="rgx-enter" onClick={() => editorial.setActive(true)} title="Editorial Mode (Alt+Shift+E)">✎ Edit copy</button>
        ) : (
          <>
            <span className="rgx-title">Editorial Mode</span>
            <span className="rgx-status" title="Drafts are saved in this browser only. Export them to share; nothing changes the website.">Local draft — not published</span>
            <span className="rgx-segment" role="group" aria-label="Preview">
              <button type="button" aria-pressed={state.view === "original"} onClick={() => editorial.setView("original")} title="The published copy">Original</button>
              <button type="button" aria-pressed={state.view === "draft"} onClick={() => editorial.setView("draft")} title="Your decisions, editable">Draft</button>
              <button type="button" aria-pressed={state.view === "preview"} onClick={() => editorial.setView("preview")} title="The page as it would read with your decisions">Preview</button>
            </span>
            <button type="button" className="rgx-changes" aria-expanded={panelOpen} onClick={() => setPanelOpen((open) => !open)}>
              Changes <b>{changes.length}</b>{conflicts > 0 && <i title="Conflicts"> · {conflicts} ⚠</i>}
            </button>
            <button type="button" onClick={() => { setPanelOpen(false); editorial.setActive(false); }}>Exit</button>
            <p className="rgx-hint" aria-live="polite">
              {notice || (!state.storage ? "This browser blocks local storage: drafts will be lost on reload. Export them."
                : state.view === "original" ? "Showing the published copy. Switch to Draft to edit."
                : state.view === "preview" ? "Preview: the page with your decisions applied, removals taken out. Switch to Draft to edit."
                : focused ? <>Editing <b>{focused.label}</b> · Enter saves · Esc undoes</>
                : "Click outlined text to edit it, keep it or remove it. Drafts save in this browser automatically.")}
            </p>
            {state.view === "draft" && selected && <ItemActions key={selected.id} item={selected} draft={state.drafts[selected.id]} notify={notify} />}
          </>
        )}
      </div>
      {state.active && panelOpen && <ChangesPanel changes={changes} conflicts={conflicts} pathname={pathname} onClose={() => setPanelOpen(false)} notify={notify} />}
    </>
  );
}

function ChangesPanel({ changes, conflicts, pathname, onClose, notify }: { changes: Draft[]; conflicts: number; pathname: string; onClose: () => void; notify: (message: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  // "changes": every decision on both pages. "hidden": the copy of this page that is not
  // shown as text (alt text, screen-reader names, search and sharing), edited here.
  const [tab, setTab] = useState<"changes" | "hidden">("changes");
  const drafts = useEditorial().drafts;
  const hidden = hiddenIds.filter((id) => { const page = sectionFor(id)?.page; return page === pathname || page === "shared"; });
  const [confirmAll, setConfirmAll] = useState(false);
  const [message, setMessage] = useState("");
  // One snapshot gives both files the same change set id.
  const exported = () => toExport(Object.fromEntries(changes.map((draft) => [draft.id, draft])), originals, { context: itemContext, order: sourceOrder, revision: SOURCE_REVISION });
  const save = async (which: "both" | "json" | "markdown") => {
    const data = await exported();
    if (which !== "markdown") download(EXPORT_FILES.json, `${JSON.stringify(data, null, 2)}\n`, "application/json");
    if (which === "both") await new Promise((resolve) => window.setTimeout(resolve, 400));
    if (which !== "json") download(EXPORT_FILES.markdown, toMarkdown(data), "text/markdown");
    setMessage(which === "both" ? `Exported ${EXPORT_FILES.markdown} (to read) and ${EXPORT_FILES.json} (for integration). Send both.` : "Exported.");
  };

  const show = (draft: Draft) => {
    if (kindOf(draft.id) !== "visible") {
      setTab("hidden");
      window.setTimeout(() => document.querySelector(`[data-hidden-id="${CSS.escape(draft.id)}"]`)?.scrollIntoView({ block: "center" }), 50);
      return;
    }
    const page = sectionFor(draft.id)?.page;
    if (page && page !== "shared" && page !== pathname) {
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
      setMessage(`Imported ${result.added + result.replaced} ${result.added + result.replaced === 1 ? "decision" : "decisions"}: ${result.added} new, ${result.replaced} replaced${result.conflicts ? `, ${result.conflicts} with conflicts` : ""}${result.skipped ? `, ${result.skipped} skipped (malformed)` : ""}.`);
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
          <p>{changes.length} {changes.length === 1 ? "decision" : "decisions"}{conflicts > 0 ? ` · ${conflicts} in conflict` : ""} · saved in this browser · not approved, not published</p>
        </div>
        <button type="button" className="rgx-close" onClick={onClose} aria-label="Close changes">×</button>
      </header>
      <div className="rgx-actions">
        <button type="button" className="rgx-primary" disabled={!changes.length} onClick={() => save("both")}>Export for review</button>
        <button type="button" disabled={!changes.length} onClick={() => save("markdown")} title={EXPORT_FILES.markdown}>Review document</button>
        <button type="button" disabled={!changes.length} onClick={() => save("json")} title={EXPORT_FILES.json}>Change set</button>
        <button type="button" onClick={() => fileRef.current?.click()}>Import</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(event) => importFile(event.target.files?.[0])} />
      </div>
      {message && <p className="rgx-message" role="status">{message}</p>}
      <div className="rgx-segment rgx-tabs" role="group" aria-label="Panel">
        <button type="button" aria-pressed={tab === "changes"} onClick={() => setTab("changes")}>Decisions ({changes.length})</button>
        <button type="button" aria-pressed={tab === "hidden"} onClick={() => setTab("hidden")}>Hidden text ({hidden.length})</button>
      </div>
      {tab === "hidden" && (
        <>
          <p className="rgx-empty">Text on this page that is not shown as text: image descriptions, names read by screen readers, and the title and description used by search engines and link previews. Edit it here; empty it or choose Remove to take it away.</p>
          <ol>
            {hidden.map((id, index) => {
              const meta = sectionFor(id);
              const heading = meta ? sectionTitle(meta) : "";
              const previous = index > 0 ? sectionFor(hidden[index - 1]) : undefined;
              return (
                <li key={id}>
                  {meta !== previous && <h3>{heading}</h3>}
                  <HiddenRow id={id} draft={drafts[id]} notify={notify} />
                </li>
              );
            })}
          </ol>
        </>
      )}
      {tab === "changes" && changes.length === 0 && <p className="rgx-empty">No decisions yet. Click outlined text on the page to rewrite, shorten, remove or keep it; your decisions appear here. Image descriptions and search text are under Hidden text.</p>}
      {tab === "changes" && <ol>
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
      </ol>}
      {changes.length > 0 && (
        <footer>
          {confirmAll ? (
            <><span>Undo all {changes.length} decisions?</span><button type="button" className="rgx-danger" onClick={() => { editorial.replaceDrafts(() => ({})); setConfirmAll(false); setMessage("All decisions undone."); }}>Undo all</button><button type="button" onClick={() => setConfirmAll(false)}>Keep</button></>
          ) : (
            <button type="button" onClick={() => setConfirmAll(true)}>Undo all…</button>
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
  const rewritten = draft.op === "REPLACE" || draft.op === "SHORTEN";
  const diff = wordDiff(draft.base, draft.text);
  const structural = structuralReason(draft.id, draft.op, draft.scope, { base: draft.base, proposed: draft.text });
  const warnings = warningsOf(draft);
  const kind = kindOf(draft.id);
  const operation = draft.op === "REMOVE" ? `Remove ${SCOPE_LABEL[draft.scope ?? "item"]}` : OPERATION_LABEL[draft.op];
  return (
    <article className="rgx-change" data-conflict={conflict ?? undefined} data-op={draft.op}>
      <div className="rgx-field">
        <b>{fieldLabel(draft.id, itemContext(draft.id))}</b>
        <span className="rgx-badge" data-op={draft.op}>{operation}</span>
      </div>
      {kind !== "visible" && <p className="rgx-kind-label">{KIND_LABEL[kind]} · not shown as text</p>}
      {sectionFor(draft.id)?.page === "shared" && <p className="rgx-kind-label">On both pages</p>}
      {structural && <div className="rgx-conflict"><b>⚠ Structural decision:</b> {structural} It needs separate approval.</div>}
      {conflict === "source-changed" && (
        <div className="rgx-conflict">
          <b>Source changed since this decision.</b> The site now reads: “{plain(source ?? "")}”
          <span><button type="button" onClick={() => editorial.replaceDrafts((drafts) => rebase(drafts, draft.id, source ?? draft.base))}>Keep my decision</button></span>
        </div>
      )}
      {conflict === "unknown-id" && <div className="rgx-conflict"><b>{/^Retired/.test(exclusionReason(draft.id) ?? "") ? exclusionReason(draft.id) : "This text is no longer editable on the site."}</b> Keep it for the record, or undo it.</div>}
      {warnings.map((warning) => <div key={warning} className="rgx-conflict">{warning}</div>)}
      <dl>
        <dt>Current</dt><dd className="rgx-original">{rewritten ? diff.removed : plain(draft.base)}</dd>
        <dt>Proposed</dt>
        <dd className="rgx-proposed">
          {rewritten ? diff.added : draft.op === "REMOVE" ? <em>Remove {SCOPE_LABEL[draft.scope ?? "item"]} from the page</em> : <em>Keep as is (reviewed)</em>}
        </dd>
        {/* Formatting (November 10): the proposal as it will read, and its exact source text. */}
        {rewritten && hasFormatting(draft.text) && <><dt>Formatted</dt><dd className="rgx-formatted" onClickCapture={(event) => event.preventDefault()} title={draft.text}>{rich(draft.text)}</dd></>}
        {rewritten && (hasFormatting(draft.text) || hasFormatting(draft.base)) && <><dt>Markup</dt><dd><code className="rgx-markup">{draft.text}</code></dd></>}
        {rewritten && plain(draft.base) === plain(draft.text) && <><dt>Change</dt><dd>Formatting only</dd></>}
      </dl>
      {rewritten && (
        <div className="rgx-segment rgx-kind" role="group" aria-label="Kind of change">
          <button type="button" aria-pressed={draft.op === "REPLACE"} onClick={() => editorial.operate(draft.id, "REPLACE", source ?? draft.base)}>Rewrite</button>
          <button type="button" aria-pressed={draft.op === "SHORTEN"} onClick={() => editorial.operate(draft.id, "SHORTEN", source ?? draft.base)}>Shorten</button>
        </div>
      )}
      <label className="rgx-comment">
        <span>Comment</span>
        <textarea rows={2} value={comment} placeholder="Why this decision, or a question for review" onChange={(event) => setCommentText(event.target.value)} onBlur={saveComment} />
      </label>
      <div className="rgx-row-actions">
        <button type="button" onClick={onShow}>{kind === "visible" ? "Show on page" : "Show in Hidden text"}</button>
        <button type="button" onClick={() => editorial.replaceDrafts((drafts) => revert(drafts, draft.id))}>{draft.op === "REMOVE" ? "Restore" : "Undo"}</button>
      </div>
    </article>
  );
}

// One hidden copy item (alt text, screen-reader name, search and sharing text):
// a text field with the same decisions as on the page.
function HiddenRow({ id, draft, notify }: { id: string; draft: Draft | undefined; notify: (message: string) => void }) {
  const source = originals.get(id) ?? draft?.base ?? "";
  const rewritten = draft?.op === "REPLACE" || draft?.op === "SHORTEN";
  const removed = draft?.op === "REMOVE";
  const current = rewritten ? draft.text : source;
  const [text, setText] = useState(current);
  useEffect(() => { setText(current); }, [current]);
  const label = fieldLabel(id, itemContext(id));
  const kind = kindOf(id);
  const save = () => {
    if (normalizeText(text) === normalizeText(current)) return;
    editorial.replaceDrafts((drafts) => applyEdit(drafts, id, text, source));
    if (!normalizeText(text)) notify(`Marked for removal. ${structuralReason(id, "REMOVE") ?? ""} This needs separate approval.`);
  };
  const operate = (op: Operation) => {
    editorial.operate(id, op, source, op === "REMOVE" ? "item" : undefined);
    if (op === "REMOVE") notify(`Marked for removal. ${structuralReason(id, "REMOVE") ?? ""} This needs separate approval.`);
    if ((op === "REPLACE" || op === "SHORTEN") && editorial.getSnapshot().drafts[id]?.op !== op) notify(`Edit the text first, then mark it as “${OPERATION_LABEL[op]}”.`);
  };
  const status = draft ? (removed ? "Removed" : STATE_LABEL[draft.op]) : "Unchanged";
  return (
    <article className="rgx-change" data-hidden-id={id} data-op={draft?.op}>
      <div className="rgx-field"><b>{label}</b><span className="rgx-badge" data-op={draft?.op}>{status}</span></div>
      <p className="rgx-kind-label">{KIND_LABEL[kind as Exclude<typeof kind, "visible">]}</p>
      <label className="rgx-comment">
        <span>{removed ? "Removed (Restore to edit)" : "Text"}</span>
        <textarea rows={2} value={removed ? source : text} disabled={removed} onChange={(event) => setText(event.target.value)} onBlur={save} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} />
      </label>
      <div className="rgx-row-actions">
        {!removed && <span className="rgx-segment" role="group" aria-label="Kind of change">
          <button type="button" aria-pressed={draft?.op === "REPLACE"} onMouseDown={(event) => event.preventDefault()} onClick={() => { save(); operate("REPLACE"); }}>Rewrite</button>
          <button type="button" aria-pressed={draft?.op === "SHORTEN"} onMouseDown={(event) => event.preventDefault()} onClick={() => { save(); operate("SHORTEN"); }}>Shorten</button>
        </span>}
        {!removed && draft?.op !== "KEEP" && <button type="button" onClick={() => operate("KEEP")}>Keep as is</button>}
        {!removed && <button type="button" onClick={() => operate("REMOVE")}>Remove</button>}
        {draft && <button type="button" onClick={() => editorial.replaceDrafts((drafts) => revert(drafts, id))}>{removed ? "Restore" : "Undo"}</button>}
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
html[data-editorial="draft"] rg-copy[data-selectable] { cursor: pointer; }
html[data-editorial="draft"] rg-copy[data-removed] { opacity: .45; text-decoration: line-through; text-decoration-color: #ee3c78; text-decoration-thickness: 2px; }
html[data-editorial="draft"] rg-copy[data-removed="inside"] { opacity: .3; }
html[data-editorial="draft"] rg-copy[data-kept] { box-shadow: inset 0 -2px 0 #3ec27f; }
html[data-editorial="draft"] rg-copy[data-warning] { outline: 2px dotted #f5a524; }
html[data-editorial] [data-rgx-folded] { display: none !important; }
html[data-editorial="draft"] rg-copy[data-editable]:empty::before { content: "(empty: type to add text)"; opacity: .55; }
html[data-editorial] rg-copy[data-flash] { animation: rgx-flash 1.6s ease-out; }
@keyframes rgx-flash { 0%, 30% { background: color-mix(in srgb, #ee3c78 40%, transparent); } }
@media (prefers-reduced-motion: reduce) { html[data-editorial] rg-copy { transition: none; } html[data-editorial] rg-copy[data-flash] { animation: none; outline: 3px solid #ee3c78; } }

.rgx-bar, .rgx-panel, .rgx-chip, .rgx-format { color: #f4f4f5; font: 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif; letter-spacing: normal; text-transform: none; }
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
.rgx-status { border: 1px solid #f4c152; border-radius: 999px; color: #f4c152; font-size: 12px; padding: 3px 10px; white-space: nowrap; }
.rgx-segment { background: #262a33; border-radius: 999px; display: inline-flex; padding: 2px; }
.rgx-segment button { background: transparent; border: 0; padding: 4px 10px; }
.rgx-segment button[aria-pressed="true"] { background: #ee3c78; color: #fff; }
.rgx-changes b { color: #ff8fb5; }
.rgx-changes i { color: #f5a524; font-style: normal; }
.rgx-hint { color: #b9bcc6; flex-basis: 100%; font-size: 12px; margin: 0; padding: 0 6px 2px; }
.rgx-item { align-items: center; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-basis: 100%; flex-wrap: wrap; gap: 6px; padding: 8px 2px 2px; }
.rgx-item-name { color: #b9bcc6; flex-basis: 100%; font-size: 12px; padding: 0 4px; }
.rgx-item-name b { color: #f4f4f5; }
.rgx-remove { align-items: center; display: inline-flex; flex-wrap: wrap; gap: 4px; }
.rgx-remove > span { color: #b9bcc6; font-size: 12px; padding: 0 2px; }
.rgx-panel .rgx-primary { background: #ee3c78; border-color: #ee3c78; color: #fff; font-weight: 600; }
.rgx-panel .rgx-primary:hover:not(:disabled) { background: #d72f69; }
.rgx-badge { border-radius: 999px; font-size: 11px; padding: 1px 8px; white-space: nowrap; }
.rgx-field .rgx-badge { color: #fff; }
.rgx-badge[data-op="REPLACE"] { background: #7a2a52; }
.rgx-badge[data-op="SHORTEN"] { background: #2f4f7a; }
.rgx-badge[data-op="REMOVE"] { background: #8f1d3f; }
.rgx-badge[data-op="KEEP"] { background: #1f6b47; }
.rgx-kind { margin: 6px 0; }
.rgx-tabs { margin: 0 16px 8px; }
.rgx-kind-label { color: #8d919c; font-size: 11px; margin: 4px 0 0; }
.rgx-comment textarea:disabled { opacity: .55; text-decoration: line-through; }
.rgx-hint b { color: #f4f4f5; font-weight: 600; }
.rgx-chip {
  background: #15171c; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,.35); font-size: 12px; max-width: 320px; overflow: hidden; padding: 5px 9px;
  pointer-events: none; position: fixed; text-overflow: ellipsis; white-space: nowrap; z-index: 2147483000;
}
.rgx-chip span { color: #b9bcc6; }
.rgx-format {
  align-items: center; background: #15171c; border: 1px solid rgba(255,255,255,.14); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.4);
  display: flex; flex-wrap: wrap; gap: 6px; max-width: min(460px, calc(100vw - 16px)); padding: 6px 8px; position: fixed; z-index: 2147483000;
}
.rgx-format-label { color: #b9bcc6; font-size: 12px; max-width: 150px; overflow: hidden; padding: 0 2px; text-overflow: ellipsis; white-space: nowrap; }
.rgx-format-tools { align-items: center; display: inline-flex; gap: 4px; }
.rgx-format button { background: #262a33; border: 1px solid rgba(255,255,255,.14); border-radius: 8px; color: inherit; cursor: pointer; font: inherit; min-height: 32px; min-width: 32px; padding: 4px 8px; }
.rgx-format button:hover:not(:disabled) { background: #323743; }
.rgx-format button[aria-pressed="true"] { background: #ee3c78; border-color: #ee3c78; color: #fff; }
.rgx-format button:disabled { cursor: default; opacity: .35; }
.rgx-format button:focus-visible, .rgx-format input:focus-visible { outline: 2px solid #ee3c78; outline-offset: 2px; }
.rgx-formatted a { color: #ff8fb5; }
.rgx-markup { background: #262a33; border-radius: 6px; color: #d6d8de; display: block; font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; padding: 4px 6px; }
.rgx-format-sep { background: rgba(255,255,255,.14); height: 20px; margin: 0 2px; width: 1px; }
.rgx-format-note { color: #8d919c; font-size: 11px; }
.rgx-format-link { align-items: center; border-top: 1px solid rgba(255,255,255,.1); display: flex; flex-basis: 100%; flex-wrap: wrap; gap: 6px; padding-top: 6px; }
.rgx-format-link label { display: grid; flex: 1 1 220px; gap: 2px; }
.rgx-format-link label span { color: #8d919c; font-size: 11px; }
.rgx-format-link input { background: #262a33; border: 1px solid rgba(255,255,255,.14); border-radius: 8px; color: inherit; font: inherit; min-height: 32px; padding: 4px 8px; }
.rgx-format-link small { color: #8d919c; flex-basis: 100%; font-size: 11px; }
/* Phones: pinned to the top, clear of the on-screen keyboard. */
.rgx-format[data-narrow] { left: 8px; max-width: none; right: 8px; top: 8px; }
.rgx-format[data-narrow] .rgx-format-label { max-width: 40vw; }
.rgx-format[data-narrow] button { min-height: 40px; min-width: 40px; }
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
