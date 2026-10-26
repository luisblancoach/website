"use client";

import { useTheme } from "./ThemeProvider";
import styles from "../venture.module.css";

// The day/night control changes appearance only; it never changes the audience.
export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const isNight = theme === "dark";

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
