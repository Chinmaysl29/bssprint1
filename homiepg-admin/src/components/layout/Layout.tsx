import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F6FAFD' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 240, minWidth: 0, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.2s ease' }}>
        <Header />
        <main style={{ flex: 1, padding: '28px 28px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
