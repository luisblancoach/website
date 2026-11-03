import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import localFont from "next/font/local";

// Last Duel, the landing pages' display family (November 2, 2026; it replaces
// the earlier display family, see STATUS.md). Supplied as OTF; the name tables
// show private builds renamed from Adobe's Eurostile LT Std 2.035, with the
// licence field "PRIVATE / INTERNAL USE ONLY ... No redistribution,
// sublicensing, web hosting". See STATUS.md before committing or deploying.
// One family mirrors the old Regular/Italic pair: the upright cuts are the
// Extended 2 widths (Ex2, BoldEx2); the italics are the only slanted cuts of
// normal width (Oblique, BoldOblique). font-synthesis stays off on the
// landing pages, so 500 renders the 400 cut and 600+ the 700 cut.
export const lastDuel = localFont({
  src: [
    { path: "../../public/fonts/LastDuel-Ex2.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/LastDuel-BoldEx2.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/LastDuel-Oblique.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/LastDuel-BoldOblique.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-last-duel",
  display: "swap",
});

// The back-slanted (+12°) Bold Extended 2 cut, kept as its own family so
// that `font-style: normal` selects it: the top line of every two-level
// display heading (November 2, hierarchy pass). The regular Retalic
// (LastDuel-Ex2Retalic.otf) is supplied but not wired: nothing sets Retalic
// below 700 any more, and next/font preloads every registered file.
export const lastDuelRetalic = localFont({
  src: [
    { path: "../../public/fonts/LastDuel-BoldEx2Retalic.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-last-duel-retalic",
  display: "swap",
});

// Bold Extended 2 on its own, with no italic face, for the bottom line of the
// two-level headings ("Bold Extended Italic"). Last Duel has no extended
// italic, so those lines ask for `font-style: italic` with style synthesis
// on: the browser slants BoldEx2 (about 14°), the same mechanical oblique the
// supplied Oblique and Retalic cuts are (12°). Same file as in `lastDuel`.
export const lastDuelExtended = localFont({
  src: [{ path: "../../public/fonts/LastDuel-BoldEx2.otf", weight: "700", style: "normal" }],
  variable: "--font-last-duel-extended",
  display: "swap",
});

// Openly licensed display alternative; preserve legacy typography on other routes.
export const afacadFlux = localFont({
  src: "../../public/fonts/AfacadFlux-Variable.ttf",
  weight: "100 1000",
  style: "normal",
  variable: "--font-afacad",
  display: "swap",
});

// Legacy display face, still used by the pre-redesign pages.
// Primary Display Font - Mazius Display
export const maziusDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/MAZIUSREVIEW20.09-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/MaziusDisplay-Bold.otf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

// Secondary Body Font - EB Garamond (bundled to keep production builds deterministic)
export const ebGaramond = localFont({
  src: [
    {
      path: "../../public/fonts/EBGaramond-VariableFont_wght.ttf",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "../../public/fonts/EBGaramond-Italic-VariableFont_wght.ttf",
      weight: "400 800",
      style: "italic",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

export const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

// Figma's supporting/body face. Kept separate from the display fallback so the
// hierarchy remains stable when the display family is unavailable.
export const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
