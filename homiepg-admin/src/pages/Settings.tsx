import { useState } from 'react'
import { User, Sliders, Database, Shield } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'

const tabs = [
  { label: 'Admin Profile', icon: User },
  { label: 'Platform Config', icon: Sliders },
  { label: 'Security', icon: Shield },
  { label: 'System', icon: Database },
]

function Field({ label, value, type = 'text', readOnly }: { label: string; value: string; type?: string; readOnly?: boolean }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <input type={type} defaultValue={value} readOnly={readOnly}
        style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 12, outline: 'none', boxSizing: 'border-box', color: '#0A1931', background: readOnly ? '#F6FAFD' : '#FAFCFF', cursor: readOnly ? 'not-allowed' : 'text' }} />
    </div>
  )
}

function Toggle({ label, description, defaultOn = false }: { label: string; description?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F6FAFD' }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{label}</p>
        {description && <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{description}</p>}
      </div>
      <button onClick={() => setOn(!on)} style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: on ? '#0A1931' : '#D9E3EC', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('Admin Profile')
  const [commission, setCommission] = useState('2')

  return (
    <div>
      <PageHeader title="Settings" subtitle="Admin profile and platform configuration" />

      <div style={{ display: 'flex', gap: 20 }}>
        {/* Sidebar nav */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8EEF5', overflow: 'hidden' }}>
            {tabs.map(t => (
              <button key={t.label} onClick={() => setTab(t.label)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                background: tab === t.label ? '#EDF4FB' : 'transparent', border: 'none', cursor: 'pointer',
                color: tab === t.label ? '#0A1931' : '#6B7FA3', fontSize: 12, fontWeight: tab === t.label ? 700 : 500,
                borderLeft: tab === t.label ? '3px solid #0A1931' : '3px solid transparent',
                textAlign: 'left', transition: 'all 0.15s',
              }}>
                <t.icon size={14} strokeWidth={1.5} />{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 12, border: '1px solid #E8EEF5', padding: 24 }}>

          {tab === 'Admin Profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#F6FAFD', borderRadius: 12, padding: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 18, fontWeight: 800 }}>SA</div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: 0 }}>Super Administrator</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>admin@homiepg.com · Full Platform Access</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Full Name" value="Super Administrator" />
                <Field label="Email" value="admin@homiepg.com" type="email" />
                <Field label="Role" value="SUPER_ADMIN" readOnly />
                <Field label="Last Login" value="Today, 9:42 AM" readOnly />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Profile</Button>
              </div>
            </div>
          )}

          {tab === 'Platform Config' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Commission (%)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="number" value={commission} onChange={e => setCommission(e.target.value)} min="0" max="10" step="0.5"
                    style={{ width: 100, padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, fontWeight: 700, outline: 'none', textAlign: 'center' }} />
                  <span style={{ fontSize: 12, color: '#6B7FA3' }}>% of each booking amount goes to HomiePG</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supported Cities</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'].map(city => (
                    <label key={city} style={{
                      display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 12, color: '#0A1931',
                      background: ['Bangalore', 'Pune'].includes(city) ? '#EDF4FB' : '#F6FAFD',
                      border: `1px solid ${['Bangalore', 'Pune'].includes(city) ? '#B3CFE5' : '#E8EEF5'}`,
                      borderRadius: 7, padding: '6px 12px',
                    }}>
                      <input type="checkbox" defaultChecked={['Bangalore', 'Pune'].includes(city)} style={{ accentColor: '#0A1931' }} />
                      {city}
                    </label>
                  ))}
                </div>
              </div>

              <Toggle label="Platform Active" description="Enable/disable new registrations and bookings" defaultOn={true} />
              <Toggle label="Owner Registration Open" description="Allow new PG owners to register" defaultOn={true} />
              <Toggle label="Auto-approve Verified Owners" description="Skip manual review for verified owners' new properties" />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Save Configuration</Button>
              </div>
            </div>
          )}

          {tab === 'Security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { l: 'Current Password' },
                { l: 'New Password' },
                { l: 'Confirm Password' },
              ].map(f => (
                <div key={f.l}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.l}</label>
                  <input type="password" placeholder="••••••••"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <Toggle label="Two-Factor Authentication" description="Require OTP on every admin login" />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button>Update Password</Button>
              </div>
            </div>
          )}

          {tab === 'System' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Platform Version',  value: 'v2.4.1' },
                { label: 'Database Status',   value: 'PostgreSQL · Connected' },
                { label: 'Last Backup',       value: 'Today, 03:00 AM' },
                { label: 'Storage Used',      value: '2.4 GB / 50 GB' },
                { label: 'API Status',        value: 'All services operational' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#F6FAFD', borderRadius: 9, border: '1px solid #E8EEF5' }}>
                  <span style={{ fontSize: 12, color: '#6B7FA3', fontWeight: 500 }}>{s.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1931' }}>{s.value}</span>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
