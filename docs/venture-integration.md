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

October 30, 2026 (release pass) — Guild CTA order (uncommitted):
- Guild module (`GuildPrologue`, audience routes; the module appears only on /community): "Join the DAO"
  (primary) first on the left, "Your Guild kit" (secondary) anchored to the row's right edge; phones stack
  them in that order, left-aligned. Links below unchanged (Enter Discord, Read the handbook, Queen Raida).
  Supersedes the CTA order pass's kit-first order. Styles, icons and states unchanged.

October 30, 2026 (metadata pass) — Route share images, form intro, card colours, one card family (uncommitted):
- Metadata: /clients keeps the owner's title, description and og:title, and now shares a Queen Raida image;
  /community gets its own title "Join the DAO" (template "| RaidGuild"), description, og/twitter title "Join
  the DAO: find your people at RaidGuild" (drafted, for review) and a Moloch image. Both images are 1200 ×
  630 WebP derivatives of the rectangle artwork (150 / 111 KB) with og:image width, height, type and alt.
  Each page restates site name, type and URL (a page openGraph replaces the root's). "/" unchanged.
- Inquiry: the form's own heading ("Tell us about your project") is removed; the module title introduces it.
  The description is one line where the column allows 15 px+ (16 px at 1920, 15.1 px at 1440), wrapping at
  16 px on narrower columns. The stepper is stronger: 28 px circles, 15 px titles, 6 px bar.
- Builder colours: dark cards rest on #191E4E and turn #303674 on hover, focus and selection; canonical coral
  name and mark again (4.2:1 on #191E4E); selected profession #FF95B8. Supersedes "#303674 at rest".
- Wall rhythm: one --wall-gap (24 px desktop, 16 px phones) above, between and below the courses and grid
  rows; the plane is the fixed content height + 2 gaps. Selector → plane 64 px desktop / 48 px phones.
  Builders → People / Hats stays 115 px.
- Large and tall tiles centre avatar and name (horizontal large tiles keep the avatar beside a left-aligned
  name, centred as a group); narrow phone tiles centre too; the phone wall cards centre their stacked
  content. Narrow tiles use 10 px padding so long names stay ≥ 13 px at 375.
- People behind the work (/clients): the steward cards join the builder family: same surface and tokens,
  2 px edge, 14 px radius, display-italic name, mono caps role and project, crossed-swords mark (24 → 32 px),
  same hover / focus / selected (dark #303674), clean round photo (inner ring and filter removed). Every card
  is a link (Takekek, without a profile, goes to the Portal directory with an aria-label saying so).

October 30, 2026 (panel-secondary pass) — Transparent in-panel secondaries, Join title rhythm (uncommitted):
- Secondary CTAs inside panels (Guild module: "Your Guild kit"; Join panel: "Enter Discord"; inquiry form:
  Back / Previous) are transparent: the panel surface shows through the pill and its icon disc; only the
  edge, label and glyph carry it (navy on bone, cream on navy). Hover / pressed tint the surface with the
  label colour (9% / 16%); label, edge and glyph never change; focus ring and disabled (.5) unchanged.
  Secondaries over artwork (heroes, Moloch) keep the opaque bone / navy fill decided earlier.
- Join title: the hero's rhythm. "YOUR FIRST STEP" in the Retalic cut, 30 px (20 px on phones), the quiet
  level; "INTO THE GUILD." in the display italic, coral, sized to one line (9.6 em; up to 52 px: about
  47 px at 1440, 30 px at 393). Compared in place with three alternatives (current; upright 900 lead +
  Retalic second line; upright tracked lead + italic second line, the Raida/Moloch pattern).

October 30, 2026 (wall-frame pass) — #303674 cards, fixed wall height, adaptive tiles, shared selection (uncommitted):
- Dark builder cards use the owner's exact navy #303674 on every card (wall and grids). Coral (#EE3C78) is
  2.9:1 on it, under 3:1 even for the 24 px names, so the dark name and mark are light coral #FF7AA6 (4.5:1)
  and the selected profession #FF95B8 (5.4:1); profession cream (9.1:1), selected name cream, edge cream 38%.
  Light unchanged (cyan #DFF2F1).
- Fixed wall height: the coral plane's content is 360 px where the grid has 12 columns (viewport ≥ 809 px)
  and 552 px below, for every tab; wall courses take a third each (gaps tied to the same variable) and grids
  stretch their rows to fill. Switching tabs no longer moves the next module.
- Adaptive tiles: each grid tile is a size container and lays out its body (new `memberTileBody` wrapper in
  TeamWall, since a container cannot query itself): compact = row card; tall (150 px+) = up to 132 px
  avatar over the name; large (520 × 220 px+) = up to 180 px avatar beside a name up to 52 px; narrow
  (< 260 px) = stacked. The mark is 24 px, 32 px in tall/large tiles (40 px selected). Names shrink only to
  fit whole (width factor 1.02 em per character; smallest 14 px). Wall cards: 64 px avatar on desktop; on
  phones a vertical card with an 80 px avatar.
- Builders → People (/clients) and Builders → Hats (/community): half the section space on each side of
  the joint (115 px at 1440, was about 250).
- Shared selection language: hover / keyboard focus / selection keep the surface and thicken the edge to
  3 px in the selection colour (builders: navy light, cream dark; steward cards: their text colour; Hats:
  cream), no lift, scale or background swap, focus ring outside. Hats no longer scale the selected card or
  dim the others; aria-pressed, Escape and click-outside unchanged.
- Hire form: the coral step heading ("ABOUT YOU" etc.) under the stepper is removed in the guided form; the
  stepper names the step. "/" keeps it.

October 30, 2026 (normalization pass) — One builder card component (uncommitted):
- Every builder block (moving wall and category grids, both routes, both themes, every width) is one card:
  an `<a>`, 14 px radius, 2 px edge, padding 14 / 46 (room for the mark) / 14 / 14, a 56 px round avatar on
  the left, display-italic 24 px name over mono 12 px caps profession, the RaidGuild crossed-swords mark
  24 px at 12/12 px from the top-right corner (32 px when selected). Colours come from per-theme card
  tokens. Light: cyan #DFF2F1, deep coral name #CE1252 (4.7:1), dark green profession, selected = 3 px
  navy edge, navy name, deep coral profession, navy mark. Dark: deep navy #12163B (4.6:1 against the coral
  plane), coral name (4.6:1), cream profession, selected = 3 px cream edge, cream name (navy cannot read on
  navy), light coral profession #FF7AA6 (7.1:1), cream mark. Focus adds a 3 px ring outside the card
  (dark-green ring light, cream dark). This supersedes the single cyan surface of the CTA order pass in dark
  and fixes the faint names (e.g. Bitbeckers) and white-on-cyan selected text.
- Phone grids (category view, under 720 px): tiles stack the avatar above the text with 14 px padding, and
  a name that does not fit at 24 px shrinks to fit whole (smallest: "THEBEYONDR", 14 px) rather than
  truncating. Wall cards never need it.
- Clickability: the 8 builders without a profile link in the data (Aperion, Bitbeckers, Elco, Georgeh, Jip,
  Takekek, Ven, Vid) were plain, non-focusable divs styled like links. Every card is now a link: to the
  builder's own page when known, otherwise to the Guild directory on Portal (`PORTAL_MEMBERS_URL`), with an
  aria-label saying so. Their own profile URLs are an open question.
- The October 29 wall card rules outranked the new ones (one is loaded twice by the dev build); the box,
  surface and edge use a doubled class to win.

October 30, 2026 (CTA order pass) — Guild CTA hierarchy, one builder-card surface (uncommitted):
- Guild CTAs (`GuildPrologue`, audience routes; the Guild module exists only on /community): "Your Guild kit"
  is now the secondary pill (sword right, left while the kit is open), "Join the DAO" the primary, side by
  side; "Enter Discord" (an outline action in the narrative) renders as a quiet text link with the Discord
  mark, first in the links row, before "Read the handbook" and the Queen Raida link. "/" is unchanged. The
  Join form panel's "Enter Discord" pill is unchanged.
- Builder cards: one surface in both themes, wall and category grids: light cyan #DFF2F1, 2 px navy-tint
  edge, 14 px radius. A brighter navy was not usable (the selected navy name would be 1.3–1.6:1). Default:
  deep coral name #CE1252 (4.7:1; canonical pink 3.3:1 on this cyan) and dark green profession; selected
  (hover or keyboard focus): same surface, 3 px navy edge, navy name, deep coral profession. Icon: the
  RaidGuild crossed-swords mark (`ico-logo.svg`), 24 px top-right (10 px in), 32 px navy when selected. This
  also resolves the dark-phone name question (60).
- Builders spacing: section padding + 24 px; 48 px (desktop) / 40 px (phones) between the category
  selector and the coral plane.

October 30, 2026 (form pass) — Channel picker, bone panel, stepper, coral logo sword (uncommitted):
- "Prefer another way to connect?": the Radix select keeps its behaviour and value (`altContactChannel`), and
  gains channel marks (owner's `ico_discord.svg`, a drawn paper plane `ico_telegram.svg`) in the trigger and
  the options. Its menu (portalled outside the page, so styled in `globals.css`): bone with a navy edge (navy
  with a cream edge in dark), 44 px options in Ubuntu, highlighted option one bone step deeper, coral check.
  The username field and picker read as one field.
- Panel: bone (`--color-cream`) in light, on both routes, instead of white-cream; fields white (dark: a 7%
  cream surface on the navy panel). Dark panel unchanged.
- Stepper (`wizard.tsx`, guided form only; "/" keeps its pills): a full-width `<nav>` with one column per
  step, a 20 px numbered circle and the title over a 4 px bar segment; current = coral circle, bold title;
  others = bone circle, no outline, quieter; segments up to the current step fill coral (the progress bar).
  The "Step N of 3" card and the percentage are removed; the nav's label says "step N of 3".
- "Enter Discord" (Join panel): verified identical to "Explore our work" (bone/navy secondary), unchanged.
- Global logos: the sword in the top-bar and footer logos is coral (3.1:1 on bone, 3.7:1 on navy).

October 30, 2026 (wall pass) — Builders wall, Moloch title, white panel, ground alignment (uncommitted):
- Builders: the "N profiles · category" line is screen-reader only (it still announces filter changes). A
  mouse over the moving wall slows it to 30% (about 36 → 11 px/s) instead of stopping it; keyboard focus, a
  drag or the wheel still hold it. Every linked card (wall and category grids) ends with the up-right sword
  (`arrow-right-up.svg`) in its top-right corner, 10 px in; the link's name is the card text. Selected card
  (hover or keyboard focus): white card, deep navy name (16.7:1), deep coral profession #CE1252 (5.25:1;
  canonical pink is 3.6:1 on white), both themes. Default unchanged (coral name, dark/cream profession).
- Moloch: "TOGETHER WE SLAY" cream (3.1:1, large display); "MOLOCH" 73 px (was 52, the hero scale), the
  sword mark on the same line; phones size the line to the column (about 51 px at 393).
- Contact panels, light theme: white-cream #FFFCF4 instead of light blue; the form's step card and chips
  go cream to stay distinct. "Enter Discord" unchanged. Dark unchanged.
- Ground alignment: the scene art moves up under the figures (9% of its height on desktop, 4% on phones);
  the figures stay put. On desktop their feet now land on the paving in front of the hovercraft instead of
  on its hull (all four route/theme combinations).

October 30, 2026 (hover pass) — Calm hover and pressed states (uncommitted):
- Hover no longer turns a button into another one (it was deep coral with a white label for every variant).
  Every CTA keeps its label, edge, icon, size, radius, type and layout in hover and pressed.
- Primary (coral): the fill does not change (a darker coral drops the navy/ink labels under 4.5:1: #E8366F is
  4.31/4.35:1); hover = 1 px lift + soft shadow (light rgba(7,28,29,.2), dark rgba(0,0,0,.38)) + the sword
  nudging 2 px the way it points; pressed = no lift, inset shadow.
- Secondary: surface one step deeper: light bone #E6DFC9 (pressed #DED5BC), dark navy #20265C (pressed
  #262D69); same lift and shadow; labels stay ≥ 10:1.
- Chips (unselected Hire/Join and Day/Night options, builder and Explore filters, Guild kit toggle, kit close,
  showcase arrows): a 9% tint of their own text colour (pressed 16% + inset). Selected chips do not change.
- Form buttons follow the same rules (Next primary, Back/Previous secondary). Focus ring and disabled are
  unchanged. Hover rules stay under `(hover: hover)` (no sticky hover after a tap); reduced motion removes
  the lift and the sword nudge. Tokens `--cta-hover-bg/-fg` and `--cta-active-bg/-fg` were removed; new:
  `--cta-hover-shadow`, `--cta-secondary-hover-bg`, `--cta-secondary-active-bg`, `--cta-chip-hover-bg`,
  `--cta-chip-active-bg`.

October 30, 2026 (composition pass 2) — Figures on the art's ground, Dark primary = selected tab (uncommitted):
- Contact scene: the stage is the artwork's own box (scene width × native ratio: 0.4375 desktop, 1.5 phones),
  pinned at the top; the art is never rescaled to the viewport. The gallery sits in the art's coordinates
  taken from the owner's mockups (desktop 14–53% across, 10–90% down; phones 12–88% across, 44–99% down;
  601–999 px 3–43% across), so the group stands on the same ground at every width and theme. The art fades
  from 72% of its height into the module's surface (raised from the earlier 90%), with the feet in that fade
  as in the mockups; the group's own foot fade is 10%. The vertical cut now matches the single-column layout
  (≤ 600 px). Supersedes the viewport-tall stage of the composition pass.
- Dark primary CTAs take the selected Hire/Join tab's treatment: coral, deep navy label #12163B (4.6:1), one
  cream edge, navy disc with a light glyph. This removes the 3.1:1 cream-label exception. Applies to every
  dark primary (hero, Ask our AI CTO, Discuss your project, creed, Join, inquiry and form actions) and to the
  selected tab and theme option, which share the tokens.

October 30, 2026 (composition pass) — Scene and gallery as one pinned picture, Dark primary, sword variation (uncommitted):
- Contact scene (inquiry and Join): the profession gallery now lives on the pinned stage (`ContactScene`
  children), not in the module's flow; an invisible slot keeps its grid place (and, on phones, the room above
  the form). Stage height is controlled: the viewport, at least 560 px. The art is anchored to its top and
  cropped from the bottom or sides, never scaled to fit. Gallery: desktop in the left content column, 68%
  of the stage tall, 10% above its foot; phones centred, half the stage, below the top bar. The stage fades
  over its own last 10% instead of the section's end, so the characters never change while scrolling.
- Dark primary CTA: cream label and cream edge on coral, navy icon disc with a white glyph (light unchanged:
  ink label, navy edge). Contrast exception: cream on coral is 3.1:1, below AA 4.5:1 for these labels; the
  owner's choice, flagged.
- Sword variation, by meaning: "↘" (`arrow-right-down.svg`) for in-page links into the inquiry form (Hire
  hero primary, Hire creed CTA), "↓" for continuing down the page, "→" to enter/join, "↗" external.
  `pathGlyph()` in `PillIcon.tsx`. Icons stay aria-hidden; labels carry the action.
- "Discuss your project" (Hire showcase): full primary pill (56 px, 14 px label, 40 px disc; 52/13 px on
  phones) instead of the 44 px compact pill.

October 30, 2026 (final pass, later) — Pinned contact scene and one-line inquiry heading (uncommitted):
- Inquiry (/clients) and Join (/community), shared `ContactScene`: the scene layer spans the whole section
  (`overflow: clip`, not a scroll container) and its stage is `position: sticky; top: 0`, one viewport tall,
  covering it with the art. The art stays put while the document scrolls the form (or Join panel) over it,
  and leaves when the section ends; no nested scroller, no scroll capture, so wheel, trackpad, touch and
  keyboard scroll the page normally. The layer fades out over the section's last 220 px. The sections switch
  from `overflow: hidden` to `clip` so the sticky stage works. Desktop (≥ 1000 px): the profession gallery is
  sticky at the section's top padding, so it holds still with the scene while the form travels beside it.
  The gallery already pauses while focus is in the module (typing in the form). The Join panel at 1440×900
  fits the viewport, so there is nothing to travel there; on phones it scrolls over the pinned scene.
- Inquiry heading: "YOU'RE BUILDING" on one line: 46 px where the column allows, scaled with the copy column
  (container units) otherwise (36 px at 1100, 29 px at 393). The Join heading is unchanged.
- Fix: the open inquiry rendered an `undefined` class (a style name that did not exist); removed.

October 30, 2026 (final pass) — Logo restored, single outline, form open, clues moved, section rhythm (uncommitted):
- Logo: the coral/navy pill of the late-night pass is not approved and is reverted. The bar's own pill is
  back (paper in light, navy in dark, the audience switch's edge and shadow), one size larger: a 48 px sword
  disc (was 44) with a 30 px sword; phones keep the 52 px pill with a 28 px sword.
- CTAs: one outline only. The inner light rim is removed from every pill, the inquiry bar and the form
  buttons (`--cta-rim` deleted). Primary: coral, navy edge, ink label, navy disc. Secondary: opaque
  cream/navy, contrasting edge, navy disc.
- /clients inquiry: the form is open by default on the audience routes, below the introduction in the same
  panel; no trigger, no close link, no Back on step 1 (`GuildInquiry.tsx`; "/" keeps its trigger). It grows
  downward: the panel top stays put between steps.
- Easter eggs: the signal clue (was beside the inquiry) and the walker's mark (was under the creed) moved to
  the footer on the audience routes; their directions no longer name a place ("further down the page"). "/"
  keeps its placements. The portal clue stays inside the Portal overlay.
- Section rhythm: every content module has `--section-space` above and below (72 px phones, about 115 px
  at 1440, 128 px max); Raida/Moloch keep their art flush at the top. On desktop each module is at least a
  viewport tall (max 960 px), content anchored to the top so expansion goes downward.

October 30, 2026 (late night) — CTA icons, primary/secondary pills, creed highlight, logo (uncommitted):
- Icons: `primitives/PillIcon.tsx` maps each pill to a glyph by action: "→" enter/join = sword right,
  "↓" down the page = sword down, "↗" another site = sword up-right; destinations keep their mark (RaidGuild
  logo, Discord, Portal for "Create your Portal profile", handbook for Moloch's "Find your path into the
  Guild"). The Guild kit toggle uses the right/left swords. All are masks from `public/images/icons/`. The
  theme switch uses the new sun/dark icons. "/" shares the hero, Guild and creed components, so it shows the
  swords too (its colours are unchanged).
- Primary (filled): coral, a deep navy #12163B edge, a light inner rim (the double line), ink label
  (4.66:1), navy icon disc with a white glyph. `--cta-border` is now that navy for every CTA, which also
  frames the inquiry bar and the form buttons; the light-blue dark-green edge and the dark creed's navy
  button exceptions are gone. Moloch keeps its coral-scene exception for filled buttons.
- Secondary (outline): opaque, never transparent: cream with navy edge and label in light, navy with cream
  edge and label in dark (`--cta-secondary-*`, the only CTA tokens the dark block sets), with the navy icon
  disc. Form Back/Previous use it. Hover, pressed, focus and disabled are the shared states for both.
- Creed: "BUILD." highlighted again: a coral rectangle (square corners) with cream type, both themes
  (supersedes the night decision to drop the highlight).
- Logo: 60 px pill (52 px sword disc; 56 px disc on phones); navy pill with white sword and name in light,
  coral pill with navy sword and name in dark.

October 30, 2026 (night) — Refinements: Ideas heading, no foam, creed, hero, random gallery, Hire SEO (uncommitted):
- Ideas into Working Systems (shared Services module): the second heading line stays on one line, at the
  other sections' level. Desktop copy column 600 px (holds "WORKING SYSTEMS", 11.4 em, at 52 px); narrower
  columns scale the line with container units (about 40 px at 1100, 30 px on phones) instead of wrapping.
  Applies to /clients ("trying to ship?") too.
- Builders: the coral foam (blurred forms and bubbles) is removed entirely, CSS and wrapper; the plane is
  clean. Supersedes the afternoon foam decision.
- Creed: "build." loses the coral highlight; the line's cream, weight 400, both themes.
- Join hero: copy back to two sentences, "Find your people." / "Build something together.", still set on
  three lines with "TOGETHER." large, now in the headline cream (no pink). 88 px on desktop keeps it inside
  the copy column (ends at 717 px at 1440); phones fit the gutters.
- Profession gallery: shuffle-bag order (random per visit, every group once per round, never the same twice
  in a row; first group fixed for a stable server render). Change = a "transmission" of about 1.3 s:
  outgoing flicker with a 2–3 px cyan/pink channel split (0.55 s), incoming resolves through scanlines masked
  to the figure, settling to clean (`@property --holo-scan`). Opacity, filter and mask only. Pauses and
  reduced motion unchanged; no visible pagination.
- Hire SEO (`clients/page.tsx`): title "RaidGuild | Smart Contracts, dApp & AI Development Studio"
  (absolute, no template), Open Graph and Twitter title "Hire RaidGuild: senior teams for hard onchain and
  AI builds", the owner's description for all three. The page restates the root's site name, type and
  share image because a page `openGraph` replaces the root's; og:url is now /clients (was the site root).
  `robots: noindex` kept (unconfirmed claims). /community metadata unchanged.

October 30, 2026 (evening) — Contact module refinement, dark scenes and favicon (uncommitted):
- Dark scenes added: `neo/join-horizontal-dark.png` (desktop) and `neo/join-vertical-dark.png` (phones) as
  `contactScenes.dark`. Light + desktop → horizontal-light, light + phone → vertical-light, dark + desktop →
  horizontal-dark, dark + phone → vertical-dark. Light art never shows behind Dark. Only the shown picture
  is displayed; the hidden one is lazy and never downloads.
- Animation: 9 s per group; staggered opacity crossfade (outgoing 1.6 s, incoming 2.4 s after 0.4 s), no
  slide or scale. Pauses while the pointer is anywhere over the module, while focus is in it (reading or
  filling the form), off screen, in a hidden tab; reduced motion: no rotation, no transition.
- Pagination: removed (the dots read as generic). A visually hidden status names the group shown, not
  announced on every change; the active image's alt names it too.
- Light: the scene is unchanged; a faint cream veil inside the scene layer quiets the area behind the
  panel on desktop, and the light panel gets a soft elevation shadow (below it, seamless across the
  /clients panel's two halves). Text stays on the opaque panel.
- Phones: 40–72 px of landscape above the group (about 56 px at 393).
- Favicon: the owner's `icons/favicon-moloch.png` is the website favicon (`src/app/favicon.ico` rebuilt
  from it; the only icon the app links). Unlinked legacy icon files and the manifest were left alone.

October 30, 2026 (late afternoon) — Final contact module: scene and profession gallery (uncommitted):
- Shared by the /clients inquiry and the /community Join module (`sections/ContactScene.tsx`); "/" keeps its
  single illustration. Form fields, validation, submission, copy, CTAs and the Hire/Join differences are
  unchanged; the gallery takes the illustration's place and box.
- Background: `neo/join-horizontal-light.png` above 760 px, `neo/join-vertical-light.png` on phones (one
  `<picture>`, next/image sizes, lazy). Behind the module (isolated stack), at the top, width capped at
  `--page-wide` (1760 px), height at most the art's own ratio, cropped from the bottom.
- Gradient: the scene fades to transparent over its lower 42% (to the module's surface) and, when capped,
  over 120 px at each side; each profession group fades out over its lowest 14%. Masks only: no extra
  height; text and form sit on the opaque panel (contrast unchanged).
- Light / Dark: scenes only exist for light, so dark keeps its navy surface (no filtered or dimmed light
  art). Adding `dark` to `contactScenes` (`join-horizontal-dark.png`, `join-vertical-dark.png`) enables it.
- Gallery: six transparent groups, opening on "Druid 2" (the previous illustration); one every 7 s with a
  1.2 s crossfade. Waits on hover, while focus is in the module, off screen and in a hidden tab; stops once
  a dot is chosen. Dots: one tab stop, arrow keys, 44 × 44 px, `aria-pressed`; the shown group is named in
  its alt and, after a choice, a polite live region. Reduced motion: no rotation, instant change.
- Open: where the supplied `icons/favicon-moloch.png` belongs (not shown in the mockups).

October 30, 2026 (afternoon) — Container, persistent bar and landing refinements (uncommitted):
- Page container: one content column for every section on both routes, `--page-max: clamp(1240px,
  78vw, 1500px)` with `--page-gutter: clamp(24px, 5.5vw, 96px)` (`--page-inline` centres it). Calibrated
  on Frames 132/133 (`~/Downloads`), which are about 1590 px captures scaled to 1920: the owner's guides
  sit 174 px in there, which the formula reproduces (175 px; 211 px at 1920; 100 px at 1440; 24 px on
  phones). The old 1280 composition gutter now points at it; Raida, Moloch, Hats, Ideas, the showcase
  title and Builders left their own 1144 px / 6vw boxes. Exception: the hero copy keeps its own position
  (the curtain artwork fills the outer gutter).
- Builders plane: may run wider than the column, capped at `--page-wide` 1760 px and centred; corners
  round only when capped. Decorative coral foam (blurred forms and bubbles) sits behind the plane edges:
  absolutely positioned, clipped sideways, identical in both themes, static. /community's builder module
  now carries the crew illustration like /clients (shared module). The 1° angle stays deferred.
- Persistent top bar (audience routes): sword logo (to `/`), audience switch and a new Day/Night switch
  in the audience switch's pill, pinned on the page gutters; section nav scrolls with the header. Phones
  (< 700 px): logo disc and a single theme switch (`role="switch"`) so the row fits at 375 px. The theme
  controls use the shared CTA chip states and focus ring.
- Join the DAO hero: "FIND YOUR PEOPLE / BUILD SOMETHING" on one level, "TOGETHER" about twice the size
  in pink, inside the copy column (no longer over the characters). New optional `title.finale` field.
- Moloch title: "TOGETHER WE SLAY / MOLOCH" + the owner's `swords.svg` inline (no "+").
- Hats: clicking outside the role cards clears the selection; "Stewards." term 21 px / 800.
- Two-level headings: the first line is weight 900 on every section (Explore and the Join/inquiry panel
  headings were 400).

October 30, 2026 (later) — Builders module restored (uncommitted):
- Reference: the owner's recording `~/Desktop/Oct-30-2026 10-04-59.mp4` (current light module next to the
  earlier behaviour), asking to restore the earlier one.
- 1–8 results use the October 28 editorial grid again (`builderGrid.ts`, restored from `2bf270d`; removed in
  `a8ff16c`); 9+ keep the three-course masonry wall, moving edge to edge when wider than the screen.
- The coral plane stays but is flat: the October 29 1-degree tilt is removed (it leant the cards with the
  plane and made the slack around short lists read as uneven). The plane wraps the grid or the wall with
  28 px above and below; no fixed wall height. Tiles are opaque on it (cream / navy).
- The brief's "5–8: two-row brick" differs from the recording's earlier behaviour (editorial 12 × 3 for
  5–8); the recording was followed. Open for the owner.

October 30, 2026 — Shared CTA system and landing-page inventory (uncommitted):
- Trigger: the owner's recording (`~/Desktop/Oct-30-2026 09-27-22.mp4`, /community hero). In Light the
  outline CTA rested on a cream fill with ink text and the filled hover had no ring; in Dark the outline
  was transparent with a cream edge and the filled hover added a cream ring. Same buttons, two models.
- Decision: one CTA behaviour for /clients and /community, identical in Light and Dark. The dark block
  no longer redefines any `--cta-*` token (a test enforces it). Tokens in `.site`: `--cta-bg` #EE3C78,
  `--cta-fg` #071C1D, `--cta-border` #EE3C78, `--cta-border-width` 2px, `--cta-hover-bg` #CE1252,
  `--cta-hover-fg` #FAFAFA, `--cta-active-bg` #A80E44, `--cta-active-fg` #FAFAFA, `--cta-active-inset`,
  `--cta-outline-fg` currentColor, `--cta-focus-ring` #102D2C, `--cta-focus-halo` #EFE9D7,
  `--cta-disabled-opacity` .5. The old names (`--cta-bg-hover`, `--cta-ring`, `--cta-hover-ring`,
  `--cta-edge`, `--cta-outline-*`) are gone.
  - Rest: filled = canonical pink, ink label (4.66:1). Outline = transparent, border and label in the
    surface's own text colour (cream on the hero video, ink on cream, cream on navy, navy on coral).
  - Hover, every variant (filled, outline, chips, toggles, icon buttons, form buttons): deep coral
    #CE1252 with a white label (5.25:1), the pink edge kept, 2 px lift. Only under `(hover: hover)`, so
    a tap never leaves a button looking hovered. No hover ring in either theme.
  - Pressed: #A80E44, white label (7.16:1), an inset shadow, no lift.
  - Focus: 3 px dark-green outline at 3 px offset over a 3 px cream halo (box-shadow), same colours and
    geometry in both themes; one of the two always reaches 3:1 on cream, light blue, navy, deep green,
    coral and deep navy.
  - Disabled: opacity .5, not-allowed, no hover or lift.
  - Selected chips (builder filters, Explore filters, the current audience, the open Guild kit) use
    the filled rest state.
  - Text links with arrows: surface text colour, 1 px underline thickening to 2 px on hover. The
    showcase site link and the Hats tree link no longer turn or rest pink (pink text is under 4.5:1
    on cream and navy at 18 px).
- Why this hover: the CTAs sit on cream, dark green, light blue, navy, video and coral. A cream fill or
  a cream outline on hover disappears on the cream and light-blue surfaces of the light theme; a
  white label on deep coral reads on all of them, and it was already the dark hover.
- Contrast exceptions (by surface, documented in the CSS): (1) light-blue surfaces in the light theme
  (the #B8E0DF panels, the Explore band): pink edge 2.66:1, so the edge is dark green; (2) coral
  scenes (Moloch in both themes, the creed in the dark theme): filled buttons rest on deep navy
  #12163B with a white label and every button keeps a navy edge; hover and pressed are unchanged.
- Visible consequences: the light hero outline CTA is now transparent (was cream-filled); the Moloch
  CTA, an outline CTA, is now transparent with a navy border (was a filled navy pill); the dark creed
  CTA is navy (was pink on the pink creed); "Your Guild kit", "Explore all … discoveries", the Explore
  filters and the showcase arrows join the system; form Back/Next become pills in the compact pill type.
- Inventory: the numbered English map of both landing pages is in STATUS.md ("Landing-page
  inventory"); section order unchanged.

October 29, 2026 (night) — Iteration 04 (committed and pushed, not deployed):
- About Moloch: "Together we slay" / "Moloch +" with the supplied `raidguild.png` as an image (alt
  "RaidGuild"), sized 1.9em with negative margins because the swords fill about half its square; the
  square is the scene's coral, so it disappears.
- Explore: the owner's description; the brand steward's B3.4 lines are fully replaced.
- "The Guild runs on owners, / not employees." keeps Grinder (override after the H3 Ubuntu rule).
- Builders: a full-width coral plane in every category (no rounded container); layout tiers by count
  (1–2, 3–4 one course; 5–8 two, staggered; 9+ three). Tiers up to 8 fill the plane width and wrap,
  so they never trigger the moving wall and phones stack them.
- /community: Projects before builders, Hats Tree after them; Join's dark scene navy.
- CTAs: one state system in both themes. Rest canonical pink + ink label, hover #CE1252, pressed
  #A80E44. In dark this replaces the iteration 01 #CE1252 resting colour (it was the hover colour).
- Process note: a block replacement by text range deleted unrelated later blocks; restored from the
  previous commit. Range edits on this file need an exact end marker.

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
