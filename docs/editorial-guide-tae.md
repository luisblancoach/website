# Editing the RaidGuild pages: a short guide for Tae and Dekan

You can change the wording of the Agency and Community pages directly on the page, see how it reads, and
send us your decisions. Since November 9 (v0.3) that covers every text on both pages: headings, cards,
questions and answers, buttons and menus, the ticker, the creed and the footer, plus text that is not shown
on the page (see "Hidden text"). Nothing you do here changes the public website: your work stays in your own
browser until you export it and send it to us.

Since November 10 you can also format words inside running text: **bold**, *italic*, underline and links
(see "Format words and add links").

## Who does what

| Person | Does | Never needs to |
|---|---|---|
| **Tae** (editor) | Edits, formats, previews and reviews the copy in the browser, writes comments, exports the two files and sends them to Dekan | Touch the code, the repository or the website |
| **Dekan** (developer) | Validates the exported files, applies the approved decisions with the apply tool, runs the checks, commits and deploys | Edit page components or change a field's id |

The path of every change: **Save** (Tae's edits save in her browser; Enter or click elsewhere after each text) →
**Export** (Changes → Export for review; both files to Dekan) → **Apply** (Dekan, "Validate and apply" below).

Shareable version of this guide: https://claude.ai/artifact/Xmhy49kfgYYqx3zrKiT6x5 (kept in step with this file).

## Open the editor

- Agency: https://raidguild-estudioblanco.luisblancoach.workers.dev/agency?editorial=1
- Community: https://raidguild-estudioblanco.luisblancoach.workers.dev/community?editorial=1

A dark bar appears at the bottom of the page. It always says **Local draft — not published**.
Your browser remembers the editor: you can move between the two pages, close the tab and come back later.
Use the same browser and the same computer each time. Your work is saved there and nowhere else.

## Choose what to do with a text

Text you can edit has a thin dotted outline. Click it. The bar then shows its name (for example
"Agency · Hero · Headline, line 1") and your choices:

- **Rewrite**: type the new wording directly on the page, then press **Enter** (or click elsewhere).
  **Esc** cancels what you just typed. Your wording is kept exactly as you write it.
- **Shorten**: the same, for a shorter version. Type it, then click **Shorten** so we know it is a cut.
- **Remove…**: take something away. Choose **This text**, **Whole item** (a whole card, row or button) or
  **Whole section**. Removed text appears crossed out, so you can still see it.
- **Keep as is**: you read it and it is right. Nothing changes; we simply know it was reviewed.
- **Undo** or **Restore**: go back to the published text at any time.

Removing a button, a link, a menu item, a heading or a whole item or section changes the layout of the page,
not only its words. You can still propose it; it is marked ⚠ so we review it separately. The same goes for
changing a price written in the text ("$20 a month"): reword the sentence freely, but a different amount is
marked ⚠ and confirmed separately.

Some texts appear on **both pages**: the Hire / Join switch at the top, the ticker, the creed and the footer.
A change there changes both pages; the list of changes shows them under "Both pages".

A few texts only appear after a click, as they do for visitors:

- **Questions**: open a question with its arrow (not its text) to edit the answer. Words in brackets, such as
  [X–Y weeks], are placeholders: replace them with the real value if you know it.
- **Previous works**: click a project's logo to show its text, then edit it.

## Format words and add links

In running text (texts, answers, introductions, descriptions, details) a small toolbar appears above the text
you are editing (at the top of the screen on a phone). Select the words first, then:

| Button | Shortcut (Mac / Windows) | What it does |
|---|---|---|
| **B** | ⌘B / Ctrl+B | Bold |
| *I* | ⌘I / Ctrl+I | Italic |
| U | ⌘U / Ctrl+U | Underline (use sparingly: underlined words look like links) |
| Link | ⌘K / Ctrl+K | Add a link: type the address and press **Add link**. Inside a link: **Update** or **Remove link** |
| ↶ ↷ | ⌘Z / Ctrl+Z, ⌘⇧Z / Ctrl+Y | Undo / redo the last change in this text |

- Links may point to `https://…`, `mailto:…`, a page of this site (`/agency`, `/community`) or a section
  (`#faq`). Other addresses are refused. Links to other sites open in a new tab for visitors.
- If no words are selected, the link address itself is inserted as the linked text.
- Headings, titles, labels, buttons, questions, names and hidden text stay plain: there the buttons are
  greyed out, so the page design (type sizes, colours, fonts) never changes through copy. Sizes, colours and
  fonts are never available.
- From the keyboard: **Alt+F10** moves into the toolbar, the arrow keys move between its buttons, **Esc** goes
  back to the text.
- Press **Enter** (or click elsewhere) to keep the text, as for any edit. **Changes** shows the proposal as it
  will read and its exact markup, for example `**bold**`, `_italic_`, `++underline++`, `[words](https://…)`;
  a change that only adds formatting is labelled "Formatting only".

## Look at your work

At the top of the bar:

- **Original**: the page as it is published today.
- **Draft**: your decisions, ready to edit.
- **Preview**: the page as it would read with all your decisions, with removed text taken out.

## Hidden text

Some text is not shown on the page: image descriptions (read aloud to people who cannot see the images),
names read by screen readers, and the title and description that search engines and link previews show. In
**Changes**, open **Hidden text**: it lists this page's hidden text. Edit a text in its box and click
elsewhere to keep it; **Shorten**, **Keep as is**, **Remove** and **Undo** work as on the page.

## Comments and the list of changes

Click **Changes** to see every decision on both pages. For each one you can write a comment (why you
changed it, or a question for us), jump to it with **Show on page**, or undo it. **Undo all** clears everything and
brings back the published text.

## Send your work (Tae)

In **Changes**, click **Export for review**. Your browser downloads two files:

- `raidguild-tae-editorial.md`: the review document, easy to read;
- `raidguild-tae-editorial.json`: the same decisions, in the form we use to apply them.

Please send us **both** files. If your browser asks whether this site may download several files,
choose Allow. You can export as often as you like; each export has all your decisions so far.

To continue on another computer, open the editor there, click **Changes**, then **Import**, and choose
the `.json` file.

## Good to know

- Anyone with the link can open the editor in their own browser, but nobody sees your drafts and nothing
  is published from here. It is not a private or protected space: do not write anything confidential.
- If we change the site's text after you made a decision, that decision is marked as a conflict so we
  check it with you.
- Links do not open while you are editing (including links you add). Click **Exit** to use the site normally again.
- Formatting typed by hand (two asterisks, underscores) also counts as formatting; use the toolbar instead.
- Not editable here, on purpose: people's names and roles (the builders, the stewards, the Hats tree), the
  list of Portal projects (it comes from the Portal itself), the contact form, the Portal and its hunt, and
  controls such as Day / Night. Tell us in a comment if any of them needs a change.
- What happens next: Dekan validates your files, applies the approved decisions, tests the pages and publishes
  them. Your exported files are the record of what you proposed.
- The formatting toolbar arrives on the review site with the next release; until then the editor works as before.

## Validate and apply (Dekan)

The exported files never change the site by themselves. With both files from Tae or Dekan:

1. Put them in a working copy of the repository (current `feat/venture-beyond-integration`).
2. Dry run, nothing written: `bun scripts/apply-editorial.mjs raidguild-tae-editorial.json`. It checks every
   decision against the current text (fingerprints), finds the exact place in the source, rehearses the change
   on a copy and verifies that only the intended texts change. Formatting a field does not take, or an unsafe
   link, is **BLOCKED** and never written; so are structural decisions (⚠).
3. Apply the approved change set: `bun scripts/apply-editorial.mjs raidguild-tae-editorial.json --apply --confirm <change-set id>`
   (the first line of the dry run shows it: "Change set 5091626c13f5…" → `--confirm 5091626c13f5`). Removals and
   structural decisions stay a reviewed code change.
4. `bun run test`, `bunx tsc --noEmit`, `bun run lint`, a production build, a look at the pages; then commit,
   push and deploy as usual. No page component needs editing: formatting is part of the text and every page
   renders it (`src/lib/narrative/inline.ts`).
5. If only the Markdown arrived, apply its "Proposed text (exact wording)" lines by copy id the same way, and say
   so in the commit: there is no fingerprint check without the JSON.
