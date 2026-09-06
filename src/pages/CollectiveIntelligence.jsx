import { TrendingUp, MapPin } from 'lucide-react'
import { EMERGING_ISSUES } from '../data.js'

export default function CollectiveIntelligence() {
  return (
    <div className="page">
      <p className="page-eyebrow">Collective Intelligence</p>
      <h2 className="page-heading">Emerging Civic Issues</h2>
      <p className="page-subtext">
        Kya Karu doesn't only route individual complaints — it looks across all citizen
        reports to surface patterns authorities should act on before they escalate.
      </p>

      <div className="issue-grid">
        {EMERGING_ISSUES.map((issue) => (
          <article key={issue.id} className="issue-card">
            <div className="issue-header">
              <h3>{issue.title}</h3>
              <span
                className={
                  'status-pill ' +
                  (issue.status === 'Increasing' ? 'status-pill--alert' : 'status-pill--review')
                }
              >
                <TrendingUp size={13} strokeWidth={2} />
                {issue.status}
              </span>
            </div>

            <p className="issue-count">
              {issue.count} complaints reported in this area in the {issue.window}
            </p>

            <p className="issue-location">
              <MapPin size={14} strokeWidth={1.8} />
              {issue.location}
            </p>

            <p className="issue-explanation">{issue.explanation}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
