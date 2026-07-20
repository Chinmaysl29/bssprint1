'use client'
import { useState } from 'react'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'

interface Props {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  error?: string
  icon?: LucideIcon
  hint?: string
  required?: boolean
}

export default function AuthInput({ label, type = 'text', placeholder, value, onChange, error, icon: Icon, hint, required }: Props) {
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', letterSpacing: '0.01em' }}>
        {label}{required && <span style={{ color: '#DC2626', marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon size={15} color={error ? '#DC2626' : '#6B7FA3'} strokeWidth={1.5} />
          </div>
        )}
        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: `12px ${isPassword ? '42px' : '14px'} 12px ${Icon ? '40px' : '14px'}`,
            border: `1.5px solid ${error ? '#FECACA' : value ? '#B3CFE5' : '#D9E3EC'}`,
            borderRadius: 11,
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
            color: '#0A1931',
            background: error ? '#FEF9F9' : '#FAFCFF',
            transition: 'all 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = error ? '#FECACA' : '#4A7FA7'; e.target.style.boxShadow = '0 0 0 3px rgba(74,127,167,0.1)' }}
          onBlur={e => { e.target.style.borderColor = error ? '#FECACA' : value ? '#B3CFE5' : '#D9E3EC'; e.target.style.boxShadow = 'none' }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPwd(s => !s)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#6B7FA3' }}>
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p style={{ fontSize: 11, color: '#DC2626', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ {error}</p>}
      {hint && !error && <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>{hint}</p>}
    </div>
  )
}
