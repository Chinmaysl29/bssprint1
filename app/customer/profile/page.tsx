'use client'
import { useState } from 'react'
import { Camera, MapPin, Phone, Mail, User, Shield, Heart, BedDouble } from 'lucide-react'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import { bookings, wishlist } from '../data/dummy'

function Field({ label, value, type = 'text' }: { label: string; value: string; type?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <input type={type} defaultValue={value} style={{ width: '100%', padding: '10px 13px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#0A1931', background: '#FAFCFF' }} />
    </div>
  )
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false)
  const activeBooking = bookings.find(b => b.status === 'active')

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>My Profile</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>Manage your personal information</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Main form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Avatar section */}
          <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', borderRadius: 18, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#4A7FA7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', border: '3px solid rgba(255,255,255,0.2)' }}>AR</div>
              <button style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={12} color="#0A1931" />
              </button>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Arjun Reddy</p>
              <p style={{ fontSize: 12, color: '#B3CFE5', margin: '0 0 8px' }}>arjun.reddy@email.com</p>
              <StatusBadge status="active" />
            </div>
          </div>

          {/* Personal info */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={16} color="#4A7FA7" strokeWidth={1.5} />
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>Personal Information</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit Profile'}</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Full Name" value="Arjun Reddy" />
              <Field label="Phone" value="9876543210" type="tel" />
              <Field label="Email" value="arjun.reddy@email.com" type="email" />
              <Field label="Age" value="24" type="number" />
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gender</label>
                <select style={{ width: '100%', padding: '10px 13px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', color: '#0A1931', background: '#FAFCFF' }}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <Field label="City" value="Bangalore" />
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Permanent Address" value="123, MG Road, Koramangala, Bangalore" />
              </div>
            </div>
            {editing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <Button onClick={() => setEditing(false)}>Save Changes</Button>
              </div>
            )}
          </div>

          {/* Emergency contact */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Phone size={16} color="#4A7FA7" strokeWidth={1.5} />
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>Emergency Contact</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Contact Name" value="Ramesh Reddy" />
              <Field label="Relationship" value="Father" />
              <Field label="Phone" value="9876500000" type="tel" />
              <Field label="Email" value="ramesh@email.com" type="email" />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Current booking */}
          {activeBooking && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <BedDouble size={15} color="#4A7FA7" strokeWidth={1.5} />
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Current Stay</p>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 4px' }}>{activeBooking.pg}</p>
              <p style={{ fontSize: 12, color: '#6B7FA3', margin: '0 0 10px' }}>{activeBooking.room} · {activeBooking.bed}</p>
              {[['Move-in', activeBooking.moveIn], ['Rent', `₹${activeBooking.amount.toLocaleString()}`]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F6FAFD' }}>
                  <span style={{ fontSize: 12, color: '#6B7FA3' }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Saved PGs */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Heart size={15} color="#4A7FA7" strokeWidth={1.5} />
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Saved PGs ({wishlist.length})</p>
            </div>
            {wishlist.map(pg => (
              <div key={pg.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                <img src={pg.images[0]} style={{ width: 44, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', margin: 0 }}>{pg.name}</p>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>₹{pg.price.toLocaleString()}/mo</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Shield size={15} color="#4A7FA7" strokeWidth={1.5} />
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Security</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Button variant="secondary" size="sm" fullWidth>Change Password</Button>
              <Button variant="secondary" size="sm" fullWidth>Two-Factor Auth</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
