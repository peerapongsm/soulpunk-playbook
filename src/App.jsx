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
import './App.css'

const art = { eden: edenLocation, bleed: bleedLocation, ethereal: etherealLocation, glitch, valerius, willow, kael, voss, echo9, mara }
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
  const sections = content.sections.slice(0, 6)
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
              <div key={sidx} className="subsection">
                <h3>{sub.title}</h3>
                {sub.content && <p>{sub.content}</p>}
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
