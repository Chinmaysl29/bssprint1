import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, FileCheck, Building2, UserCog,
  AlertTriangle, IndianRupee, BarChart3, Bell, Settings,
  Home, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'PG Owners', path: '/owners', badge: 1 },
  { icon: FileCheck, label: 'Documents', path: '/documents', badge: 3 },
  { icon: Building2, label: 'Properties', path: '/properties', badge: 2 },
  { icon: UserCog, label: 'Users', path: '/users' },
  { icon: AlertTriangle, label: 'Complaints', path: '/complaints', badge: 4 },
  { icon: IndianRupee, label: 'Revenue', path: '/revenue' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: '#0A1931',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '18px 16px' : '18px 20px', borderBottom: '1px solid #1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#4A7FA7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={16} color="#fff" />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 14, margin: 0, letterSpacing: '-0.02em' }}>HomiePG</p>
              <p style={{ color: '#4A7FA7', fontSize: 9, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Panel</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ background: '#1A3D63', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex', color: '#B3CFE5', flexShrink: 0 }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
        {nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              margin: '2px 0',
              borderRadius: 8,
              textDecoration: 'none',
              background: isActive ? '#1A3D63' : 'transparent',
              color: isActive ? '#fff' : '#7A9AB5',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
              position: 'relative',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
          >
            <item.icon size={17} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            {!collapsed && (
              <>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ background: '#DC2626', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 700, padding: '1px 6px', lineHeight: 1.6 }}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1A3D63' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#4A7FA7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>SA</div>
            <div>
              <p style={{ color: '#fff', fontSize: 12, fontWeight: 600, margin: 0 }}>Super Admin</p>
              <p style={{ color: '#4A7FA7', fontSize: 10, margin: 0 }}>admin@homiepg.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
