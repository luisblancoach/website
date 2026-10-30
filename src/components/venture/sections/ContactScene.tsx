"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image, { getImageProps } from "next/image";
import { contactScenes, professions } from "@/lib/data/illustrations";
import styles from "../venture.module.css";

// The final contact module on both audience routes (/clients inquiry,
// /community Join; October 30, afternoon): the Venture Beyond scene behind
// the module and a gallery of profession groups in front of it.

// The vertical cut matches the module's single-column layout (≤ 600 px).
const PHONE = "(max-width: 600px)";

// The scene: the horizontal cut on desktop, the vertical one on phones, one
// <picture> per theme; CSS shows the current theme's picture only. October 30
// (final pass): the scene is pinned while the module scrolls. The outer layer
// spans the whole section; the stage inside it is sticky and one viewport tall,
// so the art stays put behind the form (or the Join panel) while the document
// itself moves the content, then leaves with the section's end. No scroll
// container, so wheel, touch and keyboard scroll the page as usual. The layer
// fades out over the section's last 220 px (and at its sides once capped at
// the page's wide maximum), so no rectangular edge shows.
// October 30 (final pass, composition): the stage has a controlled height (the
// viewport, at least 560 px) and carries the profession gallery (`children`)
// at a fixed place on the art, so characters and landscape are one pinned
// picture; the form is the only thing that moves. The art is anchored to its
// top and cropped from the bottom (or the sides) rather than scaled down. The
// modules keep an invisible slot where the gallery used to sit in the flow
// (ContactGallerySlot), so the form starts below the characters on phones.
export function ContactScene({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.contactScene}>
      <div className={styles.contactSceneStage}>
      {(Object.entries(contactScenes) as [string, NonNullable<(typeof contactScenes)["light"]>][]).map(([theme, scene]) => {
        const { props: { srcSet: verticalSet } } = getImageProps({ alt: "", sizes: "100vw", ...scene.vertical });
        const { props: horizontal } = getImageProps({ alt: "", sizes: "(max-width: 1760px) 100vw, 1760px", ...scene.horizontal });
        return (
          <picture key={theme} data-scene-theme={theme}>
            <source media={PHONE} srcSet={verticalSet} width={scene.vertical.width} height={scene.vertical.height} />
            {/* Art direction needs <picture>; the image props come from next/image. */}
            <img {...horizontal} alt="" loading="lazy" decoding="async" />
          </picture>
        );
      })}
        {children}
      </div>
    </div>
  );
}

// The gallery's former place in the module's grid: it keeps the columns and,
// on phones, the room above the form, without drawing anything.
export function ContactGallerySlot() {
  return <div className={`${styles.contactDruid} ${styles.contactGallerySlot}`} aria-hidden="true" />;
}

// One group every 9 s, in a shuffled order: a shuffle bag deals every group
// once per round in random order and never repeats the group just shown, so
// the sequence differs on every visit (the first group is fixed, "Druid 2",
// so the server render matches). The change reads as a brief hologram
// transmission (CSS, about 1.2 s): the outgoing group flickers out with a
// faint cyan/pink channel split; the incoming one resolves through scanlines
// that sit on the figure only (no rectangle shows). Opacity, filter and mask
// only: nothing moves the layout. Rotation waits while the pointer is over the
// module, while focus is anywhere in it (someone reading or filling the form),
// while the module is off screen or the tab is hidden. With reduced motion
// nothing rotates or flickers. There is no visible pagination (the dots read
// as generic); a visually hidden status names the group shown, without
// announcing every change.
const HOLD_MS = 9000;
const TRANSMIT_MS = 1300;

function shuffled(count: number, avoid: number) {
  const bag = Array.from({ length: count }, (_, index) => index).filter((index) => index !== avoid);
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

export function ProfessionGallery({ className }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const bag = useRef<number[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    if (!root || !section) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovered = false;
    let focused = section.contains(document.activeElement);
    let visible = false;
    let timer = 0;
    const advance = () => {
      if (!bag.current.length) bag.current = shuffled(professions.length, active);
      setLeaving(active);
      setActive(bag.current.shift()!);
    };
    const schedule = () => {
      window.clearTimeout(timer);
      if (hovered || focused || !visible || document.hidden || motion.matches) return;
      timer = window.setTimeout(advance, HOLD_MS);
    };
    const enter = () => { hovered = true; schedule(); };
    const leave = () => { hovered = false; schedule(); };
    const focusIn = () => { focused = true; schedule(); };
    const focusOut = (event: FocusEvent) => { focused = section.contains(event.relatedTarget as Node | null); schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(root);
    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointerleave", leave);
    section.addEventListener("focusin", focusIn);
    section.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);
    schedule();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("focusin", focusIn);
      section.removeEventListener("focusout", focusOut);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, [active]);

  // The transmission states last one effect; then the groups rest.
  useEffect(() => {
    if (leaving === null) return;
    const timer = window.setTimeout(() => setLeaving(null), TRANSMIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  return (
    <div ref={rootRef} className={[styles.professionGallery, className].filter(Boolean).join(" ")} role="group" aria-label="Guild professions">
      <div className={styles.professionStage}>
        {professions.map((item, index) => (
          <Image
            key={item.src}
            src={item.src}
            alt={index === active ? `${item.name}, one of the Guild's professions` : ""}
            aria-hidden={index === active ? undefined : true}
            data-active={index === active ? "" : undefined}
            data-entering={index === active && leaving !== null ? "" : undefined}
            data-leaving={index === leaving ? "" : undefined}
            width={item.width}
            height={item.height}
            sizes="(max-width: 760px) 80vw, 480px"
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <p className={styles.srOnly}>Showing {professions[active].name}, {active + 1} of {professions.length}</p>
    </div>
  );
}
