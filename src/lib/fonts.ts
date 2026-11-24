import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import localFont from "next/font/local";

// Venture Beyond, the landing pages' display family since November 24, 2026
// (it replaces Last Duel), is registered with @font-face in
// src/app/venture-beyond.css, not here: it needs the font-stretch and
// size-adjust descriptors, which next/font drops under Turbopack.

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
