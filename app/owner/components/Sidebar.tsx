'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, Wallet, BarChart3,
  Bell, Settings, ChevronDown, ChevronRight, BedDouble,
  Layers, DoorOpen, Menu, X, Home, Shield, UserCheck,
} from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
  {
    label: 'Property Management', icon: Building2, children: [
      { label: 'Buildings', href: '/owner/buildings', icon: Home },
      { label: 'Floors', href: '/owner/floors', icon: Layers },
      { label: 'Rooms', href: '/owner/rooms', icon: DoorOpen },
      { label: 'Beds', href: '/owner/beds', icon: BedDouble },
    ],
  },
  { label: 'Residents', href: '/owner/residents', icon: Users },
  { label: 'Finance', href: '/owner/payments', icon: Wallet },
  { label: 'Reports', href: '/owner/reports', icon: BarChart3 },
  { label: 'Verification', href: '/owner/verification', icon: Shield, badge: 'Pending' },
  { label: 'Notifications', href: '/owner/notifications', icon: Bell },
  { label: 'Settings', href: '/owner/settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(['Property Management'])

  const toggle = (label: string) =>
    setOpenMenus(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label])

  const isActive = (href?: string) => href ? pathname === href || pathname.startsWith(href + '/') : false

  return (
    <aside style={{
      width: collapsed ? 64 : 240, minHeight: '100vh', background: '#0A1931',
      display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease',
      position: 'fixed', left: 0, top: 0, zIndex: 100, overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '20px 16px' : '20px 24px', borderBottom: '1px solid #1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#4A7FA7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={16} color="#fff" />
            </div>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>HomiePG</span>
          </div>
        )}
        <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B3CFE5', padding: 4, borderRadius: 6, display: 'flex' }}>
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {nav.map((item) => {
          if (item.children) {
            const open = openMenus.includes(item.label)
            const childActive = item.children.some(c => isActive(c.href))
            return (
              <div key={item.label}>
                <button onClick={() => toggle(item.label)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '10px 20px' : '10px 20px', background: 'none', border: 'none',
                  cursor: 'pointer', color: childActive ? '#B3CFE5' : '#7A9AB5',
                  transition: 'all 0.15s', justifyContent: collapsed ? 'center' : 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <item.icon size={18} strokeWidth={1.5} />
                    {!collapsed && <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>}
                  </div>
                  {!collapsed && (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                </button>
                {open && !collapsed && (
                  <div style={{ paddingLeft: 20 }}>
                    {item.children.map(child => (
                      <Link key={child.href} href={child.href} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
                        borderRadius: 8, margin: '2px 8px', textDecoration: 'none',
                        color: isActive(child.href) ? '#fff' : '#7A9AB5',
                        background: isActive(child.href) ? '#1A3D63' : 'transparent',
                        fontSize: 13, fontWeight: isActive(child.href) ? 600 : 400,
                        transition: 'all 0.15s',
                      }}>
                        <child.icon size={15} strokeWidth={1.5} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          return (
            <Link key={(item as any).href} href={(item as any).href!} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '10px 20px' : '10px 20px', margin: '2px 8px',
              borderRadius: 8, textDecoration: 'none',
              color: isActive((item as any).href) ? '#fff' : '#7A9AB5',
              background: isActive((item as any).href) ? '#1A3D63' : 'transparent',
              fontSize: 13.5, fontWeight: isActive((item as any).href) ? 600 : 400,
              transition: 'all 0.15s', justifyContent: collapsed ? 'center' : 'flex-start',
              position: 'relative',
            }}>
              <item.icon size={18} strokeWidth={1.5} />
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {(item as any).badge && (
                    <span style={{ fontSize: 9, fontWeight: 800, background: '#FBBF24', color: '#0A1931', padding: '2px 7px', borderRadius: 6, letterSpacing: '0.03em' }}>
                      {(item as any).badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && (item as any).badge && (
                <span style={{ position: 'absolute', top: 8, right: 10, width: 7, height: 7, borderRadius: '50%', background: '#FBBF24' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1A3D63' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 13, fontWeight: 600 }}>RK</div>
            <div>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>Ravi Kumar</p>
              <p style={{ color: '#7A9AB5', fontSize: 11, margin: 0 }}>PG Owner</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
