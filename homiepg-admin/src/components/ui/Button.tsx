import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md'
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

const vs = {
  primary:   { bg: '#0A1931', color: '#fff',    border: '#0A1931' },
  secondary: { bg: '#fff',    color: '#0A1931', border: '#D9E3EC' },
  ghost:     { bg: 'transparent', color: '#4A7FA7', border: 'transparent' },
  danger:    { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  success:   { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
}
const sizes = {
  xs: { p: '4px 10px', fs: 11 },
  sm: { p: '6px 14px', fs: 12 },
  md: { p: '8px 18px', fs: 13 },
}

export default function Button({ children, variant = 'primary', size = 'sm', icon: Icon, onClick, disabled, type = 'button', fullWidth }: Props) {
  const v = vs[variant]; const s = sizes[size]
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: s.p,
      background: v.bg, color: v.color, border: `1px solid ${v.border}`,
      borderRadius: 8, fontSize: s.fs, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      transition: 'all 0.15s', whiteSpace: 'nowrap', width: fullWidth ? '100%' : 'auto',
      justifyContent: fullWidth ? 'center' : 'flex-start',
    }}>
      {Icon && <Icon size={size === 'xs' ? 12 : 14} strokeWidth={1.5} />}
      {children}
    </button>
  )
}
