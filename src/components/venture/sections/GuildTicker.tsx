import LoopBand from "@/components/LoopBand";
import styles from "../venture.module.css";

export default function GuildTicker() {
  return (
    <LoopBand label="Guild ticker">
      {['ONE GUILD', 'MANY EDGES', 'BUILDER-OWNED', 'APPLIED AI', 'ONCHAIN SYSTEMS', 'OPEN EXPERIMENTS'].map(word => <span className={styles.tickerWord} key={word}>{word}<i aria-hidden="true" /></span>)}
    </LoopBand>
  );
}
