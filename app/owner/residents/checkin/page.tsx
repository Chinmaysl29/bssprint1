'use client'
import { useState } from 'react'
import { Check, ChevronRight, User, Home, BedDouble, IndianRupee, FileText, CheckCircle } from 'lucide-react'
import Button from '../../components/Button'
import Link from 'next/link'

const steps = ['Personal Info', 'Room Selection', 'Bed Selection', 'Rent Details', 'Documents', 'Review & Finish']

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36, gap: 0 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < current ? '#1A3D63' : i === current ? '#1A3D63' : '#E8EEF5',
              border: i === current ? '2px solid #4A7FA7' : 'none',
              transition: 'all 0.2s',
            }}>
              {i < current
                ? <Check size={14} color="#fff" strokeWidth={2.5} />
                : <span style={{ fontSize: 13, fontWeight: 700, color: i === current ? '#fff' : '#6B7FA3' }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontSize: 10, color: i <= current ? '#0A1931' : '#6B7FA3', fontWeight: i === current ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 60, height: 2, background: i < current ? '#1A3D63' : '#E8EEF5', margin: '0 2px 16px', transition: 'all 0.2s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }} />
    </div>
  )
}

const stepContent = [
  // Step 0: Personal Info
  <div key={0} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    <Field label="Full Name" placeholder="Arjun Mehta" />
    <Field label="Phone" placeholder="9876543210" type="tel" />
    <Field label="Email" placeholder="arjun@email.com" type="email" />
    <Field label="Age" placeholder="24" type="number" />
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Gender</label>
      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
        <option>Male</option><option>Female</option><option>Other</option>
      </select>
    </div>
    <Field label="Permanent Address" placeholder="City, State" />
  </div>,

  // Step 1: Room Selection
  <div key={1} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Building</label>
      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
        <option>Sunrise PG</option><option>Green Valley PG</option><option>Blue Ridge PG</option>
      </select>
    </div>
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Floor</label>
      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
        <option>Ground Floor</option><option>1st Floor</option><option>2nd Floor</option>
      </select>
    </div>
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Room</label>
      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
        <option>101 — Triple (1 Vacant)</option><option>102 — Double (1 Vacant)</option><option>201 — Triple (2 Vacant)</option>
      </select>
    </div>
  </div>,

  // Step 2: Bed Selection
  <div key={2} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
    {['Bed A (Occupied)', 'Bed B (Available)', 'Bed C (Reserved)'].map((b, i) => (
      <div key={i} style={{
        padding: '14px', border: `2px solid ${i === 1 ? '#1A3D63' : '#E8EEF5'}`,
        borderRadius: 10, textAlign: 'center', cursor: i === 1 ? 'pointer' : 'not-allowed',
        background: i === 1 ? '#EDF4FB' : '#F9FAFB', opacity: i === 0 ? 0.5 : 1,
      }}>
        <BedDouble size={20} color={i === 1 ? '#1A3D63' : '#9CA3AF'} style={{ margin: '0 auto 8px' }} />
        <p style={{ fontSize: 12, fontWeight: 600, color: i === 1 ? '#0A1931' : '#9CA3AF', margin: 0 }}>{b}</p>
      </div>
    ))}
  </div>,

  // Step 3: Rent Details
  <div key={3} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
    <Field label="Monthly Rent (₹)" placeholder="8000" type="number" />
    <Field label="Security Deposit (₹)" placeholder="16000" type="number" />
    <Field label="Move-in Date" placeholder="" type="date" />
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Payment Mode</label>
      <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
        <option>Cash</option><option>UPI</option><option>Bank Transfer</option>
      </select>
    </div>
  </div>,

  // Step 4: Documents
  <div key={4} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    {['Aadhaar Card', 'PAN Card', 'Resident Photo', 'Agreement Copy'].map(doc => (
      <div key={doc} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={16} color="#4A7FA7" />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0A1931' }}>{doc}</span>
        </div>
        <Button variant="secondary" size="sm">Upload</Button>
      </div>
    ))}
  </div>,

  // Step 5: Review
  <div key={5} style={{ textAlign: 'center', padding: '20px 0' }}>
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
      <CheckCircle size={32} color="#1A3D63" strokeWidth={1.5} />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A1931', margin: '0 0 8px' }}>Ready to Check-In</h3>
    <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>Review the details and complete the check-in process.</p>
    <div style={{ marginTop: 24, background: '#F6FAFD', borderRadius: 12, padding: 20, textAlign: 'left' }}>
      {[['Resident', 'Arjun Mehta'], ['Room', '101 — Sunrise PG'], ['Bed', 'Bed B'], ['Rent', '₹8,000/month'], ['Deposit', '₹16,000'], ['Move-in', '2024-06-07']].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8EEF5' }}>
          <span style={{ fontSize: 13, color: '#6B7FA3' }}>{k}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{v}</span>
        </div>
      ))}
    </div>
  </div>,
]

export default function CheckInPage() {
  const [step, setStep] = useState(0)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Link href="/owner/residents" style={{ fontSize: 13, color: '#4A7FA7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          ← Back to Residents
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A1931', margin: 0 }}>Resident Check-In</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '4px 0 0' }}>Register a new resident step by step</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: '32px', boxShadow: '0 1px 4px rgba(10,25,49,0.06)', maxWidth: 760 }}>
        <StepIndicator current={step} />

        <div style={{ minHeight: 280 }}>
          {stepContent[step]}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid #E8EEF5' }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Previous</Button>
          {step < steps.length - 1
            ? <Button onClick={() => setStep(s => s + 1)} icon={ChevronRight}>Continue</Button>
            : <Button icon={CheckCircle}>Complete Check-In</Button>
          }
        </div>
      </div>
    </div>
  )
}
