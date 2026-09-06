import { LayoutDashboard, Activity, ClipboardList, Settings, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'admin-overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'admin-intelligence', label: 'Collective Intelligence', icon: Activity },
  { id: 'admin-complaints', label: 'Complaints', icon: ClipboardList },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ page, onNavigate, onLogout, userName }) {
  return (
    <aside className="sidebar sidebar--admin">
      <div className="sidebar-brand">
        <span className="brand-badge brand-badge--admin">KK</span>
        <div>
          <p className="brand-name">Kya Karu?</p>
          <p className="brand-tagline">Administrator Console</p>
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
          <span className="role-chip">Admin</span>
          <span>{userName || 'Administrator'}</span>
        </div>
        <button className="nav-item" onClick={onLogout}>
          <LogOut size={18} strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
