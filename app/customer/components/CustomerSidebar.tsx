'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, CalendarCheck, Heart, FileText, Star, Bell, User, Settings } from 'lucide-react'

const links = [
  { label: 'Dashboard', href: '/customer/dashboard', icon: LayoutDashboard },
  { label: 'Search PG', href: '/customer/search', icon: Search },
  { label: 'Bookings', href: '/customer/bookings', icon: CalendarCheck },
  { label: 'Wishlist', href: '/customer/wishlist', icon: Heart },
  { label: 'Documents', href: '/customer/documents', icon: FileText },
  { label: 'Reviews', href: '/customer/reviews', icon: Star },
  { label: 'Notifications', href: '/customer/notifications', icon: Bell },
  { label: 'Profile', href: '/customer/profile', icon: User },
  { label: 'Settings', href: '/customer/settings', icon: Settings },
]

export default function CustomerSidebar() {
  const pathname = usePathname()
  return (
    <aside style={{ width: 220, minHeight: '100vh', background: '#fff', borderRight: '1px solid #E8EEF5', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#B3CFE5', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 12px', margin: 0 }}>Menu</p>
      {links.map(l => {
        const active = pathname === l.href || pathname.startsWith(l.href + '/')
        return (
          <Link key={l.href} href={l.href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, textDecoration: 'none',
            background: active ? '#EDF4FB' : 'transparent',
            color: active ? '#0A1931' : '#6B7FA3',
            fontSize: 13, fontWeight: active ? 700 : 500, transition: 'all 0.15s',
            borderLeft: active ? '3px solid #0A1931' : '3px solid transparent',
          }}>
            <l.icon size={16} strokeWidth={1.5} />
            {l.label}
          </Link>
        )
      })}
    </aside>
  )
}
