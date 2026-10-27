"use client";

import Image from "next/image";
import type { JoinContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// The Join chapter in the October 23 contact composition (40f3910): the Guild
// characters beside the invitation, with the join actions in place of the form.
export default function JoinCTA({ content }: { content: JoinContent }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.contact} ${styles.joinContact} ${arrivalTarget === "join" ? styles.sectionArriving : ""}`} id="join" aria-labelledby="join-heading">
      <div className={styles.contactIntro}>
        <Image className={styles.contactDruid} src="/images/neo/contact-druid-transparent.png" alt="" width={768} height={1024} sizes="(max-width: 600px) 70vw, 420px" aria-hidden="true" />
        <div className={styles.contactCopy}>
          <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
          <h2 id="join-heading" className={styles.contactHeadline}><CopyText copy={content.title.lead} /> <em><CopyText copy={content.title.em} /></em></h2>
          <p className={styles.contactDek}><CopyText copy={content.body} /></p>
        </div>
      </div>
      <div className={styles.guildActions}>
        {content.actions.map((action) => (
          <NarrativeAnchor key={action.label.id} link={action} className={`${styles.pill} ${action.variant === "filled" ? styles.pillFilled : styles.pillOutline}`}>
            <span><CopyText copy={action.label} /></span>
            <i className={styles.pillIcon}><b className={action.icon === "discord" ? styles.iconDiscord : styles.iconLogo} /></i>
          </NarrativeAnchor>
        ))}
      </div>
      <div className={styles.guildMoreLinks}>
        {content.links.map((link) => (
          <NarrativeAnchor key={link.label.id} link={link} className={styles.handbookLink}><CopyText copy={link.label} /></NarrativeAnchor>
        ))}
      </div>
    </section>
  );
}
