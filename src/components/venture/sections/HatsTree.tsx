import Image from "next/image";
import type { CSSProperties } from "react";
import { featuredHats, hatImageSize, hatsParent } from "@/lib/data/hats";
import type { HatsContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import venture from "../venture.module.css";
import styles from "../hats.module.css";

// October 29: RaidGuild's Hats tree (replaces "Keepers of the signal"). On
// desktop a horizontal composition: the title and both texts on the left, the
// tree on the right (the RaidGuild mark as the parent hat, joined by
// connectors to its five featured roles). On phones one vertical column. The
// full tree, the section's one link, opens on Hats Protocol. It is a reference
// snapshot of roles (lib/data/hats.ts), never of wearers, so the roles are a
// plain list rather than controls.
export default function HatsTree({ content }: { content: HatsContent }) {
  return (
    <section id="hats" className={styles.hats} aria-labelledby="hats-title">
      <span id="stewards" className={venture.anchorTarget} />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.label}><CopyText copy={content.label} /></p>
          <h2 id="hats-title" className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
          <div className={styles.intro}>
            <p><CopyText copy={content.intro} /></p>
            <p><strong><CopyText copy={content.stewards.term} />.</strong> <CopyText copy={content.stewards.detail} /></p>
          </div>
          <NarrativeAnchor link={content.treeLink} className={styles.treeLink}><CopyText copy={content.treeLink.label} /> <span aria-hidden="true">↗</span></NarrativeAnchor>
        </div>

        <figure className={styles.tree} aria-labelledby="hats-snapshot">
          <div className={styles.parent}>
            <span className={styles.parentArt}><Image src={hatsParent.image} alt="" width={hatsParent.width} height={hatsParent.height} sizes="(max-width: 760px) 64px, 96px" /></span>
            <span className={styles.nodeText}><small>{hatsParent.id}</small><strong>{hatsParent.name}</strong></span>
          </div>
          <p className={styles.srOnly}><CopyText copy={content.featuredLabel} /></p>
          <ul className={styles.children}>
            {featuredHats.map((item) => (
              <li key={item.slug} className={styles.card} style={{ "--hat-accent": item.accent } as CSSProperties}>
                <span className={styles.art}><Image src={item.image!} alt="" {...hatImageSize} sizes="(max-width: 760px) 72px, 120px" /></span>
                <span className={styles.nodeText}><small>{item.id}</small><strong>{item.name}</strong></span>
              </li>
            ))}
          </ul>
          <figcaption id="hats-snapshot" className={styles.snapshot}><CopyText copy={content.snapshot} /></figcaption>
        </figure>
      </div>
    </section>
  );
}
