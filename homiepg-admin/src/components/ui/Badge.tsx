type Status = string

const cfg: Record<string, { bg: string; color: string; dot: string }> = {
  active:      { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  live:        { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  approved:    { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  verified:    { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  resolved:    { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  pending:     { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  in_progress: { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  rejected:    { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  suspended:   { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  banned:      { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  open:        { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  inactive:    { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  closed:      { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  critical:    { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  high:        { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  medium:      { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  low:         { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
}

export default function Badge({ status, size = 'sm' }: { status: Status; size?: 'sm' | 'xs' }) {
  const c = cfg[status?.toLowerCase()] ?? { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' }
  const label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'xs' ? '2px 7px' : '3px 9px',
      borderRadius: 20, fontSize: size === 'xs' ? 10 : 11, fontWeight: 600,
      background: c.bg, color: c.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {label}
    </span>
  )
}
