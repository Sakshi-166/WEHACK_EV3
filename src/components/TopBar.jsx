import { Sun, Moon } from 'lucide-react'

export default function TopBar({ eyebrow, title, theme, onToggleTheme }) {
  return (
    <header className="topbar">
      <div>
        {eyebrow && <p className="topbar-eyebrow">{eyebrow}</p>}
        <h1 className="topbar-title">{title}</h1>
      </div>
      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="Toggle light and dark mode"
      >
        <span className={theme === 'light' ? 'theme-toggle-active' : ''}>
          <Sun size={15} strokeWidth={1.8} />
        </span>
        <span className={theme === 'dark' ? 'theme-toggle-active' : ''}>
          <Moon size={15} strokeWidth={1.8} />
        </span>
      </button>
    </header>
  )
}
