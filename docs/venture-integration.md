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

November 2, 2026 — Typography migration, Grinder → Last Duel (uncommitted):
- Last Duel replaces Grinder as the landing pages' display family (owner's brief); Ubuntu and Ubuntu
  Mono stay for body, labels, navigation, buttons and forms.
- Mapping from the files' name tables, mirroring Grinder's structure so every element keeps its
  authored style: one family `--font-last-duel` (Ex2 400 / BoldEx2 700 upright; Oblique 400 /
  BoldOblique 700 italic) and one `--font-last-duel-retalic` (Ex2Retalic 400). The upright cuts are the
  Extended 2 widths; the only italics are normal width. BoldEx2Retalic is not wired (no Retalic text
  asks for 600+; next/font preloads every registered file).
- `font-synthesis: none` stays, so heading lead lines set at 900 now show the real bold cut (Grinder
  had no bold and rendered them regular).
- Card names keep their approved style (italic → Oblique); upright Regular for them is open (STATUS 65).
- The wider Extended 2 cuts required re-fitting the lines that are fitted to one line or a column:
  /community hero (14.5 em), /clients inquiry "YOU'RE BUILDING" (12.8), Guild "MEMBER-GOVERNED"
  (15.2, above 760 px), and on "/" the phone hero, rail names (per name, `--chars`) and steward names
  (one shared size).
- Grinder is removed from code and assets (the six woff2 files deleted); `.gitignore` keeps its rules
  so stray Grinder binaries stay out of Git.
- The supplied Last Duel files carry a private, no-web-hosting licence field (Eurostile LT Std
  derivative): they are not to be committed or deployed until that is resolved (STATUS 64).

November 2, 2026 — Display hierarchy pass (uncommitted):
- Two-level display headings everywhere (heroes, section headings, Builder-owned / Member-governed,
  Queen Raida, Moloch, Join, Hire inquiry, Hats, Explore, creed): top line Last Duel Bold Extended
  Retalic, smaller; bottom line Bold Extended italic, about 1.3–1.4 times larger. Last Duel has no
  extended italic, so the bottom line is BoldEx2 with the browser's synthesized oblique (its own family,
  `--font-last-duel-extended`); BoldOblique is the alternative (STATUS 67).
- One scale: section 28 / 37 px (phones 18 / ≤24), panels 24 / ≤32 (16 / ≤22), creed 40 / 54 (22 / 30);
  heroes and one-line bottom lines fit their column. Replaces the 34 / 52 (20 / 40) showcase scale and
  the heroes' 2× second lines.
- Standalone display labels (TRANSMISSION, the hero index, section markers) in Last Duel Bold, upright;
  the thin regular Retalic and the regular "001" are retired. Card names unchanged (STATUS 65).
- Guild module: Join the DAO and Your Guild kit grouped 14 px apart (no longer pushed to the edges).
- Grinder's `.gitignore` rules removed; no Grinder reference remains in code or configuration.

November 2, 2026 — Mobile pass (uncommitted; phones ≤ 760 px unless noted, desktop unchanged):
- Audience heroes in two groups: eyebrow + headline at the top, dek + actions at the foot within thumb reach,
  the artwork visible between them; the hero is one screen tall (640–780 px).
- One phone CTA object on every route: full column width, 52 px, fully rounded, 40 px icon disc inset 6 px on
  three sides, 14 px label on one line. Labels were not shortened; the Join panel's side padding is 20 px at
  ≤ 400 px so "Create your Portal profile" fits at 375.
- Top bar: 16 px gutters both sides; the menu's lines end on the theme switch's edge.
- Queen Raida and Moloch on phones show the rectangle cut's centre square (the vertical cut is no longer used).
  The Moloch heading's second line is 1.6 × the shared phone scale and its first line grows as far as it fits
  on one line. The crossed-swords mark after "MOLOCH" (swords.svg) is removed at every width, and the file
  deleted, at the owner's request.
- Builder categories: two per row, full width, outlined when inactive, filled when selected.
- Hats tree: the parent node is the tree's title (80 px mark, 21 px bold name); "Explore the Hats tree" sits
  under the tree, above the snapshot note, on phones (rendered twice, one copy displayed per width range).
- Join module and Hire inquiry scene: larger profession group, panel 32 px below its feet (no overlap).
- Creed on phones: Last Duel Extended Regular, upright and centred, "BUILD." highlighted in Bold Extended
  upright, with a soft navy veil for legibility. This is a documented exception to the two-level display rule
  (phones only; desktop keeps the two-level creed pending STATUS 68).
- /clients steward names fit their card on one line on phones.

November 2, 2026 — Hero experiment (uncommitted; /clients and /community, both themes, all widths):
- The hero keeps its height; the scene takes the upper field and the copy sits on a solid navy floor (#191E4E,
  both themes, with a soft indigo glow) that the scene fades into (96 px phones / 160 px). The art is re-framed
  into the shorter box with `object-fit: cover`, never stretched.
- No eyebrow on either audience hero; the field is optional and "/" keeps its own.
- /clients: "HARD PROBLEMS," is as wide as "WORKING PRODUCTS" (1.16 × its size); faces and slants unchanged.
- Actions side by side from 1000 px, stacked below.
- Case-study names on /clients: Last Duel Bold (upright), an exception to the audience routes' Ubuntu h3 rule.

November 2, 2026 — Hero desktop pass (uncommitted; ≥ 761 px only, phones unchanged):
- More scene within the same hero height: actions side by side, dek and actions on one row from 1360 px, the
  art bleeding under the title into a 200 px fade.
- Two-line title, never wrapped; /clients back to the two-level ratio on desktop ("HARD PROBLEMS," 1 / 1.15 of
  "WORKING PRODUCTS"); phones keep their approved 1.16 ×.
- Day inverts the floor: cream with a celeste glow, all hero text in the Light UI dark green; Night keeps navy
  and cream. CTAs keep the shared tokens.
- TRANSMISSION 001 leaves the hero's foot: on the floor beside the title from 1300 px, at the scene's lower
  right below that (cream halo in Day).

November 2, 2026 — Galleries and FAQ (uncommitted):
- The services accordion is replaced by one shared horizontal card gallery (FeatureGallery): /clients services
  right after the hero ("What we can build for you"), /community member benefits right after the hero ("What
  you can access as a member"), and /community "Ideas into working systems" with the service cards.
- Buyer FAQ before the /clients inquiry; member FAQ before the /community Join module, built only from
  existing community copy. Unknown values in the buyer answers are visible placeholders, not facts.
- New copy (card labels, titles, benefit bodies, FAQ questions, gallery headings) is flagged for approval.

November 3, 2026 — Hero layer seam and nav label (uncommitted):
- Every hero scene layer ends at the same bottom edge, under the solid part of the floor, so no layer edge is
  visible in the fade; the curtain foreground keeps its top edge, scale and framing (cropped, never stretched).
- /clients navigation reads "Works" instead of "Previous works" (owner request); the section heading is unchanged.

November 3, 2026 — /community restructure (uncommitted):
- /clients and /community share the gallery system but not its content. /community's capability gallery shows
  the same six capabilities from the builder side (where members raid, learn and help shape the work), with
  community links and an "Explore the Guild" action; no inquiry.
- Member benefits are a separate module with its own compact layout (numbered cards with small art, two
  columns from 700 px, stacked on phones), answering why a builder would join; it is not a second gallery row.


## 2026-11-03 — Figma pass from the owner's edit of "Clients / Light / 1440×900"

- The owner's edited Figma artboard is the visual reference for this pass. Only deliberate edits were taken
  (capture artifacts such as video posters and unrendered masks were not), and each became a responsive rule
  for both audience routes and both themes rather than a 1440-only layout.
- Hero titles use the accent colour on the second line in Day as well as Night, matching every other two-level
  heading. This replaces the November 2 rule that set the whole Day hero title in dark green.
- The builder network heading pairs title and intro beside the art; its link joins the skill tabs' row.
- The FAQ carries the foundry portrait from 1000 px.
- Kept the shared section-title scale where the artboard deviated in one place ("OUR CLIENTS"); see STATUS 75.
- Light UI dark contrast (owner, same day): in Day every dark contrast element is the dark green
  (`--color-dark-green`, #102D2C); the navy family is Night-only. Coral surfaces keep the existing green-black
  on-pink ink (#071C1D) for contrast. "OUR CLIENTS" takes the artboard's larger second line (owner confirmed);
  the FAQ head sits at 0.4 × the section space.
- Widows (owner, same day): on /clients and /community the browser's line breaker avoids a single short word on
  a last line: `text-wrap-style: pretty` for all text, `balance` for headings and their two-level lines. A
  single word is accepted when it fills most of its line (three-word headings, the footer motto) or when the
  engine's pretty breaker keeps it (a last word wider than a third of the line). No copy was rewritten for it.
- Tablet layouts that could not hold their content were stacked rather than shrunk: the immersive features
  (Queen Raida, Moloch) stack their copy at 761–899 px, as on phones, so "MOLOCH" keeps its 1.5 × size and the
  CTA label its pill; the Hats tree stays under its copy up to 1199 px so steward names fit their cards.
- Selectors (owner, night): the current audience and theme option is marked by an ink outline (dark green Day,
  cream Night) with the other option muted and the current theme icon coral, not by a filled pink pill.
- /clients speaks to buyers (owner brief): the services gallery keeps its Figma layout and titles but its intro
  and card bodies answer what the client gets; a "Why build with RaidGuild" module of expandable reasons follows
  it. Only facts already in approved or flagged copy are reused; no prices, durations, guarantees or new clients.
- Expandable rows use one chevron (functional) on both routes; capability / reason rows also carry the full
  RaidGuild sigil as a decorative brand mark. The bare crossed-swords glyph is not used as a row marker.
- /community (owner, November 3 night): the Guild module precedes the capabilities gallery; the Hats tree and
  Explore swapped places and surfaces in Day (Hats sky, Explore dark green; Night unchanged); the selector's
  current option is outlined in Moloch magenta in both themes; builder names are Last Duel Regular (upright
  Ex2; settles question 65); "FIND YOUR PEOPLE." is 1 / 1.15 of the second hero line; the Hats parent mark has
  dark-green swords in Day.
- Hat cards turn over to their wearer on hover and while selected. The wearer is the site's published steward
  for that role (`lib/data/venture.ts`), not a live Hats Protocol read; the snapshot note stays.
- Category buttons (builder tabs, Explore filters) mark the selection with a magenta outline, not a fill. Steward
  cards share the builder cards' name style and turn over to the steward's hat. The /clients FAQ has no section
  label. On /community the builder wall runs straight into Explore. The Full-stack card uses the crashed-pod crew
  illustration (owner's choice), replacing the blueprint sketch that sat outside the illustration system.
- /community Explore (owner, November 3): the "Follow your curiosity" gallery is replaced by a project explorer
  (main media viewport, metadata, a selectable stack of horizontal cards, Explore all, a larger view). It reuses
  the gallery's data and screenshots; "/" keeps the old gallery. The section heading becomes "Projects and
  experiments" (the B3.4 name), pending confirmation.
- 2026-11-04 (owner): the Last Duel OTFs may be published in the public repositories (luisblancoach/website and
  the raid-guild/website PR); the baseline for Dekan's review goes up as a PR against raid-guild/website `main`.

## 2026-11-07 — /agency route and an independent baseline on estudioblanco.org

- Owner decision: Hire the DAO moves from `/clients` to `/agency`, the canonical client route. `/clients` and
  anything below it answer a permanent 308 to the same path under `/agency`; the query string is kept and the
  browser keeps the `#section`. `/community` is unchanged. The review-domain root (`raidguild.estudioblanco.org/`)
  opens `/agency` directly, and legacy `/?audience=hire` links land on `/agency`.
- The audience id stays `clients` (`data-audience="clients"`, the CSS scoped to it, the narrative ids
  `clients.*`, `lib/narrative/clients.ts`). Only the URL changed, so no stylesheet and no copy was touched.
- Canonical and Open Graph URLs resolve against the unchanged `metadataBase` (`https://www.raidguild.org`), so
  the page declares `https://www.raidguild.org/agency`. The route stays `noindex`; choosing the canonical origin
  is SEO decision D-2. The sitemap still lists only `/` (the audience routes are `noindex`).
- Owner decision: before Editorial Mode, establish a baseline under `raidguild.estudioblanco.org` that we deploy
  and control ourselves, without touching raidguild.org, Dekan's Railway service or the upstream review branch.
  Hosting proposal: Cloudflare Workers through the OpenNext adapter, attached as a Workers route on the existing
  proxied record, with the current Cloudflare redirect to Railway as the instant rollback. Evidence and
  procedure: `STATUS.md`, November 7 entry.
- Owner approval, 2026-11-07:
  - the migration is committed as `1b86fd6` and tagged `checkpoint/agency-baseline`;
  - **Cloudflare Workers is the chosen host** for the independent baseline.
- Owner constraints for that host:
  - review flags off by default;
  - the whole host stays out of search indexing;
  - no production lead submission (no form secrets) for now;
  - Railway, raidguild.org, DNS and the Cloudflare redirect rules stay as they are until the Worker has been
    deployed and verified;
  - the owner's uncommitted `package.json` change is not overwritten.

## 2026-11-07 — Editorial Mode, local prototype (owner request)

- Owner request: Tae edits the copy on the rendered pages, in context, with drafts kept apart from the
  published narrative data, an Original / Draft preview, a Changes panel (comments, individual revert), JSON
  export and import, a Markdown export for review and conflict detection. Nothing is approved automatically.
  First scope: Agency hero, services gallery and Why RaidGuild; Community hero, capabilities gallery and Join.
- Decisions in the prototype (uncommitted):
  - **Local development only.** Both entry points (`CopyText` in `primitives/Review.tsx`, the mount in
    `shell/VentureShell.tsx`) `require` the editor inside `process.env.NODE_ENV === "development"`, so production
    builds drop it at build time. The isolated production build is byte-identical to the agency baseline (JS, CSS
    and prerendered HTML, apart from Next's random build id).
  - **The stable copy ids are the editing keys.** `lib/editorial/config.ts` lists the editable sections by id
    prefix and names the fields in plain words ("Card 2 · Text"); enabling another section is one registry entry
    plus its tree in `lib/editorial/catalog.ts`.
  - **Drafts live in the browser** (localStorage), never in source files or on a server. A draft keeps the source
    text it was made against; a later change to the source shows as a conflict until someone reviews it.
  - **Edited text sits in an `<rg-copy>` custom element** while the mode is on, so no `span` rule of the site's
    CSS applies to it; entering the mode moves no text block (measured on both pages, Day and Night, 1440 and
    390 px).
  - While the mode is on, a click on editable text edits it and activates nothing (links, disclosure buttons);
    links do not navigate; other controls (gallery arrows, a row's chevron) work as usual.
- Not decided yet: how Tae reaches the editor (a protected URL), where shared drafts are stored, and the review
  and approval workflow. Recommendation: `STATUS.md`, November 7 entry "Editorial Mode".
- Owner approval, 2026-11-07: the prototype is released as **Editorial Mode v0.1**, commit `d1b6fa4`, annotated tag
  `release/editorial-v0.1`, pushed to the fork only (never upstream). Next owner goal: a protected remote editorial
  deployment for Tae on our own Cloudflare Worker, with an explicit build-time flag (off by default), access
  restricted by Cloudflare Access rather than by any URL or client-side switch, and no billing or account-level
  change without the owner.

## 2026-11-08 — Static-first review host; Editorial Mode opt-in for Tae (owner request)

- **Static-first Cloudflare host** (owner approval 2026-11-08; kit `0ad287e`, Worker version `0c37e331`). The
  review Worker answers the prerendered pages, their RSC payloads, the optimised images those pages use and the
  `/api/posts`, `/api/artifacts` snapshots from static assets, without loading Next.js, so the public pages stay
  within the Workers Free CPU limit. Deploy kit only; app tree identical to `8456bdb` (Night `a1114f0`, Louchi
  photo `8456bdb`). Rollback target: version `0176ba2e`.
- **Editorial Mode: no Cloudflare Access.** Access is unavailable on this account and plan, so the owner chose
  an explicit opt-in instead: `?editorial=1` opens the editor on `/agency` and `/community`. The parameter is an
  interface switch, **not authentication**: anyone with the URL can open the editor. This is acceptable only
  because editing is entirely local to the browser (drafts in localStorage, exported as files); nothing is
  written to a server, shared or published, and the client bundle holds no secret. This version is **not a
  private editor**.
- **Build flag `NEXT_PUBLIC_EDITORIAL_MODE`**: `disabled` (default, every build including raidguild.org: no editor
  code in the bundle) or `opt-in` (set by `deploy/cloudflare/build.sh` for the review host only). In an opt-in
  build the editor's chrome is a lazy chunk loaded only after `?editorial=1`; ordinary visitors get the published
  HTML, no editor control and no editor styles. The mode is remembered in that browser until Exit or
  `?editorial=0`. Local development keeps the "Edit copy" button and Alt+Shift+E.
- The bar always shows "Local draft — not published".
- Owner approval, 2026-11-08: the opt-in editor shipped as `64d16d6` (Worker version `f57739de`).

## 2026-11-08, evening — Editorial Mode v0.2: operations, structured export, integration CLI (owner request)

- **Four explicit operations** per copy item: REPLACE (new wording), SHORTEN (a shorter version), REMOVE (this
  text, the whole item, or the whole section) and KEEP (reviewed, no change). REPLACE and SHORTEN keep the exact
  typed text; SHORTEN that is not shorter is flagged in the editor and refused by the CLI. Emptying a text becomes
  REMOVE: a removal is never an empty string. Every decision is reversible (Undo, Restore, Undo all).
- **Structural removals need separate approval** (`structuralReason` in `lib/editorial/config.ts`): a whole item or
  section, a button or link label, a heading or section label, or text serving accessibility.
- **Preview** shows the page with the decisions applied: removed text and whatever only held it (its paragraph,
  its button), whole items and whole sections are folded away, in the editor only.
- **Export version 2**: `raidguild-tae-editorial.json` (authoritative: copy id, operation, base text, SHA-256
  fingerprint, proposed text for REPLACE/SHORTEN only, source revision, review status "proposed", structural
  flag, comment, conflict) and `raidguild-tae-editorial.md` (the review document), from one snapshot with the same
  change set id (SHA-256 of the change list). Deterministic (no export timestamp), ordered by page and section.
  Version 1 exports and stored drafts are migrated on import.
- **`scripts/apply-editorial.mjs`**: dry run by default. Validates schema, change set id and fingerprints; resolves
  every id in the current narrative; detects stale and unknown items; locates the single string literal holding
  each text (refuses when absent or repeated); rehearses the patch on a throwaway copy and verifies that only the
  planned copy items changed. `--apply --confirm <change-set-id>` writes REPLACE/SHORTEN only, refuses any
  conflict and uncommitted target files, and re-verifies (restoring on failure). REMOVE is never applied
  automatically (it needs a reviewed component and type change); KEEP is recorded only. No network code.
- Owner approval, 2026-11-08: v0.2 released as `5e04f1a` (operations and export) and `bb37620` (CLI), annotated tag
  `release/editorial-v0.2` → `bb37620`, deployed as Worker version `f8fd6838` (rollback target `f57739de`).

### Reviewing and integrating Tae's proposals (process, 2026-11-08)

1. **Receive** both files from Tae, `raidguild-tae-editorial.md` and `raidguild-tae-editorial.json`, by any channel
   (email, Slack, a shared folder). They hold only page copy and her comments, no secrets. Keep the pair together
   and do not edit the JSON: the CLI rejects a change set whose list no longer matches its id. Store them outside
   the repository (e.g. `~/Projects/raidguild-backups/<date>/editorial/`) unless the owner approves versioning them.
2. **Review** the Markdown. Decide per decision: approve, reject or discuss. ⚠ items (structural) and ⚡ items
   (made against older text) need explicit attention. To approve only some, import the JSON in the editor
   (Changes → Import), undo the rejected decisions and export again: the new pair gets a new change set id.
3. **Dry run** (Claude): `bun scripts/apply-editorial.mjs raidguild-tae-editorial.json --report dry-run.json`. It
   validates, flags conflicts, shows the exact source diff, and proves on a throwaway copy that only the intended
   copy changes. Nothing is written.
4. **Approve** the change set id explicitly (owner). Then, and only then, Claude runs
   `--apply --confirm <change-set-id>` on this branch (target files must be clean): REPLACE and SHORTEN only,
   exactly as written. Removals and structural decisions are separate, reviewed code changes with their own
   approval; KEEP decisions are recorded, not written. Applying a text does not mark it approved in the narrative
   (`status`, review flags): that is a separate editorial decision.
5. **Verify and ship**: `bun run test`, `bun run review:claims`, lint, side-by-side visual comparison, then a commit
   and a deployment, each with the owner's approval. Never write to the deployed Worker directly.

## 2026-11-09 — Tae's first editorial review applied (owner-approved)

- Source of truth: Tae's review document `raidguild-tae-editorial.md` (change set `sha256:1f3373b71bc5…`, made on
  `bb37620`; three decisions). The `raidguild-tae-editorial.json` next to it in Downloads was an earlier **test**
  export (one REPLACE "asdasdasdasd", change set `sha256:e994eec4…`) and was **not** applied; it is kept as
  `~/Projects/raidguild-backups/2026-11-09/editorial/test-export-asdasd-DO-NOT-APPLY.json`.
- Why the structured path was still used: the matching JSON was rebuilt from the Markdown with the editor's own
  export code (`toExport`/`toMarkdown`, the decisions, base texts and edit times in the Markdown). The rebuilt pair
  reproduces Tae's Markdown **byte for byte** and the change set id `1f3373b71bc5`, so it is the same change set.
  The CLI dry run resolved both texts to `src/lib/narrative/clients.ts` and verified on a copy that the other 442
  copy items were unchanged; `--apply --confirm 1f3373b71bc5b44e` wrote exactly the two literals.
- Applied (`055cbb0`): `clients.hero.dek` (REPLACE) "**Senior designers and engineers, building your onchain
  product, digital experience, or AI workflow**" (the whole line bold, as written) and
  `clients.serviceGallery.cards.4.body` (REPLACE) "…documentation that explains what you built…". Recorded, no
  change: `clients.reasons.items.5.body` (KEEP).
- Editorial flag for the owner: in card 5, "explains" agrees with "documentation" but the subject is a list
  ("Positioning, launch content and documentation"), which reads more naturally with "explain". Kept exactly as
  Tae wrote and the owner approved; raise it with Tae if wanted.
- Verified: tests, tsc, lint; hero typography, wrapping and responsive behaviour at 1440 / 1024 / 390 / 320 px in
  Day and Night (bold 700, same line count except one line fewer at 320 px, no overflow); card 5 gains a line only
  at 320 px. Pixel comparison against the approved build (2026-11-07, the v0.2 visitor reference): only the hero
  introduction band differs on /agency; /community 0 px. Not compared against the October 23 reference.

## 2026-11-09 — Editorial Mode v0.3: full coverage (owner request)

- **One registry, no second editor.** `lib/editorial/config.ts` registers every narrative tree that /agency and
  /community render (30 sections, in page order, then "Both pages"); `catalog.ts` holds their trees. Every copy
  item of a registered tree is editable unless an exclusion names it with a reason. A test enforces that every
  item is classified, and the e2e coverage audit checks the rendered page against the registry.
- **Copy moved into the narrative, verbatim** (stable ids for strings that lived in components):
  `lib/narrative/site.ts` (`site.header` page switch, `site.hero` index and scroll cue, `site.ticker`, `site.creed`,
  `site.footer`), `clients.meta` / `community.meta` (page title, description, share title, share image alt) and
  `community.activity.collection.actions` (the explorer's "Open the Portal" and "Explore now"). The chrome copy
  reaches the client through `VentureLayout → VentureShell` props, like the navigation, so the narrative modules
  never ship to the browser on their own. Visitors' pages are identical (see verification).
- **Kinds of copy.** Page text is edited in place. Copy not shown as text is edited from the Changes panel's new
  **Hidden text** tab: image descriptions (alt), screen-reader names, and search/sharing metadata. Exports keep
  version 2: page-text changes have exactly the v0.2 shape; hidden items add `kind`. v0.2 change sets import
  unchanged; items whose source has moved show as conflicts ("source changed").
- **Structural decisions** (separate approval, never applied by the CLI): removal of a whole item or section, of
  navigation (menu items, the page switch), a button or link label, a heading (titles, FAQ questions, project
  names), a section label, accessibility text or metadata; and any rewrite or shortening that **changes a stated
  price or amount** (copy may state "$20 a month"; the amount is the owner's decision).
- **Not editable, on purpose** (no live records, no behaviour): member names, roles and profile links (builders,
  stewards, Hats tree: data records), the Portal projects list (runtime snapshot from the Portal), the inquiry
  form (labels, placeholders, validation: application behaviour), the Portal overlay and the discovery-trail
  puzzle (interactive experience), interface controls (Day/Night, menu toggle, carousel arrows, filters, skip
  link, counters, generated screen-reader templates) and the RaidGuild wordmark. Links' destinations and hrefs
  are data, never copy. Within registered trees: 7 link-destination review notes and 13 items these pages do not
  render (the inquiry's hints, coordinates and illustration alt; the Guild statistics) are excluded.
- **FAQ placeholders**: answers with "[X–Y weeks]" are edited as plain text, brackets included; visitors still see
  the marked placeholders (`CopyText` gained a `display` renderer for visitors).
- **CLI source mapping** (`scripts/apply-editorial.mjs`): every candidate literal is probed on a scratch copy of the
  source to learn exactly which copy ids it produces, so repeated texts resolve to the right literal instead of
  being refused. A literal that feeds several items (a shared constant, a helper called twice) is applied only
  when the change set gives all of them the same new text; texts assembled from a literal ("<name> website
  homepage") follow it and are verified. `--map` reports the source of every editable id.

### Editorial coverage report (v0.3, `5f93262`)

| | Count |
|---|---|
| Eligible copy fields (registered, editable) | **295**: Agency 130, Community 143, Both pages 22 |
| Editable in place on the page | 274 (e2e: /agency 137/137, /community 158/158 including the shared chrome) |
| Editable from Hidden text | 21: 11 image descriptions, 2 screen-reader names, 8 metadata fields |
| Successfully editable | **295 / 295** |
| Structural if removed (separate approval) | 191: headings 99, buttons and links 47, section labels 14, accessibility 13, navigation 10, metadata 8 |
| Structural if the amount changes | every item stating a price (today: the Guild kit card, "$20 a month") |
| Source map | 260 in their own literal · 26 in a literal shared with other items (applied together or not at all) · 9 assembled in code (the screenshot descriptions, "<name> website homepage": integrated by hand) |
| Excluded inside registered trees | 20 (7 link-destination notes; 13 not rendered on these pages) |

Remaining gaps (proposed for a later pass, not started): the inquiry form's labels, placeholders and messages;
the Portal overlay and hunt clue texts; the explorer's category filter names and "Explore all N" / "Show fewer";
the profession gallery's labels; "PROFILE FORTHCOMING"; Day/Night labels. Previous works shows one project at a
time: its texts are edited after selecting the project's logo, as visitors see them.

### Release: v0.3 live on workers.dev (2026-11-09)

- Commits: `055cbb0` (Tae's content), `5f93262` (v0.3 full coverage, with its tests), and the docs commit. Built
  with `BASELINE=5f93262 deploy/cloudflare/build.sh 5f93262` (`~/Projects/raidguild-backups/2026-11-09/cf-build-5f93262`,
  build id `_BOBdnwXmxKffNv4ktiiq`, editor revision `5f93262`); deployed to the existing Worker
  `raidguild-estudioblanco` as version **`8d6c86ce-e4bb-4ba3-8185-26434d87cde4`** (workers.dev only, no route).
  Rollback target: `f8fd6838` (v0.2), then `f57739de`.
- Propagation: deployed 22:35 UTC during Cloudflare's open incident "Changes made to Workers may be delayed or
  disrupted"; the previous version kept answering until 22:46 UTC. Serving was confirmed from the responses
  themselves (data snapshot time, build id, the new build's files), not from the deployment record.
- Live verification (after 22:46 UTC): Phase 4 checks 19/19 (Tae's two texts and the Keep text in the server HTML
  and the RSC payload, client navigation, routes, redirects with query strings, noindex, lead POST 503); v0.3
  acceptance 36/36 (all 295 fields: 274 in place, Hidden text, structural and price flags, export, CLI, v0.2
  import); v0.2 regression 36/36; ordinary visitors 8/8 at 0 px (Agency and Community, Day and Night, 1440 and 390 px)
  against the public build of `5f93262`, no editor element; 3 load rounds, 984 requests, 0 errors; tail 348 events, all `ok` on
  `8d6c86ce`, static paths CPU p50 0 ms, max 19 ms (the dynamic `/` unchanged from v0.2).

### `raidguild.estudioblanco.org` (investigation 2026-11-09; change NOT made, needs approval)

- Current behaviour (read-only checks): the record is proxied by Cloudflare (zone `estudioblanco.org`, same
  account as the Worker) and every request answers **302 to `https://raidguild-website-redesign-production.up.railway.app/`**:
  the path is dropped, the query string is kept (`/agency?editorial=1` → `/?editorial=1`). Workers routes on
  the zone: `estudioblanco.org/*` → `estudioblanco-app`, `coema.estudioblanco.org/*`, `estudioblanco.org/coema*`;
  none for this host. The Wrangler token cannot read zone rules, so the rule type (Single Redirect, Page Rule or
  Bulk Redirect) must be read in the dashboard.
- Proposed change (two steps, owner approval required for each; no DNS record change, no new Worker, no billing):
  1. Attach the prepared route `raidguild.estudioblanco.org/*` → `raidguild-estudioblanco` with
     `wrangler deploy -c wrangler.route.jsonc` from the release build directory (same code, adds only the route).
     While the redirect rule is active it keeps answering first; the check shows the order.
  2. The owner disables (does not delete) the redirect rule for `raidguild.estudioblanco.org` in Cloudflare →
     estudioblanco.org → Rules. The Worker then serves the host: `/` → 307 `/agency`, `/agency`, `/community`,
     `?editorial=1`, `/clients…` → 308 with path and query kept. The main `estudioblanco.org` site is a different
     route and Worker and is not touched.
- Rollback: re-enable the redirect rule (instant), then `deploy/cloudflare/route.sh remove` (removes only this route).

## 2026-11-10 — Editorial governance: Tae holds editorial authority (owner decision)

- **Tae has full editorial authority over RaidGuild's website content.** Her decisions are approved by the project
  owner and implemented as submitted: wording, positioning, additions, removals and editorial restructuring need
  no further per-item approval. Claude's role is the implementation: accuracy, design system, technical
  integrity, accessibility and functionality. Material factual or legal claims are flagged for verification by
  the appropriate owner in the release report, never rewritten.

## 2026-11-10 — Tae's editorial batch 02 (34 decisions), manually authorized Markdown integration

- **Source:** `raidguild-tae-editorial-agency.md` (sha256 `491d5c281afac8145779de961fc651954970dba995f2400d7a651e33a37debe1`,
  change set `sha256:9e1c68fabd01…`, made on `5f93262188e0`, last edited 2026-11-10 15:03 UTC; copy in
  `~/Projects/raidguild-backups/2026-11-10/editorial/`). Despite the name it covers Agency, Community and both pages.
- **No matching JSON** was available (the only JSON in Downloads was the 2026-11-09 test export). No change set was
  rebuilt or signed. The Markdown was parsed into a review manifest (`review-manifest.json`); every base text matched
  its fingerprint prefix (34/34), all 34 ids were editable, 32 bases equalled the source. The text changes were
  applied to the exact literals given by `apply-editorial.mjs --map`, rehearsed first on a scratch copy and
  verified with `--dump-copy`: exactly the intended copy items changed, as written (34/34 reflected).
- **Implemented as submitted** (commits `08ee651`, `8e82e54`, `6e7ae87`, `78b0240`):
  - 23 rewrites: navigation "Our Work"; hero introduction; services introduction and the six cards; Why RaidGuild
    introduction and titles 1, 4 and 7; the Problem description; Builders and People introductions; FAQ answers 1,
    2, 5 and 6; Community hero introduction; ticker word 6; copyright "© 2019—2027 RAIDGUILD · EARTH & ELSEWHERE".
  - **Conflicts resolved for Tae's latest proposals:** `clients.hero.dek` (batch 01 text → "**Senior designers and
    engineers, for your next onchain product, digital experience, or AI workflow**") and
    `clients.serviceGallery.cards.4.body` (batch 01 "…documentation that explains…" → "Help the right people
    understand what you’re building. Positioning, launch content, and documentation that make your product’s value
    clear."). Her drafts had kept the pre-batch-01 base text; her new proposals supersede both.
  - **Nine "Visit" labels** ("Visit DAOHaus" … "Visit YieldNest", her capitalization kept): one shared "Read more"
    literal became one literal per project; ids and destinations unchanged; the screen-reader suffix is now
    "(opens the <name> website)".
  - **Reason 6 retired** ("DELETE" / "DELETE." on title and text = remove the item; the words are never published).
    The item stays in the source as a tombstone (`retired`), so its ids and Reason 7's do not shift. `forAudience`
    drops retired items before anything leaves the server (public and review builds); `ClientReasons` renders the
    active ones: six rows. Editorial Mode removes the two ids from the active registry with a "Retired" reason; an
    older draft or export naming them shows that reason (editor and CLI).
- **Editorial field count:** 293 active editable fields (Agency 128, Community 143, Both pages 22; was 295). All 295
  v0.3 ids remain in the source; the two retired ids are tombstones.
- **Claims flagged for verification by the appropriate owner** (published as Tae wrote them; not independently
  verified): FAQ "How do payment and contracts work?" (escrowed stablecoin payments, ACH/Wire, "our Marshall Islands
  DAO": a legal entity and payment rails); FAQ "What does it cost?" (no fixed-price commitment any more); Applied AI
  card ("Forward deployed engineers sit inside your stack"); the Problem description (Problem Media's own
  positioning and "trusted and dependable operating partner"); copyright "2019—2027" (a year not yet begun at
  publication). Also noted, unchanged by the batch: the process FAQ still promises "weekly demos" though Reason 6 is
  retired; "handover" (new copy) and "handoff" (older copy) now both appear; the Builders and People introductions
  open alike.
- **Release (2026-11-10):** build `BASELINE=78b0240 deploy/cloudflare/build.sh 78b0240` (build id
  `4boi1n3FPO1pibUz5K7QY`), deployed 16:12 UTC to the existing Worker as version
  **`c309397c-da11-4551-9e87-2be9a540b175`** (workers.dev only; rollback target `8d6c86ce`, v0.3). Serving confirmed
  from the responses (snapshot time and build id) at 16:12:16 UTC.
- **Verification.** Before deploy (public build and local workerd opt-in build): tests 125/125, tsc, lint 0 errors;
  batch 02 QA 53/53 on both (34/34 decisions in the HTML and client data, no "DELETE", six-row accordion by mouse
  and keyboard, the nine links with their labels, destinations and accessible names, no horizontal overflow and a
  one-line menu, Day/Night at 1440/1024/390/320 px, no page errors); Editorial Mode v0.3 suite 36/36 (293 active
  fields: /agency 135/135 and /community 158/158 in place, Hidden text, export, CLI, batch-01 import with the retired
  item explained); v0.2 suite 36/36; route checks 19/19; visitors on the opt-in build vs the public build 0 px in
  5 of 8 cases (all Agency views and Community light 1440), the run stopped by request before the last three
  Community cases. Live: route checks 19/19, batch 02 QA 53/53, v0.3 suite 36/36, v0.2 suite 36/36, one load round
  (384 requests, 0 errors), tail 640 events all `ok` on `c309397c` (pages CPU max 7 ms, client data 18 ms, images 27 ms).
  Not run live: the full-page visitor pixel comparison and the 3-round load test (shortened by request).

## 2026-11-10 — Tae's editorial batch 03 and close of editorial cycle 02

- **Governance (owner decision, restated at the close of the cycle).** Tae has editorial authority over the
  website copy, **including removing content and restructuring it** (retiring an item, splitting or merging fields,
  reordering). Her submitted decisions are approved and implemented as submitted. Claude implements them and keeps
  accuracy, the design system, accessibility and technical integrity. Material factual or legal claims are flagged
  for the appropriate owner, never rewritten. Prices, entitlements, billing, provisioning and business logic are not
  editorial: copy may describe them, but an editorial release never changes them.
- **Source:** `raidguild-tae-editorial(2).md` (sha256 `ed6fade88519f78a17ca750d2188ec6d7ef533c8b5877bcece6bffc84168787d`),
  change set `sha256:09f31b111631…`, made on `78b024005ad6`, last edited 2026-11-10 17:24 UTC; 49 REPLACE decisions,
  34 flagged stale (made against text batch 02 had since changed), 1 flagged structural (a price removed). No
  matching JSON: manual, auditable Markdown integration; no JSON was rebuilt and no integrity verification is claimed.
  Archived unmodified as `~/Projects/raidguild-backups/2026-11-10/editorial-b03/tae-b03.md`; index of all three
  batches with checksums: `~/Projects/raidguild-backups/2026-11-10/EDITORIAL-ARCHIVE.md`.
- **Reconciliation by copy id against `d974541`** (`manifest-b03.json`): **32 already satisfied** (all Agency and
  shared decisions, the Community hero, ticker word 6, copyright: published by batch 02); **2 already retired**
  (`clients.reasons.items.5.title` / `.body`, "DELETE": Reason 6 stays a tombstone; "DELETE" is never published);
  **15 applied** (Community, commit `5800aef`): About RaidGuild text; capabilities label "[ ways to contribute ]" and
  cards 1–3; Moloch text; Hats Tree introduction and Stewards text; member benefits card 3 text, card 4 title line
  "and raidguild domain" and text (the "$20 a month" price removed from the copy, owner-approved; no price, billing
  or domain provisioning changed); Join label "[ start with a hello ]" and text; FAQ answers "Who runs the Guild?" and
  "Do members get a Guild email?". Verified with `--dump-copy`: exactly these 15 ids changed, all read as decided,
  476 copy ids before and after.
- **Shared fields separated.** Five source literals fed a field Tae edited and one she did not; each was split so
  only her field changed (the other keeps its published text, ids unchanged):
  - `community.capabilities.cards.1.body` / `.2.body` from the practice copy in `lib/data/venture.ts`, which Agency's
    `clients.capabilities.practices.*.body` keep;
  - `community.capabilities.cards.0.body` from `community.path.steps.1.body`;
  - `community.join.body` from `community.faq.items.0.answer` ("Where do I start?");
  - `community.faq.items.3.answer` from `community.guild.body` (both edited, to different texts);
  - `community.faq.items.4.answer` from `community.guild.kit.items.0.detail`.
- **Presentation corrections** (reported, wording untouched): "leader.Members" → "leader. Members" (FAQ);
  "[ ways to contribute]" → "[ ways to contribute ]"; the closing period restored on the Hats Tree introduction after
  its last sentence was cut. Kept as written: the spaced hyphens " - " (Moloch, Stewards) and "Raidguild.org".
- **Layout fix `c749476`.** "AND RAIDGUILD DOMAIN" overflowed its card at 320, 390 and 1024 px under the title's
  `nowrap`; the accent line of a benefit card title may now wrap (`benefits.module.css`). Titles that fit are unchanged.
- **Fixtures** (in `5800aef`): the narrative tests read the new Join, Moloch and benefit texts; the CLI shared-literal
  test uses `community.guild.kit.requirement` / `community.faq.items.1.answer`; the price-rule tests use a fixture
  (no price remains in the copy) and also check that adding a price is structural.
- **Editorial Mode v0.3 coverage (unchanged by batch 03):** 293 active editable fields (Agency 128, Community 143,
  Both pages 22; 21 of them in Hidden text); the two Reason 6 ids are tombstones; 476 copy ids in the source.
- **Release.** Build `BASELINE=c749476 deploy/cloudflare/build.sh c749476` (build id `u8lggr7pLO8-t7dGjQXGL`),
  deployed to the existing Worker as version **`5dcaac41-1c25-4b5f-a1e4-30a65326a1f3`** (workers.dev only); serving
  confirmed by the build id in the live HTML at 17:45 UTC. **Rollback target: `c309397c`** (batch 02). Railway, DNS,
  raidguild.org, billing and upstream untouched.
- **Verification.** Tests 125/125, tsc clean, lint 0 errors (1 old warning). Local workerd and live: both pages 200;
  all 15 new texts in the visitor HTML and the replaced texts absent; at 1440 and 390 px no horizontal overflow, no
  empty elements, every link labelled with a destination, no page errors; `?editorial=1` opens Editorial Mode (166
  editable elements on /community) and visitors get no editor; Reason 6 absent, no "DELETE". The clipped-text probe
  flagged only visually hidden screen-reader text (Hats, Join), the same on the previous live version. Benefit cards
  measured at 320/390/1024/1440 px. **Intentionally skipped (express release):** pixel comparisons, load tests, the
  full Editorial Mode suites, Night theme checks. Not compared against the October 23 reference.
- **Checkpoint:** annotated tag `release/editorial-cycle-02` on the docs commit that records this, on top of
  `c749476`; pushed to `fork` only.

### Editorial history (cycle 02)

| Batch | Change set | Made on | Decisions | Commits | Worker version |
|---|---|---|---|---|---|
| 01 | `1f3373b71bc5…` (JSON reconstructed byte for byte) | `bb37620` | 3 (2 rewrites, 1 KEEP) | `055cbb0` | `8d6c86ce` (with v0.3 `5f93262`) |
| 02 | `9e1c68fabd01…` (Markdown only) | `5f93262188e0` | 34 (23 text, 9 link labels, Reason 6 retired) | `08ee651`, `8e82e54`, `6e7ae87`, `78b0240` | `c309397c` |
| 03 | `09f31b111631…` (Markdown only) | `78b024005ad6` | 49 (32 satisfied, 2 retired, 15 applied) | `5800aef`, `c749476` | **`5dcaac41`** (current) |

### Next cycle backlog (not started)

1. **Draft rebasing.** Tae's drafts keep the base text she started from, so batch 03 carried 34 stale decisions
   already published. Editorial Mode should rebase drafts on newly published copy (drop drafts the site now
   matches, show real conflicts only).
2. **Export compatibility.** Batches 02 and 03 came as Markdown only and print a truncated change-set id. Make the
   JSON export reliably travel with the Markdown (or embed the full id and per-decision fingerprints in the Markdown)
   so the CLI can verify integrity again.
3. **Shared-field independence.** Several literals still feed more than one field (practice link labels across both
   pages, the kit requirement and FAQ answer 2, Queen Raida's application panel and FAQ answer 3, capabilities card 5
   and the stewardship introduction). Decide which should stay linked and give the others their own literals.
4. **Remaining copy inconsistencies** for Tae's review: the process FAQ still promises "weekly demos" with Reason 6
   retired; "handover" and "handoff" both appear; the Builders and People introductions open alike; "guild" vs
   "Guild" capitalization (FAQ "Where do I start?" and Path step 2 keep lower case); the Guild kit list says
   "Guild email" while the benefits card now says "Guild email and raidguild domain"; the practice copy now differs
   between Agency and Community. Plus the claims flagged on 2026-11-10 (payment and entity FAQ, pricing FAQ,
   forward-deployed engineers, Problem description, copyright 2027).
5. **Full responsive and accessibility regression** (Day/Night, 320–1440 px, keyboard, screen-reader names, pixel
   comparison against the public build and the October 23 reference) before the next major structural release.
6. **`raidguild.estudioblanco.org` routing**: the cutover proposed on 2026-11-09 (route + redirect-rule change)
   still awaits the owner's decision.

## 2026-11-10 — Final card illustrations (owner; uncommitted, awaiting approval)

- **Decision (owner):** the 16 final illustrations replace the card art of three groups, mapped 01–06 / 01–04 to
  the cards in their visual (= source) order: the /agency services gallery (`hire/`), the /community capabilities
  gallery (`community/`) and the /community member benefits (`membership/`). Mapping, checksums and the art they
  replace: `docs/asset-provenance.md`, 2026-11-10.
- **Consequence:** the two galleries no longer share art. Since November 3 the /community gallery reused the
  /agency images; each now has its own set (the November 3 test that asserted equal images now asserts each set,
  its order, 4:3 size and `contain`). The practice art in `lib/data/venture.ts` (`spear-onchain-v1.webp`,
  `spear-applied-ai-v1.webp`) is unchanged; the cards no longer read it.
- **Implementation:** image references only, in the narrative data layer (`src/lib/narrative/clients.ts`,
  `src/lib/narrative/community.ts`): `{ src, width: 1448, height: 1086, fit: "contain" }` for gallery cards (the
  existing 4:3 art box with its padding, as the previous practice art), `{ src, width: 1254, height: 1254 }` for
  benefit thumbnails. No component, CSS, copy or editorial id changed; no asset deleted.
- **Verification (isolated production build of HEAD + this change, `~/Projects/raidguild-backups/2026-11-10/verify-illustrations`,
  `next start` on :3061):** tests 125/125, tsc clean, lint 0 errors (1 old warning), build OK. Browser
  (`qa/illustrations-qa.mjs`): Day and Night at 1440 × 900 and 393 × 852, both routes: 16/16 cards show the
  intended file in order, all loaded, delivered ratio 1.333 / 1.000 with `contain` / `cover` (no distortion), no
  card overflow, no horizontal page overflow, CLS < 0.1, no failed image request. The only console error is the
  existing 404 for `/_vercel/insights/script.js` (Vercel Analytics off Vercel; also on the live Worker).
  Screenshots: `qa/shots-illustrations/` (section and all-cards strip per group, theme and width).
  Not compared against the October 23 reference (the art is new by design). Not deployed.

## 2026-11-10 — Final UI polish before handoff (owner; uncommitted, awaiting visual approval)

Part of the same handoff candidate as the final card illustrations above. The owner's four reference screenshots
did not reach the session; the changes follow the written brief and were checked on the pages themselves.

- **Company selector (logo marquee, `/agency` Previous Works; the only place the shared `LogoMarquee` appears).**
  Rendered cards were already equal in size; the inconsistencies were: the card was 190 × 73 (and 210 × 81) while the
  art is 228 × 88, so the art's 16-unit corners (13.3 / 14.7 px) did not match the 12 px card and selection ring;
  hovering lifted a card 2 px, so a clicked card sat 2 px above its neighbours; five logos sat 0.5–1.35 units off
  centre inside their SVGs and the Daedalus logo showed a darker plate. Now (`showcase.module.css`, shared
  component): one geometry from `--logo-w` with `aspect-ratio: 228 / 88` and the art's corner radius; a 3 px ring that
  is always present and only changes colour (coral when selected, 45 % coral on hover); no hover lift; focus ring
  unchanged. Asset fixes: `docs/asset-provenance.md`. Marquee motion, selection, keyboard and drag are untouched.
- **Moloch CTA ("Find your path into the Guild", pink `[ THE GUILD ]` section):** dark surface in both themes:
  `--color-dark-green` (#102D2C), cream label 12.1:1, dark-green edge, icon disc transparent with a cream ring (the
  Night treatment); hover #1A3F3D (9.5:1), pressed #0A2120 (13.8:1), the shared 1 px lift, inset and focus ring.
  Size (390 × 56 / 345 × 52), shape, icon and destination unchanged (`feature.module.css`).
- **Guild → Ways to contribute spacing:** the desktop "at least one viewport tall" rule no longer applies to `#guild`
  (its content ends about 650 px into a 900 px section), and since the Guild shares its Day surface with the next
  section it keeps half of `--section-space` below (`venture.module.css`). From the last Guild content to the
  `[ WAYS TO CONTRIBUTE ]` label: about 360 → 178 px at 1440, 168 → 132 px at 393. Nothing overlaps; opening the
  Guild kit still grows the section downward.
- **Footer (shared by both audiences and `/`):** the motto is upright (it was italic from 1000 px; phones were
  already upright) and keeps its two lines on desktop: its column takes the motto's width and the size (24.75 px)
  eases down only between 1000 and about 1180 px (21 px at 1000). The two hunt clues ("A signal at the edge of the
  map", "A mark left by the walker") and their row were removed from the audience routes; `/` keeps its own clues
  (inquiry and creed), so **the hunt can no longer be completed from /agency or /community**. Each link shows an
  18 px icon (GitHub, X, Discord, RaidGuild mark, blog) in the text colour, labels are set in capitals by CSS, links
  underline on hover; focus unchanged. New link "Portal Blog" → https://portal.raidguild.org/posts
  (`site.footer.socials.4.label`, owner-approved), so Editorial Mode now has 294 active fields (shared 23).
- **Verification (isolated production build `~/Projects/raidguild-backups/2026-11-10/verify-illustrations`, :3061):**
  tests 125/125 (editorial counts updated for the new field), tsc clean, lint 0 errors (1 old warning), build OK.
  `qa/polish-qa.mjs`, both routes, Day/Night × 1440/393: 92/92 (selector geometry identical on hover and selection,
  Moloch CTA colours, contrast and focus in every state, Guild gap, footer motto, links, icons, no clues, no
  horizontal overflow, CLS < 0.1, no failed requests or console errors apart from the existing Vercel Analytics 404).
  `qa/illustrations-qa.mjs` re-run: 16/16 illustrations unchanged. Footer destinations all answer 200. Before/after
  screenshots: `qa/shots-polish/{before,after}-*`. Not compared against the October 23 reference. Not deployed.

## 2026-11-10 — Hunt after the footer clues; SEO / AEO pass (same candidate; uncommitted)

- **Hunt (owner: verify, do not restore the footer copy, keep `/`).** The audience routes could still open the
  portal (`/community` Projects Explorer), whose overlay invited the hunt ("Follow the rabbit … find the ✧ signal
  and the ✧ mark further down the page") although the signal and walker are no longer on those pages: a dead end.
  `PortalOverlay` now takes `hunt` (`pathname === "/"` in `VentureShell`): off `/` the overlay shows no hunt intro
  and no rabbit clue, and its screen-reader title and description no longer mention the trail. `/` is unchanged
  (all three clues). **Deliberate limitation:** the on-page hunt exists only on `/`; the `raidguild` console
  commands still work on every route (progress is per device), and their help text already points to the `/`
  gallery. Verified: `qa/hunt-qa.mjs` 11/11.
- **SEO / AEO (Tae's request).** Report and decisions: `docs/seo-aeo-handoff.md`. Code: `src/lib/seo.ts`
  (canonical origin `https://www.raidguild.org`, indexing gate, asset origin, JSON-LD builders), root layout
  (robots, `metadataBase`, `twitter:site`), the three pages (absolute canonical and og:url, JSON-LD), `sitemap.ts`
  (three routes when indexable, empty otherwise), `public/llms.txt`, `lib/agent-readiness.ts` (stale Markdown for
  `/` and `/join` removed), a space before every `<br>` in the venture components (heading text), and
  `tests/seo.test.mjs` (run through `agent-readiness.test.mjs`, since the test list lives in the owner's
  `package.json`). **Indexing decision:** every build is `noindex` except the Vercel production deployment of
  raidguild.org or a build with `RAIDGUILD_INDEXING=on`; go-live needs that confirmed (D-2).
- **Release held:** the owner's "Final Handoff Release" (commit, push, Vercel deploy) was superseded mid-run by the
  SEO / AEO brief ("do not commit, push, tag or deploy without explicit approval"); nothing was committed or deployed.

## 2026-11-10 — Editorial Mode rich text (owner request; same candidate, uncommitted, awaiting review)

- **Architecture found:** 294 editable fields, each a plain string literal in `src/lib/narrative/*` (plus
  `lib/data`), rendered by `CopyText` (`primitives/Review.tsx`) with one inline mark, `**bold**`; the editor edits
  the rendered text in a `contenteditable` `<rg-copy>` and serializes it back (`EditorialMode.tsx`); drafts live
  in localStorage (`store.ts`), export as Markdown + fingerprinted JSON (`lib/editorial/drafts.ts`) and are applied
  to the exact literal by `scripts/apply-editorial.mjs`. Inline formatting fits this design without a new engine.
- **Decision: extend the existing inline format; no Tiptap.** Four marks only, as text:
  `**bold**`, `_italic_`, `++underline++`, `[words](address)` (`src/lib/narrative/inline.ts`: one parser for the
  renderer, the editor, drafts, the CLI and search metadata). No HTML, styles, sizes or colours can be expressed.
  None of the 477 existing strings uses `_`, `++` or `](`; every one prints back unchanged and renders through the
  untouched legacy path (visitor layout identical in 12 route/theme/width combinations).
- **Tiptap, evaluated and not adopted:** it would replace the 294 in-place `contenteditable` fields with
  ProseMirror instances (or one editor per focused field), add roughly 100–150 KB gzipped of editor code to the
  opt-in bundle, need a ProseMirror-JSON ↔ string-literal mapping for the export and the CLI (or move copy to a
  store, i.e. a CMS), and re-test the guards that keep links and buttons inert while editing. Its benefits (tables,
  lists, collaborative editing) are outside this brief. Reconsider only if block formatting or a CMS is wanted.
- **Field policy (`config.ts formattingFor`):** marks and links only in running prose (body, answer, intro,
  description, detail, dek, text, requirement: 57 rendered on the two pages, including the 4 editable fields that
  already use bold);
  titles, display lines, labels, buttons, questions, names, ticker words and all hidden text (alt, screen-reader
  names, metadata) stay plain. Verified on both pages that no prose field sits inside a link or button.
- **Links:** `https://`, `http://`, `mailto:`, site paths and `#anchors` only (`safeHref`); `javascript:`, `data:`,
  protocol-relative and malformed addresses are refused in the editor, flagged in drafts and the export, blocked by
  the CLI, and never rendered as links (they stay visible text). External links open in a new tab with
  `rel="noopener noreferrer"`; links take the text colour, underline and the site focus ring (`.inlineLink`).
- **Editor:** a toolbar above the text (top of the screen on phones, 40 px targets): Bold, Italic, Underline, Link
  (add / update / remove), Undo, Redo; Cmd/Ctrl+B/I/U/K; Alt+F10 into the toolbar, arrows, Escape back. Browser
  formatting other than B/I/U is dropped; disallowed fields keep plain text. The Changes panel shows the formatted
  proposal, its markup and "Formatting only" changes. Shorten counts words, not markers. FAQ placeholders no longer
  mistake a link for a placeholder. JSON-LD and metadata use plain text.
- **Verification:** tests 137/137 (new `tests/editorial-rich.test.mjs`: round trip of every existing string,
  marks, nesting, link safety, policy, warnings; CLI test: formatted text applied as written, title formatting
  and `javascript:` refused); tsc, lint 0 errors. Opt-in build (`verify-editorial-rich`, :3064), `qa/rich-qa.mjs`
  21/21: toolbar and labels, bold/italic/underline/link by button and shortcut, unsafe link refused, undo/redo,
  keyboard access, title stays plain, persistence after reload, Preview link attributes, Changes panel, export of
  both files, phone toolbar and tap; the exported JSON passes the CLI dry run (1 change, 476 others unchanged).
  Not deployed; the shareable guide doc (claude.ai artifact) is not updated yet.

## 2026-11-10 — Editorial Mode final acceptance (owner: inline parser approved, no Tiptap)

- **Responsibilities:** Tae edits, formats, previews, reviews and exports; Dekan validates the export, applies it
  with the CLI, runs the checks, commits and deploys (`docs/editorial-guide-tae.md` and the shareable guide
  https://claude.ai/artifact/Xmhy49kfgYYqx3zrKiT6x5, both updated: toolbar, shortcuts, field restrictions, link rules,
  Save → Export → Apply).
- **Acceptance run** (`~/Projects/raidguild-backups/2026-11-10/acceptance/`): in the opt-in editor, the Join text
  (`community.join.body`) got bold, italic (shortcut), underline and a link (Cmd/Ctrl+K), was saved and exported.
  On a clean scratch repository of the candidate, the CLI dry run and `--apply --confirm 023524e782d2` changed one line
  of `src/lib/narrative/community.ts` only, 477 copy ids before and after, only that id changed; tests 137/137, tsc,
  build OK; visitors get `<strong>`, `<em>`, `<u>` and `<a href target=_blank rel="noopener noreferrer">` in the server
  HTML at 1440 and 393 px, no overflow, no errors. Raw markers appear only in the React data inside `<script>` (as
  `**` already did), never in visible text or metadata.
- **Fixture decision:** copy fixtures pin the words, not the formatting. The run first failed two tests: one of the
  new rich-text tests asserted that no live copy used the new marks (replaced by the real invariant: every string
  round-trips and carries only the formatting its field takes), and `narrative.test.mjs` compared prose verbatim
  (13 prose assertions and the two brief checks now compare `plainText`). A formatting-only change therefore needs no
  test edit; a wording change to pinned brief copy still does, by design.

## 2026-11-10 — Final handoff release `b0d6cb6` (owner-approved)

- **Commit:** `b0d6cb613760bb53f891eb2bfc32e138d36f7d0c` "feat(handoff): final illustrations, UI polish, SEO/AEO and
  Editorial Mode rich text", 78 files exactly as in the release manifest
  (`~/Projects/raidguild-backups/2026-11-10/RELEASE-MANIFEST.md`); pushed to `fork/feat/venture-beyond-integration`
  (`c4e921a..b0d6cb6`). Upstream untouched (`origin/review/venture-beyond-redesign` `7d0e878`, `main` `b02d67b`).
  Owner files preserved (`package.json`, 21 legacy image deletions, the font, `clients.pdf`, `.DS_Store`).
- **Vercel review** (project `raidguild-venture-beyond-review`, existing configuration unchanged): clean archive
  `git archive b0d6cb6` + the project link from `2026-11-02/deploy-04da57f`, `npx vercel@65.8.0 deploy --prod --yes
  --build-env SHOW_REVIEW_FLAGS=false` → `dpl_D4iJJAvqf2LRwSourYmN9Lm2mnj4`, READY, production. Public URL:
  https://raidguild-venture-beyond-review.vercel.app (the deployment URL itself needs a Vercel login). Editorial Mode
  is not in this build. Vercel names `raidguild.estudioblanco.org` as the project's production domain; that host
  still 302s to Railway through Cloudflare (DNS untouched).
- **Cloudflare Editorial Mode** (Worker `raidguild-estudioblanco`, workers.dev, no routes, kit unchanged):
  `BASELINE=b0d6cb6 deploy/cloudflare/build.sh b0d6cb6` (`NEXT_PUBLIC_EDITORIAL_MODE=opt-in`, review flags off;
  build id `c9Lhe8g0jxuI8GbxG81Ts`), `wrangler deploy` → version **`32af0c5c-155c-4aee-b60b-c667f973dce7`**, serving
  confirmed by its build id; `X-Robots-Tag: noindex, nofollow`. URLs: https://raidguild-estudioblanco.luisblancoach.workers.dev/agency?editorial=1
  and `/community?editorial=1`.
- **Verification, Vercel** (public alias): `/`, `/agency`, `/community` 200, `noindex, follow`, canonical
  `https://www.raidguild.org…`, `twitter:site`, JSON-LD (Organization, WebSite, WebPage; 6 Service on /agency), one
  H1 each, heading text spaced; robots.txt as before, sitemap valid and empty, llms.txt lists both audience pages,
  agent Markdown off on `/`. Illustrations suite 236 checks passed (16/16 cards, Day/Night × 1440/393), one CLS
  reading of 0.124 on a cold first load of /agency light 1440 that did not reproduce (4 reruns 0.0000–0.0005). Polish
  92/92, hunt 11/11.
- **Verification, Cloudflare:** rich-text suite 21/21 on the live Worker (activation, toolbar, bold/italic/underline/
  link by button and shortcut, unsafe link refused, undo/redo, keyboard, plain-only title, save and reload, Preview,
  Changes panel, export of both files, phone); the live export (source revision `b0d6cb613760`) passes the CLI dry run
  against the commit (1 change, 476 unchanged). Visitors get no editor; `?editorial=1` opens it with 118 (/agency) and
  167 (/community) editable texts; footer and illustrations present, no page errors.
- **Known limitations:** share-image URLs on the Vercel review site point at `raidguild.estudioblanco.org` (its
  production domain), which redirects, so previews there show no image; on the Worker they point at raidguild.org
  paths, which exist only after go-live. The on-page hunt exists only on `/`. Editorial drafts live in one browser;
  the editor link is public (no access control), as before. Raw formatting markers appear in React's script data,
  never in visible text. Not compared against the October 23 reference. raidguild.org, Railway, DNS and
  `raidguild.estudioblanco.org` routing unchanged (D-2 and the cutover remain open).
- **Rollback:** Vercel: `npx vercel@65.8.0 rollback dpl_8BmqYkt7ykpEw5NFZmgm2kKCiqdD` (the previous production,
  `233777b`) from the linked archive directory, or promote it in the dashboard. Cloudflare: `wrangler rollback
  5dcaac41-1c25-4b5f-a1e4-30a65326a1f3` from a kit build directory. Source: `git revert b0d6cb6` (never a reset of the
  pushed branch).
- **Editorial workflow (Tae / Dekan):** Tae edits and formats at the Worker URLs, previews, comments and exports both
  files; Dekan runs `bun scripts/apply-editorial.mjs <json>` (dry run), then `--apply --confirm <12-character id>`,
  `bun run test`, tsc, lint, a build, commit, push and deploys (Vercel review as above; the Worker with the kit so the
  editor shows the new text). Guide: `docs/editorial-guide-tae.md`, shareable https://claude.ai/artifact/Xmhy49kfgYYqx3zrKiT6x5.

## 2026-11-10 — Canonical routes: Hire the DAO at `/` (owner-approved; two-page architecture)

- **Decision (owner):** `/` serves Hire the DAO (the former `/agency` page, unchanged); `/community` keeps Join the
  DAO; `/agency` and `/clients` (and anything below them) redirect permanently to `/`. The former `/` entry page
  ("Venture Beyond": Guild prologue, wall of curiosities, practices, legacy inquiry, entry creed) is retired from
  the routes; its components and `lib/narrative/entry.ts` stay in the code, unused (no deletion without approval).
- **Implementation:** `src/app/(venture)/page.tsx` is the Agency page (canonical, og:url and JSON-LD on `/`);
  `src/app/(venture)/agency/` removed; `next.config.ts` redirects `/agency` → `/`, `/agency/:path+` → `/:path+`, the
  same for `/clients` (explicit bare-path rules: `/:path*` with an empty path produced an empty Location and a
  self-redirect loop on `/agency?editorial=1`, caught in testing); the host-scoped
  `raidguild.estudioblanco.org` `/` → `/agency` redirect is removed (it would loop). `lib/venture-routes.ts` (Hire
  the DAO href `/`, section homes, legacy `?audience=hire` → `/`), `lib/theme.ts` (`/` opens in Day),
  `(venture)/layout.tsx` (nav keyed by `/`), `lib/editorial/config.ts` (Editorial pages `/` and `/community`;
  copy ids unchanged), `lib/seo.ts` (public routes `/`, `/community`), `public/llms.txt`, `scripts/review-claims.mjs`,
  `/chat` back-links to `/community#guild`, the editor's link example.
- **Verification (isolated builds of the working tree, :3061 public and :3064 opt-in):** tests 137/137, tsc, lint 0
  errors, both builds OK (`/` static). Redirects: `/agency`, `/clients` → `/` in one 308 with query kept
  (`/agency?editorial=1` → `/?editorial=1`), sub-paths up one level, trailing-slash forms two hops (Next's slash
  normalization first), `?audience=hire` → `/`, no loop on any host. Visitor layout of `/` identical to the released
  `/agency` and `/community` unchanged (every element box, Day/Night × 1440/393). SEO: `/` canonical
  `https://www.raidguild.org`, Agency title and description, 6 Service nodes; `/community` unchanged; sitemap lists
  only `/` and `/community` at go-live; `llms.txt` two pages. Illustrations 16/16, polish 92/92. Editorial:
  rich-text suite 21/21 at `/?editorial=1`; route checks 8/8 (118 / 167 editable texts, old `/agency?editorial=1`
  links keep the editor, Hidden text by page, an export made on `/agency` imports, Show on page crosses to
  `/community`, exports name "Agency (/)"); 477 copy ids identical to the release; the new export passes the CLI
  dry run.
- **Conflicts for the owner:**
  1. **Hunt.** The retired entry page held all three on-page clues (Portal in its gallery, signal by its inquiry,
     walker in its creed). No route now shows an on-page hunt; the overlay never shows it (`hunt={false}`); the
     `raidguild` console commands still work. Two texts still promise it: the "The Portal" project card on
     `/community` ("follow the rabbit to begin a three-clue discovery trail", `components/ArtifactGallery.tsx`;
     live since `b0d6cb6`, missed by that release's hunt check) and the console help ("Open The Portal in the
     gallery"). Options: retire the on-page hunt and reword those two texts; bring the hunt to `/community` (rabbit in
     the overlay plus new signal and walker placements); or keep the old entry page at a hidden, noindex route.
  2. The entry page's content (prologue, wall of curiosities, legacy inquiry) is no longer public.
  3. Tae's editor link becomes `/?editorial=1` once released; old `/agency?editorial=1` links keep working through
     the redirect. The shareable guide is updated at release, not before (its links would be wrong until then).

- **Resolution (owner, final two-page architecture):** exactly two public experiences, `/` (Hire the DAO) and
  `/community` (Join the DAO); "Venture Beyond" is a campaign concept, not a route. Hunt: **option A**, the on-page
  hunt is retired. The Portal project card now reads "Step into RaidGuild's world through the Portal, then choose
  where to go next: the Guild's practices, a project, or the community." (its gallery caption and button drop "the
  hunt"); `PortalOverlay` no longer has a hunt branch (intro, rabbit clue and the `hunt` prop removed); the console
  banner, help and "next clue" messages now lead the trail in the console itself (`raidguild.clue("signal")`, then
  `"walker"`). Console commands, progress and the walker link are unchanged. No hunt was moved to `/community` and no
  hidden landing was kept; the legacy entry components and the on-page clue markers remain in the code, unused.

## Social previews — 2026-11-11

The home page uses Venture Beyond; `/clients` and `/agency` use Hire the DAO; `/community` uses Join the DAO. `/agency` renders the existing client experience without redirecting and retains its own canonical URL. Moving the root file-based Open Graph image into `public` allows explicit route metadata to select the intended image. Existing audience navigation still targets `/clients`.

## Integration with `main` — 2026-11-11

Branch `feat/venture-beyond-agency-community` replays `feat/venture-beyond-integration` (`7417113..c7cd52f`) on `main` `256b2ff`. Hire the DAO renders at `/`; `/agency` and `/clients` redirect permanently to `/` (one hop, query kept), which supersedes the non-redirecting `/agency` alias above. The 2026 cards stay: Hire the DAO on `/`, Join the DAO on `/community`, Venture Beyond as the site-wide default. The share-image descriptions follow the new cards (text from PR #108, marked for editorial approval). The Cloudflare review kit (`deploy/cloudflare/`) is not part of this branch.

## Hire the DAO form, states and 404 — 2026-11-11

On `feat/venture-beyond-agency-community` (PR #109): lighter selections (Services Needed as check tiles), Ubuntu
throughout the form, Day/Night error colours (#a61b29 / #ffb4ab), focus on the first field needing attention, the
panel kept in place while sending, errors and retries that keep every answer and the step, the confirmation with the
lit beacon (Last Duel title, static RaidGuild signature), the transmitter beside the error notice, and a 404 page with
the fallen signpost. Illustrations: `docs/asset-provenance.md`, "Inquiry and error states".
The specs link accepts a domain with or without protocol: trimmed, given https:// when it has none, full http(s)
links kept as entered; normalized before Next validates and sent normalized (`normalizeLink` and `isValidLink`
in `lib/validation.ts`, tests in `tests/inquiry-link.test.mjs`).

**New copy pending Tae's review** (not yet in the narrative files, so not editable in Editorial Mode):

| Where | Copy |
|---|---|
| Inquiry, step 3 action (was "Complete") | "Send inquiry" |
| Inquiry, while sending | "Sending inquiry…" |
| Inquiry, action after a failed send | "Try again" |
| Inquiry, failed send (alert title) | "We couldn't confirm your inquiry." (owner's wording) |
| Inquiry, failed send (alert text) | "Your answers are still here. You can try again." (owner's wording) |
| Inquiry heading after success (label) | "[ Transmission Started ]" (owner's wording) |
| Inquiry heading after success (title) | "The Fires" / "Have Been Lit!" (the existing title, set as the opening title's two lines) |
| Confirmation, first sentence (was "Your quest has been received.") | "**Your Submission Has Been Received.**" in Ubuntu Bold (owner's wording) |
| Inquiry, share-image descriptions (from PR #108) | already marked `wording` in `clients.ts` / `community.ts` |
| Inquiry, invalid specs link (owner's wording) | "Enter a valid link, like example.com." |
| 404 page title (owner's wording) | "This trail ends here." |
| 404 page link (owner's wording) | "Back to RaidGuild" |
| 404 browser tab | "This trail ends here" |

## Why Builders Join the Guild cards — 2026-11-11

`/community#benefits` (`MemberBenefits.tsx`, `benefits.module.css`): each card lays itself out from its own width
(container query). From 560 px the illustration is a square column on the left, the full interior height of the card,
on the card's surface and shown whole (contain); below that the illustration sits above the copy in the same card,
still square (160–240 px). Two cards per row from 700 px. Eyebrows in Ubuntu Mono 14 px with the theme accent; titles
(Last Duel, 15/18 px) and bodies (Ubuntu 15 px) a step smaller and free to wrap, left-aligned. Copy and editorial ids
unchanged. Open: the pink eyebrows at 14 px are 3.4:1 (Day) and 4.2:1 (Night), below 4.5:1 for small text, as before.

## Steward role and Stewardship heading — 2026-11-11 (owner)

- Takekek (Tae) shows as **Account manager** (`lib/data/members.ts`): the steward card on `/` and the builder cards on
  `/` and `/community`. Name, avatar, project line and link unchanged. The Hats tree still lists her as wearer of the
  Sync Steward hat (1822.5), the Hats Protocol role name, which is matched through `stewards[].role`.
- The Stewardship heading on `/community` reads RAIDGUILD'S / **ROLE STRUCTURE** (`community.hats.title.em`), in the
  coral, slanted Extended treatment; the line is fitted to the column so it stays on one line. The intro ("RaidGuild's
  Hats Tree maps…") and the link "Explore the Hats Tree" keep the Hats Protocol name.
