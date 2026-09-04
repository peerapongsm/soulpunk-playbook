import { useState, useRef, useEffect } from 'react'
import { data } from './data'
import ReactMarkdown from 'react-markdown'
import edenHero from './assets/eden-hero.png'
import soulcoinContract from './assets/soulcoin-contract.png'
import edenLocation from './assets/eden-location.png'
import bleedLocation from './assets/bleed-location.png'
import etherealLocation from './assets/ethereal-location.png'
import glitch from './assets/npc-glitch.png'
import valerius from './assets/npc-valerius.png'
import willow from './assets/npc-willow.png'
import kael from './assets/npc-kael.png'
import voss from './assets/npc-voss.png'
import echo9 from './assets/npc-echo9.png'
import mara from './assets/npc-mara.png'
import aster from './assets/preg-aster.png'
import nyx from './assets/preg-nyx.png'
import sable from './assets/preg-sable.png'
import ash from './assets/preg-ash.png'
import kestrel from './assets/preg-kestrel.png'
import ilyra from './assets/preg-ilyra.png'
import jun from './assets/preg-jun.png'
import './App.css'

const art = { eden: edenLocation, bleed: bleedLocation, ethereal: etherealLocation, glitch, valerius, willow, kael, voss, echo9, mara, aster, nyx, sable, ash, kestrel, ilyra, jun }
const npcDetails = { glitch: ['Deep Network', '29'], valerius: ['Infernal Syndicate', '46'], willow: ['Archfey Conglomerate', 'Unknown'], kael: ['The Disconnect', '58'], voss: ['Celestial Vanguard', '34'], echo9: ['Deep Network', 'Unknown'], mara: ['No-Coin', '27'] }
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
    '**Scene 1 — The Roots:** Bargain with Kestrel or evade Deep Network lookouts to learn the ledger is moving through the Ethereal.',
    '**Scene 2 — The Ethereal:** Use Oil of Etherealness, bypass Gloom Stalkers, and find the ledger inside a floating contract archive.',
    '**Scene 3 — Neon-Hell:** Escape with the evidence as Valerius and his Hex Blades close in.',
    '**Outcome:** Give the ledger to The Disconnect, sell it to Echo-9, or erase it—each choice creates an ally and an enemy.'
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
  const subsections = (section, idx) => lang === 'th' && idx === 4 ? thaiNpcs : section.subsections

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

            {section.cards && <div className="dossier-list">
              {section.cards.map(([image, name, role, sheet, background]) => (
                <article className="dossier-card" key={name}>
                  <img src={art[image]} alt={name} />
                  <div><h3>{name}</h3><p className="dossier-role">{role}</p><p className="dossier-sheet">{sheet}</p><p>{background}</p></div>
                </article>
              ))}
            </div>}

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
                {idx === 4 && <p className="npc-facts"><strong>Faction:</strong> {npcDetails[sub.art][0]} &nbsp; <strong>Age:</strong> {npcDetails[sub.art][1]}</p>}
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
