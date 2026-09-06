import { LifeBuoy } from 'lucide-react'

const STAGES = ['Submitted', 'Under Review', 'Action in Progress', 'Resolved']

export default function ComplaintStatus({ record, onAdvance }) {
  const stageIndex = STAGES.indexOf(record.status)
  const isDone = stageIndex === STAGES.length - 1

  return (
    <div className="page page--narrow">
      <p className="page-eyebrow">Complaint Status</p>
      <h2 className="page-heading">Complaint ID: {record.id}</h2>
      <p className="status-current">
        Status: <strong>{record.status}</strong>
      </p>

      <div className="stepper">
        {STAGES.map((stage, i) => (
          <div key={stage} className="stepper-item">
            <span
              className={
                'stepper-dot' +
                (i < stageIndex ? ' stepper-dot--done' : '') +
                (i === stageIndex ? ' stepper-dot--current' : '')
              }
            >
              {i + 1}
            </span>
            <span className="stepper-label">{stage}</span>
            {i < STAGES.length - 1 && (
              <span className={'stepper-line' + (i < stageIndex ? ' stepper-line--done' : '')} />
            )}
          </div>
        ))}
      </div>

      <button className="btn btn--ghost btn--sm" onClick={onAdvance} disabled={isDone}>
        {isDone ? 'Resolved' : 'Simulate next update (demo)'}
      </button>

      <section className="detail-card">
        <h3 className="section-heading">Complaint Details</h3>
        <div className="detail-row">
          <span>Complaint</span>
          <span>{record.text}</span>
        </div>
        <div className="detail-row">
          <span>Domain</span>
          <span>{record.domain}</span>
        </div>
        <div className="detail-row">
          <span>Location</span>
          <span>{record.location}</span>
        </div>
        <div className="detail-row">
          <span>Authority</span>
          <span>{record.authority}</span>
        </div>
        <div className="detail-row">
          <span>Date Submitted</span>
          <span>{record.dateSubmitted}</span>
        </div>
      </section>

      <section className="help-card">
        <LifeBuoy size={18} strokeWidth={1.8} />
        <div>
          <p className="help-title">Need Help?</p>
          <p className="help-text">
            If your issue is urgent or hasn't been addressed, contact civic support at{' '}
            <strong>1800-123-4567</strong> or email <strong>support@kyakaru.gov.in</strong>.
          </p>
        </div>
      </section>
    </div>
  )
}
