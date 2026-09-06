import { useState } from 'react'
import { Plus, ArrowUp, EyeOff, Loader2, Info } from 'lucide-react'
import { CATEGORIES } from '../data.js'

export default function CitizenHome({ userName, onSubmitComplaint, isAnalyzing }) {
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  const handleSubmit = () => {
    if (!text.trim() || isAnalyzing) return
    onSubmitComplaint(text.trim(), anonymous)
  }

  const handleCategoryClick = (label) => {
    setText((t) => (t ? t : `I have an issue related to ${label.toLowerCase()} in my area.`))
  }

  return (
    <div className="page">
      <p className="page-eyebrow">Welcome back</p>
      <h2 className="page-heading">{userName ? `Welcome back, ${userName}` : 'Welcome back'}</h2>

      <div className="disclaimer-banner">
        <Info size={16} strokeWidth={1.8} />
        <p>
          Kya Karu? guides you to existing official complaint channels. It does not
          replace government or institutional authorities.
        </p>
      </div>

      <div className="complaint-bar">
        <textarea
          className="complaint-input"
          placeholder="What's your complaint?"
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="complaint-bar-actions">
          <button className="icon-button" title="Add attachment or extra detail">
            <Plus size={18} strokeWidth={2} />
          </button>
          <button
            className="icon-button icon-button--primary"
            title={isAnalyzing ? 'Analyzing complaint…' : 'Submit complaint'}
            onClick={handleSubmit}
            disabled={!text.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 size={18} strokeWidth={2} className="spin" />
            ) : (
              <ArrowUp size={18} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      <label className="anon-toggle">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
        />
        <EyeOff size={15} strokeWidth={1.8} />
        <span>Report Anonymously</span>
      </label>

      <section className="section">
        <h3 className="section-heading">Common Issues</h3>
        <div className="category-grid">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            return (
              <button
                key={c.id}
                className="category-card"
                onClick={() => handleCategoryClick(c.label)}
              >
                <Icon size={20} strokeWidth={1.7} />
                <span>{c.label}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
