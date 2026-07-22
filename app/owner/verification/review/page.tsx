'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Building2, FileText, CreditCard, Home, Check, Edit2, Send, ChevronRight,
  ShieldCheck, AlertCircle, CheckCircle, Phone, Mail, Calendar, MapPin
} from 'lucide-react'

const DUMMY_DATA = {
  basic: {
    fullName: 'Ravi Kumar',
    email: 'ravi.kumar@email.com',
    phone: '+91 98765 43210',
    gender: 'Male',
    dob: '15 March 1988',
    altPhone: '+91 98123 45678',
  },
  business: {
    businessName: "Kumar's Premium PG",
    experience: '6 Years',
    occupation: 'Full-time PG Owner',
    address: 'Flat 4B, Sunrise Apartments, 12th Cross, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
  },
  documents: [
    { type: 'Aadhaar Card (Front)', status: 'uploaded', file: 'aadhar_front.jpg', size: '1.2 MB' },
    { type: 'Aadhaar Card (Back)', status: 'uploaded', file: 'aadhar_back.jpg', size: '0.9 MB' },
    { type: 'PAN Card', status: 'uploaded', file: 'pan_card.pdf', size: '0.4 MB' },
    { type: 'Owner Photo', status: 'uploaded', file: 'owner_photo.jpg', size: '0.6 MB' },
  ],
  bank: {
    accountHolder: 'Ravi Kumar',
    accountNumber: '••••••••3456',
    ifsc: 'SBIN0001234',
    bankName: 'State Bank of India',
    proofType: 'Cancelled Cheque',
    proofFile: 'cancelled_cheque.jpg',
  },
  property: [
    { type: 'Sale Deed', file: 'sale_deed.pdf', size: '2.1 MB' },
  ],
}

function SectionCard({ icon: Icon, title, onEdit, children, accent = '#EDF4FB', iconColor = '#1A3D63' }: any) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(10,25,49,0.1)' }}>
      <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0F4F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={19} color={iconColor} strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>{title}</p>
        </div>
        <button
          onClick={onEdit}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: '#F6FAFD', border: '1.5px solid #D9E3EC', borderRadius: 9, fontSize: 12, fontWeight: 600, color: '#4A7FA7', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Edit2 size={12} /> Edit
        </button>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  )
}

function InfoRow({ label, value, half = false }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#9BADC2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
    </div>
  )
}

function DocRow({ type, status, file, size }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F4F9' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FileText size={16} color="#16A34A" strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', margin: 0 }}>{type}</p>
        <p style={{ fontSize: 11, color: '#6B7FA3', margin: '1px 0 0' }}>{file} · {size}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 8, padding: '3px 10px' }}>
        <Check size={11} color="#16A34A" strokeWidth={3} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A' }}>Uploaded</span>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!agreed) { setError('Please confirm the declaration before submitting'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    setLoading(false)
    router.push('/owner/verification/status')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 18px', marginBottom: 14, backdropFilter: 'blur(8px)' }}>
            <CheckCircle size={12} color="#4ADE80" strokeWidth={2.5} />
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>STEP 6 OF 7 · FINAL REVIEW</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Review Your Application</h1>
          <p style={{ fontSize: 13, color: 'rgba(179,207,229,0.8)', margin: 0 }}>Verify all details are correct before submitting for verification</p>
        </div>

        {/* Completeness Banner */}
        <div style={{ background: 'rgba(74, 222, 128, 0.12)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={20} color="#4ADE80" strokeWidth={2} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>All required information collected</p>
            <p style={{ fontSize: 11, color: 'rgba(179,207,229,0.8)', margin: '2px 0 0' }}>5 document categories · Profile 100% complete · Ready for submission</p>
          </div>
          <div style={{ background: '#4ADE80', borderRadius: 9, padding: '5px 14px' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0A1931' }}>5/5</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Basic Information */}
          <SectionCard icon={User} title="Basic Information" onEdit={() => router.push('/owner/verification/profile')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <InfoRow label="Full Name" value={DUMMY_DATA.basic.fullName} />
              <InfoRow label="Email Address" value={DUMMY_DATA.basic.email} />
              <InfoRow label="Phone Number" value={DUMMY_DATA.basic.phone} />
              <InfoRow label="Gender" value={DUMMY_DATA.basic.gender} />
              <InfoRow label="Date of Birth" value={DUMMY_DATA.basic.dob} />
              <InfoRow label="Alternative Number" value={DUMMY_DATA.basic.altPhone} />
            </div>
          </SectionCard>

          {/* Business Information */}
          <SectionCard icon={Building2} title="Business Information" accent="#FEF3C7" iconColor="#D97706" onEdit={() => router.push('/owner/verification/profile')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <InfoRow label="Business Name" value={DUMMY_DATA.business.businessName} />
              <InfoRow label="Experience" value={DUMMY_DATA.business.experience} />
              <InfoRow label="Occupation" value={DUMMY_DATA.business.occupation} />
              <InfoRow label="Pincode" value={DUMMY_DATA.business.pincode} />
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoRow label="Residential Address" value={`${DUMMY_DATA.business.address}, ${DUMMY_DATA.business.city}, ${DUMMY_DATA.business.state} - ${DUMMY_DATA.business.pincode}`} />
              </div>
            </div>
          </SectionCard>

          {/* Uploaded Documents */}
          <SectionCard icon={FileText} title="Identity Documents" accent="#DCFCE7" iconColor="#16A34A" onEdit={() => router.push('/owner/verification/identity')}>
            {DUMMY_DATA.documents.map((d, i) => <DocRow key={i} {...d} />)}
          </SectionCard>

          {/* Bank Details */}
          <SectionCard icon={CreditCard} title="Bank Details" accent="#F0E6FF" iconColor="#7C3AED" onEdit={() => router.push('/owner/verification/bank')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <InfoRow label="Account Holder" value={DUMMY_DATA.bank.accountHolder} />
              <InfoRow label="Account Number" value={DUMMY_DATA.bank.accountNumber} />
              <InfoRow label="IFSC Code" value={DUMMY_DATA.bank.ifsc} />
              <InfoRow label="Bank Name" value={DUMMY_DATA.bank.bankName} />
              <InfoRow label="Proof Type" value={DUMMY_DATA.bank.proofType} />
              <InfoRow label="Proof File" value={DUMMY_DATA.bank.proofFile} />
            </div>
          </SectionCard>

          {/* Property Documents */}
          <SectionCard icon={Home} title="Property Documents" accent="#EDF4FB" iconColor="#1A3D63" onEdit={() => router.push('/owner/verification/property')}>
            {DUMMY_DATA.property.map((d, i) => <DocRow key={i} type="Sale Deed" status="uploaded" file={d.file} size={d.size} />)}
          </SectionCard>

          {/* Declaration */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', boxShadow: '0 4px 20px rgba(10,25,49,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <ShieldCheck size={20} color="#1A3D63" strokeWidth={1.5} />
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>Declaration & Consent</p>
            </div>
            <div style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 12, padding: '16px 18px', marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#4A7FA7', margin: 0, lineHeight: 1.7 }}>
                I hereby declare that all information and documents provided in this application are accurate, genuine, and my own. I understand that providing false information may result in permanent account suspension and legal action as per applicable laws.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <div
                onClick={() => { setAgreed(a => !a); setError('') }}
                style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${agreed ? '#0A1931' : error ? '#DC2626' : '#D9E3EC'}`,
                  background: agreed ? '#0A1931' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
              >
                {agreed && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 13, color: '#0A1931', lineHeight: 1.6, fontWeight: 500 }}>
                I confirm that all the above information is correct and I agree to HomiePG's{' '}
                <span style={{ color: '#4A7FA7', fontWeight: 700 }}>Terms of Service</span>,{' '}
                <span style={{ color: '#4A7FA7', fontWeight: 700 }}>Privacy Policy</span>, and{' '}
                <span style={{ color: '#4A7FA7', fontWeight: 700 }}>KYC Guidelines</span>.
              </span>
            </label>
            {error && <p style={{ fontSize: 12, color: '#DC2626', margin: '10px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}><AlertCircle size={13} /> {error}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '16px', borderRadius: 16,
              background: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #fff, #EDF4FB)',
              color: loading ? 'rgba(255,255,255,0.5)' : '#0A1931',
              border: 'none', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: !loading ? '0 12px 40px rgba(10,25,49,0.35)' : 'none', transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: '2px solid rgba(10,25,49,0.3)', borderTopColor: '#0A1931', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Submitting your application...
              </>
            ) : (
              <>
                <Send size={18} strokeWidth={2.5} />
                Submit for Verification
                <ChevronRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(179,207,229,0.5)', margin: '-8px 0 0' }}>
            Once submitted, our team will review your application within 24–48 hours
          </p>
        </div>
      </div>
    </div>
  )
}
