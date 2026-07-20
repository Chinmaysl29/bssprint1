'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Building2, BedDouble, BarChart3, Users, Sparkles } from 'lucide-react'

const features = [
  { icon: Building2, label: 'Property Management', desc: 'Manage buildings, rooms and beds' },
  { icon: Users,    label: 'Resident Tracking',   desc: 'Check-in, check-out, KYC' },
  { icon: BedDouble,label: 'Bed Management',       desc: 'Real-time occupancy view' },
  { icon: BarChart3, label: 'Financial Reports',   desc: 'Revenue, expenses, receipts' },
]

export default function AuthSuccessPage() {
  const [progress, setProgress] = useState(0)
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 60)
    const r = setTimeout(() => { setRedirecting(true); clearInterval(t) }, 3200)
    return () => { clearInterval(t); clearTimeout(r) }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 24 }}>
      {/* Success card */}
      <div style={{
        width: 500, maxWidth: '100%',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderRadius: 22,
        boxShadow: '0 32px 80px rgba(10,25,49,0.35)',
        overflow: 'hidden',
      }}>
        {/* Top gradient banner */}
        <div style={{ background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 60%, #4A7FA7 100%)', padding: '40px 36px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid rgba(255,255,255,0.25)', boxShadow: '0 0 0 8px rgba(255,255,255,0.06)' }}>
              <CheckCircle size={34} color="#fff" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              You're all set! 🎉
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(179,207,229,0.8)', margin: 0 }}>
              Your HomiePG owner account is ready
            </p>
          </div>
        </div>

        <div style={{ padding: '28px 36px 32px' }}>
          {/* Account details */}
          <div style={{ background: '#F6FAFD', borderRadius: 12, padding: '16px 18px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>RK</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>Ravi Kumar</p>
              <p style={{ fontSize: 12, color: '#6B7FA3', margin: '2px 0 0' }}>ravi@email.com · PG Owner</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: '#EFF6FF', padding: '5px 10px', borderRadius: 20 }}>
              <Sparkles size={11} color="#1D4ED8" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1D4ED8' }}>NEW</span>
            </div>
          </div>

          {/* What you can do */}
          <p style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What's waiting for you</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {features.map(f => (
              <div key={f.label} style={{ background: '#F6FAFD', borderRadius: 10, padding: '12px 14px', border: '1px solid #E8EEF5', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={14} color="#1A3D63" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#0A1931', margin: 0 }}>{f.label}</p>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#6B7FA3' }}>
                {redirecting ? 'Redirecting to dashboard...' : 'Setting up your workspace...'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#0A1931' }}>{progress}%</span>
            </div>
            <div style={{ height: 5, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #0A1931, #4A7FA7)', borderRadius: 4, transition: 'width 0.15s linear' }} />
            </div>
          </div>

          <Link href="/owner/dashboard" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
            <button style={{
              width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0A1931, #1A3D63)',
              color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 6px 20px rgba(10,25,49,0.25)', transition: 'all 0.2s',
            }}>
              Go to Owner Dashboard <ArrowRight size={17} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
