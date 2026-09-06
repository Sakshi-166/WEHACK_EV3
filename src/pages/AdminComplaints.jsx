import { PREVIOUS_CONVERSATIONS } from '../data.js'

export default function AdminComplaints() {
  return (
    <div className="page">
      <p className="page-eyebrow">All Records</p>
      <h2 className="page-heading">Complaints</h2>

      <div className="table-card">
        <div className="table-row table-row--head">
          <span>Complaint</span>
          <span>Domain</span>
          <span>Location</span>
          <span>Status</span>
        </div>
        {PREVIOUS_CONVERSATIONS.map((c) => (
          <div key={c.id} className="table-row">
            <span>{c.title}</span>
            <span>{c.domain}</span>
            <span>{c.location}</span>
            <span className={'status-pill ' + statusClass(c.status)}>{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function statusClass(status) {
  if (status === 'Resolved') return 'status-pill--resolved'
  if (status === 'Action in Progress') return 'status-pill--progress'
  return 'status-pill--review'
}
