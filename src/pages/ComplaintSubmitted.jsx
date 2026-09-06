import { CheckCircle2, ClipboardCheck, Download } from 'lucide-react'

export default function ComplaintSubmitted({ record, onViewStatus, onDownload }) {
  return (
    <div className="page page--narrow">
      <div className="success-hero">
        <span className="success-icon">
          <CheckCircle2 size={28} strokeWidth={1.8} />
        </span>
        <h2 className="page-heading">Complaint Submitted Successfully</h2>
        <p className="success-id">Complaint ID: {record.id}</p>
      </div>

      <div className="detail-card">
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
        <div className="detail-row">
          <span>Current Status</span>
          <span className="status-pill status-pill--submitted">{record.status}</span>
        </div>
      </div>

      <div className="button-row">
        <button className="btn btn--primary" onClick={onViewStatus}>
          <ClipboardCheck size={16} strokeWidth={1.8} />
          View Complaint Status
        </button>
        <button className="btn btn--ghost" onClick={onDownload}>
          <Download size={16} strokeWidth={1.8} />
          Download Complaint Report
        </button>
      </div>
    </div>
  )
}
