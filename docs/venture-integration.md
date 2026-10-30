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

October 29, 2026 (late evening) — Iteration 03, final visual refinement pass (committed and pushed,
not deployed):
- Hero: light and dark already matched; the side panels moved only on /clients. /community now uses
  the same curtain (owner note: "use the same transition"); layer parallax stays off.
- /community order: About → Queen Raida → Moloch → Hats → Builders → Projects → Join → Ideas →
  creed (owner's choice for the two sections missing from the brief's list).
- Hats Tree: curved SVG branches from the parent (no single trunk line); cards artwork → name → ID;
  `aria-pressed` buttons with hover highlight, select-to-enlarge (1.1 / 1.04 on phones), dimmed
  siblings, Escape or a second click to clear; focus-visible selection only for keyboard focus, so
  a mouse click does not toggle twice. Stewards paragraph emphasised (coral rule and term).
- Headings: one two-level scale (34 / 52, phones 20 / ≤ 40); Guild 34 / 44; panel headings 30 / 46.
- Builders: still lists keep natural-width cards in staggered rows, centred with auto margins
  (`justify-content: center` would clip a wider list on the left).
- Creed: coral highlight, deep navy type. Hire panel: one stroke around both stacked blocks.

October 29, 2026 (evening) — Iteration 02, both audience routes (committed and pushed with the work
it builds on; owner approved committing the artwork):
- Hero (/community): the owner's copy (eyebrow, two lines, subtitle, two CTAs); "builder owned
  community" in bold; "Explore the community →" keeps the Portal join destination.
- Hero (both): no layer parallax (`Hero still`; the /clients curtain stays). One headline rule for
  Hire and Join: the second line fits its space up to 73 px, the first at 58:73, one line per segment
  at every width (`--title-fit` per route, measured: 11.95 Hire, 17.45 Join). On phones this makes the
  headlines smaller than before (open question 30). Eyebrow heavier.
- H3: Ubuntu on both routes, h3 em included, with `!important` because several module rules are more
  specific. Hats labels in Ubuntu.
- Guild kit (/community): a horizontal expander on desktop (its own grid column grows from 0 while
  the illustration's shrinks, content pinned right so it slides in from the right), a vertical one on
  phones (rows 0fr → 1fr inside a clipping wrapper). Semantic button with `aria-expanded`; closed panel
  `inert`; Escape anywhere or the close button closes and refocuses the toggle; reduced motion
  switches instantly. The Guild module does not exist on /clients.
- Queen Raida and Moloch: `min(58svh, 600px)` with a bottom-up crop and a 28–44 px gap to the copy;
  depth parallax not attempted (no separate layers; duplicating the image was ruled out).
- Hats Tree: two columns on desktop (copy and link left, tree right, 96 px parent), one column under
  961 px. The "Explore the roles…" requirement line is no longer rendered (removed from the content).
- Builders (both): the Frame 122 editorial grid for short lists is retired; every category uses the
  masonry cards (short lists one or two per row) on the coral band; band, rows and cards tilt −1°
  together (the earlier counter-rotation is gone).
- CTAs: dark hover #E0185E and pressed #A80E44 so the resting #CE1252 no longer equals hover; Portal
  actions use →, in-page actions ↓; standalone links and disclosures ≥ 44 px.
- Accordion rows: title 700 full contrast, description 82% (≥ 7:1).
- Creed: "build." as an indigo (#303675) preselected highlight with cream type, both themes.
- Join: owner copy, Grinder at regular weight for the heading, "Create your Portal profile →". The
  rounded coral panel stroke now applies to the /clients inquiry panel as well.
- Projects heading: "What happens when builders / follow their curiosity." (owner).

October 29, 2026 — Community visual refinement follow-up (committed with iteration 02). Two passes on the owner's
brief of the same evening; the second (this session) supersedes the first where they differ.
- Hero, /community: both segments white and each on one line at every width. The second line
  ("SERIOUS WEB3 BUILDERS") scales to the space it has, up to the shared 73 px, and the first keeps
  the 58:73 proportion; the h1 takes the same size so the lines sit together on phones. At 393 px the
  lines are about 19 and 23 px (they were 33 and 52 px, with the second line clipped off-screen).
  /clients is unchanged; its "WORKING PRODUCTS" still wraps to two lines below about 420 px.
- Artwork: the owner's Queen Raida and Moloch cuts (desktop 2877 × 1230, rectangle 16:9, mobile 2:3)
  under `public/images/venture/entities/`. Phones ≤ 700 px get the vertical cut, tablets and squarer
  monitors (≤ 1199 px or aspect ≤ 3:2) the rectangle, wide screens the desktop cut. The missing-file
  fallback was removed: every cut now has the same (untracked) status.
- Builder wall, /community: the masonry runs on a coral band (the site's coral #EE3C78, in both
  themes) tilted −1°, the wall inside turned back +1°, so rows, cards and text are level. The first
  pass put Moloch red on the whole section with a ±0.6° pair that cancelled out (no visible tilt) and
  left the coral heading line and selected filter coral-on-red; now the section keeps its surface and
  only the band is coral. Cards are opaque (cream in light, navy in dark). The band is 64 px wider than
  the screen; the section clips it (no page overflow).
- Join panel: 2 px coral stroke, 28 px radius. The membership-guide link was cream on the light-blue
  panel (unreadable, since iteration 01); it is dark green in the light theme now.
- Moloch: coral background (#EE3C78) with RaidGuild deep navy text (#12163B, 4.6:1) for label, title
  and body. Navy #191E4E (4.2:1) and indigo #303675 (2.9:1) fail for body copy on coral, so "lilac/blue"
  is the deep navy. CTA: deep navy pill, white label, cream on hover.
- Hats Tree: `raidguild.png` as the parent node (132 px, 64 px on phones) with the connector from it to
  the five roles. Removed: "Also in the tree" (the four other roles), the selected-role detail panel
  below the tree, the "Explore the Hats Tree" pill, and the DAO Roles and GitHub links. One link
  remains, "Explore the Hats Tree ↗", to the full tree on Hats Protocol. With no detail panel the role
  cards are a plain list, not buttons. The handbook role descriptions (Brand, Sync) were dropped
  with the panel. The first pass had removed the "Stewards." paragraph from the intro; it is approved
  copy outside the tree, so it is restored. Surfaces: dark green in light; deep navy #12163B in dark
  (no green in the dark theme; between raised-navy Projects and navy builders).
- H3s on /community use Ubuntu (`--font-body`); the first pass applied it to /clients too, now
  scoped to /community. Only /community H3s changed.
- Audience switch unchanged: fixed, `aria-current="page"`, 44 px targets, visible focus ring.
- Not changed: approved copy, the illustrations themselves, /clients.

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

October 29, 2026 — Design system normalization, iteration 01 (uncommitted):
- One hero title scale for /clients and /community (the October 27 Hire the DAO scale); /community
  keeps its coral second line, /clients its headline-colour line and curtain.
- Dark-theme buttons on both routes: white (#FAFAFA) labels; filled buttons on #CE1252 (5.3:1) with
  a canonical pink edge; outline buttons transparent with a cream edge. Light theme unchanged.
- /community uses the /clients builder network (masonry, 36 px/s, adaptive grids, full bleed), the
  Services module for "Ideas into working systems" (with its specialist practices), and the
  light-blue panel for Join; Join keeps its membership actions and no inquiry form.
- /community order: hero, About RaidGuild (restored from f842d87), Queen Raida feature, Projects and
  Experiments, the Hats Tree (replaces "Keepers of the signal"), builders, Join, About Moloch
  feature, ideas into working systems, creed. The October 23 Queen Raida carousel and the steward
  roster are no longer rendered there (their copy stays in community.ts).
- Queen Raida and Moloch share sections/ImmersiveFeature.tsx: full-width art (horizontal on
  desktop, vertical on phones), copy below; no parallax (no separated layers exist).
- The Hats Tree is a reference snapshot of tree 1822 (lib/data/hats.ts): parent, five featured
  roles with placeholder art, four more listed, "Explore the Hats Tree" to the Hats app. No wearers.
- Dark scenes: navy, deep navy (--surface-deep #12163B), raised navy, dark green (Hats), Moloch red
  (--moloch-600; the literal coral fails body-text contrast).
