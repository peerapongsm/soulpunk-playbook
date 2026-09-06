import assert from 'node:assert/strict'
import process from 'node:process'
import { sections, groups, maps, getHandout } from '../src/data.js'
import { characters, modifier, abilityMod, proficiency, skillBonus, attackBonus, spellDC } from '../src/characters.js'
import { contracts } from '../src/rules.js'

const ids = new Set(sections.map(s => s.id))
assert.equal(ids.size, sections.length, 'Duplicate section IDs')
assert.equal(sections.length, 14, 'Expected all campaign, rules and character sections')
const languages = ['en', 'th']
const localized = (record, context) => {
  assert.deepEqual(Object.keys(record).sort(), languages, context + ': language coverage')
  for (const lang of languages) assert.ok(record[lang]?.trim(), context + ': empty ' + lang)
}
for (const section of sections) {
  localized(section.title, section.id + ' title')
  localized(section.body, section.id + ' body')
  assert.ok(groups.some(g => g.id === section.group), section.id + ': missing group')
  if (section.map) assert.ok(maps[section.map])
  for (const lang of languages) {
    for (const match of section.body[lang].matchAll(/\]\(#([^)]+)\)/g)) {
      assert.ok(ids.has(match[1]), section.id + ': broken link #' + match[1])
      if (!section.dm) assert.ok(!sections.find(s => s.id === match[1]).dm, section.id + ': player link exposes DM section')
    }
  }
}
for (const [key, map] of Object.entries(maps)) {
  localized(map.title, key)
  assert.equal(new Set(map.nodes.map(n => n.id)).size, map.nodes.length)
  for (const node of map.nodes) localized(node.label, key + node.id)
  for (const edge of map.edges) {
    assert.ok(map.nodes.some(n => n.id === edge.from) && map.nodes.some(n => n.id === edge.to), key + ': invalid route')
    if (!edge.dm) assert.ok(!map.nodes.find(n => n.id === edge.from).dm && !map.nodes.find(n => n.id === edge.to).dm, key + ': public route to secret node')
  }
}
const required = {
  en: ['Preparation', 'Scenes', 'Encounters', 'Outcomes', 'Rewards', 'Handout'],
  th: ['การเตรียม', 'ฉาก', 'การเผชิญหน้า', 'ผลลัพธ์', 'รางวัล', 'เอกสารแจก'],
}
for (const id of ['silence', 'mercy', 'tomorrow']) {
  const adventure = sections.find(s => s.id === id)
  assert.equal(adventure.dm, true)
  for (const lang of languages) {
    for (const heading of required[lang]) assert.equal(adventure.body[lang].split('## ' + heading + '\n').length, 2, id + ': missing/duplicate ' + heading)
    assert.ok(getHandout(adventure.body[lang]).length > 30, id + ': missing player handout')
  }
}
assert.equal(getHandout('## Scenes\nNo handout here'), '')
assert.equal(getHandout('## Handout\nA receipt.\n\n## Outcomes\nSecret.'), 'A receipt.')
assert.equal(getHandout('## เอกสารแจก\nใบรับรอง\n\n## ผลลัพธ์\nความลับ'), 'ใบรับรอง')
assert.ok(sections.find(s => s.id === 'silence').body.en.includes('#mercy'))
assert.ok(sections.find(s => s.id === 'mercy').body.en.includes('#tomorrow'))

assert.equal(characters.length, 7)
assert.equal(new Set(characters.map(c => c.id)).size, 7)
assert.equal(modifier(9), -1)
for (const c of characters) {
  assert.equal(c.level, 5, c.id)
  assert.equal(proficiency(c), 3, c.id)
  assert.equal(c.scores.length, 6)
  assert.ok(c.scores.every(n => Number.isInteger(n) && n >= 3 && n <= 20))
  const constitution = abilityMod(c, 'CON')
  assert.equal(c.hp, c.hitDie + constitution + 4 * (c.hitDie / 2 + 1 + constitution) + (c.hpPerLevel || 0) * c.level, c.id + ': incorrect fixed HP')
  for (const key of ['ancestry', 'role', 'features', 'equipment', 'story', 'turn']) localized(c[key], c.id + ': ' + key)
  assert.equal(c.saves.length, 2)
  for (const skill of Object.keys(c.skills)) assert.ok(Number.isFinite(skillBonus(c, skill)), c.id + ': invalid skill')
  if (c.casting) {
    assert.ok(c.casting.slots.every(n => Number.isInteger(n) && n >= 0))
    if (c.casting.prepared) assert.equal(c.casting.prepared.length, 5 + abilityMod(c, c.casting.ability), c.id + ': preparations')
    if (c.casting.book) {
      assert.equal(c.casting.book.length, 14)
      assert.ok(c.casting.prepared.every(s => c.casting.book.includes(s)))
    }
  }
}
const find = id => characters.find(c => c.id === id)
assert.equal(skillBonus(find('kestrel'), 'Stealth'), 10)
assert.equal(skillBonus(find('kestrel'), 'Deception'), 8)
assert.equal(attackBonus(find('ilyra'), find('ilyra').attacks[0]), 9)
assert.equal(attackBonus(find('aster'), find('aster').attacks[0]), 7)
assert.equal(spellDC(find('nyx')), 15)
assert.equal(spellDC(find('sable')), 15)
assert.equal(spellDC(find('ash')), 15)
assert.equal(spellDC(find('ilyra')), 13)
assert.equal(find('jun').ac, 10 + abilityMod(find('jun'), 'DEX') + abilityMod(find('jun'), 'WIS'))
assert.deepEqual(find('sable').casting.slots, [0, 0, 2])
assert.equal(find('sable').casting.known.length, 6)
assert.equal(find('ilyra').casting.known.length, 4)
for (const c of contracts) { localized(c.name, c.id); localized(c.duty, c.id); assert.ok(c.pledge > 0 && c.pledge <= 100); assert.equal(c.stipend, c.release) }
process.stdout.write('Content check passed: 14 bilingual sections, 3 complete adventure structures, 3 valid maps, 7 level-5 sheets, 3 contracts.\n')
