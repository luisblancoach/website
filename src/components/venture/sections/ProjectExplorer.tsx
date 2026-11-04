"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { fallbackArtifacts, guildPortal, type GalleryItem } from "@/components/ArtifactGallery";
import { resolveArtifactPreview } from "@/lib/data/artifactPreviews";
import venture from "../venture.module.css";
import styles from "../explorer.module.css";

// November 3 (owner): the /community project explorer replaces the Explore /
// "Follow your curiosity" gallery (ArtifactGallery stays on "/" only). A
// video-site layout: category buttons, then one main media viewport (two
// thirds of the row on desktop) with the selected artifact's category, title
// and description below it, and a vertical stack of horizontal project cards on
// the right. The Portal is selected by default.
// - The viewport has previous / next chevrons at its edges and one primary
//   action, "Explore now" (no icon): the artifact in a new tab, or the on-page
//   Portal experience. Static screenshots (recordings may come later).
// - Clicking the screenshot opens a larger view (Radix dialog: focus trap,
//   Escape, focus back to the screenshot).
// - Cards are buttons with aria-current; Arrow Up / Down, Home and End move
//   between them, Enter or Space selects. Metadata is a polite live region.
// - Category buttons filter the stack (aria-pressed); "Explore all" reveals the
//   rest of the category under the first six.
// - A short crossfade when the artifact changes; none with reduced motion.
// Data and artwork are the gallery's own: the Portal entry, the live
// /api/artifacts catalog (fallback list when offline) and /api/posts, with
// screenshots from resolveArtifactPreview. No new artwork.
const VISIBLE = 6;
const artifactUrl = (item: GalleryItem) => item.href || `https://portal-artifacts-production.up.railway.app/${item.id}/`;
const isGame = (item: GalleryItem) => /game|arcade/i.test(item.category);
const isTool = (item: GalleryItem) => /tool|interface|utility/i.test(item.category);
const CATEGORIES: [string, string, (item: GalleryItem) => boolean][] = [
  ["all", "Everything", () => true],
  ["experiment", "Experiences", (item) => item.kind === "experiment"],
  ["game", "Games", isGame],
  ["tool", "Tools & interfaces", isTool],
  ["post", "Field notes", (item) => item.kind === "post"],
];

export default function ProjectExplorer({ onOpenPortal }: { onOpenPortal?: () => void }) {
  const [posts, setPosts] = useState<GalleryItem[]>([]);
  const [experiments, setExperiments] = useState<GalleryItem[]>(fallbackArtifacts);
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(guildPortal.id);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const base = useId();

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/artifacts", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Unavailable"); return response.json(); })
      .then(({ docs }) => { if (Array.isArray(docs) && docs.length) setExperiments(docs); })
      .catch(() => {});
    fetch("/api/posts", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Unavailable"); return response.json(); })
      .then(({ docs }) => { if (Array.isArray(docs)) setPosts(docs); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Same order as the gallery: the Portal, then experiments and field notes interleaved.
  const tagged = experiments.map((item) => ({ ...item, kind: "experiment" as const }));
  const all: GalleryItem[] = [guildPortal, ...Array.from({ length: Math.max(posts.length, tagged.length) }, (_, index) => [tagged[index], posts[index]].filter(Boolean)).flat()];
  const categories = CATEGORIES.filter(([value, , test]) => value === "all" || all.some(test));
  const test = (CATEGORIES.find(([value]) => value === category) ?? CATEGORIES[0])[2];
  const items = all.filter(test);
  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? all[0];
  const index = Math.max(0, items.indexOf(selected));
  // The selected card always stays in view, even when it sits past the first six.
  const shown = expanded ? items : items.filter((item, position) => position < VISIBLE || item.id === selected.id);
  const hidden = items.length - Math.min(items.length, VISIBLE);
  const image = resolveArtifactPreview(selected.id, selected.image);
  const isPortal = selected.id === guildPortal.id;
  const url = isPortal ? null : artifactUrl(selected);

  const select = (id: string) => setSelectedId(id);
  const step = (direction: 1 | -1) => { if (items.length) select(items[(index + direction + items.length) % items.length].id); };
  const choose = (value: string) => {
    setCategory(value); setExpanded(false);
    const next = all.filter((CATEGORIES.find(([key]) => key === value) ?? CATEGORIES[0])[2]);
    if (!next.some((item) => item.id === selectedId) && next[0]) setSelectedId(next[0].id);
  };

  const move = (event: KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>("button[data-item]") ?? [])];
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : Math.min(buttons.length - 1, Math.max(0, current + (event.key === "ArrowDown" ? 1 : -1)));
    buttons[next]?.focus();
  };

  const media = (item: GalleryItem, large = false) => {
    const src = resolveArtifactPreview(item.id, item.image);
    return src
      ? <Image src={src} alt={large ? `Preview of ${item.title}` : ""} width={1280} height={720} unoptimized={src.startsWith("https:")} sizes={large ? "90vw" : "(max-width: 999px) 100vw, 66vw"} priority={!large && item.id === guildPortal.id} />
      : <span className={styles.noPreview} aria-hidden="true">{item.category}</span>;
  };

  // One primary action, no icon (owner, November 3): "Explore now" opens the artifact in a new tab; for the
  // Portal it opens the on-page experience. Static screenshots for now (recordings may follow).
  const actions = (
    <div className={styles.actions}>
      {isPortal ? (
        <Dialog.Trigger asChild>
          <button type="button" className={`${venture.pill} ${venture.pillFilled} ${styles.action}`} onClick={onOpenPortal}><span>Explore now</span></button>
        </Dialog.Trigger>
      ) : (
        <a className={`${venture.pill} ${venture.pillFilled} ${styles.action}`} href={url!} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${selected.title} now (opens in a new tab)`}><span>Explore now</span></a>
      )}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.categories} role="group" aria-label="Filter the projects">
        {categories.map(([value, label]) => <button key={value} type="button" aria-pressed={category === value} onClick={() => choose(value)}>{label}</button>)}
      </div>
      <div className={styles.explorer}>
        <div className={styles.stage}>
          <div className={styles.viewport}>
            <Dialog.Root open={zoom} onOpenChange={setZoom}>
                <Dialog.Trigger asChild>
                  <button type="button" className={styles.media} aria-label={`View ${selected.title} larger`} disabled={!image}>
                    <span key={selected.id} className={styles.mediaFrame}>{media(selected)}</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className={styles.lightboxOverlay} />
                  <Dialog.Content className={styles.lightbox} aria-describedby={`${base}-lightbox-desc`}>
                    <div className={styles.lightboxBar}>
                      <Dialog.Title className={styles.lightboxTitle}>{selected.title}</Dialog.Title>
                      <Dialog.Close className={styles.lightboxClose}>Close <span aria-hidden="true">×</span></Dialog.Close>
                    </div>
                    <p id={`${base}-lightbox-desc`} className={styles.srOnly}>{selected.category}. Press Escape to close.</p>
                    <div className={styles.lightboxMedia}>{media(selected, true)}</div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            {items.length > 1 && <>
              <button type="button" className={`${styles.chevron} ${styles.chevronPrev}`} aria-label="Previous project" onClick={() => step(-1)}><ChevronLeft aria-hidden="true" focusable="false" /></button>
              <button type="button" className={`${styles.chevron} ${styles.chevronNext}`} aria-label="Next project" onClick={() => step(1)}><ChevronRight aria-hidden="true" focusable="false" /></button>
            </>}
            {/* November 3 (owner): category, title and description over the screenshot on a transparent shadow,
                "Explore now" at the lower right. Phones (< 640 px) set them under the image. */}
            <div className={styles.caption}>
              <div key={selected.id} className={styles.meta} aria-live="polite">
                <p className={styles.metaCategory}>{selected.category}</p>
                <h3 className={styles.metaTitle} style={{ "--chars": selected.title.length } as CSSProperties} title={selected.title}>{selected.title}</h3>
                <p className={styles.metaBody}>{selected.description}</p>
              </div>
              {actions}
            </div>
          </div>
        </div>

        <div className={styles.side}>
          <p id={`${base}-list`} className={styles.srOnly}>Projects, {items.length} in this category</p>
          <ul ref={listRef} id={`${base}-items`} className={`${styles.list} ${expanded ? styles.listExpanded : ""}`} aria-labelledby={`${base}-list`} onKeyDown={move}>
            {shown.map((item) => {
              const thumb = resolveArtifactPreview(item.id, item.image);
              return (
                <li key={item.id}>
                  <button type="button" data-item className={styles.item} aria-current={item.id === selected.id ? "true" : undefined} onClick={() => select(item.id)}>
                    <span className={styles.thumb}>{thumb ? <Image src={thumb} alt="" width={320} height={180} unoptimized={thumb.startsWith("https:")} sizes="160px" /> : <span className={styles.noPreview} aria-hidden="true" />}</span>
                    <span className={styles.itemText}><small>{item.category}</small><strong>{item.title}</strong></span>
                  </button>
                </li>
              );
            })}
          </ul>
          {hidden > 0 && (
            <button type="button" className={styles.exploreAll} aria-expanded={expanded} aria-controls={`${base}-items`} onClick={() => setExpanded((value) => !value)}>
              {expanded ? "Show fewer" : `Explore all ${items.length}`} <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
