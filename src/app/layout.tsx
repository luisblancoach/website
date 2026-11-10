import type { Metadata } from "next";
import {
  afacadFlux,
  lastDuel,
  lastDuelRetalic,
  lastDuelExtended,
  ebGaramond,
  maziusDisplay,
  ubuntu,
  ubuntuMono,
} from "@/lib/fonts";
import "./globals.css";
// import { ThemeProvider } from "next-themes";
import { Providers } from "@/providers/providers";
import VercelAnalytics from "@/components/VercelAnalytics";
import { themeBootScript } from "@/lib/theme";
import { ASSET_ORIGIN, ROBOTS, SITE_ORIGIN, X_HANDLE } from "@/lib/seo";

export const metadata: Metadata = {
  // Relative share images resolve on the serving host; canonical URLs are absolute (lib/seo.ts).
  metadataBase: new URL(ASSET_ORIGIN),
  title: {
    default: "RaidGuild — A Builder-Owned Community",
    template: "%s | RaidGuild",
  },
  description:
    "A builder-owned community of creative and technical people sharing knowledge, exploring technology, and building together since 2019.",
  openGraph: {
    siteName: "RaidGuild",
    type: "website",
    url: `${SITE_ORIGIN}/`,
    title: "RaidGuild — A Builder-Owned Community",
    description:
      "Explore the people, ideas, and independent specialist practices growing from the RaidGuild community.",
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    title: "RaidGuild — A Builder-Owned Community",
    description:
      "Explore the people, ideas, and independent specialist practices growing from the RaidGuild community.",
  },
  // noindex on every host until go-live (lib/seo.ts).
  robots: ROBOTS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          async
          src="https://plausible-production-78b3.up.railway.app/js/pa-FkymWO7gixkQ6_9ux01Qn.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};\n  plausible.init()",
          }}
        />
      </head>
      <body
        className={`${lastDuel.variable} ${lastDuelRetalic.variable} ${lastDuelExtended.variable} ${afacadFlux.variable} ${ebGaramond.variable} ${maziusDisplay.variable} ${ubuntu.variable} ${ubuntuMono.variable} antialiased`}
      >
        <VercelAnalytics />
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        > */}
        <Providers>{children}</Providers>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
