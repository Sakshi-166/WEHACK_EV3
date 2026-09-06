export default function Settings({ theme, onToggleTheme }) {
  return (
    <div className="page page--narrow">
      <p className="page-eyebrow">Preferences</p>
      <h2 className="page-heading">Settings</h2>

      <div className="detail-card">
        <div className="detail-row">
          <span>Appearance</span>
          <button className="btn btn--ghost btn--sm" onClick={onToggleTheme}>
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
          </button>
        </div>
        <div className="detail-row">
          <span>Notifications</span>
          <span>Email updates on status change — On</span>
        </div>
        <div className="detail-row">
          <span>Language</span>
          <span>English (auto-detects Hindi / Tamil in complaints)</span>
        </div>
      </div>
    </div>
  )
}
