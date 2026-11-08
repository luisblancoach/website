// Editorial Mode state in the browser (local development only; see
// lib/editorial/config.ts). Drafts and the mode live in localStorage, apart
// from the narrative data; nothing here writes files or calls a server.
//
// Typing does not re-render: keystrokes go to `pending` and are autosaved
// directly, and React sees the text when the edit is committed (blur, Enter).
// Re-rendering an element while it is being edited would move the caret.
import { useSyncExternalStore } from "react";
import { applyEdit, parseStored, serializeStored, setOperation, type Drafts, type Operation, type RemoveScope } from "@/lib/editorial/drafts";

// Original: the published copy. Draft: the decisions, editable. Preview: the page as
// it would read with every decision applied (removals taken out), not editable.
export type View = "draft" | "original" | "preview";
export type EditorialState = {
  active: boolean;
  view: View;
  drafts: Drafts;
  // Bumped when the page text must be re-rendered from state (they key the editable
  // elements): `epoch` for every item, `revs[id]` for one item after its edit.
  epoch: number;
  revs: Record<string, number>;
  storage: boolean;
};

const DRAFTS_KEY = "raidguild-editorial-drafts";
const MODE_KEY = "raidguild-editorial-mode";

const SERVER_STATE: EditorialState = { active: false, view: "draft", drafts: {}, epoch: 0, revs: {}, storage: true };
let state: EditorialState | null = null;
const pending = new Map<string, { text: string; source: string }>();
const listeners = new Set<() => void>();
let saveTimer = 0;

function read(key: string) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { window.localStorage.setItem(key, value); return true; } catch { return false; }
}

function load(): EditorialState {
  const mode = (() => { try { return JSON.parse(read(MODE_KEY) ?? "{}") as Partial<EditorialState>; } catch { return {}; } })();
  const requested = new URLSearchParams(window.location.search).get("editorial");
  const active = requested === "1" ? true : requested === "0" ? false : mode.active === true;
  let storage = true;
  try { window.localStorage.setItem(`${DRAFTS_KEY}:probe`, "1"); window.localStorage.removeItem(`${DRAFTS_KEY}:probe`); } catch { storage = false; }
  return { active, view: mode.view === "original" || mode.view === "preview" ? mode.view : "draft", drafts: parseStored(read(DRAFTS_KEY)), epoch: 1, revs: {}, storage };
}

function current(): EditorialState {
  if (!state) state = load();
  return state;
}

function persist(next: EditorialState) {
  let drafts = next.drafts;
  for (const [id, entry] of pending) drafts = applyEdit(drafts, id, entry.text, entry.source);
  const ok = write(DRAFTS_KEY, serializeStored(drafts)) && write(MODE_KEY, JSON.stringify({ active: next.active, view: next.view }));
  if (!ok && next.storage) state = { ...next, storage: false };
}

// `rerender`: true re-renders every editable element, an id re-renders that one only.
function set(update: (previous: EditorialState) => EditorialState, rerender: boolean | string = false) {
  const previous = current();
  const next = update(previous);
  state = rerender === true ? { ...next, epoch: previous.epoch + 1 }
    : typeof rerender === "string" ? { ...next, revs: { ...next.revs, [rerender]: (next.revs[rerender] ?? 0) + 1 } }
    : next;
  persist(state);
  listeners.forEach((listener) => listener());
}

// Another tab changed the drafts or the mode: reload, unless an edit is in progress here.
function syncFromOtherTab(event: StorageEvent) {
  if ((event.key !== DRAFTS_KEY && event.key !== MODE_KEY) || pending.size > 0) return;
  state = { ...load(), epoch: current().epoch + 1 };
  listeners.forEach((listener) => listener());
}

export const editorial = {
  subscribe(listener: () => void) {
    if (listeners.size === 0) window.addEventListener("storage", syncFromOtherTab);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", syncFromOtherTab);
    };
  },
  getSnapshot: current,
  getServerSnapshot: () => SERVER_STATE,

  setActive(active: boolean) { this.commitAll(); set((s) => ({ ...s, active }), true); },
  setView(view: View) { this.commitAll(); set((s) => ({ ...s, view }), true); },

  // While typing: autosave without re-rendering.
  type(id: string, text: string, source: string) {
    pending.set(id, { text, source });
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => persist(current()), 250);
  },
  // End of an edit: the text becomes part of the state and the element re-renders.
  commit(id: string) {
    const entry = pending.get(id);
    if (!entry) return;
    pending.delete(id);
    set((s) => ({ ...s, drafts: applyEdit(s.drafts, id, entry.text, entry.source) }), id);
  },
  commitAll() {
    for (const id of [...pending.keys()]) this.commit(id);
  },
  // Escape: forget the keystrokes of this edit and restore the text it started with.
  cancel(id: string, startText: string, source: string) {
    pending.delete(id);
    set((s) => ({ ...s, drafts: applyEdit(s.drafts, id, startText, source) }), id);
  },
  // Keep as is, Remove (with its scope), Rewrite or Shorten for one item.
  operate(id: string, op: Operation, source: string, scope?: RemoveScope) {
    this.commitAll();
    set((s) => ({ ...s, drafts: setOperation(s.drafts, id, op, source, { scope }) }), true);
  },
  replaceDrafts(update: (drafts: Drafts) => Drafts) {
    this.commitAll();
    set((s) => ({ ...s, drafts: update(s.drafts) }), true);
  },
};

export const useEditorial = () => useSyncExternalStore(editorial.subscribe, editorial.getSnapshot, editorial.getServerSnapshot);
