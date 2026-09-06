# Soulpunk 1577 — Start in The Roots

A bilingual English/Thai campaign guide for four level-5 D&D 5e (2014) characters. Protect a neighborhood clinic through three connected adventures, then continue from the crew's choices.

## Run locally

Requires Node.js compatible with the installed Vite version (Node 22.12+ or a supported newer release). Run from this directory:

    npm install
    npm run dev

On Windows PowerShell with script execution disabled, use npm.cmd instead of npm.

    npm run check
    npm run lint
    npm run build
    npm run preview

Content checks use Node's built-in assertions. No test framework, backend, accounts or database required.

## Using the guide

Start with **Start Playing**, choose four of seven pregenerated characters, then visit **The Roots**. Rules include contracts, field procedures, prices, items and a glossary.

Player view is the default. **Show DM content** reveals faction plans, adversaries, adventures and continuing-campaign material. This is spoiler control, not access security: the static application contains all content. A direct DM anchor does not silently enable spoilers.

Language controls preserve the current section. Section links use stable hash anchors. Desktop has persistent navigation; mobile has a collapsible menu.

Print the current view, a section, a character sheet or a player handout. Player handouts include only their document and the public map where applicable. Map checkboxes hide secret routes when preparing other player material. Browser Print without a dedicated button prints the current reading view.

## Canon and content

The guide uses **Eden**, **SoulCoin**, and **1577 DR**. This homebrew future connects to the Forgotten Realms; its cataclysm is not official D&D canon. Gold is physical currency. SoulCoin is issued against contracts and can subsequently circulate. Spendable balances and pledged soul percentages are separate.

Contracts create duties and disputes rather than automatic HP loss or removal of player control. Passage Oil is a labeled homebrew variant of published Oil of Etherealness. The guide targets 2014 rules, not the 2024 revision.

Older files outside this application—Soulpunk1577_Campaign_Guide.md, its .docx source, and soulpunk_1577_playbook.md—are retained as superseded drafting references. Their Vael terminology, original soul-share penalties and earlier mechanics are not authoritative for this starter. They have not been overwritten.

Content responsibilities:

- src/campaign.js: bilingual setting, factions and adventures.
- src/characters.js: seven shared mechanical records and translated guidance.
- src/rules.js: contracts, field rules, equipment and attribution.
- src/data.js: section assembly, navigation, maps and handout extraction.

Sections have stable IDs, groups, translated titles/bodies, and optional DM flags, kinds and map keys. Use Markdown links to section anchors. Adventure handouts begin with the second-level heading Handout / เอกสารแจก and end at the next second-level heading. Put no DM commentary inside them. Character statistics and contract values are shared, not duplicated per language. Keep translated rules synchronized.

The [implementation plan](docs/roots-starter-plan.md) records scope and interfaces. The [DM walkthrough and verification record](docs/verification.md) covers preparation, failure paths and limitations.

## Rules attribution

This work includes material taken from the System Reference Document 5.1 (“SRD 5.1”) by Wizards of the Coast LLC and available at [SRD 5.1](https://www.dndbeyond.com/attachments/39j2li89/SRD5.1-CCBY4.0_License_live%20links.pdf). The SRD 5.1 is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/legalcode).

Keep the 2014 Player's Handbook or [2014 Basic Rules](https://www.dndbeyond.com/sources/dnd/basic-rules-2014) available for full class and spell descriptions. Soulpunk lore, contracts, Passage Oil and encounter templates are homebrew. This is an unofficial fan setting.

Balance has not been tested with a live group. Encounter adjustments are starting guidance. No deployment is part of this change.
