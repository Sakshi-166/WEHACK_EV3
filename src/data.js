import {
  Droplet, Zap, Construction, Trash2, ShieldAlert,
 HelpCircle,
} from 'lucide-react'

// Base URL of the Kya Karu? FastAPI backend (backend/app/main.py).
// Matches the CORS origins configured there for local development.
export const API_BASE_URL = 'http://127.0.0.1:8000'

export const CATEGORIES = [
  { id: 'water', label: 'Water', icon: Droplet },
  { id: 'electricity', label: 'Electricity', icon: Zap },
  { id: 'roads', label: 'Roads', icon: Construction },
  { id: 'waste', label: 'Waste', icon: Trash2 },
  { id: 'cyber', label: 'Cyber Crime', icon: ShieldAlert },
]

export const AUTHORITY_MAP = {
  water: {
    domain: 'Water Supply',
    authority: 'Vellore Municipal Corporation — Water Supply Division',
    keyword: 'a disruption in water supply',
  },
  electricity: {
    domain: 'Electricity',
    authority: 'TANGEDCO, Vellore Circle',
    keyword: 'an electricity or streetlight issue',
  },
  roads: {
    domain: 'Roads',
    authority: 'Vellore Municipal Corporation — Public Works Department',
    keyword: 'damage to public road infrastructure',
  },
  waste: {
    domain: 'Waste Management',
    authority: 'Vellore Municipal Corporation — Sanitation Department',
    keyword: 'uncollected garbage',
  },
  cyber: {
    domain: 'Cyber Crime',
    authority: 'Tamil Nadu Cyber Crime Wing, Vellore',
    keyword: 'a suspected online fraud or cyber offence',
  },
}

const DOMAIN_KEYWORDS = {
  water: ['water', 'pipeline', 'supply', 'tap', 'leak'],
  electricity: ['electric', 'power', 'streetlight', 'street light', 'transformer', 'current', 'voltage'],
  roads: ['road', 'pothole', 'street', 'footpath', 'pavement'],
  waste: ['garbage', 'waste', 'trash', 'dump', 'sanitation', 'sewage'],
  cyber: ['fraud', 'scam', 'cyber', 'hack', 'phishing', 'otp'],
}

const KNOWN_AREAS = [
  'Katpadi', 'Sathuvachari', 'Gandhi Nagar', 'Bagayam', 'Thorapadi',
  'Green Circle', 'Officers Line', 'Vellore Fort', 'Ida Scudder Road', 'Vellore',
]

export const DEFAULT_COMPLAINT_TEXT =
  'There is a huge pile of garbage outside my hostel near Katpadi for the past three days.'

export function detectLocation(text) {
  const found = KNOWN_AREAS.find((area) => text.toLowerCase().includes(area.toLowerCase()))
  return found ? `${found}, Vellore`.replace('Vellore, Vellore', 'Vellore') : 'Vellore'
}

// ---------- Backend classifier category → display label / icon ----------
// The FastAPI backend (backend/app/classifier.py) classifies complaints against
// database/authorities.json, which uses these category ids.
const BACKEND_CATEGORY_META = {
  water: { label: 'Water', icon: Droplet },
  electricity: { label: 'Electricity', icon: Zap },
  roads: { label: 'Roads', icon: Construction },
  waste: { label: 'Waste Management', icon: Trash2 },
  cyber: { label: 'Cyber Crime', icon: ShieldAlert },
  general: { label: 'General Grievance', icon: HelpCircle },
}

function formatCategoryLabel(category) {
  if (!category) return 'General Grievance'
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getCategoryMeta(category) {
  return BACKEND_CATEGORY_META[category] || { label: formatCategoryLabel(category), icon: HelpCircle }
}

// Offline, in-browser fallback classifier — only used if the Kya Karu? backend
// (uvicorn app.main:app) cannot be reached, so the demo still works without it running.
export function classifyComplaintFallback(text) {
  const lower = text.toLowerCase()
  let matchedId = 'waste'
  for (const [id, words] of Object.entries(DOMAIN_KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) {
      matchedId = id
      break
    }
  }
  const meta = AUTHORITY_MAP[matchedId]
  const location = detectLocation(text)
  const category = CATEGORIES.find((c) => c.id === matchedId)

  return {
    categoryId: matchedId,
    domain: meta.domain,
    location,
    authority: meta.authority,
    icon: category?.icon,
    explanation: `Your complaint mentions ${meta.keyword}, which falls under ${meta.domain}. Based on the location provided, the relevant authority is the ${meta.authority}, which handles matters of this kind in that jurisdiction.`,
    officialChannel: meta.domain,
    website: 'https://pgportal.gov.in/',
    confidence: 'low',
    offline: true,
  }
}

async function postForm(path, fields) {
  const body = new URLSearchParams()
  Object.entries(fields).forEach(([key, value]) => body.append(key, value ?? ''))

  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', body })

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json()
}

// Sends the complaint text to POST /api/classify on the backend, which runs it
// through the keyword classifier and looks up the matching entry in
// database/authorities.json. This is preview-only — nothing is saved yet.
// Falls back to an offline heuristic if the backend is unreachable.
export async function classifyComplaint(text, userArea = '') {
  const location = userArea || detectLocation(text)

  try {
    const result = await postForm('/api/classify', {
      description: text,
      location,
    })

    const meta = getCategoryMeta(result.category)

    return {
      categoryId: result.category,
      domain: meta.label,
      location: result.location || location,
      authority: result.authority,
      icon: meta.icon,
      explanation: result.reason,
      officialChannel: result.official_channel,
      website: result.website,
      steps: result.steps,
      confidence: result.confidence,
      offline: false,
    }
  } catch (err) {
    console.error(
      'Kya Karu? backend unreachable, using offline classifier:',
      err
    )

    return classifyComplaintFallback(text)
  }
}

// Confirms and actually saves the complaint via POST /api/report (backend/app/main.py),
// which appends it to database/complaints.json. Falls back to a local-only record
// if the backend is unreachable so the UI flow can still be demoed.
export async function submitComplaint(text, location, anonymous) {
  try {
    const result = await postForm('/api/report', {
      description: text,
      location: location || '',
      anonymous: anonymous ? 'true' : 'false',
    })
    return { ...result, offline: false }
  } catch (err) {
    console.error('Could not reach Kya Karu? backend to save complaint:', err)
    const fallback = classifyComplaintFallback(text)
    return {
      category: fallback.categoryId,
      authority: fallback.authority,
      reason: fallback.explanation,
      official_channel: fallback.officialChannel,
      website: fallback.website,
      confidence: fallback.confidence,
      location,
      attachments: [],
      message: 'Saved locally — the Kya Karu? backend could not be reached.',
      offline: true,
    }
  }
}

export function formatDate(d) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function generateComplaintId(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `KK${yyyy}${mm}${dd}001`
}

export const PREVIOUS_CONVERSATIONS = [
  {
    id: 'pc1',
    title: 'Garbage not collected near hostel',
    domain: 'Waste Management',
    location: 'Katpadi, Vellore',
    authority: 'Vellore Municipal Corporation — Sanitation Department',
    status: 'Resolved',
    date: '02 Sep 2026',
  },
  {
    id: 'pc2',
    title: 'Water supply interruption',
    domain: 'Water Supply',
    location: 'Vellore',
    authority: 'Vellore Municipal Corporation — Water Supply Division',
    status: 'Action in Progress',
    date: '30 Aug 2026',
  },
  {
    id: 'pc3',
    title: 'Streetlight not working',
    domain: 'Electricity',
    location: 'Vellore',
    authority: 'TANGEDCO, Vellore Circle',
    status: 'Under Review',
    date: '27 Aug 2026',
  },
]

export const ADMIN_STATS = {
  total: 248,
  pending: 62,
  inProgress: 121,
  resolved: 65,
}

export const DOMAIN_BREAKDOWN = [
  { label: 'Water', value: 64 },
  { label: 'Electricity', value: 45 },
  { label: 'Roads', value: 58 },
  { label: 'Waste', value: 52 },
  { label: 'Cyber Crime', value: 29 },
]

export const EMERGING_ISSUES = [
  {
    id: 'ei1',
    title: 'Water Supply',
    count: 47,
    window: 'last 24 hours',
    location: 'Katpadi, Vellore',
    status: 'Increasing',
    explanation:
      'Multiple citizens have reported similar water supply problems in the same area within a short period. This may indicate an emerging civic issue.',
  },
  {
    id: 'ei2',
    title: 'Waste Collection',
    count: 31,
    window: 'last 48 hours',
    location: 'Sathuvachari, Vellore',
    status: 'Increasing',
    explanation:
      'A cluster of uncollected-garbage reports has formed around the same residential blocks, suggesting a missed collection route rather than isolated incidents.',
  },
  {
    id: 'ei3',
    title: 'Road Damage',
    count: 22,
    window: 'last 7 days',
    location: 'Gandhi Nagar, Vellore',
    status: 'Monitoring',
    explanation:
      'A steady trickle of pothole reports along the same stretch of road points to a single infrastructure issue affecting many residents, rather than several unrelated ones.',
  },
]
