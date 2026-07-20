import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, ShieldCheck, Home } from 'lucide-react'

export default function Login() {
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('admin@homiepg.com')
  const [password, setPassword] = useState('admin123')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (!ok) setError('Invalid credentials. Use admin@homiepg.com / admin123')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 60%, #4A7FA7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* Background circles */}
      <div style={{ position: 'fixed', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'fixed', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

      <div style={{ width: 420, position: 'relative' }}>
        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 36px', boxShadow: '0 32px 80px rgba(10,25,49,0.4)' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: '#0A1931', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Home size={24} color="#fff" strokeWidth={1.5} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: '0 0 4px', letterSpacing: '-0.02em' }}>HomiePG Admin</h1>
            <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>Super Administrator Portal</p>
          </div>

          {/* Security badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 9, padding: '10px 14px', marginBottom: 24 }}>
            <ShieldCheck size={15} color="#1D4ED8" strokeWidth={1.5} />
            <p style={{ fontSize: 11, color: '#1D4ED8', margin: 0, fontWeight: 600 }}>Restricted access — Super Administrators only</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#0A1931', background: '#FAFCFF' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ width: '100%', padding: '11px 42px 11px 14px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', color: '#0A1931', background: '#FAFCFF' }}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  {show ? <EyeOff size={15} color="#6B7FA3" /> : <Eye size={15} color="#6B7FA3" />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 13px' }}>
                <p style={{ fontSize: 12, color: '#DC2626', margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: loading ? '#6B7FA3' : '#0A1931', color: '#fff',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', marginTop: 4,
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#B3CFE5', marginTop: 20 }}>
            Demo: admin@homiepg.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
