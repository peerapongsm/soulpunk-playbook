import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { groups, sections, maps, getHandout } from './data'
import { characters, abilities, abilityMod, signed, proficiency, skillBonus, attackBonus, spellDC } from './characters'
import { contracts } from './rules'
import './App.css'

const assets = import.meta.glob(['./assets/preg-*.png', './assets/npc-*-v2.png', './assets/eden-hero.png', './assets/eden-location.png'], { eager: true, query: '?url', import: 'default' })
const art = name => assets['./assets/' + name + '.png']
const text = (lang, en, th) => lang === 'en' ? en : th
const markdownComponents = { h2: props => <h3 {...props} />, h3: props => <h4 {...props} /> }
const Markdown = ({ children }) => <div className="prose"><ReactMarkdown components={markdownComponents}>{children}</ReactMarkdown></div>

function FieldMap({ mapKey, lang, dm, publicOnly = false }) {
  const [playerMap, setPlayerMap] = useState(false)
  const map = maps[mapKey]
  const secrets = dm && !playerMap && !publicOnly
  const nodes = map.nodes.filter(n => !n.dm || secrets)
  const edges = map.edges.filter(e => !e.dm || secrets)
  const prefix = (publicOnly ? 'handout-' : '') + mapKey
  return <figure className="field-map">
    <figcaption><strong>{map.title[lang]}</strong><span>{text(lang, 'Schematic, not to scale. Select a node for its key.', 'แผนผังไม่ตามมาตราส่วน เลือกจุดเพื่ออ่านกุญแจ')}</span>
      {dm && !publicOnly && <label className="screen-only"><input type="checkbox" checked={playerMap} onChange={e => setPlayerMap(e.target.checked)} /> {text(lang, 'Player map (hide secret routes)', 'แผนที่ผู้เล่น (ซ่อนทางลับ)')}</label>}
    </figcaption>
    <svg viewBox="0 0 600 325" aria-label={map.title[lang]} role="group"><title>{map.title[lang]}</title>
      {edges.map(e => {
        const a = map.nodes.find(n => n.id === e.from), b = map.nodes.find(n => n.id === e.to)
        return <g key={e.from + e.to} className={e.dm ? 'secret-route' : 'route'}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          {e.minutes && <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 9}>{e.minutes} {text(lang, 'min', 'นาที')}</text>}
        </g>
      })}
      {nodes.map(n => <a key={n.id} href={'#' + prefix + '-key-' + n.id} aria-label={n.id + ': ' + n.label[lang]}><circle cx={n.x} cy={n.y} r="24" /><text x={n.x} y={n.y + 6} textAnchor="middle" className="node-label">{n.id}</text></a>)}
    </svg>
    <ol className="map-key">{nodes.map(n => <li id={prefix + '-key-' + n.id} key={n.id} tabIndex="-1"><strong>{n.id}</strong> {n.label[lang]}</li>)}</ol>
    <p className="map-routes">{edges.map(e => e.from + ' ↔ ' + e.to + (e.minutes ? ' · ' + e.minutes + text(lang, ' min', ' นาที') : '') + (e.dm ? text(lang, ' (secret)', ' (ลับ)') : '')).join(' / ')}</p>
  </figure>
}

function CharacterSheet({ character: c, lang, printTarget, print }) {
  const label = (en, th) => text(lang, en, th)
  return <article id={'char-' + c.id} className={'character-sheet ' + (printTarget === 'char-' + c.id ? 'print-selected' : '')}>
    <img src={art('preg-' + c.id)} alt={c.name} loading="lazy" width="320" height="320" />
    <div className="character-body">
      <div className="section-actions"><h3>{c.name}</h3><button className="print-button screen-only" onClick={() => print('char-' + c.id)}>{label('Print sheet', 'พิมพ์ชีต')}</button></div>
      <p>{c.ancestry[lang]} · {c.klass} {c.level} · {c.subclass}</p><p className="muted">{c.role[lang]}</p>
      <dl className="combat-grid">{[[label('Armor class', 'เกราะ'), c.ac], ['HP', c.hp], [label('Speed', 'ความเร็ว'), c.speed + ' ft'], [label('Hit Dice', 'ลูกเต๋าพลังชีวิต'), c.level + 'd' + c.hitDie], [label('Initiative', 'ลำดับการเล่น'), signed(abilityMod(c, 'DEX'))], [label('Proficiency', 'ความชำนาญ'), signed(proficiency(c))]].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
      <p className="ability-line">{abilities.map((a, i) => <span key={a}>{a} <strong>{c.scores[i]}</strong> ({signed(abilityMod(c, a))})</span>)}</p>
      <p><strong>{label('Level 4 increase', 'เพิ่มตอนเลเวล 4')}:</strong> {c.asi} +2</p>
      <p><strong>{label('Saving throws', 'เซฟ')}:</strong> {abilities.map(a => a + ' ' + signed(abilityMod(c, a) + (c.saves.includes(a) ? proficiency(c) : 0))).join(' · ')}</p>
      <p><strong>{label('Proficient skills', 'ทักษะที่ชำนาญ')}:</strong> {Object.keys(c.skills).map(s => s + ' ' + signed(skillBonus(c, s))).join(' · ')}. {label('Other skills use the relevant ability modifier.', 'ทักษะอื่นใช้ตัวปรับความสามารถที่เกี่ยวข้อง')}</p>
      <p><strong>{label('Passive Perception', 'การรับรู้ติดตัว')}:</strong> {10 + skillBonus(c, 'Perception')}</p>
      <h4>{label('Attacks', 'การโจมตี')}</h4><ul>{c.attacks.map(a => <li key={a.name}><strong>{a.name}</strong> · {a.save ? a.save + ' DC ' + (8 + proficiency(c) + abilityMod(c, a.ability)) : signed(attackBonus(c, a))} · {a.dice}{!a.spell || a.addAbility ? signed(abilityMod(c, a.ability) + (a.extra || 0)) : ''} {a.type} · {a.range}</li>)}</ul>
      {c.casting && <div className="spell-list"><h4>{label('Spellcasting', 'การร่ายเวท')}</h4>
        <p>DC {spellDC(c)} · {label('Spell attack', 'โจมตีเวท')} {signed(proficiency(c) + abilityMod(c, c.casting.ability))} · {label('Slots by level', 'ช่องตามระดับ')}: {c.casting.slots.map((n, i) => (i + 1) + ': ' + n).join(' / ')}</p>
        <p>{c.casting.pact ? label('Pact slots return on a short or long rest.', 'ช่อง Pact ฟื้นเมื่อพักสั้นหรือยาว') : label('Slots return on a long rest.', 'ช่องเวทฟื้นเมื่อพักยาว')}</p>
        {[['cantrips', label('Cantrips', 'Cantrip')], ['prepared', label('Prepared', 'เตรียมแล้ว')], ['domain', label('Always prepared (domain)', 'เตรียมเสมอจาก Domain')], ['known', label('Known spells', 'เวทที่รู้')], ['book', label('Spellbook', 'สมุดเวท')], ['innate', label('Ancestry magic (no slot)', 'เวทเผ่าพันธุ์ ไม่ใช้ช่อง')]].map(([key, name]) => c.casting[key]?.length ? <p key={key}><strong>{name}:</strong> {c.casting[key].join(' · ')}</p> : null)}
      </div>}
      <h4>{label('Features & resources', 'ความสามารถและทรัพยากร')}</h4><p>{c.features[lang]}</p>
      <h4>{label('Equipment & proficiencies', 'อุปกรณ์และความชำนาญ')}</h4><p>{c.equipment[lang]}</p>
      <p><strong>{label('Starting money / soul', 'เงินและวิญญาณเริ่มต้น')}:</strong> 25 gp · {c.soulcoin || 0} SC · {c.pledge || 0}% {label('pledged', 'ที่ผูก')}</p>
      <h4>{label('Your neighborhood ties', 'สายสัมพันธ์ในชุมชน')}</h4><p>{c.story[lang]}</p>
      <h4>{label('A useful first turn', 'ตัวอย่างเทิร์นแรก')}</h4><p>{c.turn[lang]}</p>
      <p className="write-in">{label('HP now: ____  Hit Dice left: ____  Slots / Ki: ____  Conditions: ____', 'HP ปัจจุบัน: ____  Hit Dice เหลือ: ____  ช่องเวท / Ki: ____  สภาวะ: ____')}</p>
    </div>
  </article>
}

function App() {
  const [lang, setLang] = useState('th'), [dm, setDm] = useState(false), [navOpen, setNavOpen] = useState(false)
  const [active, setActive] = useState('start'), [requested, setRequested] = useState(window.location.hash.slice(1)), [printTarget, setPrintTarget] = useState(null)
  const navButton = useRef(null)
  const label = (en, th) => text(lang, en, th)
  const visible = groups.flatMap(g => sections.filter(s => s.group === g.id && (!s.dm || dm)))
  const needsDm = !dm && sections.some(s => s.dm && (requested === s.id || requested.startsWith(s.id + '-')))

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = text(lang, 'Soulpunk 1577 · Start in The Roots', 'Soulpunk 1577 · เริ่มต้นใน The Roots')
  }, [lang])
  useEffect(() => {
    const followHash = () => {
      const id = window.location.hash.slice(1)
      setRequested(id)
      const node = document.getElementById(id)
      if (node) { setActive(node.closest('.playbook-section')?.id || 'start'); node.scrollIntoView(); if (node.hasAttribute('tabindex')) node.focus({ preventScroll: true }) }
    }
    window.addEventListener('hashchange', followHash)
    const frame = requestAnimationFrame(followHash)
    return () => { window.removeEventListener('hashchange', followHash); cancelAnimationFrame(frame) }
  }, [dm])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id) }, { rootMargin: '-10% 0px -75% 0px' })
    document.querySelectorAll('.playbook-section').forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [dm])
  useEffect(() => {
    if (!printTarget) return
    const done = () => setPrintTarget(null)
    window.addEventListener('afterprint', done)
    const frame = requestAnimationFrame(() => window.print())
    return () => { window.removeEventListener('afterprint', done); cancelAnimationFrame(frame) }
  }, [printTarget])
  const toggleDm = () => {
    if (dm && sections.some(s => s.id === active && s.dm)) { window.history.replaceState(null, '', '#start'); setRequested('start'); setActive('start') }
    setDm(!dm)
  }
  const switchLanguage = () => { setLang(lang === 'en' ? 'th' : 'en'); requestAnimationFrame(() => document.getElementById(active)?.scrollIntoView()) }
  const closeNav = () => { setNavOpen(false); navButton.current?.focus() }
  return <div className={'layout lang-' + lang} data-print-target={printTarget || undefined}>
    <a className="skip-link" href="#guide-content">{label('Skip to guide', 'ข้ามไปคู่มือ')}</a>
    <header className="mobile-header"><button ref={navButton} aria-expanded={navOpen} aria-controls="guide-navigation" onClick={() => setNavOpen(!navOpen)}>{label('Menu', 'เมนู')}</button><span>SOULPUNK <em>1577</em></span><button onClick={switchLanguage} aria-label={label('Switch to Thai', 'เปลี่ยนเป็นภาษาอังกฤษ')}>{lang === 'en' ? 'TH' : 'EN'}</button></header>
    <nav id="guide-navigation" className={'sidebar ' + (navOpen ? 'open' : '')} aria-label={label('Campaign guide', 'คู่มือแคมเปญ')} onKeyDown={e => { if (e.key === 'Escape') closeNav() }}>
      <div className="sidebar-brand"><span className="brand-name">SOULPUNK</span><span className="brand-year">1577</span><span className="brand-edition">{label('An Eden field guide', 'คู่มือภาคสนาม Eden')}</span></div>
      <button className="close-nav" onClick={closeNav}>{label('Close menu', 'ปิดเมนู')}</button>
      {groups.map(g => <div className="nav-group" key={g.id}><p>{g.title[lang]}</p><ul className="nav-list">{visible.filter(s => s.group === g.id).map(s => <li key={s.id}><a href={'#' + s.id} className={'nav-item ' + (active === s.id ? 'active' : '')} aria-current={active === s.id ? 'location' : undefined} onClick={() => setNavOpen(false)}>{s.title[lang]}</a></li>)}</ul>{g.id === 'campaign' && !dm && <button className="dm-nav" onClick={() => { toggleDm(); setNavOpen(false) }}>{label('Show DM content', 'แสดงเนื้อหา DM')}</button>}</div>)}
      <button className="lang-toggle" onClick={switchLanguage}>{lang === 'en' ? 'ภาษาไทย' : 'English'}</button>
    </nav>
    {navOpen && <button tabIndex="-1" className="nav-overlay" aria-label={label('Close navigation', 'ปิดเมนูนำทาง')} onClick={closeNav} />}
    <main className="content" id="guide-content" tabIndex="-1">
      <div className="hero"><p className="hero-era">EDEN · 1577 DR</p><h1>{label('Start in The Roots', 'เริ่มต้นใน The Roots')}</h1><p className="hero-intro">{label('A neighborhood worth fighting for. Three connected adventures in a city that sells paradise one soul at a time.', 'ชุมชนที่ควรค่าแก่การปกป้อง สามการผจญภัยต่อเนื่อง ในนครที่ขายสรวงสวรรค์แลกวิญญาณทีละดวง')}</p><p className="campaign-meta">{label('4 players · Level 5 · D&D 2014 · 3 sessions', 'ผู้เล่น 4 คน · เลเวล 5 · D&D 2014 · 3 ตอน')}</p><img className="hero-art" src={art('eden-hero')} alt={label('Eden beneath its magical dome', 'Eden ใต้โดมเวทมนตร์')} /></div>
      <div className="reading-tools screen-only"><button onClick={toggleDm} aria-pressed={dm}>{dm ? label('Hide DM content', 'ซ่อนเนื้อหา DM') : label('Show DM content', 'แสดงเนื้อหา DM')}</button><button onClick={() => setPrintTarget('all')}>{label('Print current view', 'พิมพ์มุมมองปัจจุบัน')}</button><p>{dm ? label('DM view includes spoilers. This controls reading, not access security.', 'มุมมอง DM มีข้อมูลลับ ช่วยเลี่ยงสปอยล์ ไม่ใช่ระบบจำกัดสิทธิ์') : label('Player view · adventure secrets are hidden.', 'มุมมองผู้เล่น · ซ่อนความลับการผจญภัย')}</p></div>
      {needsDm && <p role="status" className="spoiler-notice">{label('That link leads to DM content. Choose “Show DM content” above to read it.', 'ลิงก์นั้นเป็นเนื้อหา DM เลือก “แสดงเนื้อหา DM” ด้านบนเพื่ออ่าน')}</p>}
      {visible.map(s => <section id={s.id} tabIndex="-1" key={s.id} className={'playbook-section ' + (s.kind === 'characters' ? 'characters-container ' : '') + (printTarget === s.id || (s.kind === 'characters' && printTarget?.startsWith('char-')) ? 'print-selected' : '')}>
        <div className="section-header"><p className="eyebrow">{groups.find(g => g.id === s.group).title[lang]}{s.dm ? ' · DM' : ''}</p><div className="section-actions"><h2>{s.title[lang]}</h2><a className="permalink screen-only" href={'#' + s.id} aria-label={label('Link to ', 'ลิงก์ไป ') + s.title[lang]}>#</a></div><div className="section-actions screen-only"><button className="print-button" onClick={() => setPrintTarget(s.id)}>{label('Print section', 'พิมพ์ส่วนนี้')}</button>{getHandout(s.body[lang]) && <button className="print-button" onClick={() => setPrintTarget(s.id + '-handout')}>{label('Print player handout', 'พิมพ์เอกสารผู้เล่น')}</button>}</div></div>
        {s.map && <FieldMap mapKey={s.map} lang={lang} dm={dm} />}
        {s.id === 'roots' && <img className="wide-art" src={art('eden-location')} alt={label('Eden’s layered districts', 'เขตซ้อนชั้นของ Eden')} loading="lazy" />}
        {s.id === 'people' && <div className="portrait-strip">{[['glitch', 'Glitch'], ['valerius', 'Valerius'], ['willow', 'Mother Willow'], ['kael', 'Kael'], ['voss', 'Voss'], ['echo9', 'Echo-9'], ['mara', 'Mara']].map(([key, name]) => <figure key={key}><img src={art('npc-' + key + '-v2')} alt={name} loading="lazy" width="160" height="160" /><figcaption>{name}</figcaption></figure>)}</div>}
        <Markdown>{s.body[lang]}</Markdown>
        {s.kind === 'contracts' && <div className="contract-list">{contracts.map(c => <article key={c.id} className="contract"><h3>{c.name[lang]}</h3><p>{c.pledge}% {label('pledged', 'ที่ผูก')} · {c.stipend} SC {label('paid once', 'จ่ายครั้งเดียว')}</p><p>{c.duty[lang]}</p><p>{label('Release', 'ปลดสัญญา')}: {c.release} SC {label('or service for', 'หรือทำงานครบ')} {c.weeks} {label('weeks', 'สัปดาห์')}</p><p className="write-in">{label('Signed: ____  Due: ____  Balance: ____  Witness: ____', 'เซ็น: ____  กำหนด: ____  คงค้าง: ____  พยาน: ____')}</p></article>)}</div>}
        {s.kind === 'characters' && <div className="sheet-list">{characters.map(c => <CharacterSheet key={c.id} character={c} lang={lang} printTarget={printTarget} print={setPrintTarget} />)}</div>}
      </section>)}
      {dm && sections.filter(s => getHandout(s.body[lang])).map(s => <article key={s.id} className={'handout-print ' + (printTarget === s.id + '-handout' ? 'print-selected' : '')}><h1>{label('Soulpunk · Player handout', 'Soulpunk · เอกสารผู้เล่น')}</h1><h2>{s.title[lang]}</h2><Markdown>{getHandout(s.body[lang])}</Markdown>{s.map && <FieldMap mapKey={s.map} lang={lang} dm={false} publicOnly />}</article>)}
      <footer>Soulpunk 1577 · D&amp;D 5e (2014)<br />{label('Homebrew starter · balance has not been table-playtested.', 'ชุดเริ่มต้นโฮมบรูว์ · สมดุลยังไม่ผ่านการเล่นทดสอบบนโต๊ะ')}</footer>
    </main>
  </div>
}
export default App
