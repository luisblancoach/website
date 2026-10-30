"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoopBand from "@/components/LoopBand";
import type { GuildContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// The October 23 composition dropped the statistics band; the audience routes
// pass `metrics={false}` while "/" keeps it.
// `kitExpander` (/community, October 29): "Your Guild kit" becomes a second
// state. A button opens it; on desktop the kit panel slides in from the right
// and pushes the illustration and text to the left (a horizontal expander), on
// phones it opens below the text. Closed, the panel is inert; Escape or its
// close button closes it and returns focus to the toggle. CSS handles reduced
// motion. "/" keeps the kit inline.
export default function GuildPrologue({ content, metrics = true, kitExpander = false }: { content: GuildContent; metrics?: boolean; kitExpander?: boolean }) {
  const { arrivalTarget } = useVenture();
  const [kitOpen, setKitOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeKit = () => { setKitOpen(false); toggle.current?.focus(); };
  // Escape closes the open kit wherever focus is (also after a click on its text).
  useEffect(() => {
    if (!kitOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setKitOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [kitOpen]);
  const kitList = (
    <>
      <dl>
        {content.kit.items.map((item) => (
          <div key={item.term.id}><dt><CopyText copy={item.term} /></dt><dd><CopyText copy={item.detail} /></dd></div>
        ))}
      </dl>
      <p><CopyText copy={content.kit.requirement} /></p>
    </>
  );
  return (
    <section className={`${styles.prologue} ${arrivalTarget === "guild" ? styles.sectionArriving : ""}`} id="guild" data-kit={kitExpander ? (kitOpen ? "open" : "closed") : undefined}>
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
        {kitExpander ? (
          <button ref={toggle} type="button" className={styles.kitToggle} aria-expanded={kitOpen} aria-controls="guild-kit" onClick={() => setKitOpen((open) => !open)}>
            <CopyText copy={content.kit.heading} /><span aria-hidden="true">{kitOpen ? "←" : "→"}</span>
          </button>
        ) : (
          <div className={styles.guildBenefits}>
            <h3><CopyText copy={content.kit.heading} /></h3>
            {kitList}
          </div>
        )}
        <div className={styles.guildActions}>
          {content.actions.map((action) => (
            <NarrativeAnchor key={action.label.id} link={action} className={`${styles.pill} ${action.variant === "filled" ? styles.pillFilled : styles.pillOutline}`}>
              <span><CopyText copy={action.label} /></span>
              <i className={styles.pillIcon} aria-hidden="true">{action.icon === "→" ? "→" : <b className={action.icon === "discord" ? styles.iconDiscord : styles.iconLogo} />}</i>
            </NarrativeAnchor>
          ))}
        </div>
        <div className={styles.guildMoreLinks}>
          {content.links.map((link) => (
            <NarrativeAnchor key={link.label.id} link={link} className={styles.handbookLink}><CopyText copy={link.label} /></NarrativeAnchor>
          ))}
        </div>
      </div>
      {kitExpander && (
        <div id="guild-kit" className={styles.kitPanel} role="region" aria-labelledby="guild-kit-title" inert={!kitOpen}>
          <div className={styles.kitClip}><div className={`${styles.guildBenefits} ${styles.kitInner}`}>
            <div className={styles.kitHeading}>
              <h3 id="guild-kit-title"><CopyText copy={content.kit.heading} /></h3>
              <button type="button" className={styles.kitClose} onClick={closeKit} aria-label="Close Your Guild kit"><span aria-hidden="true">×</span></button>
            </div>
            {kitList}
          </div></div>
        </div>
      )}
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
