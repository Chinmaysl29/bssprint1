'use client'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  accent?: string
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, accent = '#4A7FA7' }: StatCardProps) {
  return (
    <div style={{
      background: '#FFFFFF', borderRadius: 14, padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(10,25,49,0.07)', border: '1px solid #E8EEF5',
      display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent, borderRadius: '14px 0 0 14px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: '#6B7FA3', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: '#0A1931', lineHeight: 1 }}>{value}</p>
          {subtitle && <p style={{ fontSize: 12, color: '#6B7FA3', marginTop: 4 }}>{subtitle}</p>}
        </div>
        <div style={{ background: accent + '18', borderRadius: 10, padding: 10 }}>
          <Icon size={20} color={accent} strokeWidth={1.5} />
        </div>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: trend.value >= 0 ? '#2563EB' : '#DC2626' }}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span style={{ fontSize: 12, color: '#6B7FA3' }}>{trend.label}</span>
        </div>
      )}
    </div>
  )
}
