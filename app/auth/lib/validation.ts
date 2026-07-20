// ─── Field-level validation helpers ───────────────────────────────────────────

export function validateFullName(v: string): string | null {
  if (!v.trim()) return 'Full name is required'
  if (v.trim().length < 2) return 'Name must be at least 2 characters'
  return null
}

export function validatePhone(v: string): string | null {
  const digits = v.replace(/\D/g, '')
  if (!digits) return 'Phone number is required'
  if (digits.length !== 10) return 'Enter a valid 10-digit mobile number'
  if (!/^[6-9]/.test(digits)) return 'Number must start with 6, 7, 8, or 9'
  return null
}

export function validateEmail(v: string): string | null {
  if (!v.trim()) return 'Email address is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address'
  return null
}

export function validateOtp(v: string): string | null {
  if (v.length !== 6) return 'Enter the complete 6-digit code'
  if (!/^\d{6}$/.test(v)) return 'OTP must be digits only'
  return null
}
