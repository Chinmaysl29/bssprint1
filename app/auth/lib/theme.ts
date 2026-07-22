// ─── HomiePG Auth — Local Theme Constants ─────────────────────────────────────
// Used when no global theme file is present. Reference these in className strings
// via arbitrary Tailwind values, or import directly for inline styles.

export const colors = {
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

export const BRAND_BLUE = '#2563eb'
export const BRAND_BLUE_DARK = '#1d4ed8'
export const BRAND_BLUE_LIGHT = '#eff6ff'

// Step meta — label shown in the stepper
export const OWNER_STEPS = [
  'Welcome',
  'Your Info',
  'Account Type',
  'Confirm',
  'Verify Email',
  'Onboarding',
]

export const CUSTOMER_STEPS = [
  'Welcome',
  'Your Info',
  'Account Type',
  'Booking For',
  'Nationality',
  'Documents',
  'Review',
  'Done',
]
