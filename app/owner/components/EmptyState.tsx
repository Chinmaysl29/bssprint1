'use client'
import { LucideIcon } from 'lucide-react'

export default function EmptyState({ icon: Icon, title, subtitle, action }: {
  icon: LucideIcon; title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: 12 }}>
      <div style={{ background: '#EDF4FB', borderRadius: 16, padding: 20 }}>
        <Icon size={32} color="#4A7FA7" strokeWidth={1.5} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#0A1931', margin: 0 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0, textAlign: 'center' }}>{subtitle}</p>}
      {action}
    </div>
  )
}
