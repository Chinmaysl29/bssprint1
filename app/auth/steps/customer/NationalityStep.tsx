'use client'
import React from 'react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step, type Nationality } from '../../types/auth'
import { SelectableCard } from '../../components/SelectableCard'
import { StepShell, PrimaryButton } from '../../components/StepShell'

export function NationalityStep() {
  const { state, goTo, setFormData } = useAuthFlow()
  const { formData } = state

  const select = (v: Nationality) => setFormData({ nationality: v })

  const handleContinue = () => {
    if (formData.nationality === 'indian') goTo(Step.IndianDocuments)
    else if (formData.nationality === 'foreign') goTo(Step.ForeignDocuments)
  }

  return (
    <StepShell
      title="What's your nationality?"
      subtitle="We collect different documents based on your citizenship status."
      onBack={() => goTo(Step.BookingFor)}
    >
      <SelectableCard
        selected={formData.nationality === 'indian'}
        onSelect={() => select('indian')}
        icon="🇮🇳"
        title="Indian Citizen"
        description="I hold an Indian passport or Aadhaar card."
      />

      <SelectableCard
        selected={formData.nationality === 'foreign'}
        onSelect={() => select('foreign')}
        icon="🌍"
        title="Foreign National"
        description="I'm visiting or residing in India on a foreign passport and visa."
      />

      <PrimaryButton
        onClick={handleContinue}
        disabled={!formData.nationality}
      >
        Continue
      </PrimaryButton>
    </StepShell>
  )
}
