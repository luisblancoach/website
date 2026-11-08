"use client";

import type { ReactNode } from "react";
import { fieldLabel, sectionFor, sectionTitle } from "@/lib/editorial/config";

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

// One editable copy item (local development only). With Editorial Mode on, the
// text sits in an <rg-copy> element: a custom element, so no `span` or
// `:first-child` rule of the site's CSS matches it and the layout is unchanged.
// EditorialMode.tsx handles the editing itself (focus, typing, guards).
export default function EditableCopy({ copy, before, after, fallback, rich, flag }: Props) {
  const { active, view, drafts, epoch, revs } = useEditorial();
  if (!active) return <>{fallback}</>;
  const draft = drafts[copy.id];
  const showDraft = view === "draft";
  const text = showDraft && draft ? draft.text : copy.text;
  const section = sectionFor(copy.id);
  const label = section ? `${sectionTitle(section)} · ${fieldLabel(copy.id)}` : copy.id;
  const element = (
    <rg-copy
      key={`${epoch}.${revs[copy.id] ?? 0}`}
      ref={(node: HTMLElement | null) => {
        if (!node) return;
        node.contentEditable = showDraft ? "true" : "false";
        node.spellcheck = false;
      }}
      data-copy-id={copy.id}
      data-copy-source={copy.text}
      data-copy-label={label}
      title={showDraft ? `${label} (click to edit)` : label}
      data-editable={showDraft ? "" : undefined}
      data-changed={showDraft && draft && draft.text !== draft.base ? "" : undefined}
      data-commented={showDraft && draft?.comment ? "" : undefined}
      data-conflict={showDraft && draft && draft.base !== copy.text ? "" : undefined}
    >
      {rich(text)}
    </rg-copy>
  );
  return <>{before}{flag(element)}{after}</>;
}
