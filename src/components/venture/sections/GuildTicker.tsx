import LoopBand from "@/components/LoopBand";
import styles from "../venture.module.css";

export default function GuildTicker() {
  return (
    <LoopBand label="Guild ticker">
      {['ONE GUILD', 'SENIOR DEVS', 'BUILDER-OWNED', 'APPLIED AI', 'SCOPED RAIDS', 'BUILT BY OWNERS'].map(word => <span className={styles.tickerWord} key={word}>{word}<i aria-hidden="true" /></span>)}
    </LoopBand>
  );
}
