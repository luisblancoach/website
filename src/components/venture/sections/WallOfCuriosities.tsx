"use client";

import ArtifactGallery from "@/components/ArtifactGallery";
import { networkLogos } from "@/lib/data/venture";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function WallOfCuriosities() {
  const { arrivalTarget, openPortal } = useVenture();
  return (
    <section className={`${styles.fieldNotes} ${arrivalTarget === "work" ? styles.sectionArriving : ""}`} id="work">
      <header className={styles.collectionHeading}>
        <p className={styles.sectionLabel}>[ EXPLORE ]</p>
        <h2>Wall of<br /><em>curiosities</em></h2>
      </header>
      <div id="uncharted" className={styles.collectionAnchor}>
        <div id="gallery" className={styles.collectionAnchor}>
          <ArtifactGallery showFeatured={false} onOpenPortal={openPortal} collaborators={networkLogos.map(logo => ({
          id: `network-${logo.file.replace(/\.(svg|png)$/, "")}`, title: logo.name,
          category: "Across the network", kind: "collaborator" as const,
          description: logo.description, href: logo.href,
          image: `/images/${logo.file}`,
          }))} />
        </div>
      </div>
    </section>
  );
}
