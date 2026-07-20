'use client'
import React, { useRef, useEffect } from 'react'

interface OtpInputProps {
  value: string
  onChange: (v: string) => void
  length?: number
  disabled?: boolean
  error?: string
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === 'Backspace') {
      if (value[idx]) {
        // Clear current
        const arr = value.split('')
        arr[idx] = ''
        onChange(arr.join(''))
      } else if (idx > 0) {
        // Move back
        inputs.current[idx - 1]?.focus()
        const arr = value.split('')
        arr[idx - 1] = ''
        onChange(arr.join(''))
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = (value || '').split('')
    while (arr.length < length) arr.push('')
    arr[idx] = char
    const next = arr.join('')
    onChange(next)
    if (char && idx < length - 1) {
      inputs.current[idx + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted.padEnd(length, '').slice(0, length))
      inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    }
    e.preventDefault()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2.5" onPaste={handlePaste} aria-label="OTP input">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKey(e, i)}
            disabled={disabled}
            aria-label={`Digit ${i + 1}`}
            className={[
              'w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
              error
                ? 'border-red-400 bg-red-50 text-red-700'
                : value[i]
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-800',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
            style={{ height: '52px', width: '44px' }}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
