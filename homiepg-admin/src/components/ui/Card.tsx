import type { ReactNode } from 'react'

export default function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #E8EEF5',
      boxShadow: '0 1px 4px rgba(10,25,49,0.06)', ...style,
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </div>
  )
}
