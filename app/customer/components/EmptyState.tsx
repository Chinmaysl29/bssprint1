'use client'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export default function EmptyState({ icon: Icon, title, subtitle, action }: {
  icon: LucideIcon; title: string; subtitle?: string; action?: ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '72px 24px', gap: 14 }}>
      <div style={{ width: 72, height: 72, borderRadius: 20, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={32} color="#4A7FA7" strokeWidth={1.5} />
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#0A1931', margin: 0 }}>{title}</p>
      {subtitle && <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0, textAlign: 'center', maxWidth: 320 }}>{subtitle}</p>}
      {action}
    </div>
  )
}
