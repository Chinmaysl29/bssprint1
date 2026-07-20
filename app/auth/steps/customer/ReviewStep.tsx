'use client'
import React, { useState } from 'react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step } from '../../types/auth'
import { mockSubmitVerification } from '../../lib/mock'
import { ReviewSummary } from '../../components/ReviewSummary'
import { StepShell, PrimaryButton } from '../../components/StepShell'

export function ReviewStep() {
  const { state, goTo, setLoading } = useAuthFlow()
  const { formData, isLoading } = state
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async () => {
    if (!agreed) return
    setLoading(true)
    await mockSubmitVerification(formData) // TODO: wire to backend
    setLoading(false)
    goTo(Step.Submitted)
  }

  // Determine which docs step to go back to for editing
  const docsStep =
    formData.nationality === 'indian' ? Step.IndianDocuments : Step.ForeignDocuments

  return (
    <StepShell
      title="Review your information"
      subtitle="Check everything looks correct. You can edit any section before submitting."
      onBack={() => goTo(docsStep)}
      maxWidth="max-w-lg"
    >
      <ReviewSummary formData={formData} onEdit={goTo} />

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        <span className="text-sm text-slate-600 leading-relaxed">
          I confirm that all information provided is accurate and I agree to
          HomiePG's{' '}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>

      <PrimaryButton
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!agreed}
      >
        Submit Verification
      </PrimaryButton>
    </StepShell>
  )
}
