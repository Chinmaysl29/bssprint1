'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Mail, RefreshCw } from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step } from '../../types/auth'
import { mockVerifyOtp, mockSendOtp } from '../../lib/mock'
import { validateOtp } from '../../lib/validation'
import { OtpInput } from '../../components/OtpInput'
import { StepShell, PrimaryButton } from '../../components/StepShell'

const RESEND_COOLDOWN = 30

export function EmailVerificationStep() {
  const { state, goTo, setFormData, setLoading } = useAuthFlow()
  const { formData, isLoading } = state

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const [resending, setResending] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleVerify = useCallback(async () => {
    const err = validateOtp(otp)
    if (err) { setError(err); return }
    setError('')
    setLoading(true)
    const result = await mockVerifyOtp(formData.email, otp)
    setLoading(false)
    if (result.success) {
      setSuccess(true)
      setFormData({ otp })
      // Auto-advance after brief success flash
      setTimeout(() => goTo(Step.OwnerOnboarding), 900)
    } else {
      setError(result.message)
    }
  }, [otp, formData.email, setLoading, setFormData, goTo])

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && !isLoading && !success) handleVerify()
  }, [otp, handleVerify, isLoading, success])

  const handleResend = async () => {
    if (cooldown > 0 || resending) return
    setResending(true)
    setCooldown(RESEND_COOLDOWN)
    setOtp('')
    setError('')
    await mockSendOtp(formData.email)
    setResending(false)
  }

  return (
    <StepShell
      title="Check your email"
      subtitle={`Enter the 6-digit code sent to ${formData.email}`}
      onBack={() => goTo(Step.OwnerConfirm)}
      maxWidth="max-w-sm"
    >
      {/* Email icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shadow-sm">
          <Mail size={32} className="text-blue-600" />
        </div>
      </div>

      {/* OTP input */}
      <OtpInput
        value={otp}
        onChange={setOtp}
        disabled={isLoading || success}
        error={error}
      />

      {/* Success flash */}
      {success && (
        <div className="flex items-center justify-center gap-2 py-2 text-green-600 font-semibold text-sm animate-fade-in">
          <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          Email verified! Redirecting…
        </div>
      )}

      <PrimaryButton
        onClick={handleVerify}
        loading={isLoading}
        disabled={otp.length !== 6 || success}
      >
        Verify Code
      </PrimaryButton>

      {/* Resend */}
      <div className="flex items-center justify-center gap-1 text-sm">
        <span className="text-slate-500">Didn't get it?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className={[
            'flex items-center gap-1 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1',
            cooldown > 0 || resending
              ? 'text-slate-400 cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-700',
          ].join(' ')}
        >
          <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-center text-slate-400">
        Tip: enter <strong>any</strong> 6 digits except 000000 to simulate verification.
      </p>
    </StepShell>
  )
}
