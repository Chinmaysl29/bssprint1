'use client'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}

const variants = {
  primary:   { bg: '#1A3D63', color: '#fff',     border: '#1A3D63',  hover: '#0A1931' },
  secondary: { bg: '#fff',    color: '#1A3D63',  border: '#D9E3EC',  hover: '#EDF4FB' },
  ghost:     { bg: 'transparent', color: '#4A7FA7', border: 'transparent', hover: '#EDF4FB' },
  danger:    { bg: '#FEF2F2', color: '#DC2626',  border: '#FECACA', hover: '#FEE2E2' },
}

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, type = 'button' }: ButtonProps) {
  const v = variants[variant]
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: size === 'sm' ? '6px 14px' : '9px 18px',
        background: v.bg, color: v.color, border: `1px solid ${v.border}`,
        borderRadius: 9, fontSize: size === 'sm' ? 12 : 13, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s', whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 13 : 15} strokeWidth={1.5} />}
      {children}
    </button>
  )
}
