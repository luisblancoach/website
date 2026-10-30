"use client";

import { getImageProps } from "next/image";
import type { EntityArtwork } from "@/lib/data/illustrations";
import type { ImmersiveContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import venture from "../venture.module.css";
import styles from "../feature.module.css";

// October 29 immersive feature (Queen Raida, Moloch on /community): a
// full-width artwork with the copy below it rather than over the illustration.
// Art direction: the vertical cut on phones, the 16:9 rectangle on tablets and
// squarer monitors, the wide horizontal cut on desktop. The artwork is a single
// image per cut, so there is no parallax: depth would need separated layers.
// `tone` sets the scene's surface in both themes (feature.module.css).
const PHONE = "(max-width: 700px)";
const RECTANGLE = "(max-width: 1199px), (max-aspect-ratio: 3/2)";

export default function ImmersiveFeature({ id, content, artwork, tone }: { id: string; content: ImmersiveContent; artwork: EntityArtwork; tone: "raida" | "moloch" }) {
  const alt = content.artwork.alt.text;
  const { props: { srcSet: mobileSet } } = getImageProps({ alt, sizes: "100vw", ...artwork.mobile });
  const { props: { srcSet: rectangleSet } } = getImageProps({ alt, sizes: "100vw", ...artwork.rectangle });
  const { props: desktop } = getImageProps({ alt, sizes: "100vw", ...artwork.desktop });
  const filled = content.cta.variant === "filled";
  return (
    <section id={id} className={`${styles.feature} ${styles[tone]}`} aria-labelledby={`${id}-title`}>
      <div className={styles.media}>
        <picture>
          <source media={PHONE} srcSet={mobileSet} width={artwork.mobile.width} height={artwork.mobile.height} />
          <source media={RECTANGLE} srcSet={rectangleSet} width={artwork.rectangle.width} height={artwork.rectangle.height} />
          {/* Art direction needs <picture>; the image props come from next/image. */}
          <img {...desktop} alt={alt} className={styles.image} />
        </picture>
      </div>
      <div className={styles.copy}>
        <p className={styles.label}><CopyText copy={content.label} /></p>
        <h2 id={`${id}-title`} className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        <p className={styles.body}><CopyText copy={content.body} /></p>
        <NarrativeAnchor link={content.cta} className={`${venture.pill} ${filled ? venture.pillFilled : venture.pillOutline} ${styles.cta}`}>
          <span><CopyText copy={content.cta.label} /></span>
          <i className={venture.pillIcon} aria-hidden="true"><b className={venture.iconLogo} /></i>
        </NarrativeAnchor>
      </div>
    </section>
  );
}
