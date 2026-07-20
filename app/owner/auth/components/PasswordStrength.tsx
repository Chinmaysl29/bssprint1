'use client'

const levels = [
  { label: 'Very Weak', color: '#EF4444', width: '20%' },
  { label: 'Weak',      color: '#F97316', width: '40%' },
  { label: 'Fair',      color: '#EAB308', width: '60%' },
  { label: 'Strong',    color: '#3B82F6', width: '80%' },
  { label: 'Very Strong', color: '#1D4ED8', width: '100%' },
]

function getStrength(password: string): number {
  if (!password) return -1
  let score = 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(Math.floor(score / 1.1), 4)
}

export default function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password)
  if (strength < 0) return null
  const level = levels[strength]

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: level.width, background: level.color, borderRadius: 4, transition: 'all 0.3s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 11, color: level.color, fontWeight: 600 }}>{level.label}</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {levels.map((l, i) => (
            <div key={i} style={{ width: 16, height: 4, borderRadius: 2, background: i <= strength ? l.color : '#E8EEF5', transition: 'background 0.2s' }} />
          ))}
        </div>
      </div>
      {password.length > 0 && password.length < 8 && (
        <p style={{ fontSize: 10, color: '#6B7FA3', margin: '4px 0 0' }}>Use at least 8 characters</p>
      )}
    </div>
  )
}
