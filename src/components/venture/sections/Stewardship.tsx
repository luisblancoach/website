"use client";

import Image from "next/image";
import { mercenaries } from "@/lib/data/members";
import { stewards } from "@/lib/data/venture";
import type { Copy, StewardshipContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import styles from "../venture.module.css";

// October 23 stewardship (40f3910) with the steward portraits kept visible.
// Clients see each steward's professional title; Community sees their
// stewardship role and the responsibilities disclosures.
const withoutArrow = (copy: Copy): Copy => ({ ...copy, text: copy.text.replace(/\s*↗$/, "") });

export default function Stewardship({ content, titles = "role" }: { content: StewardshipContent; titles?: "role" | "professional" }) {
  const responsibilities = [content.hats, content.agents].filter((item) => item !== undefined);
  return (
    <section id="stewards" className={styles.keepers}>
      <div className={styles.guildRoster}>
        <div className={styles.rosterHeading}>
          <div>
            <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
            <h3><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h3>
            <p><CopyText copy={content.intro} /></p>
          </div>
          <div className={styles.rosterAside}>
            <NarrativeAnchor link={content.roster}><CopyText copy={withoutArrow(content.roster.label)} /> <span>↗</span></NarrativeAnchor>
          </div>
        </div>

        <div className={styles.stewardTrack}>
          {stewards.map((steward, index) => {
            const title = titles === "professional" ? mercenaries.find((member) => member.name === steward.name)?.title ?? steward.role : steward.role;
            const card = (
              <>
                <div className={styles.stewardTop}>
                  <span>ST—{String(index + 1).padStart(2, "0")}</span>
                  <i>{steward.href ? "↗" : "·"}</i>
                </div>
                <div className={styles.stewardPortrait}>
                  <Image src={steward.image} alt="" fill sizes="180px" />
                </div>
                <p>{title}</p>
                <h4>{steward.name}</h4>
                <small>{steward.project}</small>
              </>
            );

            return steward.href ? (
              <a className={styles.stewardCard} href={steward.href} target="_blank" rel="noopener noreferrer" key={steward.name}>{card}</a>
            ) : (
              <div className={styles.stewardCard} key={steward.name}>{card}</div>
            );
          })}
        </div>

        {responsibilities.length > 0 && (
          <div className={styles.stewardResponsibilities}>
            {responsibilities.map((item) => (
              <details key={item.summary.id}>
                <summary><CopyText copy={item.summary} /></summary>
                <p><CopyText copy={item.body} /></p>
                <NarrativeAnchor link={item.link}><CopyText copy={item.link.label} /></NarrativeAnchor>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
