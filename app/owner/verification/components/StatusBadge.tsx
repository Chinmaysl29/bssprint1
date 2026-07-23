'use client'

const cfg: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  pending:   { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', label: 'Pending' },
  uploaded:  { bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6', label: 'Uploaded' },
  verified:  { bg: '#EFF6FF', color: '#1D4ED8', dot: '#1D4ED8', label: 'Verified' },
  approved:  { bg: '#EFF6FF', color: '#1D4ED8', dot: '#1D4ED8', label: 'Approved' },
  rejected:  { bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444', label: 'Rejected' },
  review:    { bg: '#F5F3FF', color: '#5B21B6', dot: '#8B5CF6', label: 'Under Review' },
  completed: { bg: '#EFF6FF', color: '#1D4ED8', dot: '#1D4ED8', label: 'Completed' },
  optional:  { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8', label: 'Optional' },
}

export default function StatusBadge({ status, size = 'sm' }: { status: string; size?: 'xs' | 'sm' }) {
  const c = cfg[status] ?? cfg.pending
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'xs' ? '2px 8px' : '4px 10px',
      borderRadius: 20, fontSize: size === 'xs' ? 10 : 11, fontWeight: 600,
      background: c.bg, color: c.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  )
}
