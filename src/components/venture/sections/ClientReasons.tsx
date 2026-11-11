"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { ReasonsContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import styles from "../gallery.module.css";

// November 3 (/clients, owner brief): "Why should I choose RaidGuild for this
// project?" as expandable rows after the services gallery. Each reason is a
// heading holding a disclosure button (aria-expanded, aria-controls), so the
// list is navigable by headings and opens with Enter or Space. The full
// RaidGuild sigil (disc, ring, swords) leads each row as a decorative brand
// mark; the chevron is the functional marker and turns when the row opens
// (instantly with reduced motion). One row is open at a time, like the FAQ.
export default function ClientReasons({ id, content }: { id: string; content: ReasonsContent }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id={id} className={styles.reasons} aria-labelledby={`${id}-title`}>
      <div className={styles.reasonsHead}>
        <p className={styles.label}><CopyText copy={content.label} /></p>
        <h2 id={`${id}-title`} className={styles.title}><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} /></em></h2>
        <p className={styles.intro}><CopyText copy={content.intro} /></p>
      </div>
      <div className={styles.reasonList}>
        {content.items.map((item, index) => {
          const expanded = open === index;
          return (
            <div key={item.title.id} className={styles.reasonItem}>
              <h3 className={styles.reasonTitle}>
                <button type="button" id={`${base}-r${index}`} aria-expanded={expanded} aria-controls={`${base}-b${index}`} onClick={() => setOpen(expanded ? null : index)}>
                  <span className={styles.rowMark} aria-hidden="true" />
                  <span className={styles.rowLabel}><CopyText copy={item.title} /></span>
                  <ChevronDown className={styles.chevron} aria-hidden="true" focusable="false" />
                </button>
              </h3>
              <div id={`${base}-b${index}`} role="region" aria-labelledby={`${base}-r${index}`} className={styles.reasonBody} hidden={!expanded}>
                <p><CopyText copy={item.body} /></p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
