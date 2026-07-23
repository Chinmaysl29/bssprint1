'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Lock, ArrowRight, Building2, Check, Shield, Eye, EyeOff } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import AuthStepper from '../components/AuthStepper'

/* ── password strength ── */
function getStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: '', color: '#E8EEF5' }
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  const map = [
    { label: 'Too short', color: '#EF4444' },
    { label: 'Weak', color: '#F97316' },
    { label: 'Fair', color: '#EAB308' },
    { label: 'Good', color: '#22C55E' },
    { label: 'Strong', color: '#16A34A' },
  ]
  return { score: s, ...map[s] }
}

/* ── inline input ── */
function Field({
  label, type = 'text', placeholder, value, onChange, error, icon: Icon, hint, required = false,
}: {
  label: string; type?: string; placeholder?: string; value: string
  onChange: (v: string) => void; error?: string; icon?: any; hint?: string; required?: boolean
}) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)
  const isPwd = type === 'password'

  return (
    <div>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', display: 'block', marginBottom: 6, letterSpacing: '0.01em' }}>
          {label}{required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}>
            <Icon size={15} color={error ? '#DC2626' : focused ? '#4A7FA7' : '#9BADC2'} strokeWidth={1.5} />
          </div>
        )}
        <input
          type={isPwd ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: `11px ${isPwd ? '42px' : '13px'} 11px ${Icon ? '40px' : '13px'}`,
            border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4A7FA7' : value ? '#B3CFE5' : '#D9E3EC'}`,
            borderRadius: 11, fontSize: 13, outline: 'none',
            color: '#0A1931', background: error ? '#FFF8F8' : focused ? '#FAFCFF' : '#FAFCFF',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(239,68,68,0.1)' : 'rgba(74,127,167,0.1)'}` : 'none',
            transition: 'all 0.18s',
          }}
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(s => !s)}
            style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9BADC2', display: 'flex', padding: 0 }}>
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: '#DC2626', margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '5px 0 0' }}>{hint}</p>}
    </div>
  )
}

export default function OwnerRegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const strength = getStrength(form.password)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    else if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address'
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Enter a valid 10-digit mobile number'
    if (form.password.length < 8) e.password = 'Minimum 8 characters required'
    else if (strength.score < 2) e.password = 'Password is too weak — add numbers or symbols'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!agreed) e.agreed = 'Please accept the terms & conditions to continue'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    router.push('/owner/auth/verify-email')
  }

  const completedFields = [form.name, form.email, form.phone, form.password, form.confirm].filter(Boolean).length
  const formProgress = Math.round((completedFields / 5) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 20 }}>
      <AuthStepper current={1} />

      <AuthCard width={500}>
        {/* Card header */}
        <div style={{ background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '28px 36px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -24, right: -24, width: 96, height: 96, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -16, left: 60, width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,127,167,0.15)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
              <Building2 size={24} color="#fff" strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Create Your Account</h2>
              <p style={{ fontSize: 12, color: 'rgba(179,207,229,0.75)', margin: 0 }}>Join 500+ PG owners already on HomiePG</p>
            </div>
          </div>

          {/* Form progress */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: 'rgba(179,207,229,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Form Completion</span>
              <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>{formProgress}%</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${formProgress}%`, background: 'linear-gradient(90deg, #B3CFE5, #fff)', borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px 36px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Full Name */}
          <Field label="Full Name" placeholder="e.g. Ravi Kumar" value={form.name} onChange={set('name')} icon={User} error={errors.name} required />

          {/* Email + Phone row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Email Address" type="email" placeholder="ravi@email.com" value={form.email} onChange={set('email')} icon={Mail} error={errors.email} required />
            <Field label="Phone Number" type="tel" placeholder="9876543210" value={form.phone} onChange={set('phone')} icon={Phone} error={errors.phone} hint="+91 10-digit mobile" required />
          </div>

          {/* Password */}
          <div>
            <Field label="Password" type="password" placeholder="Create a strong password" value={form.password} onChange={set('password')} icon={Lock} error={errors.password} required />
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : '#E8EEF5', transition: 'background 0.25s' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { ok: form.password.length >= 8, label: '8+ chars' },
                      { ok: /[A-Z]/.test(form.password), label: 'Uppercase' },
                      { ok: /[0-9]/.test(form.password), label: 'Number' },
                      { ok: /[^A-Za-z0-9]/.test(form.password), label: 'Symbol' },
                    ].map(r => (
                      <span key={r.label} style={{ fontSize: 10, color: r.ok ? '#16A34A' : '#B3CFE5', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Check size={9} strokeWidth={3} color={r.ok ? '#16A34A' : '#D9E3EC'} />{r.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <Field label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} icon={Lock} error={errors.confirm} required />

          {/* Terms */}
          <div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <div
                onClick={() => setAgreed(a => !a)}
                style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${agreed ? '#0A1931' : errors.agreed ? '#DC2626' : '#D9E3EC'}`,
                  background: agreed ? '#0A1931' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
              >
                {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontSize: 12, color: '#4A7FA7', lineHeight: 1.55 }}>
                I agree to HomiePG's{' '}
                <Link href="/terms" style={{ color: '#0A1931', fontWeight: 700, textDecoration: 'none' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: '#0A1931', fontWeight: 700, textDecoration: 'none' }}>Privacy Policy</Link>
                . I confirm the information provided is accurate.
              </span>
            </label>
            {errors.agreed && <p style={{ fontSize: 11, color: '#DC2626', margin: '6px 0 0' }}>⚠ {errors.agreed}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#9BADC2' : 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)',
              color: '#fff', border: 'none', borderRadius: 13, fontSize: 14, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxShadow: loading ? 'none' : '0 6px 24px rgba(10,25,49,0.28)',
              transition: 'all 0.2s', letterSpacing: '-0.01em', marginTop: 4,
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Creating your account...
              </>
            ) : (
              <>Create Account <ArrowRight size={17} strokeWidth={2.5} /></>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <Shield size={11} color="#B3CFE5" strokeWidth={1.5} />
            <span style={{ fontSize: 10, color: '#B3CFE5' }}>256-bit SSL encrypted · Your data is never shared</span>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#6B7FA3', margin: 0 }}>
            Already have an account?{' '}
            <Link href="/owner/auth/login" style={{ color: '#0A1931', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </form>
      </AuthCard>

      <Link href="/owner/auth" style={{ fontSize: 12, color: 'rgba(179,207,229,0.6)', textDecoration: 'none' }}>
        ← Back to account type selection
      </Link>
    </div>
  )
}
