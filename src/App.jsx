import { useState, useRef, useEffect } from 'react'
import { data } from './data'
import ReactMarkdown from 'react-markdown'
import edenHero from './assets/eden-hero.png'
import soulcoinContract from './assets/soulcoin-contract.png'
import edenLocation from './assets/eden-location.png'
import bleedLocation from './assets/bleed-location.png'
import etherealLocation from './assets/ethereal-location.png'
import valeriusV2 from './assets/npc-valerius-v2.png'
import willowV2 from './assets/npc-willow-v2.png'
import glitchV2 from './assets/npc-glitch-v2.png'
import kaelV2 from './assets/npc-kael-v2.png'
import vossV2 from './assets/npc-voss-v2.png'
import echo9V2 from './assets/npc-echo9-v2.png'
import maraV2 from './assets/npc-mara-v2.png'
import aster from './assets/preg-aster.png'
import nyx from './assets/preg-nyx.png'
import sable from './assets/preg-sable.png'
import ash from './assets/preg-ash.png'
import kestrel from './assets/preg-kestrel.png'
import ilyra from './assets/preg-ilyra.png'
import jun from './assets/preg-jun.png'
import './App.css'

const art = { eden: edenLocation, bleed: bleedLocation, ethereal: etherealLocation, glitch: glitchV2, valerius: valeriusV2, willow: willowV2, kael: kaelV2, voss: vossV2, echo9: echo9V2, mara: maraV2, aster, nyx, sable, ash, kestrel, ilyra, jun }
const npcDetails = { glitch: ['Deep Network', '29', 'Yuan-ti'], valerius: ['Infernal Syndicate', '46', 'Dragonborn'], willow: ['Archfey Conglomerate', 'Unknown', 'Satyr'], kael: ['The Disconnect', '58', 'Earth Genasi'], voss: ['Celestial Vanguard', '34', 'Aasimar'], echo9: ['Deep Network', 'Unknown', 'Changeling'], mara: ['No-Coin', '27', 'Goliath'] }
const characterSheets = [
  ['aster', 'Aster Vane', 'Human Fighter 3', 'No-Coin Courier', '16 (+3), 14 (+2), 14 (+2), 10 (+0), 12 (+1), 8 (-1)', 'AC 18 · HP 28 · Speed 30 ft · HD 3d10 · Initiative +2', 'Str +5, Con +4', 'Athletics +5, Intimidation +1, Perception +3, Survival +3', 'Longsword +5 (1d8+3 slashing); light crossbow +4 (1d8+2 piercing)', 'Second Wind; Action Surge; Champion: Improved Critical', 'Chain mail, shield, longsword, crossbow, 20 bolts, explorer pack, gold comm-stone', 'Direct and unsentimental. Ideal: freedom. Bond: exposes stolen soul shares. Flaw: never leaves a debt unpaid.'],
  ['nyx', 'Nyx Arclight', 'High Elf Wizard 3', 'Soulhacker', '8 (-1), 14 (+2), 14 (+2), 16 (+3), 12 (+1), 10 (+0)', 'AC 13 · HP 17 · Speed 30 ft · HD 3d6 · Initiative +2', 'Int +5, Wis +3', 'Arcana +5, History +5, Investigation +5, Insight +3', 'Dagger +4 (1d4+2); Fire Bolt +5 (1d10 fire)', 'Arcane Recovery; School of Divination: Portent (2d20)', 'Projector, spellbook, dagger, scholar pack, 15 gp', 'Restless and precise. Ideal: truth should be free. Bond: a stolen vault key. Flaw: trusts systems more than people.'],
  ['sable', 'Sable Thorn', 'Tiefling Warlock 3', 'Corporate Defector', '8 (-1), 14 (+2), 14 (+2), 10 (+0), 10 (+0), 16 (+3)', 'AC 14 · HP 24 · Speed 30 ft · HD 3d8 · Initiative +2', 'Wis +2, Cha +5', 'Deception +5, Intimidation +5, Investigation +2, Persuasion +5', 'Eldritch Blast +5 (1d10 force); dagger +4 (1d4+2)', 'Pact Magic (2 slots, level 2); Agonizing Blast; Devil’s Sight; Pact of the Chain', 'Leather armor, dagger, arcane focus, diplomat pack, infernal contract fragment', 'Elegant under pressure. Ideal: self-ownership. Bond: her Patron’s true name. Flaw: makes promises too easily.'],
  ['ash', 'Brother Ash', 'Dwarf Cleric 3', 'Ripperdoc', '14 (+2), 10 (+0), 16 (+3), 10 (+0), 16 (+3), 12 (+1)', 'AC 17 · HP 27 · Speed 25 ft · HD 3d8 · Initiative +0', 'Wis +5, Cha +3', 'Medicine +5, Insight +5, Religion +2, Persuasion +3', 'Warhammer +4 (1d8+2); Sacred Flame DC 13 (1d8 radiant)', 'Spellcasting; Channel Divinity: Preserve Life; Life Domain', 'Scale mail, shield, warhammer, holy symbol, healer kit, 20 gp', 'Gruff but gentle. Ideal: no one dies for lack of coin. Bond: his hidden clinic. Flaw: cannot refuse a patient.'],
  ['kestrel', 'Kestrel', 'Half-Orc Rogue 3', 'Fixer', '10 (+0), 16 (+3), 14 (+2), 12 (+1), 10 (+0), 14 (+2)', 'AC 15 · HP 24 · Speed 30 ft · HD 3d8 · Initiative +3', 'Dex +5, Int +3', 'Acrobatics +5, Deception +4, Insight +2, Investigation +3, Sleight of Hand +5, Stealth +7', 'Rapier +5 (1d8+3 + 2d6 Sneak Attack); shortbow +5 (1d6+3)', 'Expertise: Stealth, Deception; Cunning Action; Thief: Fast Hands', 'Rapier, shortbow, 20 arrows, thieves’ tools, gold comm-stone, 18 gp', 'Always has a contact. Ideal: leverage. Bond: favours ledger. Flaw: cannot resist a secret.'],
  ['ilyra', 'Ilyra Moss', 'Wood Elf Ranger 3', 'Bleed Scavenger', '10 (+0), 16 (+3), 14 (+2), 10 (+0), 14 (+2), 10 (+0)', 'AC 15 · HP 25 · Speed 35 ft · HD 3d10 · Initiative +3', 'Str +2, Dex +5', 'Nature +2, Perception +4, Stealth +5, Survival +4', 'Longbow +5 (1d8+3); shortsword +5 (1d6+3)', 'Favored Enemy: aberrations; Natural Explorer: The Bleed; Hunter’s Prey: Colossus Slayer', 'Studded leather, longbow, 20 arrows, two shortswords, explorer pack, storm compass', 'Quietly observant. Ideal: endure. Bond: an impossible route through The Bleed. Flaw: sleeps with one eye open.'],
  ['jun', 'Jun Vale', 'Human Monk 3', 'Faraday Order', '10 (+0), 16 (+3), 14 (+2), 10 (+0), 14 (+2), 12 (+1)', 'AC 15 · HP 24 · Speed 40 ft · HD 3d8 · Initiative +3', 'Str +2, Dex +5', 'Acrobatics +5, Athletics +2, Insight +4, Stealth +5', 'Unarmed Strike +5 (1d4+3); quarterstaff +5 (1d6+3)', 'Martial Arts; Ki 3; Flurry of Blows; Patient Defense; Step of the Wind; Way of the Open Hand', 'Quarterstaff, 10 darts, explorer pack, Faraday prayer beads', 'Calm under fire. Ideal: discipline. Bond: a rogue signal. Flaw: mistakes restraint for wisdom.']
]
const extraSections = [
  { title: 'Pre-generated Characters', content: 'Seven level-3 characters ready to enter Eden. Choose one, take the listed hooks, and play.', cards: [
    ['aster', 'Aster Vane', 'Human Fighter 3 · No-Coin Courier', 'AC 18 · HP 28 · STR 16 · DEX 14', 'A former dome-runner carrying a gold comm-stone that proves a Patron is stealing soul shares.'],
    ['nyx', 'Nyx Arclight', 'High Elf Wizard 3 · Soulhacker', 'AC 13 · HP 17 · INT 16 · Spell Save DC 13', 'A contract-code prodigy whose stolen access key opens a locked Ethereal vault.'],
    ['sable', 'Sable Thorn', 'Tiefling Warlock 3 · Corporate Defector', 'AC 14 · HP 24 · CHA 16 · Spell Save DC 13', 'Her Patron wants her back; the price of freedom is a single impossible job.'],
    ['ash', 'Brother Ash', 'Dwarf Cleric 3 · Ripperdoc', 'AC 17 · HP 27 · WIS 16 · Spell Save DC 13', 'A street medic protecting patients whose debt makes them valuable to the Vanguard.'],
    ['kestrel', 'Kestrel', 'Half-Orc Rogue 3 · Fixer', 'AC 15 · HP 24 · DEX 16 · Sneak Attack 2d6', 'A broker with one last favour owed by every faction in The Roots.'],
    ['ilyra', 'Ilyra Moss', 'Wood Elf Ranger 3 · Bleed Scavenger', 'AC 15 · HP 25 · DEX 16 · Favored Terrain: The Bleed', 'She found a route through the storm that should not exist, and something followed her home.'],
    ['jun', 'Jun Vale', 'Human Monk 3 · Faraday Order', 'AC 15 · HP 24 · DEX 16 · Ki 3', 'His Order sent him to silence a rogue signal that is scrambling corporate magic.']
  ] },
  { title: 'Example One-Shot Run', content: 'The Silence Between Contracts · a 3–4 hour mission for level-3 characters.', list: [
    '**Hook:** Glitch hires the crew to retrieve a soul-share ledger before the Infernal Syndicate purges it.',
    '**Scene 1 — The Roots (45 minutes):** Read aloud: static spills from Glitch’s bunker as the ledger’s last known signal burns across a projector. A DC 13 Persuasion, Deception, or 15 gp bribe gets the crew past Deep Network lookouts; failure starts a chase, not a fight.',
    '**Scene 2 — The Ethereal (60 minutes):** Oil of Etherealness opens the route. In the floating contract archive, a DC 13 Arcana or Investigation check finds the ledger; two Gloom Stalkers can be evaded with DC 13 Stealth, fooled with a forged corporate order, or fought.',
    '**Scene 3 — Neon-Hell (45 minutes):** Valerius blocks the exit with two Hex Blades. He wants the ledger intact; a DC 14 Persuasion check, evidence of his own debt, or surrendering a false copy can end the scene without combat.',
    '**Rewards and finale:** The ledger is worth 75 gp to Echo-9, or earns The Disconnect’s protection. Giving it to Glitch exposes a Patron theft ring; selling it makes the Deep Network an ally; erasing it earns Valerius’s permanent attention.'
  ] }
]
const thaiNpcs = [
  { title: '"Glitch" — Soulhacker Fixer', art: 'glitch', content: 'ผู้ติดต่อสุดเพี้ยนของ Deep Network ที่ทำงานจากบังเกอร์สัญญาณขาดหายใน The Roots ขาย Projector เถื่อนและ gold comm-stone' },
  { title: 'Exec-Commander Valerius — Infernal Syndicate', art: 'valerius', content: 'ผู้บังคับบัญชา Hex Blade ผู้โหดเหี้ยม มีหน้าที่ไล่ล่าสมาชิก The Disconnect' },
  { title: 'Mother Willow — Archfey Conglomerate', art: 'willow', content: 'ซีอีโอผู้เย้ายวนของบริษัทยาสาขาใหญ่ที่สุด ซ่อนร่าง Fey ที่น่าสะพรึงไว้ใต้มนตร์ภาพลวงตา' },
  { title: 'Brother Kael — Ripperdoc', art: 'kael', content: 'Cleric แห่ง Lathander ผู้ดูแลคลินิกใต้ดิน รักษา Null-Punk ด้วยเวทศักดิ์สิทธิ์ไร้ร่องรอย แลกกับ GP เท่านั้น' },
  { title: 'Aurelia Voss — Celestial Vanguard', art: 'voss', content: 'ผู้ตรวจสอบหนี้ผู้พิถีพิถัน ที่เปลี่ยนสมุดบัญชีหุ้นวิญญาณให้เป็นอาวุธ หรือลบหนี้ให้ในราคาที่เหมาะสม' },
  { title: 'Echo-9 — Deep Network Broker', art: 'echo9', content: 'นายหน้าข้อมูลสวมหน้ากาก ผู้ค้าความลับ ความทรงจำที่ขโมยมา และชื่อจริงที่ซ่อนอยู่ในสัญญาองค์กร' },
  { title: 'Mara Flint — No-Coin Smuggler', art: 'mara', content: 'นักเก็บกู้แห่ง The Bleed ผู้ลักลอบพาคนและของเถื่อนผ่านจุดบอดของโดมโดยไม่แตะต้อง SoulCoin' }
]

function App() {
  const [lang, setLang] = useState('th')
  const [activeIdx, setActiveIdx] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const sectionRefs = useRef([])

  const content = data[lang]
  const sections = [...content.sections.slice(0, 6), ...extraSections]
  const subsections = (section, idx) => {
    if (lang === 'th' && idx === 4) return thaiNpcs
    if (lang === 'th' && idx === 1) return section.subsections.map((sub, i) => ({ ...sub, title: ['Corporate Drone', 'Ethereal Soulhacker', 'Bleed Scavenger'][i] }))
    return section.subsections
  }

  const scrollTo = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveIdx(idx)
    setNavOpen(false)
  }

  useEffect(() => {
    document.documentElement.lang = lang
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target)
            if (idx !== -1) setActiveIdx(idx)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [content])

  return (
    <div className={`layout ${lang === 'th' ? 'lang-th' : ''}`}>
      <a className="skip-link" href="#guide-content">Skip to guide</a>
      {/* Sidebar */}
      <nav id="guide-navigation" className={`sidebar ${navOpen ? 'open' : ''}`} aria-label="Campaign guide sections">
        <div className="sidebar-brand">
          <span className="brand-name">SOULPUNK</span>
          <span className="brand-year">1577</span>
          <span className="brand-edition">Eden field guide</span>
        </div>
        <ul className="nav-list">
          {sections.map((sec, i) => (
            <li key={i}>
              <button
                className={`nav-item ${activeIdx === i ? 'active' : ''}`}
                onClick={() => scrollTo(i)}
              >
                <span className="nav-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="nav-label">{sec.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          className="lang-toggle"
          onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
          aria-label={lang === 'en' ? 'Switch to Thai' : 'Switch to English'}
        >
          {lang === 'en' ? 'ภาษาไทย' : 'English'}
        </button>
      </nav>

      {/* Mobile header */}
      <header className="mobile-header">
        <button
          className="hamburger"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
          aria-expanded={navOpen}
          aria-controls="guide-navigation"
        >
          <span /><span /><span />
        </button>
        <span className="mobile-title">SOULPUNK <em>1577</em></span>
        <button
          className="lang-toggle-mobile"
          onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
          aria-label={lang === 'en' ? 'Switch to Thai' : 'Switch to English'}
        >
          {lang === 'en' ? 'TH' : 'EN'}
        </button>
      </header>

      {navOpen && <div className="nav-overlay" onClick={() => setNavOpen(false)} />}

      {/* Main content */}
      <main className="content" id="guide-content">
        {/* Hero */}
        <div className="hero">
          <p className="hero-era">THE CITY OF EDEN · 1577 DR</p>
          <h1 className="hero-title">{content.title}</h1>
          <p className="hero-intro">{content.intro}</p>
          <img
            className="hero-art"
            src={edenHero}
            alt={lang === 'en' ? 'Eden, a magical city enclosed beneath a vast dome' : 'นครเอเดนใต้โดมเวทมนตร์ขนาดมหึมา'}
          />
        </div>

        {/* Sections */}
        {sections.map((section, idx) => (
          <section
            key={idx}
            className="playbook-section"
            ref={(el) => (sectionRefs.current[idx] = el)}
          >
            <div className="section-header">
              <span className="section-number">{String(idx + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
            </div>

            {section.content && <p className="section-lead">{section.content}</p>}

            {section.cards && idx !== 6 && <div className="dossier-list">
              {section.cards.map(([image, name, role, sheet, background]) => (
                <article className="dossier-card" key={name}>
                  <img src={art[image]} alt={name} />
                  <div><h3>{name}</h3><p className="dossier-role">{role}</p><p className="dossier-sheet">{sheet}</p><p>{background}</p></div>
                </article>
              ))}
            </div>}
            {idx === 6 && <div className="sheet-list">{characterSheets.map(([image, name, klass, background, abilities, combat, saves, skills, attacks, features, equipment, story]) => (
              <article className="character-sheet" key={name}><img src={art[image]} alt={name} /><div><h3>{name}</h3><p className="dossier-role">{klass} · {background}</p><p><strong>Abilities:</strong> {abilities}</p><p><strong>Combat:</strong> {combat}</p><p><strong>Saving Throws:</strong> {saves}</p><p><strong>Skills:</strong> {skills}</p><p><strong>Attacks:</strong> {attacks}</p><p><strong>Features:</strong> {features}</p><p><strong>Equipment:</strong> {equipment}</p><p><strong>Character:</strong> {story}</p></div></article>
            ))}</div>}

            {idx === 0 && (
              <figure className="setting-art">
                <img
                  src={soulcoinContract}
                  alt={lang === 'en' ? 'A SoulCoin beside a torn soul contract' : 'เหรียญ SoulCoin ข้างสัญญาขายวิญญาณที่ฉีกขาด'}
                />
                <figcaption>{lang === 'en' ? 'A SoulCoin is a contract made spendable.' : 'SoulCoin คือสัญญาที่ถูกทำให้ใช้จ่ายได้'}</figcaption>
              </figure>
            )}

            {section.list && !(lang === 'th' && idx === 4) && (
              <ul className="entry-list">
                {section.list.map((item, i) => (
                  <li key={i}>
                    <ReactMarkdown>{item}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}

            {subsections(section, idx)?.map((sub, sidx) => (
              <div key={sidx} className={`subsection ${idx === 4 ? 'npc-card' : ''}`}>
                <h3>{sub.title}</h3>
                {sub.content && <p>{sub.content}</p>}
                {idx === 4 && <p className="npc-facts"><strong>Faction:</strong> {npcDetails[sub.art][0]} &nbsp; <strong>Race:</strong> {npcDetails[sub.art][2]} &nbsp; <strong>Age:</strong> {npcDetails[sub.art][1]}</p>}
                {sub.art && (
                  <figure className="setting-art location-art">
                    <img src={art[sub.art]} alt={sub.title} />
                  </figure>
                )}
                {sub.art === 'ethereal' && lang === 'th' && <p><strong>Oil of Etherealness (Uncommon):</strong> ใช้เข้าและออกจาก The Ethereal ได้</p>}
                {sub.list && (
                  <ul className="entry-list">
                    {sub.list.map((item, i) => (
                      <li key={i}>
                        <ReactMarkdown>{item}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}

        <footer>
          <p>Soulpunk 1577 · D&amp;D 5e (2014) Campaign Setting</p>
        </footer>
      </main>
    </div>
  )
}

export default App
