'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import AuthInput from '../components/AuthInput'
import PasswordStrength from '../components/PasswordStrength'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (password !== confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  if (done) return (
    <AuthCard width={420}>
      <div style={{ padding: '48px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(29,78,216,0.2)' }}>
          <ShieldCheck size={36} color="#1D4ED8" strokeWidth={1.3} />
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: '0 0 8px' }}>Password Reset!</h2>
          <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0, lineHeight: 1.6 }}>
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
        </div>
        <div style={{ background: '#F6FAFD', borderRadius: 12, padding: '14px 18px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={14} color="#1D4ED8" />
            <span style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600 }}>Password updated successfully</span>
          </div>
        </div>
        <button onClick={() => router.push('/owner/auth/login')} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #0A1931, #1A3D63)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Sign In Now <ArrowRight size={16} />
        </button>
      </div>
    </AuthCard>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 20 }}>
      <AuthCard width={420}>
        <div style={{ padding: '32px 36px 0', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={24} color="#0A1931" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: 21, fontWeight: 800, color: '#0A1931', margin: '0 0 6px' }}>Create New Password</h2>
          <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>Choose a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 36px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <AuthInput label="New Password" type="password" placeholder="Create a strong password" value={password} onChange={setPassword} icon={Lock} error={errors.password} required />
            <PasswordStrength password={password} />
          </div>

          <AuthInput label="Confirm New Password" type="password" placeholder="Repeat your new password" value={confirm} onChange={setConfirm} icon={Lock} error={errors.confirm} required />

          {/* Requirements */}
          <div style={{ background: '#F6FAFD', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password Requirements</p>
            {[
              { text: 'At least 8 characters', met: password.length >= 8 },
              { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
              { text: 'One number', met: /[0-9]/.test(password) },
              { text: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
            ].map(r => (
              <div key={r.text} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: r.met ? '#EFF6FF' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.met ? <CheckCircle size={10} color="#1D4ED8" /> : <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />}
                </div>
                <span style={{ fontSize: 11, color: r.met ? '#1D4ED8' : '#94A3B8', fontWeight: r.met ? 600 : 400 }}>{r.text}</span>
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: loading ? '#6B7FA3' : 'linear-gradient(135deg, #0A1931, #1A3D63)',
            color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 16px rgba(10,25,49,0.25)',
          }}>
            {loading ? (
              <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Updating...</>
            ) : (
              <>Update Password <ArrowRight size={16} /></>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </form>
      </AuthCard>
    </div>
  )
}
