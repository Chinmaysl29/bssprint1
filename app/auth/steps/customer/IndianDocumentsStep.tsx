'use client'
import React from 'react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step, type MockFile } from '../../types/auth'
import { UploadCard } from '../../components/UploadCard'
import { StepShell, PrimaryButton } from '../../components/StepShell'

export function IndianDocumentsStep() {
  const { state, goTo, setFormData } = useAuthFlow()
  const { formData } = state
  const { indianDocs } = formData

  const setDoc = (key: keyof typeof indianDocs) => (file: MockFile | null) =>
    setFormData({ indianDocs: { ...indianDocs, [key]: file } })

  const setIdType = (t: 'college' | 'employee') =>
    setFormData({ indianDocs: { ...indianDocs, idType: t } })

  const canContinue = !!indianDocs.aadhaar && !!indianDocs.idFile

  return (
    <StepShell
      title="Upload your documents"
      subtitle="Required for identity verification. All files are stored securely."
      onBack={() => goTo(Step.Nationality)}
    >
      {/* Aadhaar */}
      <UploadCard
        label="Aadhaar Card"
        required
        hint="Front side preferred. JPG, PNG, or PDF."
        value={indianDocs.aadhaar}
        onChange={setDoc('aadhaar')}
      />

      {/* PAN */}
      <UploadCard
        label="PAN Card"
        required={false}
        hint="Optional. JPG, PNG, or PDF."
        value={indianDocs.pan}
        onChange={setDoc('pan')}
      />

      {/* College / Employee toggle */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-slate-700">
          Work / Study ID <span className="text-red-500">*</span>
        </p>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          {(['college', 'employee'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setIdType(t)}
              className={[
                'flex-1 py-2.5 text-sm font-semibold transition-colors',
                indianDocs.idType === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-50',
              ].join(' ')}
            >
              {t === 'college' ? '🎓 College ID' : '💼 Employee ID'}
            </button>
          ))}
        </div>

        <UploadCard
          label={indianDocs.idType === 'college' ? 'College ID' : 'Employee ID'}
          required
          hint="Clear photo or scan. JPG, PNG, or PDF."
          value={indianDocs.idFile}
          onChange={setDoc('idFile')}
        />
      </div>

      <PrimaryButton
        onClick={() => goTo(Step.ReviewInfo)}
        disabled={!canContinue}
      >
        Continue
      </PrimaryButton>
    </StepShell>
  )
}
