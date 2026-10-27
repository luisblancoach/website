"use client";

import Image from "next/image";
import LoopBand from "@/components/LoopBand";
import type { GuildContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// The October 23 composition dropped the statistics band; the audience routes
// pass `metrics={false}` while "/" keeps it.
export default function GuildPrologue({ content, metrics = true }: { content: GuildContent; metrics?: boolean }) {
  const { arrivalTarget } = useVenture();
  return (
    <section className={`${styles.prologue} ${arrivalTarget === "guild" ? styles.sectionArriving : ""}`} id="guild">
      <div className={styles.guildVisual}>
        <Image
          className={styles.guildBuilders}
          src="/images/neo/guild-builders-v1.png"
          alt=""
          width={768}
          height={1024}
          sizes="600px"
          aria-hidden="true"
        />
      </div>
      <div className={styles.prologueCopy}>
        <p className={styles.sectionLabel}><CopyText copy={content.label} /></p>
        <h2><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        <div className={styles.prologueBody}>
          <p>
            <CopyText copy={content.body} />
          </p>
          <details className={styles.guildMore}>
            <summary><CopyText copy={content.more.summary} after=" " /><span aria-hidden="true">↗</span></summary>
            <p><CopyText copy={content.more.text} /></p>
          </details>
        </div>
        <div className={styles.guildBenefits}>
          <h3><CopyText copy={content.kit.heading} /></h3>
          <dl>
            {content.kit.items.map((item) => (
              <div key={item.term.id}><dt><CopyText copy={item.term} /></dt><dd><CopyText copy={item.detail} /></dd></div>
            ))}
          </dl>
          <p><CopyText copy={content.kit.requirement} /></p>
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
      </div>
      {metrics && (
        <LoopBand label={content.metricsLabel} reverse>
          {content.metrics.map((metric) => (
            <div className={styles.metricItem} key={metric.label.id}><strong><CopyText copy={metric.value} /></strong><span><CopyText copy={metric.label} /></span></div>
          ))}
        </LoopBand>
      )}
    </section>
  );
}
