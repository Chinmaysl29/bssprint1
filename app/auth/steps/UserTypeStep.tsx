'use client'
import React from 'react'
import { useAuthFlow } from '../hooks/useAuthFlow'
import { Step, type UserType } from '../types/auth'
import { SelectableCard } from '../components/SelectableCard'
import { StepShell, PrimaryButton } from '../components/StepShell'

export function UserTypeStep() {
  const { state, goTo, setFormData } = useAuthFlow()
  const { formData } = state

  const select = (t: UserType) => setFormData({ userType: t })

  const handleContinue = () => {
    if (formData.userType === 'owner') {
      goTo(Step.OwnerConfirm)
    } else if (formData.userType === 'customer') {
      goTo(Step.BookingFor)
    }
  }

  return (
    <StepShell
      title="How will you use HomiePG?"
      subtitle="Choose the account type that fits your needs."
      onBack={() => goTo(Step.BasicInfo)}
    >
      <SelectableCard
        selected={formData.userType === 'owner'}
        onSelect={() => select('owner')}
        icon="🏢"
        title="PG Owner"
        description="Manage your PG properties, residents, finance and bookings from a single dashboard."
        badge="For Property Managers"
      />

      <SelectableCard
        selected={formData.userType === 'customer'}
        onSelect={() => select('customer')}
        icon="👤"
        title="Customer"
        description="Search and book PG accommodation near your college, office, or destination."
        badge="For Tenants"
      />

      <PrimaryButton
        onClick={handleContinue}
        disabled={!formData.userType}
      >
        Continue
      </PrimaryButton>
    </StepShell>
  )
}
