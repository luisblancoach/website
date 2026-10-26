"use client";

import Image from "next/image";
import TeamWall from "@/components/TeamWall";
import { guildMembers, stewards } from "@/lib/data/venture";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";

export default function GuildPeople() {
  const { portalOpen } = useVenture();
  return (
    <div className={styles.moreCommunity}>
    <section className={styles.keepers}>
      <div className={styles.guildRoster}>
        <div className={styles.rosterHeading}>
          <div>
            <p className={styles.sectionLabel}>[ CURRENT STEWARDS ]</p>
            <h3>Keepers of<br /><em>the signal</em></h3>
            <p>Stewards help care for the Guild’s shared knowledge, infrastructure, coordination, and public voice.</p>
          </div>
          <div className={styles.rosterAside}>
            <a href="https://portal.raidguild.org" target="_blank" rel="noopener noreferrer">Explore all members <span>↗</span></a>
          </div>
        </div>

        <div className={styles.stewardTrack}>
          {stewards.map((steward, index) => {
            const card = (
              <>
                <div className={styles.stewardTop}>
                  <span>ST—{String(index + 1).padStart(2, "0")}</span>
                  <i>{steward.href ? "↗" : "·"}</i>
                </div>
                <div className={styles.stewardPortrait}>
                  <Image src={steward.image} alt="" fill sizes="180px" />
                </div>
                <p>{steward.role}</p>
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

      </div>
    </section>

    <section className={styles.teamNetwork} id="team">
      <TeamWall members={guildMembers} suspended={portalOpen} />
      <div className={styles.teamCopy}>
        <p className={styles.sectionLabel}>[ THE TEAM ]</p>
        <h3>A WIDE NETWORK<br /><em>OF BUILDERS</em></h3>
        <p>Different skills, backgrounds, and curiosities. Get to know the people who share what they learn and make more possible together.</p>
        <a className={`${styles.pill} ${styles.pillOutline}`} href="https://discord.gg/2vx47gT95y" target="_blank" rel="noopener noreferrer">
          <span>Enter Discord</span>
          <i className={styles.pillIcon}><b className={styles.iconDiscord} /></i>
        </a>
      </div>
    </section>

    </div>
  );
}
