'use client'
import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface StepShellProps {
  title: string
  subtitle?: string
  onBack?: () => void
  children: React.ReactNode
  maxWidth?: string
}

export function StepShell({
  title,
  subtitle,
  onBack,
  children,
  maxWidth = 'max-w-md',
}: StepShellProps) {
  return (
    <div className={`w-full ${maxWidth} mx-auto px-4 py-6 flex flex-col gap-6`}>
      {/* Back + title */}
      <div className="flex flex-col gap-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-1 -ml-1 w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        )}
        <h2 className="text-2xl font-bold text-slate-900 leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 animate-fade-in">
        {children}
      </div>
    </div>
  )
}

/* ── Shared field components ──────────────────────────────────────────────── */
interface FieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  hint?: string
}

export function Field({ label, required, error, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={[
        'w-full px-4 py-3 rounded-xl border-2 text-sm font-medium text-slate-800 placeholder:text-slate-400',
        'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        error
          ? 'border-red-300 bg-red-50 focus:border-red-400'
          : 'border-slate-200 bg-white focus:border-blue-500',
        props.disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : '',
        className,
      ].join(' ')}
    />
  )
}

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
}

export function PrimaryButton({
  loading,
  fullWidth = true,
  children,
  className = '',
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white',
        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
        'shadow-md shadow-blue-200 transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
