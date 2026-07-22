import type { ReactNode } from 'react'

export default function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: ReactNode
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0A1931', margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </div>
  )
}
