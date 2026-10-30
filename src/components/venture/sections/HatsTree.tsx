"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { featuredHats, hatImageSize, hatsParent } from "@/lib/data/hats";
import type { HatsContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import venture from "../venture.module.css";
import styles from "../hats.module.css";

// Branches from the parent mark to the five role columns (centres at 10–90%),
// drawn in a 100 × 40 box stretched to the tree's width.
const BRANCHES = [10, 30, 50, 70, 90].map((x) => `M50 0 C50 22 ${x} 16 ${x} 40`);

// October 29: RaidGuild's Hats tree (replaces "Keepers of the signal"). On
// desktop a horizontal composition: the title and both texts on the left, the
// tree on the right (the RaidGuild mark at its root, curved branches to the
// five featured roles). On phones one column with a vertical tree. Each role
// card reads artwork, name, then ID. Hovering highlights a card; clicking or
// focusing selects it (aria-pressed): it grows slightly and its siblings go
// quieter; clicking it again, clicking outside the roles or Escape clears
// it. Reduced motion keeps the
// states without the zoom. It is a reference snapshot of roles
// (lib/data/hats.ts), never of wearers; the full tree, the section's one
// link, opens on Hats Protocol.
export default function HatsTree({ content }: { content: HatsContent }) {
  const [active, setActive] = useState<string | null>(null);
  const rolesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!active) return;
    const clear = (event: PointerEvent) => { if (!rolesRef.current?.contains(event.target as Node)) setActive(null); };
    document.addEventListener("pointerdown", clear);
    return () => document.removeEventListener("pointerdown", clear);
  }, [active]);

  return (
    <section id="hats" className={styles.hats} aria-labelledby="hats-title">
      <span id="stewards" className={venture.anchorTarget} />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.label}><CopyText copy={content.label} /></p>
          <h2 id="hats-title" className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
          <div className={styles.intro}>
            <p><CopyText copy={content.intro} /></p>
            <p className={styles.stewards}><strong><CopyText copy={content.stewards.term} />.</strong> <CopyText copy={content.stewards.detail} /></p>
          </div>
          <NarrativeAnchor link={content.treeLink} className={styles.treeLink}><CopyText copy={content.treeLink.label} /> <span aria-hidden="true">↗</span></NarrativeAnchor>
        </div>

        <figure className={styles.tree} aria-labelledby="hats-snapshot">
          <div className={styles.parent}>
            <span className={styles.parentArt}><Image src={hatsParent.image} alt="" width={hatsParent.width} height={hatsParent.height} sizes="(max-width: 760px) 64px, 88px" /></span>
            <span className={styles.nodeText}><strong>{hatsParent.name}</strong><small>{hatsParent.id}</small></span>
          </div>
          <svg className={styles.branches} viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            {BRANCHES.map((d) => <path key={d} d={d} />)}
          </svg>
          <p className={styles.srOnly}><CopyText copy={content.featuredLabel} /></p>
          <ul ref={rolesRef} className={styles.children} data-active={active ? "" : undefined} onKeyDown={(event) => { if (event.key === "Escape") setActive(null); }}>
            {featuredHats.map((item) => (
              <li key={item.slug} style={{ "--hat-accent": item.accent } as CSSProperties}>
                <button
                  type="button"
                  className={styles.card}
                  aria-pressed={active === item.slug}
                  onClick={() => setActive((current) => (current === item.slug ? null : item.slug))}
                  onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setActive(item.slug); }}
                >
                  <span className={styles.art}><Image src={item.image!} alt="" {...hatImageSize} sizes="(max-width: 760px) 72px, 120px" /></span>
                  <span className={styles.nodeText}><strong>{item.name}</strong><small>{item.id}</small></span>
                </button>
              </li>
            ))}
          </ul>
          <figcaption id="hats-snapshot" className={styles.snapshot}><CopyText copy={content.snapshot} /></figcaption>
        </figure>
      </div>
    </section>
  );
}
