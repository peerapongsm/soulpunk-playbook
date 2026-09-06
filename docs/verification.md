# DM preparation walkthrough and verification

## Preparing session one in an hour

This is a desk walkthrough of the material, not evidence that an unfamiliar DM completed a timed trial.

| Time budget | Read or prepare | Ready when |
| --- | --- | --- |
| 0–10 min | Primer, crew origin, contracts | Know why the crew protects Kael and how coin differs from pledge |
| 10–20 min | Ethereal procedure | Can explain oil, access window, party roles, alerts and safe return |
| 20–35 min | Silence adventure and adversaries | Have counts, actions, tactics, DCs and failure costs |
| 35–45 min | Roots/archive maps and four sheets | Know routes, pads, resources and spell dependencies |
| 45–55 min | Print ledger handout and sheets | Player papers exclude private plans and secret routes |
| 55–60 min | Give/sell/destroy outcomes and Mercy opening | Can begin the next session without inventing evidence |

Agree boundaries around coercion, medical vulnerability and soul ownership. Explain homebrew. Ask players to read their class and selected spells. Check costly components: the starting cleric has no Revivify diamonds.

## Continuity walkthrough

- **Give away the ledger:** supply records support a hearing and an escort. Medicine is still needed, so the supply problem remains actionable.
- **Sell it:** the buyer gains leverage. Nima's signed testimony at the clinic and the copy at Mara's gate remain independently available.
- **Destroy or lose it:** both testimonies remain available without checks. Failed theft does not end the campaign.
- **Fail an essential search:** obtain the clue with the specified time/alert cost. Do not require a repeat successful roll.
- **Fail a supply route:** use its partial result or retreat consequence. Delays change the neighborhood, without removing all routes to the finale.
- **Expose fraud:** retained evidence or independent testimony supports the appeal. Failure changes the hearing and clinic location.
- **Settle:** make a witnessed, bounded agreement. Refusal or insufficient funds leaves exposure and relocation available.
- **Relocate:** Mara reveals the route; independent clues also establish it. Failed transport checks cost equipment, not abandoned patients.
- **Lose a fight:** apply the custody/retreat/closure result. No automatic pledge, allegiance change or conversion of a PC to an NPC.

All three ledger outcomes support all three finale choices. Earlier results change evidence, access and relationships, not the existence of the next chapter. Award level 6 after the finale, not between level-5 adventures.

## Mechanical review

Each character uses one numeric record in both languages. Proficiency +3, saves, skills, spell DCs and attacks derive from those values. HP uses maximum first-level Hit Die and fixed average thereafter; the hill dwarf includes Toughness. Level-4 increases are included once.

The wizard has 14 spellbook entries and nine prepared spells. The cleric has nine prepared plus six domain spells. The warlock has six known spells, three invocations and two third-level pact slots. The ranger has four known spells and 4/2 slots. Monk resources and martial-arts die are level 5. Equipment and component limits are printed on each sheet.

The published 2014 Oil of Etherealness is rare, one Medium-or-smaller creature per vial, one hour. Homebrew Passage Oil deliberately changes those limits to three creatures and eight hours. The archive permission window is a separate six-hour period.

## Verification record

- Baseline lint/build passed before implementation.
- npm.cmd run check covers IDs, language coverage, references, public/DM links, map routes, adventure structure, handout extraction and character calculations.
- npm.cmd run lint and npm.cmd run build check source and production output.
- Browser checks use locally cached Playwright/Chromium; no project dependency added. Checks cover player default, DM deep-link opt-in, bilingual navigation, map secrets and keyboard links, unique anchors, menu, 390/320-pixel layouts and print isolation.
- Player-handout and character PDFs generated. Print CSS inspected separately from screen CSS.
- Thai prose checker run on extracted translations to avoid JavaScript-operator false positives. Narrow-screen wrapping inspected visually.
- Independent content review checks canon, bilingual adjudication, evidence and adventure structure. Whole-change review covers host behavior and cross-content consistency.

## Real-world validation still needed

No live table playtest, blind DM trial, performance load test or deployment was performed. Balance, session duration and the one-hour preparation target remain hypotheses until a group uses the guide. Record stalled scenes, viability of noncombat choices and missing table references, then revise the affected content.
