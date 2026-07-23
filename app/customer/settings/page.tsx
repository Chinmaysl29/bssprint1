'use client'
import { useState } from 'react'
import { Bell, Shield, Eye, Sliders, User } from 'lucide-react'
import Button from '../components/Button'

const tabs = [
  { label: 'Preferences', icon: Sliders },
  { label: 'Notifications', icon: Bell },
  { label: 'Privacy', icon: Eye },
  { label: 'Security', icon: Shield },
  { label: 'Account', icon: User },
]

function Toggle({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #F6FAFD' }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', margin: 0 }}>{label}</p>
        {description && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>{description}</p>}
      </div>
      <button onClick={() => setOn(!on)} style={{ width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: on ? '#0A1931' : '#D9E3EC', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('Preferences')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>Manage your preferences and account</p>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden' }}>
            {tabs.map(t => (
              <button key={t.label} onClick={() => setTab(t.label)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: tab === t.label ? '#EDF4FB' : 'transparent', border: 'none', cursor: 'pointer', color: tab === t.label ? '#0A1931' : '#6B7FA3', fontSize: 13, fontWeight: tab === t.label ? 700 : 500, borderLeft: tab === t.label ? '3px solid #0A1931' : '3px solid transparent', textAlign: 'left', transition: 'all 0.15s' }}>
                <t.icon size={15} strokeWidth={1.5} />{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 28 }}>
          {tab === 'Preferences' && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Search Preferences</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                {[['Preferred City', 'Bangalore'], ['Budget Range', '₹5,000 – ₹15,000'], ['Preferred Area', 'Koramangala'], ['Room Type', 'Triple Sharing']].map(([l, v]) => (
                  <div key={l}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</label>
                    <input defaultValue={v} style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <Toggle label="Food Required" description="Only show PGs with food facility" defaultOn={true} />
              <Toggle label="WiFi Required" description="Only show PGs with WiFi" defaultOn={true} />
              <Toggle label="Show Verified Only" description="Filter to verified PGs only" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button>Save Preferences</Button>
              </div>
            </div>
          )}

          {tab === 'Notifications' && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Notification Preferences</p>
              <Toggle label="Booking Updates" description="Confirmations, cancellations, reminders" defaultOn={true} />
              <Toggle label="Payment Reminders" description="Rent due and payment receipts" defaultOn={true} />
              <Toggle label="PG Updates" description="Amenity changes from your current PG" defaultOn={true} />
              <Toggle label="New PG Alerts" description="When new PGs match your preferences" />
              <Toggle label="Offers & Promotions" description="Discounts and cashback offers" />
              <Toggle label="Email Notifications" description="Receive updates via email" defaultOn={true} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button>Save Settings</Button>
              </div>
            </div>
          )}

          {tab === 'Privacy' && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Privacy Settings</p>
              <Toggle label="Show Profile to Owners" description="Allow PG owners to view your profile" defaultOn={true} />
              <Toggle label="Share Location" description="For accurate distance calculations" defaultOn={true} />
              <Toggle label="Review Visibility" description="Make your reviews publicly visible" defaultOn={true} />
              <Toggle label="Activity Status" description="Show when you were last active" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <Button>Save Settings</Button>
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ l: 'Current Password', p: '' }, { l: 'New Password', p: '' }, { l: 'Confirm New Password', p: '' }].map(f => (
                <div key={f.l}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.l}</label>
                  <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <Toggle label="Two-Factor Authentication" description="Add extra security to your account" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <Button>Update Password</Button>
              </div>
            </div>
          )}

          {tab === 'Account' && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Account Management</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ padding: '16px 20px', background: '#F6FAFD', borderRadius: 12, border: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Download My Data</p>
                    <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>Get a copy of all your data</p>
                  </div>
                  <Button variant="secondary" size="sm">Download</Button>
                </div>
                <div style={{ padding: '16px 20px', background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', margin: 0 }}>Delete Account</p>
                    <p style={{ fontSize: 11, color: '#EF4444', margin: '3px 0 0' }}>This action is irreversible</p>
                  </div>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
