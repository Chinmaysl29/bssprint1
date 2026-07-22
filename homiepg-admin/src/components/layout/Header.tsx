import { Bell, Search, ChevronDown, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function Header() {
  const logout = useAuthStore((s) => s.logout)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{
      height: 56,
      background: 'rgba(246,250,253,0.97)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #E8EEF5',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 9, padding: '7px 13px', width: 260 }}>
        <Search size={14} color="#6B7FA3" strokeWidth={1.5} />
        <input placeholder="Search users, properties..." style={{ border: 'none', outline: 'none', fontSize: 12, color: '#0A1931', background: 'transparent', width: '100%' }} />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: '#6B7FA3' }}>{today}</span>

        <button style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, padding: '7px 8px', cursor: 'pointer', display: 'flex', position: 'relative' }}>
          <Bell size={15} color="#4A7FA7" />
          <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: '#DC2626', border: '1.5px solid #F6FAFD' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 9, padding: '5px 12px' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#B3CFE5' }}>SA</div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#0A1931', margin: 0 }}>Super Admin</p>
            <p style={{ fontSize: 9, color: '#6B7FA3', margin: 0 }}>Administrator</p>
          </div>
          <ChevronDown size={12} color="#6B7FA3" />
        </div>

        <button onClick={logout} title="Logout" style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '7px 8px', cursor: 'pointer', display: 'flex' }}>
          <LogOut size={14} color="#DC2626" />
        </button>
      </div>
    </header>
  )
}
