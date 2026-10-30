"use client";

import { useTheme } from "./ThemeProvider";
import styles from "../venture.module.css";

// The day/night control changes appearance only; it never changes the audience.
// `segmented` (the audience routes, October 30) draws it as a two-option pill
// that matches the audience switch beside it; "/" keeps the celestial toggle.
export default function ThemeSwitch({ segmented = false }: { segmented?: boolean }) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const isNight = theme === "dark";

  // Phones have no room for two labelled options beside the audience switch, so
  // CSS swaps the group for one switch with the same pill and coral state.
  if (segmented) return (
    <>
      <div className={styles.themeSwitch} role="group" aria-label="Theme">
        <button type="button" aria-pressed={!isNight} onClick={() => setTheme("light")}>
          <i className={styles.iconSun} aria-hidden="true" /><span>Day</span>
        </button>
        <button type="button" aria-pressed={isNight} onClick={() => setTheme("dark")}>
          <i className={styles.iconMoon} aria-hidden="true" /><span>Night</span>
        </button>
      </div>
      <button className={styles.themeToggle} type="button" role="switch" aria-checked={isNight} aria-label="Night theme" onClick={toggleTheme}>
        <i className={styles.iconSun} aria-hidden="true" /><i className={styles.iconMoon} aria-hidden="true" />
      </button>
    </>
  );

  return (
    <button
      className={styles.celestialToggle}
      type="button"
      aria-label={`Switch to ${isNight ? "day" : "night"} mode`}
      aria-pressed={isNight}
      onClick={toggleTheme}
    >
      <span aria-hidden="true"><i /></span>
      <b>{isNight ? "NIGHT" : "DAY"}</b>
    </button>
  );
}
