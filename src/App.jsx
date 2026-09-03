import { useState } from 'react'
import { data } from './data'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [lang, setLang] = useState('th')

  const toggleLang = () => {
    setLang(lang === 'en' ? 'th' : 'en')
  }

  const content = data[lang]

  return (
    <div className={`app-container ${lang === 'th' ? 'lang-th' : ''}`}>
      <header>
        <h1>{content.title}</h1>
        <button className="lang-toggle" onClick={toggleLang}>
          {lang === 'en' ? '🇹🇭 ภาษาไทย' : '🇬🇧 English'}
        </button>
      </header>

      <main>
        <p className="intro">{content.intro}</p>

        {content.sections.map((section, idx) => (
          <section key={idx} className="playbook-section">
            <h2>{section.title}</h2>
            {section.content && <p>{section.content}</p>}
            
            {section.list && (
              <ul>
                {section.list.map((item, i) => (
                  <li key={i}><ReactMarkdown>{item}</ReactMarkdown></li>
                ))}
              </ul>
            )}

            {section.subsections && section.subsections.map((sub, sidx) => (
              <div key={sidx} className="subsection">
                <h3>{sub.title}</h3>
                {sub.content && <p>{sub.content}</p>}
                {sub.list && (
                  <ul>
                    {sub.list.map((item, i) => (
                      <li key={i}><ReactMarkdown>{item}</ReactMarkdown></li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </main>
      
      <footer>
        <p>Soulpunk 1577 Campaign Guide</p>
      </footer>
    </div>
  )
}

export default App
