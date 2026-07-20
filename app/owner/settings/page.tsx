'use client'
import { useState } from 'react'
import { User, Bell, Shield, CreditCard, Building2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'

const tabs = [
  { label: 'Profile', icon: User },
  { label: 'Notifications', icon: Bell },
  { label: 'Security', icon: Shield },
  { label: 'Billing', icon: CreditCard },
  { label: 'PG Settings', icon: Building2 },
]

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>{label}</label>
      <input type={type} defaultValue={defaultValue} style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  )
}

function Toggle({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F6FAFD' }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', margin: 0 }}>{label}</p>
        {description && <p style={{ fontSize: 12, color: '#6B7FA3', margin: '2px 0 0' }}>{description}</p>}
      </div>
      <button onClick={() => setOn(!on)} style={{
        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
        background: on ? '#1A3D63' : '#D9E3EC', position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('Profile')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
            {tabs.map(t => (
              <button key={t.label} onClick={() => setTab(t.label)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                background: tab === t.label ? '#EDF4FB' : 'transparent', border: 'none', cursor: 'pointer',
                color: tab === t.label ? '#1A3D63' : '#6B7FA3', fontSize: 13, fontWeight: tab === t.label ? 600 : 400,
                borderLeft: tab === t.label ? '3px solid #1A3D63' : '3px solid transparent', textAlign: 'left',
              }}>
                <t.icon size={15} strokeWidth={1.5} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 28, boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
          {tab === 'Profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 22, fontWeight: 700 }}>RK</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: 0 }}>Ravi Kumar</p>
                  <p style={{ fontSize: 12, color: '#6B7FA3', margin: '2px 0 6px' }}>PG Owner</p>
                  <Button variant="secondary" size="sm">Change Photo</Button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Full Name" defaultValue="Ravi Kumar" />
                <Field label="Email" defaultValue="ravi@homiepg.com" type="email" />
                <Field label="Phone" defaultValue="9876543200" type="tel" />
                <Field label="City" defaultValue="Bangalore" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div>
              <p style={{ fontSize: 13, color: '#6B7FA3', margin: '0 0 16px' }}>Choose what notifications you want to receive.</p>
              <Toggle label="Rent Payment Alerts" description="Get notified when rent is paid or overdue" defaultOn={true} />
              <Toggle label="Check-in / Check-out" description="Notifications for resident movements" defaultOn={true} />
              <Toggle label="Maintenance Alerts" description="Alerts for room and bed maintenance" defaultOn={true} />
              <Toggle label="Monthly Reports" description="Receive monthly analytics summary" defaultOn={false} />
              <Toggle label="Email Notifications" description="Send notifications to your email" defaultOn={true} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button>Save Preferences</Button>
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Field label="Current Password" type="password" />
              <Field label="New Password" type="password" />
              <Field label="Confirm Password" type="password" />
              <Toggle label="Two-factor Authentication" description="Add an extra layer of security" />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Update Password</Button>
              </div>
            </div>
          )}

          {tab === 'PG Settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Default Rent Due Day" defaultValue="1" type="number" />
                <Field label="Late Fee (%)" defaultValue="5" type="number" />
              </div>
              <Toggle label="Auto-generate Receipts" description="Automatically create receipts on payment" defaultOn={true} />
              <Toggle label="Vacancy Notifications" description="Alert when beds become vacant" defaultOn={true} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Settings</Button>
              </div>
            </div>
          )}

          {tab === 'Billing' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CreditCard size={26} color="#1A3D63" strokeWidth={1.5} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: '0 0 8px' }}>Pro Plan</p>
              <p style={{ fontSize: 13, color: '#6B7FA3', margin: '0 0 20px' }}>Your subscription is active. Next billing: July 1, 2024</p>
              <Button variant="secondary">Manage Billing</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
