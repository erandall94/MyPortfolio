import { useEffect, useState } from 'react'
import { projects } from './data/projects'

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const navItems = ['work', 'play', 'info']
const name = 'Emma Randall'
const roles = ['websites', 'chaos', 'pixels dance', 'bugs (on purpose)', 'things on the internet']
const tickerItems = [
  'certified website',
  'click anywhere',
  '100% organic pixels',
  'do not perceive me',
  'this is fine',
  'hire me (please)',
  'now with more buttons',
]
const emojis = ['✨', '🔥', '💥', '🌀', '🎉', '👾', '🍕', '🦄', '⚡', '🫠', '🌈', '💿']

const pick = (list) => list[Math.floor(Math.random() * list.length)]

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function spawn(className, x, y, vars = {}) {
  const el = document.createElement('span')
  el.className = className
  el.textContent = pick(emojis)
  el.setAttribute('aria-hidden', 'true')
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  for (const [key, value] of Object.entries(vars)) el.style.setProperty(key, value)
  el.addEventListener('animationend', () => el.remove())
  document.body.appendChild(el)
}

function burst(x, y, count = 12) {
  if (prefersReducedMotion()) return
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const distance = 60 + Math.random() * 120
    spawn('spark', x, y, {
      '--dx': `${Math.cos(angle) * distance}px`,
      '--dy': `${Math.sin(angle) * distance}px`,
      '--rot': `${Math.random() * 720 - 360}deg`,
    })
  }
}

function Floaters() {
  const [floaters] = useState(() =>
    Array.from({ length: 16 }, (_, id) => {
      const duration = 14 + Math.random() * 16
      return {
        id,
        emoji: pick(emojis),
        style: {
          '--x': `${Math.random() * 100}%`,
          '--size': `${1.5 + Math.random() * 2.5}rem`,
          '--dur': `${duration}s`,
          '--delay': `${-Math.random() * duration}s`,
        },
      }
    }),
  )

  return (
    <div className="floaters" aria-hidden="true">
      {floaters.map((f) => (
        <span key={f.id} className="floater" style={f.style}>
          {f.emoji}
        </span>
      ))}
    </div>
  )
}

function Ticker() {
  const items = [...tickerItems, ...tickerItems]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="ticker-item">
            {item} ★
          </span>
        ))}
      </div>
    </div>
  )
}

function DodgeButton() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)
  const [won, setWon] = useState(false)
  const tired = dodges >= 6

  const dodge = () => {
    if (tired) return
    setPos({ x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 140 })
    setDodges((d) => d + 1)
  }

  return (
    <div className="dodge-zone">
      <button
        className="btn dodge"
        style={{ translate: `${pos.x}px ${pos.y}px` }}
        onPointerEnter={dodge}
        onClick={(e) => {
          setWon(true)
          burst(e.clientX, e.clientY, 24)
        }}
      >
        {tired ? 'fine. click me.' : 'click for $1,000,000'}
      </button>
      {won && <p className="won">you won: nothing. congrats 🎉</p>}
    </div>
  )
}

function App() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [chaos, setChaos] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 1400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let last = 0
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
      const now = performance.now()
      if (now - last < 50) return
      last = now
      spawn('trail', e.clientX, e.clientY)
    }
    const onDown = (e) => {
      setClicks((c) => c + 1)
      if (!e.target.closest('button')) burst(e.clientX, e.clientY)
    }
    const onVisibility = () => {
      document.title = document.hidden ? 'come back 🥺' : 'Emma Randall'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const toggleChaos = (e) => {
    setChaos((c) => !c)
    burst(e.clientX, e.clientY, 30)
  }

  return (
    <div className={`page${chaos ? ' chaos' : ''}`}>
      <Floaters />

      <nav className="nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item}>
              <a className="nav-link" href={`#${item}`}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="hero">
        <h1 className="name" aria-label={name}>
          {name.split(' ').map((word, w) => (
            <span key={w} className="word" aria-hidden="true">
              {[...word].map((letter, i) => (
                <span key={i} className="letter" style={{ '--i': w * 5 + i }}>
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className="tagline">
          i make <span className="role">{roles[roleIndex]}</span>
        </p>
        <button className="btn chaos-btn" onClick={toggleChaos}>
          {chaos ? 'ok make it stop' : 'do not press'}
        </button>
      </header>

      <Ticker />

      <section id="work" className="section">
        <h2 className="section-title">work</h2>
        <div className="cards">
          {projects.map((project) => (
            <article key={project.title} className="card" style={{ '--tilt': project.tilt }}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="tags">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a className="card-link" href={project.link}>
                see it →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="play" className="section">
        <h2 className="section-title">play</h2>
        <DodgeButton />
        <p className="counter">
          times you&apos;ve clicked the void: <strong>{clicks}</strong>
        </p>
      </section>

      <section id="info" className="section">
        <h2 className="section-title">info</h2>
        <div className="card info-card" style={{ '--tilt': '1deg' }}>
          <p>
            Hi, I&apos;m Emma. Write a couple of sentences here about who you are, what you do,
            and what kind of work you want more of.
          </p>
          <ul className="links">
            <li>
              <a href="mailto:your@email.com">email</a>
            </li>
            <li>
              <a href="https://github.com/erandall94">github</a>
            </li>
            <li>
              <a href="#">linkedin</a>
            </li>
          </ul>
        </div>
      </section>

      <a className="badge" href="#info" aria-label="Hire me">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <text>
            <textPath href="#badge-circle">hire me • hire me • hire me •</textPath>
          </text>
        </svg>
        <span className="badge-emoji" aria-hidden="true">
          👋
        </span>
      </a>

      <footer className="footer">{today}</footer>
    </div>
  )
}

export default App
