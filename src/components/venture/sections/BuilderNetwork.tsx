"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import TeamWall from "@/components/TeamWall";
import { mercenaries } from "@/lib/data/members";
import { filterMembers, memberCategories, type MemberCategory } from "@/lib/data/memberCategories";
import type { Illustration } from "@/lib/data/illustrations";
import type { BuilderNetworkContent } from "@/lib/narrative/types";
import { CopyText } from "../primitives/Review";
import NarrativeAnchor from "../primitives/NarrativeAnchor";
import { useVenture } from "../shell/VentureShell";
import styles from "../venture.module.css";
import moduleStyles from "../audience.module.css";

// October 23 builder network (40f3910): skill tabs with counts over the member
// wall. Copy varies by audience through `content`; /clients lays the wall out
// as masonry rows (October 28 feedback).
// The masonry wall (/clients, and /community from October 29) moves twice as
// fast as the default 18 px/s (Frame 123) and, while it moves, runs edge to edge.
const WALL_SPEED = 36;

export default function BuilderNetwork({ content, illustration, masonry = false }: { content: BuilderNetworkContent; illustration?: Illustration; masonry?: boolean }) {
  const { portalOpen } = useVenture();
  const [category, setCategory] = useState<MemberCategory>("All builders");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const filtered = filterMembers(mercenaries, category);
  return <section id="team" className={`${styles.teamNetwork} ${moduleStyles.network}`} aria-labelledby="builders-title">
    <div className={moduleStyles.heading}><h2 id="builders-title"><CopyText copy={content.title.lead} /><br /><em><CopyText copy={content.title.em} after="." /></em></h2>{illustration && <Image className={moduleStyles.headingArt} src={illustration.src} alt="" width={illustration.width} height={illustration.height} sizes="(max-width: 700px) 280px, 380px" aria-hidden="true" />}<div><p><CopyText copy={content.intro} /></p><NarrativeAnchor link={content.link} className={moduleStyles.textLink}><CopyText copy={content.link.label} /></NarrativeAnchor></div></div>
    <div className={moduleStyles.tabs} role="tablist" aria-label="Builder skills" onKeyDown={event => {
      const current = memberCategories.indexOf(category);
      const next = event.key === "ArrowRight" ? (current + 1) % memberCategories.length : event.key === "ArrowLeft" ? (current + memberCategories.length - 1) % memberCategories.length : event.key === "Home" ? 0 : event.key === "End" ? memberCategories.length - 1 : null;
      if (next === null) return;
      event.preventDefault(); setCategory(memberCategories[next]); tabs.current[next]?.focus();
    }}>{memberCategories.map((item, index) => <button ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`builders-tab-${index}`} aria-controls="builder-profiles" aria-selected={category === item} tabIndex={category === item ? 0 : -1} key={item} onClick={() => setCategory(item)}>{item} <span>{filterMembers(mercenaries, item).length}</span></button>)}</div>
    <div id="builder-profiles" role="tabpanel" aria-labelledby={`builders-tab-${memberCategories.indexOf(category)}`}><p className={moduleStyles.resultCount} aria-live="polite">{filtered.length} profiles · {category}</p><TeamWall key={category} members={filtered} suspended={portalOpen} masonry={masonry} speed={masonry ? WALL_SPEED : undefined} bleed={masonry} /></div>
  </section>;
}
