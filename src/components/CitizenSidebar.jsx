import {
  Home, FilePlus, ClipboardList, MessagesSquare, UserCircle2, Settings, LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'new-complaint', label: 'New Complaint', icon: FilePlus },
  { id: 'my-complaints', label: 'My Complaints', icon: ClipboardList },
  { id: 'conversations', label: 'Previous Conversations', icon: MessagesSquare },
  { id: 'profile', label: 'Profile', icon: UserCircle2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function CitizenSidebar({ page, onNavigate, onLogout, userName }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-badge">KK</span>
        <div>
          <p className="brand-name">Kya Karu?</p>
          <p className="brand-tagline">All Problems, One Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = page === item.id
          return (
            <button
              key={item.id}
              className={'nav-item' + (active ? ' nav-item--active' : '')}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <UserCircle2 size={22} strokeWidth={1.6} />
          <span>{userName || 'Citizen'}</span>
        </div>
        <button className="nav-item" onClick={onLogout}>
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
