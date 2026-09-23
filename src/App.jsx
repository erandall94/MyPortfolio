const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const navItems = ['work', 'play', 'info']

function App() {
  return (
    <div className="page">
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
      <main className="landing">
        <h1 className="name">Emma Randall</h1>
      </main>
      <footer className="footer">{today}</footer>
    </div>
  )
}

export default App
