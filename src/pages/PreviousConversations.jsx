import { useState } from 'react'
import { PREVIOUS_CONVERSATIONS } from '../data.js'

export default function PreviousConversations() {
  const [selectedId, setSelectedId] = useState(PREVIOUS_CONVERSATIONS[0].id)
  const selected = PREVIOUS_CONVERSATIONS.find((c) => c.id === selectedId)

  return (
    <div className="page">
      <p className="page-eyebrow">History</p>
      <h2 className="page-heading">Previous Conversations</h2>

      <div className="master-detail">
        <ul className="conversation-list-full">
          {PREVIOUS_CONVERSATIONS.map((c) => (
            <li key={c.id}>
              <button
                className={
                  'conversation-row' + (c.id === selectedId ? ' conversation-row--active' : '')
                }
                onClick={() => setSelectedId(c.id)}
              >
                <div>
                  <p className="conversation-title">{c.title}</p>
                  <p className="conversation-meta">
                    {c.domain} — {c.location}
                  </p>
                </div>
                <span className={'status-pill ' + statusClass(c.status)}>{c.status}</span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <div className="detail-card detail-card--panel">
            <h3 className="section-heading">{selected.title}</h3>
            <div className="detail-row">
              <span>Domain</span>
              <span>{selected.domain}</span>
            </div>
            <div className="detail-row">
              <span>Location</span>
              <span>{selected.location}</span>
            </div>
            <div className="detail-row">
              <span>Authority</span>
              <span>{selected.authority}</span>
            </div>
            <div className="detail-row">
              <span>Date</span>
              <span>{selected.date}</span>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <span className={'status-pill ' + statusClass(selected.status)}>
                {selected.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function statusClass(status) {
  if (status === 'Resolved') return 'status-pill--resolved'
  if (status === 'Action in Progress') return 'status-pill--progress'
  return 'status-pill--review'
}
