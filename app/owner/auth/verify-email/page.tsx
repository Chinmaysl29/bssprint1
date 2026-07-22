'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, RefreshCw, ArrowRight, CheckCircle, Edit2, Shield, Clock } from 'lucide-react'
import AuthCard from '../components/AuthCard'
import AuthStepper from '../components/AuthStepper'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [resent, setResent] = useState(false)
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState('ravi@email.com')
  const [countdown, setCountdown] = useState(0)
  const [dotAnim, setDotAnim] = useState(0)

  /* subtle pulsing dot animation to suggest "waiting" state */
  useEffect(() => {
    const t = setInterval(() => setDotAnim(d => (d + 1) % 3), 600)
    return () => clearInterval(t)
  }, [])

  const handleResend = () => {
    setResent(true)
    setCountdown(30)
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0 }
        return c - 1
      })
    }, 1000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 20 }}>
      <AuthStepper current={2} />

      <AuthCard width={480}>
        <div style={{ padding: '40px 36px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 22 }}>

          {/* Animated illustration */}
          <div style={{ position: 'relative' }}>
            {/* Outer rings */}
            <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: '1.5px solid rgba(74,127,167,0.15)', animation: 'pulse-ring 2s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1.5px solid rgba(74,127,167,0.2)', animation: 'pulse-ring 2s ease-out infinite 0.3s' }} />
            <style>{`
              @keyframes pulse-ring {
                0% { transform: scale(0.95); opacity: 1; }
                100% { transform: scale(1.15); opacity: 0; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
              }
            `}</style>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #EDF4FB, #D9E3EC)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(74,127,167,0.2)',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <Mail size={42} color="#1A3D63" strokeWidth={1.2} />
            </div>
            {/* Badge */}
            <div style={{ position: 'absolute', top: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(10,25,49,0.15)' }}>
              <Clock size={14} color="#1D4ED8" />
            </div>
          </div>

          {/* Copy */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A1931', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Check Your Email</h2>
            <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0, lineHeight: 1.6 }}>
              We've sent a verification link to your email address. Click the link to activate your account.
            </p>
          </div>

          {/* Email display / edit */}
          {editing ? (
            <div style={{ width: '100%', display: 'flex', gap: 8 }}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '10px 13px', border: '1.5px solid #4A7FA7', borderRadius: 10, fontSize: 13, outline: 'none', boxShadow: '0 0 0 3px rgba(74,127,167,0.1)' }}
              />
              <button
                onClick={() => setEditing(false)}
                style={{ padding: '10px 18px', background: '#0A1931', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
              >
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F6FAFD', border: '1.5px solid #E8EEF5', borderRadius: 12, padding: '11px 18px', width: '100%' }}>
              <Mail size={15} color="#4A7FA7" strokeWidth={1.5} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', flex: 1 }}>{email}</span>
              <button
                onClick={() => setEditing(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 2, color: '#4A7FA7' }}
                title="Change email"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}

          {/* Steps */}
          <div style={{ width: '100%', background: '#F6FAFD', borderRadius: 14, padding: '16px 18px', textAlign: 'left' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#0A1931', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>What to do next</p>
            {[
              { step: '1', text: 'Open the email from HomiePG' },
              { step: '2', text: 'Click the "Verify Email" button in the email' },
              { step: '3', text: 'Return here — you\'ll be redirected automatically' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < 2 ? '1px solid #E8EEF5' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EDF4FB', border: '1.5px solid #D9E3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#1A3D63' }}>{s.step}</span>
                </div>
                <span style={{ fontSize: 12, color: '#4A7FA7', lineHeight: 1.5 }}>{s.text}</span>
              </div>
            ))}
          </div>

          {/* Waiting indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: dotAnim === i ? '#1A3D63' : '#D9E3EC', transition: 'background 0.3s' }} />
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#6B7FA3' }}>Waiting for email verification</span>
          </div>

          {/* Success banner */}
          {resent && (
            <div style={{ width: '100%', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 11, padding: '11px 15px', display: 'flex', gap: 9, alignItems: 'center' }}>
              <CheckCircle size={15} color="#1D4ED8" />
              <p style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600, margin: 0 }}>Verification email resent to {email}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => router.push('/owner/verification/profile')}
              style={{
                width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #0A1931, #1A3D63)',
                color: '#fff', border: 'none', borderRadius: 13, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 6px 24px rgba(10,25,49,0.25)',
              }}
            >
              I've Verified My Email <ArrowRight size={17} />
            </button>

            <button
              onClick={handleResend}
              disabled={countdown > 0}
              style={{
                width: '100%', padding: '12px',
                background: '#fff', color: countdown > 0 ? '#B3CFE5' : '#0A1931',
                border: `1.5px solid ${countdown > 0 ? '#E8EEF5' : '#D9E3EC'}`,
                borderRadius: 13, fontSize: 13, fontWeight: 600,
                cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.2s',
              }}
            >
              <RefreshCw size={14} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
            </button>
          </div>

          {/* Footer notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={11} color="#B3CFE5" strokeWidth={1.5} />
              <span style={{ fontSize: 10, color: '#B3CFE5' }}>Link expires in 24 hours</span>
            </div>
            <span style={{ fontSize: 11, color: '#B3CFE5' }}>Didn't get it? Check your spam or junk folder</span>
          </div>
        </div>
      </AuthCard>

      <Link href="/owner/auth/register" style={{ fontSize: 12, color: 'rgba(179,207,229,0.6)', textDecoration: 'none' }}>
        ← Back to registration
      </Link>
    </div>
  )
}
