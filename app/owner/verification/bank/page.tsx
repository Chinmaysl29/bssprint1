'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Upload, X, Check, ArrowRight, Eye, FileText, Building2, Hash, User, AlertCircle, ChevronRight } from 'lucide-react'

type UploadState = { file: File | null; preview: string | null; status: 'idle' | 'uploading' | 'uploaded' | 'error'; progress: number }
const initUpload = (): UploadState => ({ file: null, preview: null, status: 'idle', progress: 0 })

function Field({ label, placeholder, value, onChange, error, icon: Icon, required = false, hint, type = 'text' }: any) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon size={15} color={focused ? '#4A7FA7' : '#9BADC2'} strokeWidth={1.5} /></div>}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box', padding: `11px 13px 11px ${Icon ? '40px' : '13px'}`,
            border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4A7FA7' : value ? '#B3CFE5' : '#D9E3EC'}`,
            borderRadius: 11, fontSize: 13, outline: 'none', color: '#0A1931', background: '#FAFCFF',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(74,127,167,0.1)'}` : 'none',
            transition: 'all 0.18s',
          }}
        />
      </div>
      {error && <p style={{ fontSize: 11, color: '#DC2626', margin: '5px 0 0' }}>⚠ {error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '5px 0 0' }}>{hint}</p>}
    </div>
  )
}

export default function BankDetailsPage() {
  const router = useRouter()
  const [form, setForm] = useState({ accountHolder: '', accountNumber: '', confirmAccount: '', ifsc: '', bankName: '' })
  const [proofType, setProofType] = useState<'cheque' | 'passbook' | 'statement'>('cheque')
  const [bankProof, setBankProof] = useState<UploadState>(initUpload())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [ifscVerified, setIfscVerified] = useState(false)
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return
    setBankProof({ file, preview: null, status: 'uploading', progress: 0 })
    for (let p = 10; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 80))
      setBankProof(s => ({ ...s, progress: Math.min(p, 100) }))
    }
    const preview = file.type.startsWith('image/') ? await new Promise<string>(res => {
      const reader = new FileReader(); reader.onload = e => res(e.target?.result as string); reader.readAsDataURL(file)
    }) : null
    setBankProof({ file, preview, status: 'uploaded', progress: 100 })
  }

  const verifyIFSC = async () => {
    if (form.ifsc.length === 11) {
      await new Promise(r => setTimeout(r, 800))
      setIfscVerified(true)
      setForm(f => ({ ...f, bankName: 'State Bank of India' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.accountHolder.trim()) errs.accountHolder = 'Account holder name is required'
    if (!form.accountNumber.match(/^\d{9,18}$/)) errs.accountNumber = 'Enter a valid account number'
    if (form.accountNumber !== form.confirmAccount) errs.confirmAccount = 'Account numbers do not match'
    if (!form.ifsc.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) errs.ifsc = 'Enter a valid IFSC code'
    if (!form.bankName.trim()) errs.bankName = 'Bank name is required'
    if (bankProof.status !== 'uploaded') errs.proof = 'Bank proof document is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    router.push('/owner/verification/property')
  }

  const formProgress = Object.values(form).filter(Boolean).length
  const totalFields = Object.keys(form).length
  const isFormReady = formProgress >= totalFields - 1 && bankProof.status === 'uploaded'

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 18px', marginBottom: 14, backdropFilter: 'blur(8px)' }}>
            <CreditCard size={12} color="#fff" strokeWidth={2.5} />
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>KYC VERIFICATION · BANK DETAILS</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Bank Account Details</h1>
          <p style={{ fontSize: 13, color: 'rgba(179,207,229,0.8)', margin: 0 }}>For rental payouts and security deposits. Verified accounts only.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Account Details Card */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '28px 32px', boxShadow: '0 8px 32px rgba(10,25,49,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #EDF4FB, #D9E3EC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={20} color="#1A3D63" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>Account Information</p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>Enter your bank account details accurately</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="Account Holder Name" placeholder="e.g. Ravi Kumar" value={form.accountHolder} onChange={set('accountHolder')} icon={User} error={errors.accountHolder} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Account Number" placeholder="Enter account number" type="password" value={form.accountNumber} onChange={set('accountNumber')} icon={Hash} error={errors.accountNumber} required hint="Hidden for security" />
                <Field label="Confirm Account Number" placeholder="Re-enter account number" value={form.confirmAccount} onChange={set('confirmAccount')} icon={Hash} error={errors.confirmAccount} required />
              </div>

              {/* IFSC with verify */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', display: 'block', marginBottom: 6 }}>IFSC Code<span style={{ color: '#DC2626', marginLeft: 2 }}>*</span></label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text" value={form.ifsc} onChange={e => { set('ifsc')(e.target.value.toUpperCase()); setIfscVerified(false); setForm(f => ({ ...f, bankName: '' })) }}
                      placeholder="e.g. SBIN0001234" maxLength={11}
                      style={{
                        width: '100%', boxSizing: 'border-box', padding: '11px 40px 11px 13px',
                        border: `1.5px solid ${errors.ifsc ? '#FCA5A5' : ifscVerified ? '#86EFAC' : '#D9E3EC'}`,
                        borderRadius: 11, fontSize: 13, outline: 'none', background: '#FAFCFF', color: '#0A1931',
                        letterSpacing: '0.1em', fontFamily: 'monospace', transition: 'all 0.18s',
                      }}
                    />
                    {ifscVerified && <Check size={15} color="#16A34A" strokeWidth={3} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)' }} />}
                  </div>
                  <button type="button" onClick={verifyIFSC} disabled={form.ifsc.length !== 11}
                    style={{ padding: '11px 18px', background: form.ifsc.length === 11 ? '#0A1931' : '#E8EEF5', color: form.ifsc.length === 11 ? '#fff' : '#9BADC2', border: 'none', borderRadius: 11, fontSize: 12, fontWeight: 700, cursor: form.ifsc.length === 11 ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'all 0.2s' }}>
                    Verify IFSC
                  </button>
                </div>
                {errors.ifsc && <p style={{ fontSize: 11, color: '#DC2626', margin: '5px 0 0' }}>⚠ {errors.ifsc}</p>}
              </div>

              <Field label="Bank Name" placeholder="Auto-filled from IFSC" value={form.bankName} onChange={set('bankName')} icon={Building2} error={errors.bankName} required hint={ifscVerified ? '✓ Verified from IFSC lookup' : 'Will be auto-filled after IFSC verification'} />
            </div>
          </div>

          {/* Proof Upload Card */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '28px 32px', boxShadow: '0 8px 32px rgba(10,25,49,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="#D97706" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>Bank Account Proof<span style={{ color: '#DC2626', marginLeft: 4 }}>*</span></p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>Upload one of the accepted document types below</p>
              </div>
            </div>

            {/* Proof Type Selector */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              {[
                { key: 'cheque', label: 'Cancelled Cheque' },
                { key: 'passbook', label: 'Bank Passbook' },
                { key: 'statement', label: 'Bank Statement' },
              ].map(opt => (
                <button key={opt.key} type="button" onClick={() => setProofType(opt.key as any)}
                  style={{
                    padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${proofType === opt.key ? '#0A1931' : '#E8EEF5'}`,
                    background: proofType === opt.key ? '#0A1931' : '#fff',
                    color: proofType === opt.key ? '#fff' : '#6B7FA3',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  {proofType === opt.key && <Check size={11} strokeWidth={3} style={{ marginRight: 5 }} />}
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Upload Zone */}
            {bankProof.status !== 'uploaded' ? (
              <label
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '28px', border: '2px dashed #D9E3EC', borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#4A7FA7')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#D9E3EC')}
              >
                <div style={{ width: 52, height: 52, borderRadius: 16, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={22} color="#4A7FA7" strokeWidth={1.5} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0A1931', margin: '0 0 4px' }}>Upload {proofType === 'cheque' ? 'Cancelled Cheque' : proofType === 'passbook' ? 'Bank Passbook' : 'Bank Statement'}</p>
                  <p style={{ fontSize: 12, color: '#9BADC2', margin: 0 }}>Click to browse or drag & drop · JPG, PNG, PDF · Max 5MB</p>
                </div>
                <input type="file" accept="image/*,application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} style={{ display: 'none' }} />
              </label>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 13, padding: '14px 18px' }}>
                {bankProof.file?.type === 'application/pdf' ? (
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={24} color="#16A34A" strokeWidth={1.5} />
                  </div>
                ) : bankProof.preview ? (
                  <img src={bankProof.preview} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', border: '1.5px solid #BBF7D0' }} />
                ) : null}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#16A34A', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bankProof.file?.name}</p>
                  <p style={{ fontSize: 11, color: '#22C55E', margin: 0 }}>{((bankProof.file?.size ?? 0) / 1024).toFixed(0)} KB · {proofType === 'cheque' ? 'Cancelled Cheque' : proofType === 'passbook' ? 'Passbook' : 'Statement'}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {bankProof.preview && <button type="button" onClick={() => window.open(bankProof.preview!, '_blank')} style={{ width: 32, height: 32, borderRadius: 9, background: '#DCFCE7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={14} color="#16A34A" /></button>}
                  <button type="button" onClick={() => setBankProof(initUpload())} style={{ width: 32, height: 32, borderRadius: 9, background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} color="#DC2626" /></button>
                </div>
              </div>
            )}
            {bankProof.status === 'uploading' && (
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 4, background: '#E8EEF5', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${bankProof.progress}%`, background: 'linear-gradient(90deg, #4A7FA7, #0A1931)', borderRadius: 2, transition: 'width 0.15s' }} />
                </div>
              </div>
            )}
            {errors.proof && <p style={{ fontSize: 11, color: '#DC2626', margin: '10px 0 0' }}>⚠ {errors.proof}</p>}
          </div>

          {/* Info box */}
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 20px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={15} color="rgba(179,207,229,0.8)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: 'rgba(179,207,229,0.8)', margin: 0, lineHeight: 1.6 }}>
                Your bank details are encrypted and used only for rental payouts. We never share your financial information with third parties.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              padding: '15px', borderRadius: 14, background: loading ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #fff, #EDF4FB)',
              color: loading ? 'rgba(255,255,255,0.5)' : '#0A1931', border: 'none', fontSize: 14, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxShadow: !loading ? '0 8px 32px rgba(10,25,49,0.25)' : 'none', transition: 'all 0.2s',
            }}>
            {loading ? (
              <><span style={{ width: 16, height: 16, border: '2px solid rgba(10,25,49,0.3)', borderTopColor: '#0A1931', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Saving bank details...</>
            ) : <>Continue to Property Documents <ChevronRight size={18} strokeWidth={2.5} /></>}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(179,207,229,0.5)', marginTop: 12 }}>Step 5b of 7 · Bank Details</p>
      </div>
    </div>
  )
}
