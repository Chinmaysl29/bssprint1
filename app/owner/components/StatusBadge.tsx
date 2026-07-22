'use client'

type Status = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' | 'paid' | 'overdue' | string

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  available:   { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  occupied:    { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
  reserved:    { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  maintenance: { bg: '#F5F3FF', text: '#5B21B6', dot: '#8B5CF6' },
  active:      { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  inactive:    { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF' },
  pending:     { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' },
  approved:    { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  rejected:    { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
  paid:        { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' },
  overdue:     { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status?.toLowerCase()] ?? { bg: '#F3F4F6', text: '#374151', dot: '#9CA3AF' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
      background: cfg.bg, color: cfg.text,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
