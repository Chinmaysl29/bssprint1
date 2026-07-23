'use client'
import { useState } from 'react'
import { CheckCircle, AlertTriangle, FileText, IndianRupee } from 'lucide-react'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import Link from 'next/link'

const resident = {
  name: 'Arjun Mehta', room: '101', bed: 'Bed A', building: 'Sunrise PG',
  moveIn: '2024-01-15', rent: 8000, deposit: 16000, avatar: 'AM',
  pendingRent: 8000, refundAmount: 14000,
}

export default function CheckOutPage() {
  const [done, setDone] = useState(false)

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={36} color="#1A3D63" strokeWidth={1.5} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0A1931', margin: 0 }}>Check-Out Complete</h2>
      <p style={{ fontSize: 13, color: '#6B7FA3' }}>Arjun Mehta has been checked out successfully.</p>
      <Link href="/owner/residents" style={{ textDecoration: 'none' }}>
        <Button>Back to Residents</Button>
      </Link>
    </div>
  )

  return (
    <div>
      <Link href="/owner/residents" style={{ fontSize: 13, color: '#4A7FA7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        ← Back to Residents
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A1931', margin: '0 0 4px' }}>Resident Check-Out</h1>
      <p style={{ fontSize: 13, color: '#6B7FA3', margin: '0 0 28px' }}>Process checkout for {resident.name}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 860 }}>
        {/* Resident Summary */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 24, boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
          <p style={{ fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11, color: '#6B7FA3' }}>Resident Summary</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 16, fontWeight: 700 }}>{resident.avatar}</div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: 0 }}>{resident.name}</p>
              <p style={{ fontSize: 12, color: '#6B7FA3', margin: '2px 0 0' }}>Room {resident.room} · {resident.bed} · {resident.building}</p>
            </div>
          </div>
          {[['Move-in Date', resident.moveIn], ['Monthly Rent', `₹${resident.rent.toLocaleString()}`], ['Deposit Paid', `₹${resident.deposit.toLocaleString()}`]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F6FAFD' }}>
              <span style={{ fontSize: 13, color: '#6B7FA3' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 24, boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Financial Summary</p>

          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <AlertTriangle size={16} color="#D97706" />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', margin: 0 }}>Pending Rent</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#92400E', margin: '2px 0 0' }}>₹{resident.pendingRent.toLocaleString()}</p>
            </div>
          </div>

          {[['Security Deposit', `₹${resident.deposit.toLocaleString()}`], ['Pending Deductions', `- ₹${resident.pendingRent.toLocaleString()}`], ['Refund Amount', `₹${resident.refundAmount.toLocaleString()}`]].map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #F6FAFD' : 'none' }}>
              <span style={{ fontSize: 13, color: '#6B7FA3' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: i === 2 ? 700 : 600, color: i === 2 ? '#1A3D63' : '#0A1931' }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Check-out Date */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Check-Out Date</label>
          <input type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6, marginTop: 14 }}>Reason for Leaving</label>
          <textarea rows={3} placeholder="Optional note..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Actions */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</p>
          <Button variant="secondary" icon={FileText}>Generate Receipt</Button>
          <Button variant="secondary" icon={IndianRupee}>Process Refund</Button>
          <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #E8EEF5' }}>
            <Button onClick={() => setDone(true)} icon={CheckCircle}>Complete Check-Out</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
