# Asset provenance

Recorded 2026-10-27. Covers the artwork added during the Venture Beyond integration
(audience routes `/clients` and `/community`).

**Provenance:** AI-generated for RaidGuild. **Approval:** approved for public use in
this project by the project owner. No third-party licence and no exclusive copyright
ownership is claimed for these files.

## Queen Raida

| File in the repository | Source | Details |
|---|---|---|
| `public/images/queen-raida/queen-raida-v2.png` | `raid-guild/website` working copy, `public/images/queen-raida/queen-raida-reference.png`, modified 2026-10-26 23:56 | 1672 × 941 PNG, no transparency, MD5 `b533c6119cb4f3e73cbc80868d47e8c1`. Used by the Queen Raida module on `/community` until October 29; deleted from the working tree by the owner on October 29 (uncommitted) and no longer referenced. |

The previous reference image (1632 × 818) is superseded, is not referenced by the site
and is not part of the repository.

## Illustration library (`imaginery`)

All six files were approved together: three scenes, each in a portrait and a horizontal
cut. Each scene is used once, in the cut that suits its layout; the other three cuts
remain approved and unused; they stay unmodified in the source library (`~/Desktop/RG/imaginery`) rather than in the repository.

| File | Scene | MD5 | Used in the repository |
|---|---|---|---|
| `Ilus_01.png` (1536 × 2048) | Builder keeping a signal tower and servers | `087e7edad3052ebe2582d1d49366e4ca` | No |
| `Ilus_02.png` (1536 × 2048) | Crew repairing a vessel | `9a9702f56c209636500d95386a432456` | No |
| `Ilus_03.png` (1536 × 2048) | Foundry turning raw material into output | `2083c2a91de9d11c72d7c1e7202c8296` | `public/images/illustrations/Ilus_03.png`: Services & Capabilities, both routes (desktop on `/clients`) |
| `ilus_horiz_001.png` (1024 × 768) | Builder keeping a signal tower and servers | `e6cf33d9b10968eeb5469c501965d15a` | `public/images/illustrations/ilus_horiz_001.png`: Stewardship heading, `/community` |
| `ilus_horiz_002.png` (1024 × 768) | Foundry turning raw material into output | `945d53551e8a68c98bfa4414b012a100` | `public/images/illustrations/ilus_horiz_002.png`: Services, `/clients` mobile (from 2026-10-28) |
| `ilus_horiz_003.png` (1024 × 768) | Crew repairing a vessel | `a4876a7ce5a74c6487ed7b2dff0b9251` | `public/images/illustrations/ilus_horiz_003.png`: Builder Network heading, `/clients`, and from 2026-10-30 `/community` (same shared module) |

**Exception, approved 2026-10-28:** the foundry scene is used in both cuts. The October 27
Hire the DAO designs place the portrait cut (`Ilus_03.png`) beside the `/clients` Services
accordion on desktop and the horizontal cut (`ilus_horiz_002.png`) above it on mobile. The
file was copied unmodified from the source library; its MD5 matches the table. Every
other scene is still used once.

Placements are declared in `src/lib/data/illustrations.ts`. The illustrations are
decorative (empty alt text), keep their transparency and native aspect ratio, and are
never displayed larger than their source size.

## Client showcase (`casestudies`)

Recorded 2026-10-28. Supplied by the project owner on 2026-10-27 in `~/Desktop/RG/casestudies`
for the `/clients` "What we've built for our clients" showcase; the copy in
`public/images/casestudies/` is byte-identical. Unlike the artwork above, these are not
AI-generated: the buttons carry third-party project logos (trademarks of their owners) and
the snapshots are screenshots of each project's own website homepage. They are used to
identify the projects only, as supplied and unmodified. No licence to the logos is claimed.

| Project | Button (`custom_buttons/`, 228 × 88 SVG, paths only) | Snapshot (`snapshots/`, 1692 × 908 PNG) |
|---|---|---|
| DAOhaus | `button_daohaus.svg` `0e64ced09438fcc01e1172be91448d07` | `Snapshot_daohaus.png` `cbc154d991d64bc98e213798e1e4e4fc` |
| Daedalus | `button_daedalus.svg` `97089d2bf9348610271b95b182a7ce60` (replaced 2026-10-28; see below) | `Snapshot_daedalus.png` `f62196b86913c9599298905680ef24f8` (replaced 2026-10-28) |
| BrightID | `button_brightid.svg` `36f28174708b65a5e56167c85e283087` | `Snapshot_brightid.png` `70a25cb9a89c2cfbf72229bc1cada820` |
| Livepeer | `button_livepeer.svg` `9cfbae60b6e795ee2a13759d296df1cb` | `Snapshot_livepeer.png` `593a8c3936693a49d00b27b56d69acb8` |
| Hypercerts | `button_hypercerts.svg` `a244cf07d691934850f35e26bd2eb041` | `Snapshot_hypercerts.png` `3a1fff5b023cc4fe9f9879ef9a8a4be5` |
| Pocket Network | `button_pocket.svg` `9b5c1d8520c77b3eda48c5d5b0d07e31` | `Snapshot_pocket.png` `984462b603f44935b6986777c9315427` |
| Problem | `button_problem.svg` `d0faaaa9fc3d6c92ffea6379a35f7ad7` | `Snapshot_problem.png` `dd8f2c8a61372a1ccffa595fe7daac4a` |
| Gitcoin | `button_gitcoin.svg` `81e68e92ac6f9a98c4a768abfd5236aa` | `Snapshot_gitcoin.png` `fa3934c8f93c1e2f41a44a7f4c369268` |
| YieldNest | `button_yieldnest.svg` `66095bf588e8665df946e5bf1764e194` | `Snapshot_yieldnest.png` `50c4bb8d7c25cadffb89429362a91e40` |

MD5 values follow each file name.

**Daedalus, replaced 2026-10-28.** The owner supplied a new logo button and website screenshot
and copied them into `public/images/casestudies/` (byte-identical to
`~/Desktop/RG/casestudies/`). The button is still 228 × 88, but unlike the others it draws the
logo from an embedded PNG (`data:` URI, self-contained, no external reference). The snapshot is
still 1692 × 908. Superseded MD5s: button `f806ac6564142cc902f93270ddcdc80b`, snapshot
`80c49f726eac2fac099a059da0c6737c` (release `da9165b`).

`clients.pdf` (the source sheet: buttons, bare logos and
links) is a reference document only and is not part of the repository. Placements are
declared in `src/lib/data/caseStudies.ts`.

**Queen Raida and Moloch, Hats (October 29, 2026; owner-supplied, committed with iteration 02).** By the evening of
October 29 the owner had removed `public/images/queen-raida/` from the working tree (the tracked
`queen-raida-v2.png` shows as deleted; the untracked `queen_raida_reference_vertical.png` is gone) and
placed their own artwork under `public/images/venture/`, replacing the seven placeholder PNGs drawn
in iteration 01 (those files and paths no longer exist). Nothing was resized, recompressed or
substituted in this repository. The owner approved committing them on 2026-10-29; they are committed
with iteration 02 (without `.DS_Store` files), together with the deletion of `queen-raida-v2.png`. Paths are declared in
`src/lib/data/illustrations.ts` (`queenRaidaArtwork`, `molochArtwork`) and `src/lib/data/hats.ts`.

| Path | Pixels | Ratio | Format | Used for | MD5 |
|---|---|---|---|---|---|
| `public/images/venture/entities/queen-raida/queen-desktop.png` | 2877 × 1230 | 2.34:1 | PNG RGBA | Queen Raida, desktop (wide screens) | `f851a3dc3d74e652f11ddfc5a5be26c4` |
| `public/images/venture/entities/queen-raida/queen-rectangle.png` | 2508 × 1412 | 16:9 | PNG RGBA | tablets and squarer monitors; also the dormant October 23 carousel's artwork reference | `4c332b0672a65f20a43134f2c55c8085` |
| `public/images/venture/entities/queen-raida/queen-mobile.png` | 1536 × 2304 | 2:3 | PNG RGBA | phones (≤ 700 px) | `aff51e0fb14045cd007e7203d71b7bd8` |
| `public/images/venture/entities/moloch/moloch-desktop.png` | 2877 × 1230 | 2.34:1 | PNG RGBA | About Moloch, desktop | `58ea72d071196d79791605238766f75a` |
| `public/images/venture/entities/moloch/moloch-rectangle.png` | 2508 × 1412 | 16:9 | PNG RGBA | tablets and squarer monitors | `002f2958b406b4ae54d91571709c5bad` |
| `public/images/venture/entities/moloch/moloch-mobile.png` | 1536 × 2304 | 2:3 | PNG RGBA | phones | `5a50b07449f84d2c678add21a476d322` |
| `public/images/venture/hats/raidguild.png` | 800 × 800 | 1:1 | PNG RGBA | Hats Tree parent node (1822), 132 px desktop, 64 px phone | `c077e8ec73708f758923919cac0e447c` |
| `public/images/venture/hats/raidguild-green.png` | 800 × 800 | 1:1 | PNG RGBA | Hats Tree parent node in Day (November 3, owner request): `raidguild.png` with the navy swords (#191E4E) recoloured to dark green (#102D2C); antialiased edges remapped by blend share, pink and cream untouched. Night keeps the original | `572a666ee9d019d2c2680f4fd7f4d26c` |
| `public/images/venture/hats/knowledge-steward.png` | 600 × 600 | 1:1 | PNG RGBA | role card, about 176 px desktop, 76 px phone | `7c631ba0254b08c7b35b327a0b1b8fd0` |
| `public/images/venture/hats/infrastructure-steward.png` | 600 × 600 | 1:1 | PNG RGBA | same | `5b9ea78f7a2846e1828db2c802bdbdfb` |
| `public/images/venture/hats/sync-steward.png` | 600 × 600 | 1:1 | PNG RGBA | same | `aa8bbaecefcf5a0b05b0901ce3fb5bfb` |
| `public/images/venture/hats/participation-steward.png` | 600 × 600 | 1:1 | PNG RGBA | same | `f9286ef24937fb2139d52ea948b0c7d7` |
| `public/images/venture/hats/brand-steward.png` | 600 × 600 | 1:1 | PNG RGBA | same | `c49e7758f0a3881b08b6ba8d8d9c6069` |

Art direction (`sections/ImmersiveFeature.tsx`): `(max-width: 700px)` → mobile cut;
`(max-width: 1199px), (max-aspect-ratio: 3/2)` → rectangle; otherwise the desktop cut. Each is shown
full width, at most 88svh tall (`object-fit: cover`) above 700 px and whole on phones. The hat
illustrations carry their own painted backgrounds and fill their tiles. Each entity file is 5.2–6.0 MB;
next/image serves resized WebP. Rights and provenance of the new files were not stated with them: confirm
they are approved for public use (the earlier Queen Raida approval covered `queen-raida-v2.png`).

## Moloch title mark (2026-10-30; removed 2026-11-02)

**Removed on 2026-11-02 at the owner's request:** the title no longer carries a mark and the file is deleted
(tracked in Git, restorable from `1adb327`). The record below is historical.

| Path | Size | Format | Used for | MD5 |
|---|---|---|---|---|
| `public/images/swords.svg` | 224 × 212 viewBox | SVG, two fills (cream `#EFE9D7`, navy `#191E4E`) | After "Moloch" in the About Moloch title, `/community`, about one cap height | `e311325daa5cfcf97f6bb9b2f454b9dd` |

Supplied by the owner on 2026-10-30 (untracked in the worktree at 10:41; the brief names it
`public/images/sword.svg`, the file on disk is `swords.svg` and is used as is). November 2 (mobile pass): on
phones it is drawn at 1.6 times the MOLOCH line (about 57 px), hanging after the word, instead of one cap
height; desktop is unchanged. Same file (identical to the owner's `~/Downloads/swords.svg`). It replaces the
`venture/hats/raidguild.png` crop in the Moloch title; that PNG remains the Hats Tree parent. Not yet
committed: it must be committed with the code that references it.

## Entity artwork on phones (2026-11-02, mobile pass)

Queen Raida and Moloch phones now show the centre square of each `*-rectangle.png` (CSS crop, no new file);
the `*-mobile.png` vertical cuts are no longer rendered but stay on disk and in `illustrations.ts`.

## Final contact module: Venture Beyond scene and professions (2026-10-30, afternoon)

Supplied by the owner on 2026-10-30 (all untracked in the worktree; they must be committed with the code
that references them). Declared in `src/lib/data/illustrations.ts` (`contactScenes`, `professions`); used by
`sections/ContactScene.tsx` in the /clients inquiry and the /community Join module. Decorative scene (empty
alt); each profession group's alt names it while it is shown.

| Path | Pixels | Used for | MD5 |
|---|---|---|---|
| `public/images/neo/join-horizontal-light.png` | 2880 × 1260 | scene, light theme, above 760 px | `d2f2f97a191d2df572746adf1b654466` |
| `public/images/neo/join-vertical-light.png` | 1536 × 2304 | scene, light theme, phones | `19f29b6f4cbd7f835dec9702fa47fa04` |
| `public/images/neo/join-horizontal-dark.png` | 2880 × 1260 | scene, dark theme, above 760 px (added 12:41) | `09cab0e543003a7600ed6a5467d5fddf` |
| `public/images/neo/join-vertical-dark.png` | 1536 × 2304 | scene, dark theme, phones (added 12:41) | `99895bbd0d5ad03a8af54a6bcad7004f` |
| `public/images/professions/Druid 2.png` | 768 × 1024 | gallery 1 ("Druids"; identical to `neo/contact-druid-transparent.png`) | `8b9b3626f8a50d37cc96bddf4c1e54f1` |
| `public/images/professions/Archers.png` | 768 × 1024 | gallery 2 | `2f9bf778ef9b3d385aa97aa6b0409c20` |
| `public/images/professions/Angry Dwarves.png` | 768 × 1024 | gallery 3 | `ccc10d13c4a960c73479fe4ee5a30353` |
| `public/images/professions/Hunters.png` | 768 × 1024 | gallery 4 | `7e5fa84ded2f5d72b481137c33c8c82d` |
| `public/images/professions/Paladins.png` | 768 × 1024 | gallery 5 | `6a033f86616b259cb3c4165fc9da18e7` |
| `public/images/professions/Druid.png` | 768 × 1024 | gallery 6 ("Druid and companions") | `ef16593d97817ee0825bdddb7babdbda` |

`neo/contact-druid-transparent.png` remains in use on "/".

### Website favicon (2026-10-30)

`public/images/icons/favicon-moloch.png` (36 × 36, pink crossed swords, `95a9acd2ade461454408b7a4d30ec6a1`)
is the site favicon. `src/app/favicon.ico` (the App Router file convention; the only icon the app links)
was rebuilt from it: 16 and 32 px (downscaled with `sips`) and the original 36 px, as PNG entries
(`71ccc3d097a69eb1aa40c29c3bf52816`; the previous ICO, `df056522198b69e07aa7f6fc9733d620`, is in git).
Not changed: `src/app/favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png` and `site.webmanifest`,
which no page links (not App Router file names), and a 36 px source is too small for a 180 px touch icon.

## CTA icon set (2026-10-30, night)

Supplied by the owner in `public/images/icons/` (untracked; commit with the code): sword arrows
`arrow-right-flat.svg`, `arrow-left-flat.svg`, `arrow-down.svg`, `arrow-up.svg`, `arrow-right-up.svg`,
`arrow-right-up-1.svg` (drawn pointing up-left), `arrow-right-down.svg`, `arrow-rleft-down.svg` (file name
as supplied; drawn pointing down-left), and `ico_discord.svg`, `ico_portal.svg`, `ico_handbook.svg`,
`ico_sun.svg`, `ico_dark.svg`. Used as CSS masks (shape only, painted in the control's colour), so their own
fills do not matter. In use: right, left, down and up-right swords; Discord, Portal, handbook; sun and dark
(theme switch). Not yet used: `arrow-up`, `arrow-right-up-1`, `arrow-right-down`, `arrow-rleft-down`. The
older `icons/venture/ico-*.svg` remain for the RaidGuild logo glyph (`ico-logo.svg`) and the sigil.

## Telegram mark (2026-10-30, form pass)

`public/images/icons/ico_telegram.svg` (24 × 24, one path, `5c782430c862569955ecb5374904c756`): a simple paper plane drawn for this
project (not a third-party logo file), used as a mask for the Telegram option of the inquiry form's
"Prefer another way to connect?" picker. The Discord option uses the owner's `ico_discord.svg`.

## Social images (2026-10-30, metadata pass)

Derivatives of the owner's rectangle artwork, made with sharp (1200 × 630, cover crop, attention position,
WebP q82); the originals are untouched.

| Path | From | Size | MD5 |
|---|---|---|---|
| `public/images/venture/og/clients-queen-raida.webp` | `entities/queen-raida/queen-rectangle.png` | 150 KB | `aec1bcc26c65d4e2e2f2ba6b0550979c` |
| `public/images/venture/og/community-moloch.webp` | `entities/moloch/moloch-rectangle.png` | 111 KB | `59a2f85487e6895efb07d679af84b93e` |

## Last Duel display fonts (2026-11-02)

Supplied by the owner on 2026-11-02 in `public/fonts/` (untracked; not to be committed until the licence
is settled, STATUS open question 64). Name tables: private builds "renamed from EurostileLTStd-* 2.035"
(Adobe; Eurostile is a Linotype trademark), Retalic cuts "+12° derived from EurostileLTStd-Ex2"; `fsType` 4;
licence field "PRIVATE / INTERNAL USE ONLY ... No redistribution, sublicensing, web hosting or open-source
licensing is granted. Renaming does not change the license status." 261 glyphs each (Latin, no arrows).

| File | Name table (family / style) | Used | SHA-256 |
|---|---|---|---|
| `LastDuel-Ex2.otf` | Last Duel Ext Two / Regular (400, width 7) | upright display | `8cde147b01fbc5377d96cc3d3138bf959ad84ca093e80a491b35999a6accdc4a` |
| `LastDuel-BoldEx2.otf` | Last Duel Ext Two / Bold (700, width 7) | upright 600+, labels; heading bottom lines with synthesized oblique | `c8ec0fcdf584bb1c1903eba7ed432d3b382f1dd146de684ceb9febc8d932ba70` |
| `LastDuel-Oblique.otf` | Last Duel / Italic (400, −12°) | italic | `197881fea5f2715948f9f3eba115a4ef4c4db1a5ac260c2c949f1b1313830b41` |
| `LastDuel-BoldOblique.otf` | Last Duel Bold / Italic (700, −12°) | italic, 600+ | `521457c9320244ac92354a563638abd8ce18597fd39a87d4984c41a02ac51fe6` |
| `LastDuel-Ex2Retalic.otf` | Last Duel Ext Two Retalic / Regular (400, +12°) | not wired (hierarchy pass) | `5721249a825b820992e14545260d3bd9bc684172eb9046837c4ec9f26733d2d1` |
| `LastDuel-BoldEx2Retalic.otf` | Last Duel Ext Two Retalic / Bold (700, +12°) | heading top lines (hierarchy pass) | `06c694f754983a49951d342f0d387039c0da341c6cff1085d477f8a2c4579b58` |

Removed the same day: the six Grinder WOFF2 files (`Grinder-{Regular,Italic,Retalic}.woff2`,
`Grinder-Refined-{Regular,Italic,Retalic}.woff2`), no longer referenced; recoverable from Git history.

## Sword arrows turned (2026-11-02, owner)

`public/images/icons/arrow-{right,left,down,right-down,right-up}-hilt.svg`: the owner's five sword arrows
(`arrow-right-flat`, `arrow-left-flat`, `arrow-down`, `arrow-right-down`, `arrow-right-up`) wrapped in a 180°
rotation, so the hilt leads in the action's direction. Generated from the originals, which stay on disk; the
pill icon masks (`venture.module.css`) use the new files. Untracked until committed with that CSS.

## 2026-11-03 — `public/images/illustrations/Ilus_03.png` (foundry portrait) retouched

- Change: a stray vertical mark (an isolated sliver of opaque pixels at x 1262–1270, y 1256–1342 of the
  1536 × 2048 file, clear of the machine) made fully transparent, at the owner's request (visible beside the
  FAQ). The 871 pixels in the box x 1250–1300 × y 1230–1370 had their alpha set to 0; nothing else changed
  (same size, RGBA, PNG re-encoded).
- Before: sha256 `78d1d2056a45618faf2db80df34da0e7277a77824ef0351dabc86e267288a682` (2,316,352 bytes), kept at
  `~/Projects/raidguild-backups/2026-11-03/Ilus_03.original.png`.
- After: sha256 `b6492c83b6e714d8e9a143f9117e53360a0577aeba8bcdf96413cb9d7382d362` (2,186,205 bytes).
- Use: decorative, beside the FAQ on /clients and /community from 1000 px (empty alt, aria-hidden).

## 2026-11-10 — Final card illustrations (owner-supplied, 16 PNGs)

- **Source:** supplied by the owner, placed by hand in `public/images/illustrations/{hire,community,membership}/`
  on 2026-11-10 as the final illustrations of the Venture Beyond handoff. Used exactly as supplied: no
  re-encoding, resizing or retouching of the files (`next/image` serves resized variants at request or build time,
  as for every other image). Transparent RGBA PNGs: Hire and Community 1448 × 1086 (4:3), Membership 1254 × 1254.
  Provenance and approval as at the top of this file (the owner approved them for public use in this project).
- **Use:** decorative card art, empty `alt` (the card titles carry the meaning). Gallery cards show them whole
  (`fit: "contain"`, 4:3 art box); benefit thumbnails show the square art whole (`object-fit: cover` on a square box).

| Destination | Card | File | sha256 |
|---|---|---|---|
| /agency services gallery | 01 Full-stack development | `hire/01-technicians-repairing-a-steampunk-engine-core.png` | `a862576188dc4ac2bc118e45ebb06f8d0964033ed03dda03fd0c55124ccd97c9` |
| /agency services gallery | 02 Smart contracts, onchain systems | `hire/02-floating-modular-space-city-workshop.png` | `5da2f70637939f7dfd7c1cec8b19ca0fde9bdda1dfd98c05b670e92ebdfb6c25` |
| /agency services gallery | 03 Applied AI and automation | `hire/03-tech-orchestrator-and-robot-workshop.png` | `6b248e5967388a52b97a1e55d9a3696f05502fa4ab5d52dee068620833db5777` |
| /agency services gallery | 04 Product and system design | `hire/04-architects-of-the-ring-temple.png` | `ddad360d09b9201ddca286e7f6a9f249160b42ed8c46dfee4c6fc97b0f2dcb21` |
| /agency services gallery | 05 Marketing and content strategy | `hire/05-fantasy-portal-merchant-hub.png` | `e1bdd96a983b01c685cc3479b4b3eb7f90ba0020ac8b95d34ad3f906ac9e241c` |
| /agency services gallery | 06 DAO consulting and governance | `hire/06-celestial-amphitheater-vote.png` | `890ce45dd03ac63ec92e2dd302c5ee9e1cf2a391b2d8d31c994dcaf6924576cc` |
| /community capabilities gallery | 01 Ship on real raids | `community/01-engineering-raid-briefing.png` | `28abb3bbcbc68a158fa4606929a525b192f1af5512472a4a8bbd754633583a07` |
| /community capabilities gallery | 02 The onchain practice | `community/02-onchain-expedition-to-the-floating-hub.png` | `e7ff2414597dfb8fdbb86cbc3dd51fdd5c1ce615335b6363c1b9f4c74abc4a0a` |
| /community capabilities gallery | 03 The applied AI practice | `community/03-guild-team-beneath-the-queen-s-halo.png` | `fc3b6e4c9bdba2fa7069986d38dcc4e21770158e4b60a4385457cf1d355eb17b` |
| /community capabilities gallery | 04 Make it understandable | `community/04-sci-fi-archery-workshop-collaboration.png` | `8c86dc60bd9c2bc9a27d5811f677da7f2e757b2f3463dcb67c5a52f46bc71b14` |
| /community capabilities gallery | 05 Carry the Guild's voice | `community/05-desert-guild-s-waterworks-expedition.png` | `e4ac542a3bd8ac3df2660c36e82b1ea6ff21ad1a26f158b5d82b89d124f69e17` |
| /community capabilities gallery | 06 Shape how the Guild runs | `community/06-floating-guild-council-assembly.png` | `7fa34d1e2bae35e4a739a353fd5679a22d51dd8db41dd8936f5d3ddb4428fd08` |
| /community member benefits | 01 Cohorts, bounties and raids | `membership/01-fantasy-map-with-dagger-and-treasure-pouch.png` | `795527c96056507664de7643eadfd94f1ca652f0652a614630452015a404d027` |
| /community member benefits | 02 Hackathons and hackerhouses | `membership/02-holographic-fantasy-video-call-laptop.png` | `9ef15adc5e40d4e97e1c7fc8c6224d80df6deb3087b58e8640637763d26fb8d1` |
| /community member benefits | 03 RIPs and shared funding | `membership/03-steampunk-balance-of-knowledge.png` | `b7d39854afedecc9e148dfaaa1c9fb1f7c0862bac2d4aa98ecb668909839a040` |
| /community member benefits | 04 Guild email and raidguild domain | `membership/04-sci-fi-adventure-kit-and-holographic-tablet.png` | `ce8d6070588d521ba90326b3d6254066220ca39895966a0861e0f99030294a5a` |

- **Replaced art (kept on disk, nothing deleted):** the cards previously used `neo/spear-edge-problem-v1.webp`,
  `neo/spear-onchain-v1.webp`, `neo/spear-applied-ai-v1.webp`, `neo/guild-builders-v1.png`,
  `neo/field-signal-commons.png`, `neo/field-autonomous-treasury.png` (both galleries) and
  `neo/hero-landmarks-v1.png`, `neo/sky-citadel.png`, `neo/field-protocol-garden.png`, `neo/creed-flyer-v1.png`
  (benefits). Still referenced elsewhere: the two spear files (practice data, `lib/data/venture.ts`),
  `guild-builders-v1.png` (Guild prologue), `sky-citadel.png` and `field-protocol-garden.png` (portal overlay).
  **No longer referenced by any page:** `spear-edge-problem-v1.webp`, `field-signal-commons.png`,
  `field-autonomous-treasury.png`, `hero-landmarks-v1.png`, `creed-flyer-v1.png`; removal needs the owner's approval.
- The folder's `.DS_Store` is not part of the asset set.

## 2026-11-10 — Final UI polish: logo buttons recentred, footer link icons

- **Company selector buttons** (`public/images/casestudies/custom_buttons/`, 228 × 88): five buttons had their logo
  off the card's centre inside the SVG (measured on a 4× render: Pocket 1.35 units left, DAOhaus 1.1 right,
  Hypercerts 0.9 high, Daedalus 0.75 low, Livepeer 0.5 high). Their content is wrapped in one
  `<g transform="translate(…)">` that cancels the offset; all nine now centre within 0.25 units. The Daedalus card fill
  changes from #121212 to #0A0A0A, the colour of its embedded logo plate, which showed as a darker box. Nothing else in
  the files changed. Originals and checksums: `~/Projects/raidguild-backups/2026-11-10/custom_buttons-original/`.

| File | Change | sha256 before | sha256 after |
|---|---|---|---|
| `button_pocket.svg` | translate(1.35 0) | `9671ddd322f646f5cab472c51bf894bd0cbdddd970b7f503881572e31166852c` | `42e6217d4670062e680087d99b139e888849af9f649e130bff7dbe13a189c18f` |
| `button_daohaus.svg` | translate(-1.1 0) | `abadc27adb89b1bf64fd827baa37226f4a734de09bd885dc7b9314d34a5344be` | `93dc0459aa943b73e56b1bba5ec40d34d4742de96f899b8050ce8355ab55d990` |
| `button_hypercerts.svg` | translate(0 0.9) | `4d8eaccfeb557025d8bf5bb583172dfc66064e302cce60e7419786570b93f05c` | `4f2686ce66f4403e79d9e622f56ebdc4fb6bc3fd8b40d526abf92f26e1c58d2e` |
| `button_daedalus.svg` | translate(0 -0.75), fill #0A0A0A | `81e9d82365f96587f7051475f6ef59742c26dbc4d25b066c587d0fa660d68031` | `cb2e24922d5e20e099b8de28022ec17d1c5c6a01c57903be0514a10242588cf5` |
| `button_livepeer.svg` | translate(0 0.5) | `8b35ce67b9a5044484d706211337616e726451cc4114dd65af4f87ef8c14d5bc` | `d8f5852e600744ceea7ae13e0353c0f732e304a4719a23dcfab65ab36c108b2d` |

- **Footer link icons** (24 × 24 SVGs used as CSS masks in the text colour, like the existing pill icons):
  - `public/images/icons/ico_github.svg`: the GitHub mark (path data as published by Simple Icons, CC0), sha256
    `9495b5e0fef8fd2fa589e1cfd9dce387847ca62ab6733d809d17589e1e345efd`;
  - `public/images/icons/ico_x.svg`: the X logo (Simple Icons path data, CC0), sha256
    `0ad2abf4d9c768306760f323264dc1d6f42e5f163972d459eb971d4dd47361a9`;
  - `public/images/icons/ico_blog.svg`: Lucide "newspaper" (ISC; Lucide is already a project dependency), sha256
    `395c9a63b0230bdf80d672e838d7f5a99a234c73fb4a8306004fe358dbf3ccfa`;
  - Discord and Brand Archive reuse `ico_discord.svg` and `venture/ico-logo.svg` (the RaidGuild mark).
  The GitHub and X marks identify links to those services' RaidGuild pages only.

## Social preview cards — 2026-11-11

Supplied directly by the project owner for this social-preview update. Copied unchanged from Downloads: `venturebeyond_thumbnail.png` → `public/opengraph-image.png`; `hire-dao-thumbnail.png` → `public/images/venture/og/hire-dao-2026.png`; `join-dao-thumbnail.png` → `public/images/venture/og/join-dao-2026.png`. Each is 1731 × 909 PNG. No additional authorship or licensing claim is made.

## Inquiry and error states — 2026-11-11

Three illustrations generated for RaidGuild and selected by Luis (project owner); two are used. Supplied as final PNGs in
`public/images/venture/states/` and copied unchanged into this branch. Each is 1448 × 1086, 8-bit RGBA with a
transparent background. No other authorship or licensing claim is made.

| File | sha256 | Bytes | Use |
|---|---|---|---|
| `beacon.png` | `96259a014c8246b9e231bf5c51405a048b9f5acf7e30f6aedcec5fd59054aa3f` | 831,127 | Hire the DAO inquiry confirmation ("The Fires Have Been Lit!"): large, below the message and the Discord action, in its own space. Decorative (empty alt). Replaces the code-drawn SVG beacon proposed earlier the same day, which was never committed. |
| `error.png` | `0f883622f9ad443c54431a5ce713ec4effcecfae9fe915d5502f3f67d0591690` | 1,014,277 | Not used. Tried beside the submission error notice, then removed on the owner's review the same day (the notice is a plain alert). Not shipped in this branch; the supplied original stays in the integration worktree. |
| `404.png` | `a04f0693526112aab737372636084dcf5978343ce18469892e9d33d27d146929` | 867,933 | The fallen signpost on the not-found page (`src/app/not-found.tsx`). Decorative. |

Served through `next/image`, so visitors receive resized copies; the originals stay as supplied.
