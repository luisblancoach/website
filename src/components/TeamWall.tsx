"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { Mercenary } from "@/lib/data/members";
import { masonryRows } from "@/lib/data/memberCategories";
import { builderGridSlots } from "./venture/builderGrid";
import styles from "./venture/venture.module.css";

// Short filtered lists on /clients: an editorial grid that fills the wall's
// area (builderGrid.ts). Each member is one card, in data order.
function BuilderGrid({ members }: { members: Mercenary[] }) {
  const slots = builderGridSlots(members.length);
  if (!slots) return null;
  const area = ([c1, c2, r1, r2]: number[]) => `${r1} / ${c1} / ${r2} / ${c2}`;
  return (
    <div className={styles.teamWall}>
      <div className={styles.memberGridFrame} role="region" aria-label="Guild members">
        <div className={styles.memberGrid} data-count={members.length}>
          {members.map((member, index) => {
            const slot = slots[index];
            const style = { "--wide-area": area(slot.wide), "--narrow-area": area(slot.narrow), "--chars": member.name.length } as CSSProperties;
            const content = <><Image src={member.imagePath} alt="" width={160} height={160} draggable={false} /><span><strong title={member.name}>{member.name}</strong><small>{member.title}</small></span></>;
            return member.link
              ? <a key={member.name} className={styles.memberTile} style={style} data-wide={slot.wideShape} data-narrow={slot.narrowShape} href={member.link} target="_blank" rel="noopener noreferrer">{content}<i aria-hidden="true">↗</i></a>
              : <div key={member.name} className={styles.memberTile} style={style} data-wide={slot.wideShape} data-narrow={slot.narrowShape}>{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

// The first copy is the list of results: each member appears in it once, and it
// is the only copy in the accessibility tree and the tab order. A second,
// aria-hidden copy exists only to make the moving wall seamless, so it is
// rendered only while one copy is wider than the wall (then no member can be
// on screen twice) and motion is allowed. Short filtered lists sit still.
// `speed` is the automatic movement in CSS px per second (18 by default).
// `bleed` lets the moving wall run edge to edge across its section (/clients);
// whether it moves is then judged against the section's full width, so the
// layout cannot flip between the two widths.
export default function TeamWall({ members, suspended = false, masonry = false, speed = 18, bleed = false }: { members: Mercenary[]; suspended?: boolean; masonry?: boolean; speed?: number; bleed?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null);
  const [loops, setLoops] = useState(false);
  const hover = useRef(false);
  const focused = useRef(false);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const resumeAt = useRef(0);
  const suppressClick = useRef(false);

  useEffect(() => {
    const element = viewport.current;
    const results = element?.firstElementChild?.firstElementChild as HTMLElement | null;
    if (!element || !results) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = bleed ? element.closest("section") : null;
    const check = () => setLoops(!motion.matches && results.getBoundingClientRect().width > (frame?.clientWidth ?? element.clientWidth) + 1);
    const sizes = new ResizeObserver(check);
    sizes.observe(element);
    sizes.observe(results);
    if (frame) sizes.observe(frame);
    motion.addEventListener("change", check);
    check();
    return () => { sizes.disconnect(); motion.removeEventListener("change", check); };
  }, [members, masonry, bleed]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    if (!loops) { element.scrollLeft = 0; return; }
    if (suspended) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let previous = 0;
    let position = element.scrollLeft;
    const group = element.firstElementChild?.firstElementChild as HTMLElement | null;
    let distance = 0;
    const measure = () => {
      const loop = group?.parentElement;
      const gap = loop ? parseFloat(getComputedStyle(loop).columnGap) || 0 : 0;
      distance = group ? group.getBoundingClientRect().width + gap : 0;
    };
    const sizes = new ResizeObserver(measure);
    if (group) sizes.observe(group);
    measure();
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      position = element.scrollLeft;
      if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      if (visible && !document.hidden && !motion.matches && !hover.current && !focused.current && !drag.current && now > resumeAt.current) {
        if (distance > 0) {
          position = (position + elapsed * speed / 1000) % distance;
          element.scrollLeft = position;
        }
      } else {
        position = element.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [suspended, loops, speed]);

  if (masonry && builderGridSlots(members.length)) return <BuilderGrid members={members} />;

  return (
    <div className={styles.teamWall} data-bleed={bleed && loops ? "" : undefined}>
      <div
        ref={viewport}
        className={styles.memberMarquee}
        role="region"
        aria-label="Guild members; swipe or drag to explore"
        tabIndex={0}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") hover.current = true; }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") { hover.current = false; if (drag.current && !drag.current.moved) drag.current = null; } }}
        onFocusCapture={() => { focused.current = true; }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) focused.current = false; }}
        onWheel={() => { resumeAt.current = performance.now() + 2500; }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          suppressClick.current = false;
          drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start || event.pointerType !== "mouse") return;
          const delta = event.clientX - start.x;
          if (Math.abs(delta) > 5) {
            start.moved = true;
            suppressClick.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.scrollLeft = start.scroll - delta;
          }
        }}
        onPointerUp={() => { drag.current = null; resumeAt.current = performance.now() + 2500; }}
        onPointerCancel={() => { drag.current = null; resumeAt.current = performance.now() + 2500; }}
        onLostPointerCapture={() => { drag.current = null; }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); suppressClick.current = false; } }}
      >
        <div className={styles.memberLoop}>
          {(loops ? [0, 1] : [0]).map((copy) => {
            const cards = (list: Mercenary[]) => list.map((member) => {
              const content = <><Image src={member.imagePath} alt="" width={58} height={58} draggable={false} /><span><strong title={member.name}>{member.name}</strong><small title={member.title}>{member.title}</small></span></>;
              return member.link
                ? <a href={member.link} target="_blank" rel="noopener noreferrer" key={member.name} tabIndex={copy === 1 ? -1 : undefined}>{content}<i>↗</i></a>
                : <div key={member.name}>{content}</div>;
            });
            return masonry ? (
              <div className={styles.memberMasonry} key={copy} aria-hidden={copy === 1 ? true : undefined} data-static={loops ? undefined : ""}>
                {masonryRows(members).map((row, index) => <div className={styles.memberRail} key={index}>{cards(row)}</div>)}
              </div>
            ) : (
              <div className={styles.memberRail} key={copy} aria-hidden={copy === 1 ? true : undefined}>{cards(members)}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
