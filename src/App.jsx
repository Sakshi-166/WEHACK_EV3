import { useState } from 'react'
import CitizenSidebar from './components/CitizenSidebar.jsx'
import AdminSidebar from './components/AdminSidebar.jsx'
import TopBar from './components/TopBar.jsx'
import Login from './pages/Login.jsx'
import CitizenHome from './pages/CitizenHome.jsx'
import AIAnalysis from './pages/AIAnalysis.jsx'
import ComplaintSubmitted from './pages/ComplaintSubmitted.jsx'
import ComplaintStatus from './pages/ComplaintStatus.jsx'
import PreviousConversations from './pages/PreviousConversations.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CollectiveIntelligence from './pages/CollectiveIntelligence.jsx'
import AdminComplaints from './pages/AdminComplaints.jsx'
import { classifyComplaint, submitComplaint, formatDate, generateComplaintId } from './data.js'

const PAGE_TITLES = {
  home: { eyebrow: 'Citizen Portal', title: 'Home' },
  'new-complaint': { eyebrow: 'Citizen Portal', title: 'Home' },
  analysis: { eyebrow: 'Citizen Portal', title: 'AI Complaint Analysis' },
  submitted: { eyebrow: 'Citizen Portal', title: 'Complaint Submitted' },
  status: { eyebrow: 'Citizen Portal', title: 'Complaint Status' },
  'my-complaints': { eyebrow: 'Citizen Portal', title: 'Previous Conversations' },
  conversations: { eyebrow: 'Citizen Portal', title: 'Previous Conversations' },
  profile: { eyebrow: 'Citizen Portal', title: 'Profile' },
  settings: { eyebrow: 'Citizen Portal', title: 'Settings' },
  'admin-overview': { eyebrow: 'Administrator', title: 'Overview' },
  'admin-intelligence': { eyebrow: 'Administrator', title: 'Collective Intelligence' },
  'admin-complaints': { eyebrow: 'Administrator', title: 'Complaints' },
}

export default function App() {
  const [theme, setTheme] = useState('light')
  const [role, setRole] = useState(null)
  const [profile, setProfile] = useState({ name: '', email: '', gender: '', area: '' })
  const [page, setPage] = useState('home')
  const [draftComplaint, setDraftComplaint] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [activeRecord, setActiveRecord] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const handleLoginComplete = (selectedRole, form) => {
    setRole(selectedRole)
    setProfile(form)
    setPage(selectedRole === 'citizen' ? 'home' : 'admin-overview')
  }

  const handleLogout = () => {
    setRole(null)
    setDraftComplaint(null)
    setAnalysis(null)
    setActiveRecord(null)
    setPage('home')
  }

  // Sends the complaint to the backend classifier (POST /api/classify) so the
  // "AI Complaint Analysis" screen reflects the real routing decision from
  // backend/app/classifier.py + database/authorities.json.
  const handleSubmitComplaint = async (text, anonymous) => {
  setDraftComplaint({ text, anonymous })
  setIsAnalyzing(true)

  try {
    const result = await classifyComplaint(
      text,
      profile.area
    )

    setAnalysis(result)
    setPage('analysis')
  } finally {
    setIsAnalyzing(false)
  }
}

  // Confirms and actually saves the complaint via POST /api/report.
  const handleConfirmComplaint = async () => {
    setIsSubmitting(true)
    try {
      const now = new Date()
      const backendResult = await submitComplaint(
        draftComplaint.text,
        analysis.location,
        draftComplaint.anonymous
      )
      const record = {
        id: generateComplaintId(now) || generateComplaintId(now),
        text: draftComplaint.text,
        domain: analysis.domain,
        location: backendResult.location || analysis.location,
        authority: backendResult.authority || analysis.authority,
        officialChannel: backendResult.official_channel || analysis.officialChannel,
        website: backendResult.website || analysis.website,
        dateSubmitted: formatDate(now),
        status: 'Submitted',
        anonymous: draftComplaint.anonymous,
      }
      setActiveRecord(record)
      setPage('submitted')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdvanceStatus = () => {
    const STAGES = ['Submitted', 'Under Review', 'Action in Progress', 'Resolved']
    setActiveRecord((r) => {
      const i = STAGES.indexOf(r.status)
      return { ...r, status: STAGES[Math.min(i + 1, STAGES.length - 1)] }
    })
  }

  const handleDownload = () => {
    if (typeof window === 'undefined') return
    const source = activeRecord || {
      text: draftComplaint?.text,
      domain: analysis?.domain,
      location: analysis?.location,
      authority: analysis?.authority,
      officialChannel: analysis?.officialChannel,
      website: analysis?.website,
      dateSubmitted: formatDate(new Date()),
      status: 'Draft',
    }
    const lines = [
      'KYA KARU? — COMPLAINT REPORT',
      '-----------------------------',
      `Complaint: ${source.text}`,
      `Domain: ${source.domain}`,
      `Location: ${source.location}`,
      `Authority: ${source.authority}`,
      `Official Channel: ${source.officialChannel || '—'}`,
      `Website: ${source.website || '—'}`,
      `Date: ${source.dateSubmitted}`,
      `Status: ${source.status}`,
    ].join('\n')
    const blob = new Blob([lines], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeRecord?.id || 'kyakaru-complaint'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!role) {
    return <Login onComplete={handleLoginComplete} />
  }

  const meta = PAGE_TITLES[page] || { eyebrow: '', title: '' }

  return (
    <div className={`app-shell theme-${theme}`}>
      {role === 'citizen' ? (
        <CitizenSidebar
          page={page === 'new-complaint' ? 'new-complaint' : page}
          onNavigate={setPage}
          onLogout={handleLogout}
          userName={profile.name}
        />
      ) : (
        <AdminSidebar page={page} onNavigate={setPage} onLogout={handleLogout} userName={profile.name} />
      )}

      <main className="content">
        <TopBar
          eyebrow={meta.eyebrow}
          title={meta.title}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="content-body">
          {role === 'citizen' && (page === 'home' || page === 'new-complaint') && (
            <CitizenHome
              userName={profile.name}
              onSubmitComplaint={handleSubmitComplaint}
              isAnalyzing={isAnalyzing}
            />
          )}

          {role === 'citizen' && page === 'analysis' && draftComplaint && analysis && (
            <AIAnalysis
              complaint={draftComplaint}
              analysis={analysis}
              onConfirm={handleConfirmComplaint}
              onEdit={() => {
                setAnalysis(null)
                setPage('home')
              }}
              onDownload={handleDownload}
              isSubmitting={isSubmitting}
            />
          )}

          {role === 'citizen' && page === 'submitted' && activeRecord && (
            <ComplaintSubmitted
              record={activeRecord}
              onViewStatus={() => setPage('status')}
              onDownload={handleDownload}
            />
          )}

          {role === 'citizen' && page === 'status' && activeRecord && (
            <ComplaintStatus record={activeRecord} onAdvance={handleAdvanceStatus} />
          )}

          {role === 'citizen' && (page === 'conversations' || page === 'my-complaints') && (
            <PreviousConversations />
          )}

          {role === 'citizen' && page === 'profile' && <Profile profile={profile} />}

          {page === 'settings' && <Settings theme={theme} onToggleTheme={toggleTheme} />}

          {role === 'admin' && page === 'admin-overview' && <AdminDashboard />}
          {role === 'admin' && page === 'admin-intelligence' && <CollectiveIntelligence />}
          {role === 'admin' && page === 'admin-complaints' && <AdminComplaints />}
        </div>
      </main>
    </div>
  )
}
