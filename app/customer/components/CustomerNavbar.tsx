'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Heart, CalendarCheck, Bell, User, Sun, Moon, Menu, X, Home } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/customer/dashboard', icon: Home },
  { label: 'Search PG', href: '/customer/search', icon: Search },
  { label: 'Wishlist', href: '/customer/wishlist', icon: Heart },
  { label: 'Bookings', href: '/customer/bookings', icon: CalendarCheck },
]

export default function CustomerNavbar() {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, background: 'rgba(246,250,253,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E8EEF5', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between' }}>
      {/* Logo */}
      <Link href="/customer/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, background: '#0A1931', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Home size={16} color="#fff" strokeWidth={1.5} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 16, color: '#0A1931', letterSpacing: '-0.03em' }}>HomiePG</span>
      </Link>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: 4 }}>
        {navLinks.map(n => (
          <Link key={n.href} href={n.href} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, textDecoration: 'none',
            background: pathname === n.href || pathname.startsWith(n.href+'/') ? '#EDF4FB' : 'transparent',
            color: pathname === n.href || pathname.startsWith(n.href+'/') ? '#0A1931' : '#6B7FA3',
            fontSize: 13, fontWeight: pathname === n.href ? 700 : 500, transition: 'all 0.15s',
          }}>
            <n.icon size={15} strokeWidth={1.5} />{n.label}
          </Link>
        ))}
      </nav>

      {/* Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 10, padding: '8px 14px', width: 240 }}>
        <Search size={14} color="#6B7FA3" strokeWidth={1.5} />
        <input placeholder="Search PG, area..." style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0A1931', background: 'transparent', width: '100%' }} />
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => setDark(!dark)} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}>
          {dark ? <Sun size={16} color="#4A7FA7" /> : <Moon size={16} color="#4A7FA7" />}
        </button>
        <Link href="/customer/notifications" style={{ position: 'relative', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', textDecoration: 'none' }}>
          <Bell size={16} color="#4A7FA7" />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#DC2626', border: '1.5px solid #F6FAFD' }} />
        </Link>
        <Link href="/customer/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 10, padding: '6px 12px', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 11, fontWeight: 700 }}>AR</div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1931' }}>Arjun</span>
        </Link>
      </div>
    </header>
  )
}
