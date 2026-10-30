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

## Moloch title mark (2026-10-30)

| Path | Size | Format | Used for | MD5 |
|---|---|---|---|---|
| `public/images/swords.svg` | 224 × 212 viewBox | SVG, two fills (cream `#EFE9D7`, navy `#191E4E`) | After "Moloch" in the About Moloch title, `/community`, about one cap height | `e311325daa5cfcf97f6bb9b2f454b9dd` |

Supplied by the owner on 2026-10-30 (untracked in the worktree at 10:41; the brief names it
`public/images/sword.svg`, the file on disk is `swords.svg` and is used as is). It replaces the
`venture/hats/raidguild.png` crop in the Moloch title; that PNG remains the Hats Tree parent. Not yet
committed: it must be committed with the code that references it.

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
