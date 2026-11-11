"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeatureGalleryContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import PillIcon, { pathGlyph } from "../primitives/PillIcon";
import venture from "../venture.module.css";
import styles from "../gallery.module.css";

// November 2 feature gallery: one horizontally scrollable row of cards, shared
// by the /clients services ("What we can build for you") and the /community
// member benefits ("What you can access as a member"); the route supplies the
// content and `tone`. It replaces the services accordion. The row scrolls by
// swipe, trackpad, the keyboard (the row is a focusable region; arrow keys
// scroll it) and the two sword buttons, which move one card and are disabled
// at either end. Smooth scrolling only without reduced motion. Cards are not
// links themselves; a card's optional link is its one interactive element.
// `anchors` keeps navigation targets ("services", "capabilities") alive.
export default function FeatureGallery({ id, content, tone, anchors = [] }: { id: string; content: FeatureGalleryContent; tone: "services" | "benefits"; anchors?: string[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const update = () => setEdges({ start: row.scrollLeft <= 2, end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 2 });
    update();
    row.addEventListener("scroll", update, { passive: true });
    const sizes = new ResizeObserver(update);
    sizes.observe(row);
    return () => { row.removeEventListener("scroll", update); sizes.disconnect(); };
  }, []);

  const move = (direction: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.querySelector("li");
    if (!row || !card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(card.parentElement!).columnGap || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  const titleId = `${id}-title`;
  return (
    <section id={id} className={`${styles.gallery} ${styles[tone]}`} aria-labelledby={titleId}>
      {anchors.map((anchor) => <span key={anchor} id={anchor} className={venture.anchorTarget} />)}
      <div className={styles.head}>
        <p className={styles.label}><CopyText copy={content.label} /></p>
        <h2 id={titleId} className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        {content.intro && <p className={styles.intro}><CopyText copy={content.intro} /></p>}
      </div>
      <div ref={rowRef} className={styles.viewport} role="region" aria-labelledby={titleId} tabIndex={0}>
      <ul className={styles.row}>
        {content.cards.map((card, index) => (
          <li key={card.title.lead.id} className={styles.item}>
            <article className={styles.card} aria-labelledby={`${id}-card-${index}`}>
              <div className={`${styles.art} ${card.image.fit === "contain" ? styles.artContain : ""}`}>
                <Image src={card.image.src} alt="" width={card.image.width} height={card.image.height} sizes="(max-width: 760px) 80vw, 380px" />
              </div>
              <div className={styles.cardCopy}>
                <p className={styles.cardLabel}><CopyText copy={card.label} /></p>
                <h3 id={`${id}-card-${index}`} className={styles.cardTitle}><span><CopyText copy={card.title.lead} /></span><br /><em><CopyText copy={card.title.em} /></em></h3>
                <p className={styles.cardBody}><CopyText copy={card.body} /></p>
                {card.link && <NarrativeAnchor link={card.link} className={styles.cardLink}><CopyText copy={card.link.label} /> <span aria-hidden="true">{card.link.href ? "↗" : "↓"}</span></NarrativeAnchor>}
              </div>
            </article>
          </li>
        ))}
      </ul>
      </div>
      <div className={styles.foot}>
        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={() => move(-1)} disabled={edges.start} aria-label="Previous cards"><PillIcon glyph="←" /></button>
          <button type="button" className={styles.control} onClick={() => move(1)} disabled={edges.end} aria-label="Next cards"><PillIcon glyph="→" /></button>
        </div>
        {content.cta && (
          <NarrativeAnchor link={content.cta} className={`${venture.pill} ${venture.pillFilled} ${styles.cta}`}>
            <span><CopyText copy={content.cta.label} /></span><PillIcon glyph={pathGlyph("↓", content.cta)} />
          </NarrativeAnchor>
        )}
        {content.footnote && <p className={styles.footnote}><CopyText copy={content.footnote.lead} after=" " /><NarrativeAnchor link={content.footnote.link}><CopyText copy={content.footnote.link.label} /></NarrativeAnchor></p>}
      </div>
    </section>
  );
}
