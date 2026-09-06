import { ClipboardList, Clock, Activity, CheckCircle2 } from 'lucide-react'
import { ADMIN_STATS, DOMAIN_BREAKDOWN } from '../data.js'

const STAT_CARDS = [
  { key: 'total', label: 'Total Complaints', icon: ClipboardList, tone: 'primary' },
  { key: 'pending', label: 'Pending', icon: Clock, tone: 'warning' },
  { key: 'inProgress', label: 'In Progress', icon: Activity, tone: 'info' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, tone: 'success' },
]

export default function AdminDashboard() {
  const maxValue = Math.max(...DOMAIN_BREAKDOWN.map((d) => d.value))

  return (
    <div className="page">
      <p className="page-eyebrow">Overview of Complaints and Civic Issues</p>
      <h2 className="page-heading">Administrator Dashboard</h2>

      <div className="stat-grid">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.key} className={`stat-card stat-card--${card.tone}`}>
              <span className="stat-icon">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <p className="stat-value">{ADMIN_STATS[card.key]}</p>
              <p className="stat-label">{card.label}</p>
            </div>
          )
        })}
      </div>

      <section className="chart-card">
        <h3 className="section-heading">Complaints by Domain</h3>
        <div className="bar-chart">
          {DOMAIN_BREAKDOWN.map((d) => (
            <div key={d.label} className="bar-row">
              <span className="bar-label">{d.label}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(d.value / maxValue) * 100}%` }}
                />
              </div>
              <span className="bar-value">{d.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
