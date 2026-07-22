'use client'
import { Bell, IndianRupee, Users, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'

const notifications = [
  { id: 1, type: 'payment', title: 'Rent Overdue', message: 'Rohit Sharma (Room 102) has not paid rent for June. Amount: ₹10,000', time: '2 hours ago', read: false },
  { id: 2, type: 'resident', title: 'New Check-in Request', message: 'Priya Sharma has requested to check in to Room 201, Bed B', time: '4 hours ago', read: false },
  { id: 3, type: 'system', title: 'Maintenance Alert', message: 'Bed A in Room 401 (Blue Ridge PG) has been marked for maintenance', time: '6 hours ago', read: false },
  { id: 4, type: 'payment', title: 'Payment Received', message: 'Arjun Mehta has paid ₹8,000 for June. Receipt: REC-001', time: '1 day ago', read: true },
  { id: 5, type: 'resident', title: 'Check-out Request', message: 'Suresh Kumar (Room 401) has submitted a check-out request for Jun 30', time: '2 days ago', read: true },
  { id: 6, type: 'system', title: 'Monthly Report Ready', message: 'Your May 2024 monthly report is ready. Revenue: ₹1,62,000', time: '3 days ago', read: true },
  { id: 7, type: 'payment', title: 'Deposit Refund Due', message: 'Suresh Kumar checkout pending. Refund amount: ₹14,000', time: '3 days ago', read: true },
]

const typeConfig: Record<string, { icon: any; bg: string; color: string }> = {
  payment:  { icon: IndianRupee, bg: '#EFF6FF', color: '#1D4ED8' },
  resident: { icon: Users,       bg: '#F0FDF4', color: '#15803D' },
  system:   { icon: AlertTriangle, bg: '#FFFBEB', color: '#92400E' },
}

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notifications`}
        actions={<Button variant="secondary" size="sm">Mark all as read</Button>}
      />

      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Unread */}
        {unread > 0 && (
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Unread</p>
        )}
        {notifications.filter(n => !n.read).map(n => {
          const cfg = typeConfig[n.type] || typeConfig.system
          const Icon = cfg.icon
          return (
            <div key={n.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #D9E3EC', padding: '16px 20px', display: 'flex', gap: 14, position: 'relative' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A3D63', position: 'absolute', top: 18, right: 16 }} />
              <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color={cfg.color} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{n.title}</p>
                  <span style={{ fontSize: 11, color: '#6B7FA3', whiteSpace: 'nowrap', marginLeft: 12 }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0', lineHeight: 1.5 }}>{n.message}</p>
              </div>
            </div>
          )
        })}

        {/* Read */}
        <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '12px 0 4px' }}>Earlier</p>
        {notifications.filter(n => n.read).map(n => {
          const cfg = typeConfig[n.type] || typeConfig.system
          const Icon = cfg.icon
          return (
            <div key={n.id} style={{ background: '#F9FAFB', borderRadius: 12, border: '1px solid #E8EEF5', padding: '14px 20px', display: 'flex', gap: 14, opacity: 0.8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#E8EEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="#6B7FA3" strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{n.title}</p>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: '3px 0 0' }}>{n.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
