"use client";

import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import styles from "../showcase.module.css";

export type MarqueeItem = { id: string; label: string; src: string; width: number; height: number };

type Props = {
  items: MarqueeItem[];
  selected: number;
  onSelect: (index: number) => void;
  label: string;
  controls: string;
  reverse?: boolean;
  // A second marquee repeating the first: clickable, but hidden from assistive
  // technology and the tab order so the selector is announced once.
  decorative?: boolean;
  className?: string;
  // Automatic movement in CSS px per second.
  speed?: number;
};

// One position drives the strip: a frame loop advances it and writes it to the
// native scroll offset (whole pixels) plus a transform (the sub-pixel rest), so
// trackpad, touch and wheel scrolling move the same value instead of competing
// with a CSS animation. Four copies of the logos let the position shift by one
// set near either end without a visible jump, in both directions. Manual
// scrolling and dragging take over until the user stops, then movement eases
// back in; hover never pauses it. Vertical wheel input is never handled, so the
// page always scrolls. Keyboard focus holds the strip still so the focused logo
// does not move, and reduced motion turns automatic movement off. Only the
// second copy is reachable by keyboard and assistive technology.
const COPIES = 4;
const REACHABLE = 1;
const IDLE_MS = 900;
const EASE_S = 0.6;

export default function LogoMarquee({ items, selected, onSelect, label, controls, reverse = false, decorative = false, className, speed = 64 }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const dragged = useRef(false);

  useEffect(() => {
    const el = viewport.current;
    const inner = track.current;
    if (!el || !inner) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const direction = reverse ? -1 : 1;
    let set = 0;
    let pos = 0;
    let written = -1;
    let frame = 0;
    let last = 0;
    let visible = false;
    let holding = false;
    let idleUntil = 0;
    let ease = 1;

    const focused = () => el.querySelector(":focus-visible") !== null;
    const write = () => {
      const whole = Math.round(pos);
      el.scrollLeft = whole;
      written = el.scrollLeft;
      inner.style.transform = `translate3d(${(written - pos).toFixed(2)}px, 0, 0)`;
    };
    // Keep the view within the middle copies; shifting by one set is invisible.
    const wrap = () => {
      if (set && pos < set * 0.5) pos += set;
      else if (set && pos > set * 2.5) pos -= set;
    };
    const interrupt = () => { idleUntil = performance.now() + IDLE_MS; ease = 0; };
    const measure = () => {
      const groups = inner.children;
      if (groups.length < 2) return;
      const next = (groups[1] as HTMLElement).offsetLeft - (groups[0] as HTMLElement).offsetLeft;
      if (!next) return;
      pos = set ? (pos / set) * next : next * REACHABLE;
      set = next;
      write();
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(now - (last || now), 64) / 1000;
      last = now;
      if (!set || motion.matches || holding || now < idleUntil || focused()) return;
      ease = Math.min(1, ease + dt / EASE_S);
      pos += direction * speed * ease * dt;
      wrap();
      write();
    };
    const run = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (visible) frame = requestAnimationFrame(tick);
    };

    // Scrolling the strip by trackpad, touch, wheel or focus adopts the native offset.
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - written) < 1) return;
      pos = el.scrollLeft;
      inner.style.transform = "translate3d(0, 0, 0)";
      written = el.scrollLeft;
      if (!focused()) { const before = pos; wrap(); if (pos !== before) write(); }
      interrupt();
    };
    const onWheel = (event: WheelEvent) => { if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) interrupt(); };
    const onTouch = () => interrupt();

    // Mouse dragging; touch uses native scrolling.
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      const startX = event.clientX;
      let base = pos;
      dragged.current = false;
      holding = true;
      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        if (!dragged.current && Math.abs(dx) < 5) return;
        if (!dragged.current) { dragged.current = true; el.dataset.dragging = ""; }
        pos = base - dx;
        const before = pos;
        wrap();
        base += pos - before;
        write();
      };
      const up = () => {
        holding = false;
        delete el.dataset.dragging;
        interrupt();
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    };

    const sizes = new ResizeObserver(measure);
    sizes.observe(inner);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; run(); });
    observer.observe(el);
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouch);
      el.removeEventListener("pointerdown", onPointerDown);
    };
  }, [reverse, speed, items.length]);

  // A drag ends without selecting the logo under the pointer.
  const swallowDragClick = (event: MouseEvent) => {
    if (!dragged.current) return;
    dragged.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  // Arrow keys, Home and End move the selection; Tab still reaches every logo.
  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const next = event.key === "ArrowRight" ? (selected + 1) % items.length
      : event.key === "ArrowLeft" ? (selected + last) % items.length
      : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    onSelect(next);
    buttons.current[next]?.focus();
  };

  return (
    <div
      ref={viewport}
      className={[styles.marquee, className].filter(Boolean).join(" ")}
      role={decorative ? undefined : "group"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      onKeyDown={decorative ? undefined : move}
      onClickCapture={swallowDragClick}
    >
      <div ref={track} className={styles.marqueeTrack}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <div className={styles.marqueeGroup} key={copy} aria-hidden={copy !== REACHABLE || undefined} data-copy={copy}>
            {items.map((item, index) => {
              const reachable = copy === REACHABLE && !decorative;
              return (
                <button
                  key={item.id}
                  ref={reachable ? (el) => { buttons.current[index] = el; } : undefined}
                  type="button"
                  className={styles.marqueeButton}
                  tabIndex={reachable ? undefined : -1}
                  aria-pressed={reachable ? selected === index : undefined}
                  aria-controls={reachable ? controls : undefined}
                  data-selected={selected === index || undefined}
                  onClick={() => onSelect(index)}
                >
                  <Image src={item.src} alt={reachable ? item.label : ""} width={item.width} height={item.height} draggable={false} unoptimized />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
