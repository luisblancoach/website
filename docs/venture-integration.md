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

October 28, 2026 — team feedback on the deployed review (owner's annotated references
`~/Downloads/Frame 120.png`, desktop, and `Frame 121.png`, mobile; handwritten notes and
colour patches are instructions, not artwork):
- Review outlines: the orange and purple dotted boxes in the references were the
  narrative review flags, which rendered in every local development server. Flags now
  render only on preview deployments or with SHOW_REVIEW_FLAGS=true, so localhost shows
  what production shows (pending entries are dropped there too). Focus outlines are
  unchanged.
- Case studies: every project uses Tae's supplied description (October 28 for DAOhaus,
  Daedalus, BrightID, Hypercerts, Problem, Gitcoin and YieldNest; October 27 for Livepeer
  and Pocket Network). The October 23 archive titles and summaries are removed with the
  summaries they belonged to, so no project has a title line. Daedalus links to
  https://ddls.co, with the owner's new logo button and screenshot.
- People behind the work (/clients): "The Guild runs on owners, / not employees." in the
  showcase hierarchy (smaller dark lead, larger coral line), label in coral. The intro is
  transcribed from the references and flagged for wording until confirmed. On mobile the
  five steward cards sit in two columns instead of a sideways scroll.
- Builder network (/clients): larger illustration (up to 450 px), and the member wall in
  masonry rows: three rows whose cards are as long as each name and title, with no
  truncation. Rows are balanced by estimated length and cards grow to close the rest; no
  card is given an artificial size. Three rows on mobile too (previously two).
- Inquiry (/clients): the panel uses the light-blue brand surface (--color-cyan, #B8E0DF,
  the references' fill) in the light theme, with dark text; the dark theme keeps its
  surface. The illustration is enlarged. Wording, the Guild inquiry button and the form
  are unchanged.
- Creed (/clients): "build." is coral at every width (it was dark green below 1000 px), and
  the mobile section is at least 600 px tall.
- Scope: the people, wall, inquiry and creed refinements apply to /clients only
  (data-audience="clients" or explicit props); /community and / are unchanged.

October 28, 2026 — interaction fixes after the owner's local review:
- Builder wall: the seamless-loop copy of the cards is rendered only while one copy is wider
  than the wall and motion is allowed, so filtered results never show a builder twice; the
  first copy is the only one in the accessibility tree. Applies to every member wall.
- Inquiry (/clients): the form opens inside the light-blue "Begin a transmission" module,
  which grows to hold it; no separate dark form section. The form is unchanged.
- Navigation (/clients): the call to action reads "Build with us"; other "Tell us what you're
  building" uses stay.
- Hero parallax: not restored in that round. The approved October 23 hero (40f3910) has the
  same motion as this branch; the layered effects are older (August 7–12 painted layers;
  August 19 – September 25 hover curtain) and were removed before the baseline.

October 28, 2026 — Frame 122 (owner's annotated desktop reference, ~/Desktop/Frame 122.png):
- Hero (/clients): the owner chose the August 19 – September 25 foreground curtain (4ffb591,
  removed in 5d8a82d) over the August 7–12 painted layers. Restored with its distances (152 px;
  clamp(160px, 13vw, 250px) from 1000 px), easing and 0.8 s / 1.4 s timing, and its 2.2 s
  release; opened by the title hover, keyboard focus in the hero copy and scroll. The waypoints,
  hover prompt and copy shift are not restored; the video backdrop stays. Phones part by
  min(64px, 16vw). Reduced motion: still.
- Previous works: more space between the ticker and the heading and between the heading and
  the showcase, on the section rhythm.
- Builder network (/clients): 1–8 filtered results use an editorial grid that fills the wall
  area (src/components/venture/builderGrid.ts); 9+ keep the moving wall.
- Inquiry (/clients): the form replaces the introduction inside the light-blue module (two
  exclusive states); Close and a Back action on step 1 return to the introduction; values kept.
  The form's hierarchy is restyled (heading, stepper, step pills, fields, buttons) without
  changing its fields, validation or submission.

October 28, 2026 — Frame 123 (owner's annotated desktop reference, ~/Desktop/Frame 123.png):
- Builder network heading (/clients) uses the showcase heading scale (34 px lead, 52 px coral
  italic line); mobile 20 px over clamp(30px, 10.2vw, 48px).
- The full builder wall on /clients moves at 36 px/s (was 18); /community and / unchanged.
- Inquiry form (/clients): heading 24 px on one line; the October 23 "Three steps…" line removed;
  stepper and step pills on scroll-100 (the annotation's "white"); line-based fields with coral
  focus and moloch-600 error underlines; module about 700 px tall at 1440 (was 985).
- Not implemented, pending the owner: removing "Explore all members" and the "make gutter" note.

October 28, 2026 — after Frame 123:
- Builder wall (/clients): while it moves it runs edge to edge across the viewport; "make gutter"
  means the spacing between cards (owner), which is unchanged. Static lists keep the content grid.
- Client showcase (/clients): rotates every 3 s through the nine projects with a short crossfade;
  pauses on hover and keyboard focus, offscreen and in hidden tabs; still with reduced motion;
  manual selection restarts the interval; only manual changes are announced.

October 28, 2026 — Join the DAO iteration (/community):
- Main call to action "Join our community" (hero, navigation, creed), same Portal destination.
- Guild section "About Moloch": owner-supplied copy on Moloch, coordination, the Hats Tree and
  stewardship; CTAs "Explore the Hats Tree" and "Find your path into the Guild"; links to the DAO
  Roles handbook page and Hats Protocol. The separate Join section is unchanged.
