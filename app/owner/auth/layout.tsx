import type { ReactNode } from 'react'
import Link from 'next/link'
import { Home, Shield } from 'lucide-react'

export default function OwnerAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 50%, #4A7FA7 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background circles */}
      <div style={{ position: 'fixed', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '40%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(74,127,167,0.08)', pointerEvents: 'none' }} />

      {/* Top nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Home size={17} color="#fff" strokeWidth={1.5} />
          </div>
          <div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em' }}>HomiePG</span>
            <span style={{ color: 'rgba(179,207,229,0.7)', fontSize: 11, marginLeft: 6, fontWeight: 400 }}>for Owners</span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '6px 14px' }}>
          <Shield size={13} color="#B3CFE5" strokeWidth={1.5} />
          <span style={{ color: '#B3CFE5', fontSize: 11, fontWeight: 600 }}>Secure Authentication</span>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 24px 48px', position: 'relative', zIndex: 10 }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '16px', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(179,207,229,0.5)', fontSize: 11, margin: 0 }}>
          © 2024 HomiePG · <Link href="/privacy" style={{ color: 'rgba(179,207,229,0.6)', textDecoration: 'none' }}>Privacy</Link> · <Link href="/terms" style={{ color: 'rgba(179,207,229,0.6)', textDecoration: 'none' }}>Terms</Link>
        </p>
      </div>
    </div>
  )
}
