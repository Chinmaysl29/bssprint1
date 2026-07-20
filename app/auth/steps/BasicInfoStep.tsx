'use client'
import React, { useState } from 'react'
import { useAuthFlow } from '../hooks/useAuthFlow'
import { Step } from '../types/auth'
import { validateFullName, validatePhone, validateEmail } from '../lib/validation'
import { StepShell, Field, Input, PrimaryButton } from '../components/StepShell'

export function BasicInfoStep() {
  const { state, goTo, setFormData } = useAuthFlow()
  const { formData } = state

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    const nameErr = validateFullName(formData.fullName)
    const phoneErr = validatePhone(formData.phone)
    const emailErr = validateEmail(formData.email)
    if (nameErr) e.fullName = nameErr
    if (phoneErr) e.phone = phoneErr
    if (emailErr) e.email = emailErr
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) goTo(Step.UserType)
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ [field]: e.target.value } as never)
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const isValid =
    !validateFullName(formData.fullName) &&
    !validatePhone(formData.phone) &&
    !validateEmail(formData.email)

  return (
    <StepShell
      title="Tell us about yourself"
      subtitle="We'll use this to set up your account. All fields are required."
      onBack={() => goTo(Step.Welcome)}
    >
      {/* Full Name */}
      <Field label="Full Name" required error={errors.fullName}>
        <Input
          type="text"
          placeholder="e.g. Priya Sharma"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={!!errors.fullName}
          autoFocus
          autoComplete="name"
        />
      </Field>

      {/* Phone */}
      <Field label="Phone Number" required error={errors.phone} hint="10-digit Indian mobile number">
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 flex-shrink-0">
            🇮🇳 +91
          </div>
          <Input
            type="tel"
            placeholder="9876543210"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            maxLength={10}
            inputMode="numeric"
            autoComplete="tel"
            className="flex-1"
          />
        </div>
      </Field>

      {/* Email */}
      <Field label="Email Address" required error={errors.email}>
        <Input
          type="email"
          placeholder="priya@example.com"
          value={formData.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          autoComplete="email"
        />
      </Field>

      <PrimaryButton onClick={handleContinue} disabled={!isValid}>
        Continue
      </PrimaryButton>
    </StepShell>
  )
}
