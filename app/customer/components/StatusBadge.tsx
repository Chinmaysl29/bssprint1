'use client'

const cfg: Record<string, { bg: string; color: string; dot: string }> = {
  available:   { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  occupied:    { bg: '#EEF2FF', color: '#3730A3', dot: '#6366F1' },
  reserved:    { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  maintenance: { bg: '#F8FAFC', color: '#94A3B8', dot: '#CBD5E1' },
  active:      { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  pending:     { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  completed:   { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  confirmed:   { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  cancelled:   { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  uploaded:    { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  rejected:    { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  published:   { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
}

export default function StatusBadge({ status }: { status: string }) {
  const c = cfg[status?.toLowerCase()] ?? { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
