'use client'
import type { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function SectionCard({ title, subtitle, icon: Icon, status, children, accent = '#4A7FA7' }: {
  title: string; subtitle?: string; icon: LucideIcon; status?: string; children: ReactNode; accent?: string
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', boxShadow: '0 1px 6px rgba(10,25,49,0.06)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px', borderBottom: '1px solid #E8EEF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFCFE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color={accent} strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>{title}</p>
            {subtitle && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>
      <div style={{ padding: '22px' }}>{children}</div>
    </div>
  )
}
