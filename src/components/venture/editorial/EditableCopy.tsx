"use client";

import type { ReactNode } from "react";
import { fieldLabel, sectionFor, sectionTitle } from "@/lib/editorial/config";
import { removedBy, warningsOf } from "@/lib/editorial/drafts";

export { isEditableId } from "@/lib/editorial/config";
import type { Copy } from "@/lib/narrative/types";
import { useEditorial } from "./store";

type Props = {
  copy: Copy;
  before: string;
  after: string;
  // What CopyText renders without Editorial Mode: shown until the mode is on,
  // so the page (and its server render) is unchanged.
  fallback: ReactNode;
  rich: (text: string) => ReactNode;
  flag: (children: ReactNode) => ReactNode;
};

// One editable copy item. With Editorial Mode on, the text sits in an <rg-copy>
// element: a custom element, so no `span` or `:first-child` rule of the site's
// CSS matches it and the layout is unchanged. EditorialMode.tsx handles the
// editing itself (focus, typing, guards, the operations).
//
// Draft view: the decision is visible (rewritten text highlighted, removed text
// struck through, kept text marked) and text can be edited. Preview: the page as
// it would read; a removed item leaves only an empty, hidden marker, which
// EditorialMode uses to fold away whatever only held it (a paragraph, a button).
export default function EditableCopy({ copy, before, after, fallback, rich, flag }: Props) {
  const { active, view, drafts, epoch, revs } = useEditorial();
  if (!active) return <>{fallback}</>;
  const draft = drafts[copy.id];
  const removal = view === "original" ? undefined : removedBy(drafts, copy.id);
  if (view === "preview" && removal) return <rg-copy hidden data-copy-id={copy.id} data-removed="" />;
  const showDraft = view !== "original";
  const rewritten = showDraft && draft && (draft.op === "REPLACE" || draft.op === "SHORTEN");
  const text = rewritten ? draft.text : copy.text;
  const section = sectionFor(copy.id);
  const label = section ? `${sectionTitle(section)} · ${fieldLabel(copy.id)}` : copy.id;
  const editing = view === "draft";
  const editable = editing && !removal;
  const element = (
    <rg-copy
      key={`${epoch}.${revs[copy.id] ?? 0}`}
      ref={(node: HTMLElement | null) => {
        if (!node) return;
        node.contentEditable = editable ? "true" : "false";
        node.spellcheck = false;
      }}
      data-copy-id={copy.id}
      data-copy-source={copy.text}
      data-copy-label={label}
      title={editing ? (removal ? `${label} (removed: click to choose)` : `${label} (click to edit)`) : undefined}
      data-editable={editable ? "" : undefined}
      data-selectable={editing ? "" : undefined}
      data-op={editing && draft ? draft.op : undefined}
      data-changed={editing && rewritten ? "" : undefined}
      data-removed={editing && removal ? (removal.id === copy.id ? "self" : "inside") : undefined}
      data-kept={editing && draft?.op === "KEEP" ? "" : undefined}
      data-commented={editing && draft?.comment ? "" : undefined}
      data-warning={editing && draft && warningsOf(draft).length ? "" : undefined}
      data-conflict={editing && draft && draft.base !== copy.text ? "" : undefined}
    >
      {rich(text)}
    </rg-copy>
  );
  return <>{before}{flag(element)}{after}</>;
}
