'use client'
import React from 'react'
import { User, Phone, Mail, CheckCircle } from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step } from '../../types/auth'
import { StepShell, PrimaryButton } from '../../components/StepShell'

export function OwnerConfirmStep() {
  const { state, goTo, setLoading } = useAuthFlow()
  const { formData, isLoading } = state

  const handleConfirm = async () => {
    setLoading(true)
    // TODO: wire to backend — register / create session
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    goTo(Step.EmailVerification)
  }

  const rows = [
    { icon: User, label: 'Full Name', value: formData.fullName },
    { icon: Phone, label: 'Phone', value: `+91 ${formData.phone}` },
    { icon: Mail, label: 'Email', value: formData.email },
  ]

  return (
    <StepShell
      title="Confirm your details"
      subtitle="Review your information before we create your owner account."
      onBack={() => goTo(Step.UserType)}
    >
      {/* Info card */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Icon size={17} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notice: no nationality for owner */}
      <div className="flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
        <CheckCircle size={17} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 leading-relaxed">
          A 6-digit verification code will be sent to{' '}
          <strong>{formData.email}</strong> to confirm your account.
        </p>
      </div>

      <PrimaryButton onClick={handleConfirm} loading={isLoading}>
        Confirm &amp; Send Code
      </PrimaryButton>

      <button
        type="button"
        onClick={() => goTo(Step.BasicInfo)}
        className="text-sm text-blue-600 hover:text-blue-700 font-semibold text-center w-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
      >
        Edit my information
      </button>
    </StepShell>
  )
}
