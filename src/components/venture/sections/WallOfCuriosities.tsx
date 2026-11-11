"use client";

import ArtifactGallery from "@/components/ArtifactGallery";
import * as Dialog from "@radix-ui/react-dialog";
import ProjectExplorer from "./ProjectExplorer";
import PillIcon from "../primitives/PillIcon";
import explorer from "../explorer.module.css";
import { networkLogos } from "@/lib/data/venture";
import type { ActivityContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// With `content` (/community): the heading and, since November 3, the project
// explorer (ProjectExplorer.tsx) instead of the compact gallery. Without it,
// "/" keeps its current wall (ArtifactGallery).
export default function WallOfCuriosities({ content }: { content?: ActivityContent["collection"] }) {
  const { arrivalTarget, openPortal } = useVenture();
  return (
    <section className={`${styles.fieldNotes} ${arrivalTarget === "work" ? styles.sectionArriving : ""}`} id="work">
      <header className={`${styles.collectionHeading} ${content ? explorer.headRow : ""}`}>
        {content ? <>
          <div className={explorer.headText}>
            <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
            <h2><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
            {content.intro && <p className={styles.collectionIntro}><CopyText copy={content.intro} /></p>}
          </div>
          {/* November 3 (owner): the Portal as a secondary action on the heading's row. */}
          <Dialog.Trigger asChild>
            <button type="button" className={`${styles.pill} ${styles.pillOutline} ${explorer.portalButton}`} onClick={openPortal}><span>Open the Portal</span><PillIcon glyph="logo" /></button>
          </Dialog.Trigger>
        </> : <>
          <p className={styles.sectionLabel}>[ EXPLORE ]</p>
          <h2>Wall of<br /><em>curiosities</em></h2>
        </>}
      </header>
      <div id="uncharted" className={styles.collectionAnchor}>
        <div id="gallery" className={styles.collectionAnchor}>
          {content ? <ProjectExplorer onOpenPortal={openPortal} /> : <ArtifactGallery showFeatured={false} onOpenPortal={openPortal} collaborators={networkLogos.map(logo => ({
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
