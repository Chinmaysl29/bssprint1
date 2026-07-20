'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import AuthInput from '../components/AuthInput'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 20 }}>
      <AuthCard width={420}>
        {sent ? (
          <div style={{ padding: '44px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 18 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(29,78,216,0.15)' }}>
              <CheckCircle size={32} color="#1D4ED8" strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0A1931', margin: '0 0 8px' }}>Reset Link Sent!</h2>
              <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0, lineHeight: 1.6 }}>
                We've sent a password reset link to<br />
                <strong style={{ color: '#0A1931' }}>{email}</strong>
              </p>
            </div>
            <div style={{ background: '#F6FAFD', borderRadius: 12, padding: '14px 16px', width: '100%', textAlign: 'left' }}>
              <p style={{ fontSize: 12, color: '#4A7FA7', margin: 0, lineHeight: 1.6 }}>
                The link will expire in <strong>15 minutes</strong>. Check your spam folder if you don't see it.
              </p>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/owner/auth/login" style={{ textDecoration: 'none', width: '100%' }}>
                <button style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #0A1931, #1A3D63)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Back to Sign In
                </button>
              </Link>
              <button onClick={() => setSent(false)} style={{ width: '100%', padding: '11px', background: '#fff', color: '#4A7FA7', border: '1.5px solid #D9E3EC', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Try a different email
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ padding: '32px 36px 0', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={24} color="#0A1931" strokeWidth={1.5} />
              </div>
              <h2 style={{ fontSize: 21, fontWeight: 800, color: '#0A1931', margin: '0 0 6px' }}>Reset Password</h2>
              <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0, lineHeight: 1.5 }}>
                Enter your email and we'll send you a secure reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px 36px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AuthInput label="Email Address" type="email" placeholder="your@email.com" value={email} onChange={setEmail} icon={Mail} error={error} required />

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', background: loading ? '#6B7FA3' : 'linear-gradient(135deg, #0A1931, #1A3D63)',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 16px rgba(10,25,49,0.25)',
              }}>
                {loading ? (
                  <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Sending...</>
                ) : (
                  <>Send Reset Link <ArrowRight size={16} /></>
                )}
              </button>

              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

              <Link href="/owner/auth/login" style={{ textDecoration: 'none', width: '100%' }}>
                <button type="button" style={{ width: '100%', padding: '11px', background: '#fff', color: '#4A7FA7', border: '1.5px solid #D9E3EC', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </Link>
            </form>
          </>
        )}
      </AuthCard>
    </div>
  )
}
