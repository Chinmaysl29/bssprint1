'use client'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 64 : 240

  return (
    <div style={{ minHeight: '100vh', background: '#F6FAFD', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <Navbar sidebarWidth={sidebarWidth} />
      <main style={{
        marginLeft: sidebarWidth, paddingTop: 60,
        transition: 'margin-left 0.2s ease', minHeight: '100vh',
      }}>
        <div style={{ padding: '32px 32px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
