import styles from "../venture.module.css";

// The icon disc at the end of a pill (October 30, evening). Directions use the
// RaidGuild sword arrows (public/images/icons/arrow-*.svg): "→" enters or
// joins, "↓" moves down the page, "↘" goes down to the inquiry form (the
// conversion), "↗" leaves for another site. The variation is semantic, not
// decorative: every sword still points where the action goes, and the label
// carries the meaning (the icon is aria-hidden). Destinations with their own
// mark keep it: the RaidGuild logo, Discord, Portal, the handbook. Every glyph
// is a mask painted in the disc's colour.
export type PillGlyph = "→" | "←" | "↓" | "↘" | "↗" | "logo" | "discord" | "portal" | "handbook";

// In-page links into the inquiry form take the diagonal sword, so a "go to the
// form" action reads apart from "continue down the page".
export const pathGlyph = (icon: "→" | "↓" | "↗", link: { section?: string }): PillGlyph => (icon === "↓" && link.section === "project-inquiry" ? "↘" : icon);

const GLYPHS: Record<PillGlyph, string> = {
  "→": styles.iconSwordRight,
  "←": styles.iconSwordLeft,
  "↓": styles.iconSwordDown,
  "↘": styles.iconSwordDownRight,
  "↗": styles.iconSwordUpRight,
  logo: styles.iconLogo,
  discord: styles.iconDiscord,
  portal: styles.iconPortal,
  handbook: styles.iconHandbook,
};

export default function PillIcon({ glyph }: { glyph: PillGlyph }) {
  return <i className={styles.pillIcon} aria-hidden="true"><b className={GLYPHS[glyph]} data-glyph={glyph} /></i>;
}
