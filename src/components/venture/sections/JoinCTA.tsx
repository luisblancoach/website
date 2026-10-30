"use client";

import type { JoinContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import PillIcon from "../primitives/PillIcon";
import { useVenture } from "../shell/VentureShell";
import { ContactGallerySlot, ContactScene, ProfessionGallery } from "./ContactScene";
import styles from "../venture.module.css";

// The Join chapter in the October 23 contact composition (40f3910): the Guild
// characters on one side, and one panel holding the invitation, both actions
// and the membership guide on the other. On the light-blue panel of the
// /clients inquiry (October 29); its membership actions stay its own. October 30:
// the Venture Beyond scene and the profession gallery replace the single
// illustration, as on the /clients inquiry (ContactScene).
export default function JoinCTA({ content }: { content: JoinContent }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.contact} ${styles.contactCyan} ${styles.joinContact} ${arrivalTarget === "join" ? styles.sectionArriving : ""}`} id="join" aria-labelledby="join-heading">
      <ContactScene><ProfessionGallery /></ContactScene>
      <div className={styles.contactIntro}>
        <ContactGallerySlot />
        <div className={styles.contactCopy}>
          <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
          <h2 id="join-heading" className={styles.contactHeadline}><CopyText copy={content.title.lead} /> <em><CopyText copy={content.title.em} /></em></h2>
          <p className={styles.contactDek}><CopyText copy={content.body} /></p>
          <div className={styles.guildActions}>
            {content.actions.map((action) => (
              <NarrativeAnchor key={action.label.id} link={action} className={`${styles.pill} ${action.variant === "filled" ? styles.pillFilled : styles.pillOutline}`}>
                <span><CopyText copy={action.label} /></span>
                <PillIcon glyph={action.icon} />
              </NarrativeAnchor>
            ))}
          </div>
          <div className={styles.guildMoreLinks}>
            {content.links.map((link) => (
              <NarrativeAnchor key={link.label.id} link={link} className={styles.handbookLink}><CopyText copy={link.label} /></NarrativeAnchor>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
