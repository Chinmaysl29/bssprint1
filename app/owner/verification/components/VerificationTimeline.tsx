'use client'
import { Check, Clock, FileCheck, UserCheck, Building2, Shield, Star } from 'lucide-react'

const stages = [
  { label: 'Application Submitted',    icon: FileCheck,   status: 'done',    time: 'Jun 7, 2024 · 10:32 AM', note: 'Your verification request has been received.' },
  { label: 'Documents Under Review',   icon: Clock,       status: 'active',  time: 'Jun 7, 2024 · 10:35 AM', note: 'Our team is reviewing your submitted documents.' },
  { label: 'Identity Verification',    icon: UserCheck,   status: 'pending', time: 'Estimated: 12–24 hrs',    note: 'Aadhaar and PAN verification in progress.' },
  { label: 'Business Verification',    icon: Shield,      status: 'pending', time: 'Estimated: 24–36 hrs',    note: 'Bank account and business details validation.' },
  { label: 'Property Verification',    icon: Building2,   status: 'pending', time: 'Estimated: 36–48 hrs',    note: 'Property ownership documents review.' },
  { label: 'Approved & Verified',      icon: Star,        status: 'pending', time: 'Estimated: 24–48 hrs',    note: 'Account fully verified and activated.' },
]

const stateConfig = {
  done:    { bg: '#0A1931',  iconColor: '#fff',    line: '#0A1931', label: '#1D4ED8', labelBg: '#EFF6FF' },
  active:  { bg: '#EDF4FB',  iconColor: '#0A1931', line: '#D9E3EC', label: '#92400E', labelBg: '#FFFBEB' },
  pending: { bg: '#F6FAFD',  iconColor: '#B3CFE5', line: '#E8EEF5', label: '#6B7FA3', labelBg: '#F1F5F9' },
}

export default function VerificationTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {stages.map((s, i) => {
        const cfg = stateConfig[s.status as keyof typeof stateConfig]
        const Icon = s.icon
        return (
          <div key={i} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            {/* Line */}
            {i < stages.length - 1 && (
              <div style={{ position: 'absolute', left: 18, top: 36, width: 2, height: 'calc(100% - 8px)', background: cfg.line, borderRadius: 1 }} />
            )}
            {/* Icon */}
            <div style={{ flexShrink: 0, zIndex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: s.status === 'active' ? '2.5px solid #0A1931' : 'none', boxShadow: s.status === 'active' ? '0 0 0 4px rgba(10,25,49,0.08)' : 'none' }}>
                {s.status === 'done'
                  ? <Check size={15} color="#fff" strokeWidth={2.5} />
                  : <Icon size={15} color={cfg.iconColor} strokeWidth={1.5} />
                }
              </div>
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: i < stages.length - 1 ? 22 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: s.status === 'pending' ? '#6B7FA3' : '#0A1931', margin: 0 }}>{s.label}</p>
                <span style={{ fontSize: 9, fontWeight: 700, color: cfg.label, background: cfg.labelBg, padding: '2px 7px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.status === 'done' ? 'Done' : s.status === 'active' ? 'In Progress' : 'Pending'}
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#6B7FA3', margin: '0 0 4px' }}>{s.note}</p>
              <p style={{ fontSize: 10, color: '#B3CFE5', margin: 0, fontWeight: 500 }}>{s.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
