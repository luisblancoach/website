"use client";

// Adapted from Dekan's elastic experiments gallery and the Portal gallery study.
// Screenshots only: the live artifacts load in their own tab, never in this page.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { featuredDiscoveries } from "@/lib/data/featuredDiscoveries";
import { resolveArtifactPreview } from "@/lib/data/artifactPreviews";
import styles from "./ArtifactGallery.module.css";

export type GalleryItem = { id: string; title: string; category: string; description: string; image?: string | null; href?: string; kind?: "post" | "collaborator" | "experiment" };
type Artifact = GalleryItem;
const guildPortal: Artifact = {
  id: "raidguild-portal", title: "The Portal", category: "Interactive experience",
  description: "Step into RaidGuild's world and follow the rabbit to begin a three-clue discovery trail through the site.",
  image: "/images/neo/hero-dark-poster.png", kind: "experiment",
};
const fallbackArtifacts: Artifact[] = [
  { id: "sirocco-oasis", title: "Sirocco Oasis", category: "3D world", description: "A desert reverie with rippling water, wind-driven palms, and a passing airship. Take a moment to explore." },
  { id: "lunar-republic", title: "Lunar Republic", category: "Game", description: "A lunar catapult game with allied cities, freight, upgrades, and a landscape that changes as you play." },
  { id: "portal-motion", title: "Portal Motion", category: "Motion study", description: "Explore the light, color, and energy behind a portal. An interactive study with palette and size controls." },
  { id: "cosmic-carnival", title: "Cosmic Carnival", category: "Arcade game", description: "A twelve-lane alien arcade shooter with sculptural characters, patterned waves, and a psychedelic title reveal." },
  { id: "module-gallery-study", title: "Elastic Gallery", category: "Interface study", description: "The expanding-grid experiment behind this collection. Unfold an editorial mosaic or explore its alternative spatial view. The original study uses sample modules." },
  { id: "desert-walker", title: "Desert Walker", category: "3D vignette", description: "A dieselpunk survey walker in a procedural desert. Orbit the scene and explore its ambient motion." },
];

export default function ArtifactGallery({ collaborators = [], showFeatured = true, onOpenPortal }: { collaborators?: GalleryItem[]; showFeatured?: boolean; onOpenPortal?: () => void }) {
  const [posts, setPosts] = useState<GalleryItem[]>([]);
  const [postsState, setPostsState] = useState<"loading" | "live" | "error">("loading");
  const [modules, setArtifacts] = useState(fallbackArtifacts);
  const [filter, setFilter] = useState("all");
  const experiments = modules.map(item => ({ ...item, kind: "experiment" as const }));
  const collection = [guildPortal, ...Array.from({ length: Math.max(posts.length, collaborators.length, experiments.length) }, (_, index) =>
    [posts[index], experiments[index], collaborators[index]].filter(Boolean)).flat()];
  const artifacts = collection.filter(item => filter === "all" || item.kind === filter);
  const [catalogState, setCatalogState] = useState<'loading' | 'live' | 'fallback'>('loading');
  const [selected, setSelected] = useState<string | null>(null);
  const [peek, setPeek] = useState<string | null>(null);
  const [columns, setColumns] = useState(4);
  const grid = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previous = useRef<string | null>(null);
  const zones = useRef<{ id: string; rect: DOMRect }[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const hoverFrame = useRef<number | null>(null);
  const focusedCard = () => grid.current?.querySelector<HTMLElement>("[data-artifact]:focus-within")?.dataset.artifact || null;
  const reconcileHover = () => {
    hoverFrame.current = null;
    const root = grid.current;
    if (!root) return;
    const position = pointer.current;
    if (!position) {
      const focused = focusedCard();
      setPeek(current => current === focused ? current : focused);
      return;
    }
    // Hit zones follow the equal-width resting slots, not animated card edges.
    if (!zones.current.length) zones.current = Array.from(root.querySelectorAll<HTMLElement>("[data-elastic-row]")).flatMap(row => {
      const bounds = row.getBoundingClientRect();
      const width = bounds.width / columns;
      return Array.from(row.querySelectorAll<HTMLElement>("[data-artifact]")).map((el, index) => ({
        id: el.dataset.artifact!, rect: new DOMRect(bounds.left + index * width, bounds.top, width, bounds.height),
      }));
    });
    const hit = zones.current.find(({ rect }) => position.x >= rect.left && position.x <= rect.right && position.y >= rect.top && position.y <= rect.bottom);
    const next = hit?.id || null;
    setPeek(current => current === next ? current : next);
  };
  const scheduleHover = () => {
    if (hoverFrame.current === null) hoverFrame.current = requestAnimationFrame(reconcileHover);
  };
  const scheduleHoverRef = useRef(scheduleHover);
  scheduleHoverRef.current = scheduleHover;
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/posts", { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Unavailable"); return response.json(); })
      .then(({ docs }) => {
        if (!Array.isArray(docs)) throw new Error("Invalid posts");
        setPosts(docs); setPostsState("live"); zones.current = [];
      })
      .catch(() => { if (!controller.signal.aborted) setPostsState("error"); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    // Hit zones use viewport coordinates. Scrolling changes those coordinates
    // even while the pointer remains inside the gallery.
    const invalidateZones = () => {
      zones.current = [];
      scheduleHoverRef.current();
    };
    window.addEventListener("scroll", invalidateZones, { capture: true, passive: true });
    window.addEventListener("resize", invalidateZones);
    return () => {
      window.removeEventListener("scroll", invalidateZones, true);
      window.removeEventListener("resize", invalidateZones);
      if (hoverFrame.current !== null) cancelAnimationFrame(hoverFrame.current);
      hoverFrame.current = null;
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/artifacts', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(({ docs }) => {
        if (!Array.isArray(docs)) throw new Error('Invalid catalog');
        setArtifacts(docs); setPeek(null); zones.current = [];
        setCatalogState('live');
      })
      .catch(() => { if (!controller.signal.aborted) setCatalogState('fallback'); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const root = grid.current;
    if (!root) return;
    let lastWidth = -1;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      // Elastic title wrapping can resize the height; that is not a breakpoint
      // change and must not cancel the hover that caused it.
      if (Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;
      setColumns(Math.max(2, Math.floor(width / 190)));
      setPeek(null); zones.current = [];
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  const select = (id: string | null) => {
    setPeek(null); setSelected(id);
  };
  useEffect(() => {
    const root = grid.current;
    if (!root) return;
    if (selected) {
      closeButton.current?.focus({ preventScroll: true });
      if (matchMedia("(max-width: 800px)").matches) closeButton.current?.closest("aside")?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    else if (previous.current) root.querySelector<HTMLButtonElement>(`[data-artifact="${previous.current}"] button`)?.focus({ preventScroll: true });
    previous.current = selected; zones.current = [];
  }, [selected]);
  const active = artifacts.find(item => item.id === selected);
  const preview = (item: Artifact, detail = false) => {
    const screenshot = resolveArtifactPreview(item.id, item.image);
    return screenshot
      ? <Image className={item.kind === "collaborator" ? `${styles.logo} ${["network-logo-Daedalus", "network-logo-LX2"].includes(item.id) ? styles.compactLogo : ""}` : undefined} src={screenshot} alt={detail ? `Preview of ${item.title}` : ''} width={1280} height={720} unoptimized={screenshot.startsWith('https:')} sizes="(max-width: 600px) 90vw, (max-width: 999px) 45vw, 760px" />
      : <span className={styles.placeholder} aria-hidden="true">{item.category}<b>↗</b></span>;
  };
  const card = (item: typeof artifacts[number]) => <article key={item.id} data-artifact={item.id} data-peek={peek === item.id} className={`${styles.card} ${item.id === guildPortal.id ? styles.portalCard : ""}`}>
    <button type="button" aria-expanded={selected === item.id} aria-controls="artifact-detail" aria-label={`Unfold ${item.title}. ${item.description}`} onClick={() => select(item.id)} onFocus={() => setPeek(item.id)} onBlur={() => setPeek(null)}>
      <span className={styles.visual}>{preview(item)}<b aria-hidden="true">+</b></span>
      <span className={styles.caption} aria-hidden="true"><strong>{item.title}</strong><small>{item.id === guildPortal.id ? "Open the experience · Start the hunt" : item.description}</small></span>
    </button>
  </article>;
  const rows = (items: GalleryItem[]) => Array.from({ length: Math.ceil(items.length / columns) }, (_, row) => {
    const itemsInRow = items.slice(row * columns, (row + 1) * columns);
    return <div key={row} data-elastic-row className={styles.row} style={{ gridTemplateColumns: Array.from({ length: columns }, (_, index) => itemsInRow[index]?.id === peek ? "minmax(0, 1.5fr)" : "minmax(0, 1fr)").join(" ") }}>{itemsInRow.map(card)}</div>;
  });
  return <section className={styles.section} aria-labelledby="artifact-heading">
    <h3 id="artifact-heading" className={styles.srOnly}>Explore the frontier collection</h3>
    {showFeatured && <div className={styles.featured} aria-labelledby="featured-discoveries-heading">
      <div className={styles.featuredHeading}>
        <h4 id="featured-discoveries-heading">Selected discoveries</h4>
        <p>Public experiments from the network. Explore a few starting points, then browse the live collection below.</p>
      </div>
      <div className={styles.featuredGrid}>
        {featuredDiscoveries.map((item) => (
          <article key={item.href} className={styles.featuredCard}>
            <span>{item.category}</span>
            <h5><a href={item.href} target="_blank" rel="noopener noreferrer">{item.title} ↗</a></h5>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </div>}
    <div className={styles.guide}><span>{String(artifacts.length).padStart(2, '0')} / DISCOVERIES</span><span>{active ? "Select a preview to switch" : "Select a tile to unfold"}</span></div>
    {postsState === "error" && <p>Community posts are temporarily unavailable. <a href="https://portal.raidguild.org/posts" target="_blank" rel="noopener noreferrer">Read them on Portal →</a></p>}
    {artifacts.length === 0 && <p>{filter === "post" && postsState === "loading" ? "Loading the latest public posts…" : "No entries in this collection."}</p>}
    <div className={styles.layout} onKeyDown={event => { if (event.key === "Escape" && selected) { event.preventDefault(); select(null); } }}>
    <div ref={grid} className={styles.previews} onPointerLeave={() => {
      pointer.current = null;
      const focused = focusedCard();
      setPeek(current => current === focused ? current : focused);
    }} onPointerMove={event => {
      if ((!active && columns === 1) || event.pointerType === "touch" || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      pointer.current = { x: event.clientX, y: event.clientY };
      scheduleHover();
    }} onPointerEnter={() => { zones.current = []; }}>
      {rows(artifacts)}
    </div>
    <aside className={styles.detail} id="artifact-detail" aria-label="Discovery details">
      <div className={styles.filters} aria-label="Filter the collection">
        {[["all", "Everything"], ["post", "Field notes"], ["experiment", "Experiments"], ...(collaborators.length ? [["collaborator", "Built with"]] : [])].map(([value, label]) =>
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setSelected(null); previous.current = null; setFilter(value); setPeek(null); zones.current = []; }}>{label}</button>)}
      </div>
      {active ? <>
          <button ref={closeButton} className={styles.back} onClick={() => select(null)}>← Back to the collection <span aria-hidden="true">×</span></button>
          <div className={styles.feature}>{preview(active, true)}<div><p>{active.category}</p><h4>{active.title}</h4><p>{active.description}</p>{active.id === guildPortal.id ? <Dialog.Trigger asChild><button className={styles.portalLaunch} type="button" onClick={onOpenPortal}>Open the Portal · Begin the hunt ↗<small>Opens an experience on this page</small></button></Dialog.Trigger> : (active.href || active.kind !== "collaborator") && <a href={active.href || `https://portal-artifacts-production.up.railway.app/${active.id}/`} target="_blank" rel="noopener noreferrer">{active.kind === "collaborator" ? `Visit ${active.title}` : active.kind === "post" ? "Read the post" : "Explore experiment"} ↗<small>Opens in a new tab</small></a>}</div></div>
      </> : <div className={styles.empty}><span aria-hidden="true">↖</span><h4>Follow your curiosity.</h4><p>{collaborators.length ? "Select a card to explore a field note, a public experiment, or someone we’ve built with." : "Select a card to explore a field note or a public experiment."}</p><p>Choose a category above to narrow the collection.</p></div>}
    </aside>
    </div>
    <p className={styles.footnote}>{catalogState === 'fallback' ? 'The live experiment catalog is unavailable. Showing selected experiments. ' : collaborators.length ? 'Field notes, public experiments, clients, collaborators, and member-built projects. ' : 'Field notes and public experiments from across the network. '}<a href="https://portal.raidguild.org/modules" target="_blank" rel="noopener noreferrer">Browse Portal modules ↗</a></p>
  </section>;
}
