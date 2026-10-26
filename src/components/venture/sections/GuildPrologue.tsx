"use client";

import Image from "next/image";
import LoopBand from "@/components/LoopBand";
import { PORTAL_JOIN_URL } from "@/lib/data/constants";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function GuildPrologue() {
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
        <p className={styles.sectionLabel}>[ THE GUILD ]</p>
        <h2>The network<br /><em>is the engine</em></h2>
        <div className={styles.prologueBody}>
          <p>
            <strong>RaidGuild</strong> is a builder-owned community exploring emerging technology together.{" "}
            <strong>Designers, engineers, researchers, strategists, and operators</strong> share knowledge, reputation, and infrastructure.
          </p>
          <details className={styles.guildMore}>
            <summary>See more <span aria-hidden="true">↗</span></summary>
            <p>We learn from one another, test ideas, and build lasting relationships. Shared work grows from those connections, from open experiments to independent practices in applied AI and onchain systems.</p>
          </details>
        </div>
        <div className={styles.guildBenefits}>
          <h3>Your Guild kit</h3>
          <dl>
            <div><dt>Guild email</dt><dd>Your own @raidguild.org address</dd></div>
            <div><dt>Space to launch</dt><dd>A raidguild.org subdomain for your personal site or Tip of the Spear initiative</dd></div>
            <div><dt>Shared ownership</dt><dd>Equity in the company</dd></div>
            <div><dt>AI companion</dt><dd>Your own personal organizational AI assistant</dd></div>
          </dl>
          <p>To become a member, first complete a cohort.</p>
        </div>
        <div className={styles.guildActions}>
          <a className={`${styles.pill} ${styles.pillFilled}`} href={PORTAL_JOIN_URL} target="_blank" rel="noopener noreferrer">
            <span>Start with a cohort</span>
            <i className={styles.pillIcon}><b className={styles.iconLogo} /></i>
          </a>
          <a className={`${styles.pill} ${styles.pillOutline}`} href="https://discord.gg/2vx47gT95y" target="_blank" rel="noopener noreferrer">
            <span>Enter Discord</span>
            <i className={styles.pillIcon}><b className={styles.iconDiscord} /></i>
          </a>
        </div>
        <div className={styles.guildMoreLinks}>
          <a className={styles.handbookLink} href="https://handbook.raidguild.org/docs/overview/what-is-raidguild" target="_blank" rel="noopener noreferrer">Read the handbook ↗</a>
          <a className={styles.handbookLink} href="/chat" target="_blank" rel="noopener noreferrer">Questions? Ask Queen Raida, our AI CTO ↗</a>
        </div>
      </div>
      <LoopBand label="RaidGuild statistics" reverse>
        <div className={styles.metricItem}><strong>150</strong><span>GLOBAL MEMBERS</span></div>
        <div className={styles.metricItem}><strong>88+</strong><span>RAIDS SHIPPED ACROSS THE FRONTIER</span></div>
        <div className={styles.metricItem}><strong>∞</strong><span>QUESTIONS TO EXPLORE</span></div>
        <div className={styles.metricItem}><strong>2019</strong><span>BUILDING TOGETHER SINCE</span></div>
      </LoopBand>
    </section>
  );
}
