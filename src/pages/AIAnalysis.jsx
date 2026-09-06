import { Pencil, Download, CheckCircle2, DatabaseZap, ExternalLink } from 'lucide-react'

export default function AIAnalysis({ complaint, analysis, onConfirm, onEdit, onDownload, isSubmitting }) {
  const Icon = analysis.icon

  return (
    <div className="page">
      <p className="page-eyebrow">AI Complaint Analysis</p>
      <h2 className="page-heading">We understood your complaint as:</h2>

      <div className="quote-card">“{complaint.text}”</div>

      <div className="analysis-grid">
        <div className="analysis-card">
          {Icon && (
            <span className="analysis-icon">
              <Icon size={20} strokeWidth={1.7} />
            </span>
          )}
          <p className="analysis-label">Domain</p>
          <p className="analysis-value">{analysis.domain}</p>
        </div>
        <div className="analysis-card">
          <p className="analysis-label">Location</p>
          <p className="analysis-value">{analysis.location}</p>
        </div>
        <div className="analysis-card analysis-card--wide">
          <p className="analysis-label">Recommended authority</p>
          <p className="analysis-value">{analysis.authority}</p>
          {analysis.website && (
            <a
              className="official-link"
              href={analysis.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} strokeWidth={2} />
              Visit official complaint website
            </a>
          )}
        </div>
      </div>

      <section className="explain-card">
        <h3 className="section-heading">Why this recommendation?</h3>
        <p className="explain-text">{analysis.explanation}</p>

        <div className="verified-note">
          <DatabaseZap size={16} strokeWidth={1.8} />
          <p>
            The AI identifies and structures your complaint. The final authority
            recommendation is looked up from a verified authority database — the model
            does not decide this on its own.
          </p>
        </div>
      </section>

      <div className="button-row">
        <button className="btn btn--primary" onClick={onConfirm} disabled={isSubmitting}>
          <CheckCircle2 size={16} strokeWidth={2} />
          {isSubmitting ? 'Submitting…' : 'Yes, Report This Complaint'}
        </button>
        <button className="btn btn--ghost" onClick={onEdit} disabled={isSubmitting}>
          <Pencil size={16} strokeWidth={1.8} />
          Edit Complaint
        </button>
        <button className="btn btn--ghost" onClick={onDownload}>
          <Download size={16} strokeWidth={1.8} />
          Download Complaint Report
        </button>
      </div>
    </div>
  )
}
