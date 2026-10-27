"use client";

import ArtifactGallery from "@/components/ArtifactGallery";
import { networkLogos } from "@/lib/data/venture";
import type { ActivityContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// With `content`, the October 23 collection (40f3910): an intro, the compact
// gallery and no collaborator logos. Without it, "/" keeps its current wall.
export default function WallOfCuriosities({ content }: { content?: ActivityContent["collection"] }) {
  const { arrivalTarget, openPortal } = useVenture();
  return (
    <section className={`${styles.fieldNotes} ${arrivalTarget === "work" ? styles.sectionArriving : ""}`} id="work">
      <header className={styles.collectionHeading}>
        {content ? <>
          <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
          <h2><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
          {content.intro && <p className={styles.collectionIntro}><CopyText copy={content.intro} /></p>}
        </> : <>
          <p className={styles.sectionLabel}>[ EXPLORE ]</p>
          <h2>Wall of<br /><em>curiosities</em></h2>
        </>}
      </header>
      <div id="uncharted" className={styles.collectionAnchor}>
        <div id="gallery" className={styles.collectionAnchor}>
          {content ? <ArtifactGallery showFeatured={false} compact onOpenPortal={openPortal} /> : <ArtifactGallery showFeatured={false} onOpenPortal={openPortal} collaborators={networkLogos.map(logo => ({
          id: `network-${logo.file.replace(/\.(svg|png)$/, "")}`, title: logo.name,
          category: "Across the network", kind: "collaborator" as const,
          description: logo.description, href: logo.href,
          image: `/images/${logo.file}`,
          }))} />}
        </div>
      </div>
    </section>
  );
}
