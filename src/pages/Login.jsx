import { useState } from 'react'
import { UserRound, ShieldCheck, ArrowRight } from 'lucide-react'

const ROLES = [
  {
    id: 'citizen',
    title: 'Citizen',
    description: 'Report and track complaints',
    icon: UserRound,
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'View complaints and identify emerging civic issues',
    icon: ShieldCheck,
  },
]

export default function Login({ onComplete }) {
  const [role, setRole] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    area: '',
  })

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const canContinue = form.name.trim() && form.email.trim()

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="auth-eyebrow">All Problems, One Portal</p>
        <h1 className="auth-heading">KYA KARU?</h1>
        <p className="auth-description">An intelligent grievance navigation portal</p>

        {!role && (
          <div className="role-grid">
            {ROLES.map((r) => {
              const Icon = r.icon
              return (
                <button key={r.id} className="role-card" onClick={() => setRole(r.id)}>
                  <span className="role-icon">
                    <Icon size={22} strokeWidth={1.6} />
                  </span>
                  <span className="role-title">{r.title}</span>
                  <span className="role-description">{r.description}</span>
                </button>
              )
            })}
          </div>
        )}

        {role && (
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              if (canContinue) onComplete(role, form)
            }}
          >
            <p className="auth-form-role">
              Continuing as <strong>{role === 'citizen' ? 'Citizen' : 'Administrator'}</strong>
              <button
                type="button"
                className="link-button"
                onClick={() => setRole(null)}
              >
                Change
              </button>
            </p>

            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                placeholder="e.g. Arjun Kumar"
                value={form.name}
                onChange={update('name')}
                required
              />
            </label>

            <label className="field">
              <span>Email ID</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                required
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Gender</span>
                <select value={form.gender} onChange={update('gender')}>
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="undisclosed">Prefer not to say</option>
                </select>
              </label>

              <label className="field">
                <span>Area of residence</span>
                <input
                  type="text"
                  placeholder="e.g. Katpadi, Vellore"
                  value={form.area}
                  onChange={update('area')}
                />
              </label>
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={!canContinue}>
              Continue
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
