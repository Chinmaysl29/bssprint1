import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: string | number
  sub?: string
  icon: LucideIcon
  accent?: string
  trend?: { value: number; label: string }
}

export default function StatCard({ title, value, sub, icon: Icon, accent = '#4A7FA7', trend }: Props) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #E8EEF5',
      boxShadow: '0 1px 4px rgba(10,25,49,0.06)', display: 'flex', flexDirection: 'column', gap: 10,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent, borderRadius: '12px 0 0 12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 10, color: '#6B7FA3', fontWeight: 700, margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#0A1931', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
          {sub && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>{sub}</p>}
        </div>
        <div style={{ background: accent + '18', borderRadius: 10, padding: 9 }}>
          <Icon size={18} color={accent} strokeWidth={1.5} />
        </div>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: trend.value >= 0 ? '#1D4ED8' : '#DC2626' }}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span style={{ fontSize: 11, color: '#6B7FA3' }}>{trend.label}</span>
        </div>
      )}
    </div>
  )
}
