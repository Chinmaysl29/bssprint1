'use client'
import { useState } from 'react'
import { CalendarCheck, IndianRupee, Building2, Tag, X, Bell } from 'lucide-react'
import { notifications as allNotifs } from '../data/dummy'

const typeConfig: Record<string, { icon: any; bg: string; color: string }> = {
  booking: { icon: CalendarCheck, bg: '#EFF6FF', color: '#1D4ED8' },
  payment: { icon: IndianRupee, bg: '#FFFBEB', color: '#D97706' },
  pg:      { icon: Building2, bg: '#F1F5F9', color: '#475569' },
  offer:   { icon: Tag, bg: '#FFF0F3', color: '#BE185D' },
}

const filterTabs = ['All', 'Today', 'This Week', 'Older']

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(allNotifs)
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All' ? notifs : notifs.filter(n => n.date === activeFilter)
  const unread = notifs.filter(n => !n.read).length
  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const dismiss = (id: string) => setNotifs(n => n.filter(x => x.id !== id))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>Notifications</h1>
          <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>{unread} unread notifications</p>
        </div>
        {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 12, fontWeight: 600, color: '#4A7FA7', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all as read</button>}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
        {filterTabs.map(t => (
          <button key={t} onClick={() => setActiveFilter(t)} style={{
            padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none',
            background: activeFilter === t ? '#0A1931' : 'transparent', color: activeFilter === t ? '#fff' : '#6B7FA3',
          }}>{t}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Bell size={40} color="#B3CFE5" strokeWidth={1} style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#0A1931' }}>No notifications</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 680 }}>
          {filtered.map(n => {
            const cfg = typeConfig[n.type] ?? typeConfig.pg
            const Icon = cfg.icon
            return (
              <div key={n.id} style={{ background: n.read ? '#FAFCFE' : '#fff', borderRadius: 14, border: `1px solid ${n.read ? '#E8EEF5' : '#D9E3EC'}`, padding: '16px 20px', display: 'flex', gap: 14, position: 'relative', transition: 'all 0.2s' }}>
                {!n.read && <div style={{ position: 'absolute', top: 14, right: 48, width: 8, height: 8, borderRadius: '50%', background: '#0A1931' }} />}
                <div style={{ width: 42, height: 42, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={cfg.color} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{n.title}</p>
                    <span style={{ fontSize: 11, color: '#6B7FA3', whiteSpace: 'nowrap', marginLeft: 12 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#6B7FA3', margin: '5px 0 0', lineHeight: 1.6 }}>{n.message}</p>
                </div>
                <button onClick={() => dismiss(n.id)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.5, display: 'flex' }}>
                  <X size={13} color="#6B7FA3" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
