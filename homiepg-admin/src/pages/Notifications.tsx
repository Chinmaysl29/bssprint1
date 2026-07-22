import { useState } from 'react'
import { Bell, Send, CheckCircle, CalendarCheck, FileCheck, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'

const systemLogs = [
  { id: '1', type: 'booking',   title: 'New Booking',         message: 'Pooja V booked Bed B at Green Valley PG',              time: '2 hours ago' },
  { id: '2', type: 'approval',  title: 'Property Pending',    message: 'Skyview PG submitted for approval by Ravi Kumar',       time: '5 hours ago' },
  { id: '3', type: 'complaint', title: 'New Complaint',       message: 'Critical complaint CMP007 raised at Sunrise PG',        time: '8 hours ago' },
  { id: '4', type: 'document',  title: 'Document Uploaded',   message: 'Suresh Patel uploaded Aadhaar for KYC verification',    time: '1 day ago' },
  { id: '5', type: 'rent',      title: 'Rent Reminder Sent',  message: 'June rent reminders sent to 58 active residents',       time: '1 day ago' },
  { id: '6', type: 'booking',   title: 'Booking Confirmed',   message: 'Arjun Mehta booking at Sunrise PG confirmed by owner',  time: '2 days ago' },
  { id: '7', type: 'approval',  title: 'Property Approved',   message: 'Blue Ridge PG approved and set to live by admin',       time: '3 days ago' },
  { id: '8', type: 'document',  title: 'KYC Rejected',        message: "Deepak Joshi's Aadhaar card rejected — blurry image",  time: '3 days ago' },
]

const typeIcons: Record<string, React.ReactNode> = {
  booking:  <CalendarCheck size={14} color="#1D4ED8" />,
  approval: <CheckCircle size={14} color="#1D4ED8" />,
  complaint:<AlertTriangle size={14} color="#DC2626" />,
  document: <FileCheck size={14} color="#D97706" />,
  rent:     <Bell size={14} color="#D97706" />,
}
const typeBg: Record<string, string> = {
  booking: '#EFF6FF', approval: '#EFF6FF', complaint: '#FEF2F2', document: '#FFFBEB', rent: '#FFFBEB',
}

export default function NotificationsPage() {
  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [target, setTarget] = useState('all')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!broadcastTitle || !broadcastMsg) return
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setBroadcastTitle('')
    setBroadcastMsg('')
  }

  return (
    <div>
      <PageHeader title="Notifications Management" subtitle="System logs and broadcast announcements" />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        <Card>
          <CardHeader title="System Notification Log" subtitle="Auto-generated platform events" />
          <div>
            {systemLogs.map((n, i) => (
              <div key={n.id} style={{ display: 'flex', gap: 12, padding: '12px 18px', borderBottom: i < systemLogs.length - 1 ? '1px solid #F6FAFD' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: typeBg[n.type] || '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {typeIcons[n.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: '0 0 2px' }}>{n.title}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                  <p style={{ fontSize: 10, color: '#B3CFE5', margin: '3px 0 0' }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Broadcast Announcement" subtitle="Send platform-wide notification" />
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sent && (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 9, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <CheckCircle size={14} color="#1D4ED8" />
                <p style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600, margin: 0 }}>Announcement sent successfully!</p>
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
              <input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} placeholder="Announcement title..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message</label>
              <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} rows={4} placeholder="Write your announcement..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Audience</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['all', 'All Users'], ['owners', 'PG Owners'], ['customers', 'Customers']].map(([v, l]) => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, color: '#0A1931', background: target === v ? '#EDF4FB' : '#F6FAFD', border: `1px solid ${target === v ? '#B3CFE5' : '#E8EEF5'}`, borderRadius: 8, padding: '7px 12px' }}>
                    <input type="radio" name="target" value={v} checked={target === v} onChange={() => setTarget(v)} style={{ accentColor: '#0A1931' }} />
                    {l}
                  </label>
                ))}
              </div>
            </div>
            <Button icon={Send} onClick={handleSend} disabled={!broadcastTitle || !broadcastMsg} fullWidth>Send Broadcast</Button>

            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Broadcasts</p>
              {[
                { title: 'Platform Maintenance', sub: 'Scheduled downtime June 10, 2–4 AM', time: '5 days ago' },
                { title: 'New Feature: Review System', sub: 'Customers can now rate their PG experience', time: '2 weeks ago' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i === 0 ? '1px solid #F6FAFD' : 'none' }}>
                  <Bell size={14} color="#B3CFE5" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#0A1931', margin: 0 }}>{b.title}</p>
                    <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{b.sub} · {b.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
