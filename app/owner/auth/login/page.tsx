'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Building2, Shield } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import AuthInput from '../components/AuthInput'
import AuthStepper from '../components/AuthStepper'

export default function OwnerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address'
    if (password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    setLoginError('')
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    router.push('/owner/auth/success')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 20 }}>
      <AuthStepper current={3} />

      <AuthCard width={440}>
        {/* Header strip */}
        <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', padding: '28px 36px 24px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Building2 size={22} color="#fff" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: 21, fontWeight: 800, color: '#fff', margin: '0 0 5px', letterSpacing: '-0.02em' }}>Welcome Back</h2>
          <p style={{ fontSize: 12, color: 'rgba(179,207,229,0.7)', margin: 0 }}>Sign in to your HomiePG owner account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px 36px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {loginError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '11px 14px', display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 14 }}>⚠</span>
              <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>{loginError}</p>
            </div>
          )}

          <AuthInput label="Email Address" type="email" placeholder="your@email.com" value={email} onChange={setEmail} icon={Mail} error={errors.email} required />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>Password <span style={{ color: '#DC2626' }}>*</span></label>
              <Link href="/owner/auth/forgot-password" style={{ fontSize: 11, color: '#4A7FA7', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <AuthInput label="" placeholder="Enter your password" type="password" value={password} onChange={setPassword} icon={Lock} error={errors.password} />
          </div>

          {/* Remember me */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
            <div onClick={() => setRemember(r => !r)} style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${remember ? '#0A1931' : '#D9E3EC'}`, background: remember ? '#0A1931' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}>
              {remember && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span style={{ fontSize: 12, color: '#4A7FA7' }}>Keep me signed in for 30 days</span>
          </label>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', background: loading ? '#6B7FA3' : 'linear-gradient(135deg, #0A1931, #1A3D63)',
            color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 16px rgba(10,25,49,0.25)', marginTop: 4,
          }}>
            {loading ? (
              <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <Shield size={11} color="#B3CFE5" strokeWidth={1.5} />
            <span style={{ fontSize: 10, color: '#B3CFE5' }}>256-bit SSL encrypted · Your data is safe</span>
          </div>

          <div style={{ borderTop: '1px solid #E8EEF5', paddingTop: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#6B7FA3', margin: 0 }}>
              Don't have an account?{' '}
              <Link href="/owner/auth/register" style={{ color: '#0A1931', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
            </p>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
