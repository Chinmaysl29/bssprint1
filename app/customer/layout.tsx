'use client'
import CustomerNavbar from './components/CustomerNavbar'
import CustomerSidebar from './components/CustomerSidebar'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F6FAFD', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <CustomerNavbar />
      <div style={{ display: 'flex', paddingTop: 64 }}>
        <CustomerSidebar />
        <main style={{ flex: 1, padding: '32px', minHeight: 'calc(100vh - 64px)', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
