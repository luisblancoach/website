"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./venture/venture.module.css";

export default function LoopBand({ children, label, reverse = false }: { children: ReactNode; label: string; reverse?: boolean }) {
  const element = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (element.current) observer.observe(element.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={element} className={`${styles.loopBand} ${reverse ? styles.metricBand : styles.wordBand}`} aria-label={label}>
    <div className={styles.loopViewport}>
      <div className={styles.loopTrack} style={{ animationPlayState: !visible ? "paused" : undefined }}>
        <div className={styles.loopGroup}>{children}</div>
        <div className={styles.loopGroup} aria-hidden="true">{children}</div>
      </div>
    </div>
  </section>;
}
