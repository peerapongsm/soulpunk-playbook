import { useState, useRef, useEffect } from 'react'
import { data } from './data'
import ReactMarkdown from 'react-markdown'
import edenHero from './assets/eden-hero.png'
import soulcoinContract from './assets/soulcoin-contract.png'
import './App.css'

const SECTION_ICONS = {
  0: '📖',
  1: '⚔️',
  2: '🏛️',
  3: '🗺️',
  4: '👤',
  5: '☠️',
  6: '🔮',
}

function App() {
  const [lang, setLang] = useState('th')
  const [activeIdx, setActiveIdx] = useState(0)
  const [navOpen, setNavOpen] = useState(false)
  const sectionRefs = useRef([])

  const content = data[lang]

  const scrollTo = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveIdx(idx)
    setNavOpen(false)
  }

  useEffect(() => {
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
          <span className="brand-year">1577</span>
          <span className="brand-name">SOULPUNK</span>
        </div>
        <ul className="nav-list">
          {content.sections.map((sec, i) => (
            <li key={i}>
              <button
                className={`nav-item ${activeIdx === i ? 'active' : ''}`}
                onClick={() => scrollTo(i)}
              >
                <span className="nav-icon">{SECTION_ICONS[i] || '◆'}</span>
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
          {lang === 'en' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}
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
          {lang === 'en' ? '🇹🇭' : '🇬🇧'}
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
        {content.sections.map((section, idx) => (
          <section
            key={idx}
            className="playbook-section"
            ref={(el) => (sectionRefs.current[idx] = el)}
          >
            <div className="section-header">
              <span className="section-icon">{SECTION_ICONS[idx] || '◆'}</span>
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

            {section.list && (
              <ul className="entry-list">
                {section.list.map((item, i) => (
                  <li key={i}>
                    <ReactMarkdown>{item}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}

            {section.subsections && section.subsections.map((sub, sidx) => (
              <div key={sidx} className="subsection">
                <h3>{sub.title}</h3>
                {sub.content && <p>{sub.content}</p>}
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
