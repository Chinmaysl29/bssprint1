'use client'
import React from 'react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step, type MockFile, type PurposeOfStay } from '../../types/auth'
import { UploadCard } from '../../components/UploadCard'
import { StepShell, Field, PrimaryButton } from '../../components/StepShell'

const PURPOSES: { value: PurposeOfStay; label: string }[] = [
  { value: 'student', label: '🎓 Student' },
  { value: 'working_professional', label: '💼 Working Professional' },
  { value: 'internship', label: '📋 Internship' },
  { value: 'business', label: '🏢 Business' },
  { value: 'tourist', label: '🗺️ Tourist' },
  { value: 'research', label: '🔬 Research' },
  { value: 'medical', label: '🏥 Medical' },
  { value: 'others', label: '✏️ Others' },
]

export function ForeignDocumentsStep() {
  const { state, goTo, setFormData } = useAuthFlow()
  const { formData } = state
  const { foreignDocs } = formData

  const setDoc = (key: 'passport' | 'visa') => (file: MockFile | null) =>
    setFormData({ foreignDocs: { ...foreignDocs, [key]: file } })

  const setPurpose = (v: PurposeOfStay) =>
    setFormData({
      foreignDocs: { ...foreignDocs, purposeOfStay: v, purposeOther: '' },
    })

  const setOther = (v: string) =>
    setFormData({ foreignDocs: { ...foreignDocs, purposeOther: v } })

  const canContinue =
    !!foreignDocs.passport &&
    !!foreignDocs.visa &&
    !!foreignDocs.purposeOfStay &&
    (foreignDocs.purposeOfStay !== 'others' || foreignDocs.purposeOther.trim().length > 3)

  return (
    <StepShell
      title="Upload your documents"
      subtitle="Foreign nationals must provide valid travel documents."
      onBack={() => goTo(Step.Nationality)}
    >
      {/* Passport */}
      <UploadCard
        label="Passport"
        required
        hint="Photo / bio-data page. JPG, PNG, or PDF."
        value={foreignDocs.passport}
        onChange={setDoc('passport')}
      />

      {/* Visa */}
      <UploadCard
        label="Visa"
        required
        hint="Current valid Indian visa. JPG, PNG, or PDF."
        value={foreignDocs.visa}
        onChange={setDoc('visa')}
      />

      {/* Purpose of Stay */}
      <Field label="Purpose of Stay" required>
        <select
          value={foreignDocs.purposeOfStay}
          onChange={(e) => setPurpose(e.target.value as PurposeOfStay)}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer"
        >
          <option value="">Select purpose…</option>
          {PURPOSES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Conditional "Others" textarea */}
      {foreignDocs.purposeOfStay === 'others' && (
        <div className="animate-fade-in">
          <Field label="Please specify" required>
            <textarea
              rows={3}
              value={foreignDocs.purposeOther}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Describe your purpose of stay…"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              autoFocus
            />
          </Field>
        </div>
      )}

      <PrimaryButton
        onClick={() => goTo(Step.ReviewInfo)}
        disabled={!canContinue}
      >
        Continue
      </PrimaryButton>
    </StepShell>
  )
}
