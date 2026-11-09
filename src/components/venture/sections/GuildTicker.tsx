"use client";

import LoopBand from "@/components/LoopBand";
import { CopyText } from "../primitives/Review";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

// The ticker's words are copy (lib/narrative/site.ts, November 9). LoopBand
// renders them twice for the loop; the second copy is hidden from assistive tech.
export default function GuildTicker() {
  const { label, words } = useVenture().site.ticker;
  return (
    <LoopBand label={label.text}>
      {words.map((word) => <span className={styles.tickerWord} key={word.id}><CopyText copy={word} /><i aria-hidden="true" /></span>)}
    </LoopBand>
  );
}
