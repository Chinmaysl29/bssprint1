'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Building2, Phone, MapPin, Calendar, Briefcase, Upload, X, Check, ArrowRight, Camera } from 'lucide-react'

function Field({
  label, type = 'text', placeholder, value, onChange, error, icon: Icon, required = false, hint
}: any) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
            <Icon size={15} color={error ? '#DC2626' : focused ? '#4A7FA7' : '#9BADC2'} strokeWidth={1.5} />
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: `11px 13px`,
              border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4A7FA7' : value ? '#B3CFE5' : '#D9E3EC'}`,
              borderRadius: 11, fontSize: 13, outline: 'none',
              color: '#0A1931', background: focused ? '#FAFCFF' : '#FAFCFF',
              boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(74,127,167,0.1)'}` : 'none',
              transition: 'all 0.18s', fontFamily: 'inherit', resize: 'vertical',
            }}
          />
        ) : type === 'select' ? (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: `11px ${Icon ? '40px' : '13px'} 11px ${Icon ? '40px' : '13px'}`,
              border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4A7FA7' : value ? '#B3CFE5' : '#D9E3EC'}`,
              borderRadius: 11, fontSize: 13, outline: 'none',
              color: value ? '#0A1931' : '#9BADC2', background: focused ? '#FAFCFF' : '#FAFCFF',
              boxShadow: focused ? `0 0 0 3px rgba(74,127,167,0.1)` : 'none',
              transition: 'all 0.18s', cursor: 'pointer',
            }}
          >
            <option value="">{placeholder || 'Select...'}</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: `11px 13px 11px ${Icon ? '40px' : '13px'}`,
              border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4A7FA7' : value ? '#B3CFE5' : '#D9E3EC'}`,
              borderRadius: 11, fontSize: 13, outline: 'none',
              color: '#0A1931', background: focused ? '#FAFCFF' : '#FAFCFF',
              boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(74,127,167,0.1)'}` : 'none',
              transition: 'all 0.18s',
            }}
          />
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: '#DC2626', margin: '5px 0 0' }}>⚠ {error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '5px 0 0' }}>{hint}</p>}
    </div>
  )
}

export default function ProfileCompletionPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '', gender: '', dob: '', phone: '', altPhone: '',
    businessName: '', experience: '', occupation: '', address: '', city: '', state: '', pincode: ''
  })
  const [photo, setPhoto] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(e => ({ ...e, photo: 'Photo must be less than 2MB' }))
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => setPhoto(ev.target?.result as string)
      reader.readAsDataURL(file)
      setErrors(e => ({ ...e, photo: '' }))
    }
  }

  const requiredFields = ['fullName', 'gender', 'dob', 'phone', 'businessName', 'address', 'city', 'state', 'pincode']
  const filledCount = requiredFields.filter(k => form[k as keyof typeof form]).length + (photo ? 1 : 0)
  const progress = Math.round((filledCount / (requiredFields.length + 1)) * 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.gender) errs.gender = 'Please select gender'
    if (!form.dob) errs.dob = 'Date of birth is required'
    if (!form.phone.match(/^[6-9]\d{9}$/)) errs.phone = 'Enter valid 10-digit mobile'
    if (!form.businessName.trim()) errs.businessName = 'Business name is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.state.trim()) errs.state = 'State is required'
    if (!form.pincode.match(/^\d{6}$/)) errs.pincode = 'Enter valid 6-digit pincode'
    if (!photo) errs.photo = 'Profile photo is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    router.push('/owner/verification/identity')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 18px', marginBottom: 14 }}>
            <Check size={12} color="#4ADE80" strokeWidth={3} />
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>EMAIL VERIFIED</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Complete Your Profile</h1>
          <p style={{ fontSize: 14, color: 'rgba(179,207,229,0.8)', margin: 0 }}>Help us verify your identity and business details</p>
        </div>

        {/* Progress Card */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '20px 24px', marginBottom: 24, boxShadow: '0 8px 32px rgba(10,25,49,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #EDF4FB, #D9E3EC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#1A3D63" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Profile Completion</p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>{filledCount} of {requiredFields.length + 1} fields completed</p>
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: progress === 100 ? '#16A34A' : '#4A7FA7' }}>{progress}%</div>
          </div>
          <div style={{ height: 6, background: '#EDF4FB', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: progress === 100 ? 'linear-gradient(90deg, #16A34A, #22C55E)' : 'linear-gradient(90deg, #4A7FA7, #1A3D63)',
              borderRadius: 3, transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Main Form Card */}
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 18, padding: '32px 36px', boxShadow: '0 12px 48px rgba(10,25,49,0.2)' }}>
          {/* Profile Photo */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', marginBottom: 12 }}>Profile Photo<span style={{ color: '#DC2626', marginLeft: 2 }}>*</span></p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                border: photo ? 'none' : '2px dashed #D9E3EC',
                background: photo ? `url(${photo}) center/cover` : '#F6FAFD',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {!photo && <Camera size={32} color="#B3CFE5" strokeWidth={1.5} />}
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    style={{
                      position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(220,38,38,0.9)', border: 'none', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <X size={14} color="#fff" strokeWidth={2.5} />
                  </button>
                )}
              </div>
              <label style={{
                padding: '9px 20px', background: '#0A1931', color: '#fff', borderRadius: 11,
                fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', gap: 7, transition: 'all 0.2s',
              }}>
                <Upload size={14} /> {photo ? 'Change Photo' : 'Upload Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
              {errors.photo && <p style={{ fontSize: 11, color: '#DC2626', margin: 0 }}>⚠ {errors.photo}</p>}
              <p style={{ fontSize: 10, color: '#B3CFE5', margin: 0 }}>JPG, PNG · Max 2MB · Passport size recommended</p>
            </div>
          </div>

          <div style={{ height: 1, background: '#EDF4FB', margin: '0 0 24px' }} />

          {/* Personal Details */}
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} strokeWidth={2} /> Personal Details
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <Field label="Full Name" placeholder="e.g. Ravi Kumar" value={form.fullName} onChange={set('fullName')} icon={User} error={errors.fullName} required />
            <Field label="Gender" type="select" placeholder="Select gender" value={form.gender} onChange={set('gender')} error={errors.gender} required />
            <Field label="Date of Birth" type="date" value={form.dob} onChange={set('dob')} icon={Calendar} error={errors.dob} required />
            <Field label="Phone Number" type="tel" placeholder="9876543210" value={form.phone} onChange={set('phone')} icon={Phone} error={errors.phone} hint="+91 10-digit mobile" required />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Alternative Number" type="tel" placeholder="Optional" value={form.altPhone} onChange={set('altPhone')} icon={Phone} hint="For emergency contact" />
            </div>
          </div>

          {/* Business Details */}
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} strokeWidth={2} /> Business Information
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <Field label="Business Name" placeholder="e.g. Kumar's PG" value={form.businessName} onChange={set('businessName')} icon={Building2} error={errors.businessName} required />
            <Field label="Experience (Years)" type="number" placeholder="e.g. 5" value={form.experience} onChange={set('experience')} icon={Briefcase} hint="Years in PG business" />
            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Current Occupation" placeholder="e.g. Full-time PG Owner / Part-time + Job" value={form.occupation} onChange={set('occupation')} icon={Briefcase} />
            </div>
          </div>

          {/* Address */}
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={16} strokeWidth={2} /> Residential Address
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Address" type="textarea" placeholder="Flat/House No, Street, Landmark" value={form.address} onChange={set('address')} error={errors.address} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Field label="City" placeholder="e.g. Bangalore" value={form.city} onChange={set('city')} icon={MapPin} error={errors.city} required />
              <Field label="State" placeholder="e.g. Karnataka" value={form.state} onChange={set('state')} error={errors.state} required />
              <Field label="Pincode" type="text" placeholder="560001" value={form.pincode} onChange={set('pincode')} error={errors.pincode} required />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || progress < 100}
            style={{
              width: '100%', padding: '15px', marginTop: 28,
              background: loading || progress < 100 ? '#B3CFE5' : 'linear-gradient(135deg, #0A1931, #1A3D63)',
              color: '#fff', border: 'none', borderRadius: 13, fontSize: 14, fontWeight: 800,
              cursor: loading || progress < 100 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxShadow: loading || progress < 100 ? 'none' : '0 8px 28px rgba(10,25,49,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Saving profile...
              </>
            ) : progress < 100 ? (
              `Complete ${requiredFields.length + 1 - filledCount} more fields`
            ) : (
              <>Continue to KYC Documents <ArrowRight size={17} strokeWidth={2.5} /></>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(179,207,229,0.6)', marginTop: 20 }}>
          Step 4 of 7 · Profile Completion
        </p>
      </div>
    </div>
  )
}
