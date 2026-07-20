'use client'
import { Bell, Search, Sun, Moon, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Navbar({ sidebarWidth }: { sidebarWidth: number }) {
  const [dark, setDark] = useState(false)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header style={{
      position: 'fixed', top: 0, left: sidebarWidth, right: 0, height: 60,
      background: 'rgba(246,250,253,0.95)', backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #E8EEF5', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px', zIndex: 90,
      transition: 'left 0.2s ease',
    }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 10, padding: '7px 14px', width: 280 }}>
        <Search size={15} color="#6B7FA3" strokeWidth={1.5} />
        <input placeholder="Search anything..." style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0A1931', background: 'transparent', width: '100%' }} />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#6B7FA3', marginRight: 8 }}>{today}</span>

        <button onClick={() => setDark(!dark)} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex' }}>
          {dark ? <Sun size={16} color="#4A7FA7" /> : <Moon size={16} color="#4A7FA7" />}
        </button>

        <button style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', position: 'relative' }}>
          <Bell size={16} color="#4A7FA7" />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#DC2626', border: '1.5px solid #F6FAFD' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 10, padding: '6px 12px', cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 12, fontWeight: 600 }}>RK</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>Ravi Kumar</p>
            <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0 }}>PG Owner</p>
          </div>
          <ChevronDown size={14} color="#6B7FA3" />
        </div>
      </div>
    </header>
  )
}
