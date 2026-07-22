'use client'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: LucideIcon
  iconRight?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit'
}

const v = {
  primary:   { bg: '#0A1931', color: '#fff', border: '#0A1931' },
  secondary: { bg: '#fff', color: '#0A1931', border: '#D9E3EC' },
  ghost:     { bg: 'transparent', color: '#4A7FA7', border: 'transparent' },
  danger:    { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
}
const sz = {
  sm: { padding: '6px 14px', fontSize: 12 },
  md: { padding: '10px 20px', fontSize: 13 },
  lg: { padding: '13px 28px', fontSize: 14 },
}

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconR, onClick, disabled, fullWidth, type = 'button' }: Props) {
  const vs = v[variant]; const ss = sz[size]
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      padding: ss.padding, background: vs.bg, color: vs.color, border: `1px solid ${vs.border}`,
      borderRadius: 10, fontSize: ss.fontSize, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.15s', whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : 'auto',
    }}>
      {Icon && <Icon size={size === 'sm' ? 13 : 15} strokeWidth={1.5} />}
      {children}
      {IconR && <IconR size={13} strokeWidth={1.5} />}
    </button>
  )
}
