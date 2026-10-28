# Venture Beyond integration

Design and Figma asset handoff: Luis Blanco (Louchi), https://estudioblanco.org.

Source: https://github.com/luisblancoach/website/tree/handoff/venture-beyond-dekan
Imported tip: a195359. All seven original commits are retained as merge ancestry,
including their original author information. HANDOFF.md is the original handoff;
this document records subsequent integration decisions rather than rewriting it.

Integration decisions:
- Use self-hosted Afacad Flux with CSS slants instead of the missing Grinder cuts.
  Keep Ubuntu body and Ubuntu Mono supporting type from the handoff.
- Preserve the local foliage front door and direct inquiry route.
- Include Talent & Placement as a proposed spear; keep the handbook accessible.
- Retain the supplied illustrations, palettes, icons, portraits and video scenes.
- Make section sizing responsive rather than enforcing Figma heights when content grows.

Clean scene exports supplied by Louchi in Assets.zip on 2026-09-09:
- Video/wind.mp4 → hero-light.mp4 (2200 × 940).
- Video/forest.mp4 → hero-dark.mp4 (2184 × 948).
- Video/Animated Scene.mp4 → manifesto.mp4 (2200 × 940).
These replace the previous preview videos with background-only artwork. Web copies
use H.264 CRF 23, yuv420p and fast-start metadata, with audio removed. Posters are
extracted from the matching exports. Playback pauses offscreen, in hidden tabs,
and for reduced-motion preferences; the existing hover discovery layer is retained.

Walkthrough parity pass:
- Continuous word ticker and counter-moving statistics band, with pause controls
  and static, wrapped content for reduced-motion preferences.
- Lighter dark-mode card surfaces; stronger interaction colors apply on hover/focus.
- Contact artwork uses the genuinely transparent professions/Druid 2.png export
  from Assets.zip instead of the earlier cream-backed PNG.
- Night navigation/theme switch use navy surfaces; the switch stays separate.
Statistics remain unverified mockup values, not newly validated claims.

Loop experiment: hero playback uses separate *-pingpong.mp4 derivatives, with
the original forward sequence followed by its reverse (duplicate endpoint frames
omitted). The original clean exports remain available for comparison. Reverse
segments are processed in bounded 48-frame chunks to limit encoding memory use.
The browser plays one continuous file rather than switching players at the seam.
The creed/manifesto remains forward-only because of its flying bird. Its
manifesto-crossfade.mp4 derivative blends the final 0.75 seconds with the opening
0.75 seconds, then loops to the next forward frame without reversing motion.
Statistical and portfolio copy from the design remains mockup content requiring
editorial verification before release. No Grinder files are bundled or required.

October 28, 2026 — Hire the DAO iteration (October 27 desktop and mobile designs),
confirmed by the project owner:
- /clients hero: "Hard problems, / working products", both lines in the headline
  colour, the second line larger. The tan block behind the headline and the grey
  rectangle in the mobile hero are annotation patches, not built.
- Guild ticker (/, /clients, /community): Senior devs, Scoped raids and Built by owners
  replace Many edges, Onchain systems and Open experiments. The strikethroughs in the
  design are editorial marks.
- Previous works becomes "What we've built for our clients": nine projects from
  casestudies/ (lib/data/caseStudies.ts) with their logo buttons, website screenshots
  and official sites. One marquee on desktop with previous/next controls; two marquees in
  opposite directions on mobile, sharing one selection. Ultimate Dominion and Gnosis
  leave the showcase. Daedalus keeps ddls.co. "Read more" opens each project's own site.
- /clients services: "What are you trying to ship?", the accordion and the foundry
  illustration as separate regions (portrait cut on desktop, horizontal cut on mobile).
  The specialist-practice disclosure and the Guild inquiry pill are removed there;
  /community keeps the October 23 capabilities section unchanged.
- Typography: the served refined Grinder WOFF2 cuts (912 glyphs) stay. The supplied
  Grinder OTF package (Grinder-121888642.zip) holds the original 306-glyph cuts, the
  same as the unused Grinder-*.woff2, and is not used. Its licence terms are unknown.
- Logo marquee: one position drives each strip (frame loop writing the native scroll
  offset), so the user can scroll it by trackpad, wheel, touch or drag while it keeps moving.
  It does not pause on hover; manual input takes over briefly and motion eases back in.
  Keyboard focus holds it still; reduced motion stops automatic movement only.
- Services intro: the design's incomplete "Owners - not vendors, to turn …" is replaced by the
  owner-approved "Owners, not vendors: we turn shared experience into focused offerings with
  end dates of their own."
- Scale: the designs are a 1600 px desktop (1.8 image px per CSS px) and a 393 px mobile layout
  (about 1.62). Display type and logo buttons are sized to those, and to fit the screen on phones.
