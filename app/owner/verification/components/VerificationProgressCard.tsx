'use client'
import { Check, Mail, User, Shield, Building2, CreditCard, Send } from 'lucide-react'
import Link from 'next/link'

const checklist = [
  { label: 'Email Verified',        icon: Mail,      status: 'done',    href: '#' },
  { label: 'Profile Completed',     icon: User,      status: 'done',    href: '/owner/verification/profile' },
  { label: 'Identity Uploaded',     icon: Shield,    status: 'done',    href: '/owner/verification/identity' },
  { label: 'Bank Details Added',    icon: CreditCard,status: 'pending', href: '/owner/verification/bank' },
  { label: 'Property Verified',     icon: Building2, status: 'pending', href: '/owner/verification/property' },
  { label: 'Application Submitted', icon: Send,      status: 'pending', href: '/owner/verification/review' },
]

const statusConfig = {
  done:    { bg: '#EFF6FF', color: '#1D4ED8', icon: '#1D4ED8' },
  pending: { bg: '#F6FAFD', color: '#6B7FA3', icon: '#B3CFE5' },
  rejected:{ bg: '#FEF2F2', color: '#DC2626', icon: '#DC2626' },
}

export default function VerificationProgressCard() {
  const done = checklist.filter(c => c.status === 'done').length
  const pct = Math.round((done / checklist.length) * 100)

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', boxShadow: '0 2px 8px rgba(10,25,49,0.06)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: '#B3CFE5', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Verification Progress</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{pct}% Complete</p>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '2px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{done}</span>
            <span style={{ fontSize: 9, color: '#B3CFE5' }}>of {checklist.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #B3CFE5, #fff)', borderRadius: 3, transition: 'width 0.6s ease' }} />
        </div>
        <p style={{ fontSize: 11, color: '#B3CFE5', margin: '8px 0 0' }}>{checklist.length - done} steps remaining to complete verification</p>
      </div>

      {/* Checklist */}
      <div style={{ padding: '12px 8px' }}>
        {checklist.map((item, i) => {
          const cfg = statusConfig[item.status as keyof typeof statusConfig]
          return (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 10, margin: '2px 0', transition: 'background 0.15s', cursor: item.status !== 'done' ? 'pointer' : 'default' }}
                onMouseEnter={e => { if (item.status !== 'done') (e.currentTarget as HTMLElement).style.background = '#F6FAFD' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.status === 'done'
                    ? <Check size={13} color={cfg.icon} strokeWidth={2.5} />
                    : <item.icon size={13} color={cfg.icon} strokeWidth={1.5} />
                  }
                </div>
                <p style={{ fontSize: 13, fontWeight: item.status === 'done' ? 600 : 500, color: item.status === 'done' ? '#0A1931' : '#6B7FA3', margin: 0, flex: 1 }}>{item.label}</p>
                {item.status === 'done' && <span style={{ fontSize: 10, fontWeight: 700, color: '#1D4ED8', background: '#EFF6FF', padding: '2px 8px', borderRadius: 10 }}>Done</span>}
                {item.status === 'pending' && <span style={{ fontSize: 10, color: '#B3CFE5' }}>→</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
