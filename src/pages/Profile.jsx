export default function Profile({ profile }) {
  return (
    <div className="page page--narrow">
      <p className="page-eyebrow">Account</p>
      <h2 className="page-heading">Profile</h2>

      <div className="detail-card">
        <div className="detail-row">
          <span>Full name</span>
          <span>{profile.name || '—'}</span>
        </div>
        <div className="detail-row">
          <span>Email ID</span>
          <span>{profile.email || '—'}</span>
        </div>
        <div className="detail-row">
          <span>Gender</span>
          <span>{profile.gender || '—'}</span>
        </div>
        <div className="detail-row">
          <span>Area of residence</span>
          <span>{profile.area || '—'}</span>
        </div>
      </div>
    </div>
  )
}
