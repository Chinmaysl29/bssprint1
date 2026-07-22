'use client'
import React from 'react'
import { User, Users } from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step, type BookingFor } from '../../types/auth'
import { SelectableCard } from '../../components/SelectableCard'
import { StepShell, Field, Input, PrimaryButton } from '../../components/StepShell'

export function BookingForStep() {
  const { state, goTo, setFormData } = useAuthFlow()
  const { formData } = state

  const select = (v: BookingFor) => setFormData({ bookingFor: v })

  const canContinue =
    formData.bookingFor === 'myself' ||
    (formData.bookingFor === 'someone_else' && formData.guardianName.trim().length >= 2)

  return (
    <StepShell
      title="Who are you booking for?"
      subtitle="This helps us personalise your registration."
      onBack={() => goTo(Step.UserType)}
    >
      <SelectableCard
        selected={formData.bookingFor === 'myself'}
        onSelect={() => select('myself')}
        icon={<User size={22} className="text-blue-600" />}
        title="Myself"
        description="I'll be the one staying at the PG."
      />

      <SelectableCard
        selected={formData.bookingFor === 'someone_else'}
        onSelect={() => select('someone_else')}
        icon={<Users size={22} className="text-blue-600" />}
        title="Someone Else"
        description="I'm a parent or guardian booking on behalf of someone."
      />

      {/* Conditional guardian name */}
      {formData.bookingFor === 'someone_else' && (
        <div className="animate-fade-in">
          <Field
            label="Guardian / Parent Name"
            required
            hint="Full name of the person making the booking"
          >
            <Input
              type="text"
              placeholder="e.g. Suresh Sharma"
              value={formData.guardianName}
              onChange={(e) => setFormData({ guardianName: e.target.value })}
              autoFocus
              autoComplete="name"
            />
          </Field>
        </div>
      )}

      <PrimaryButton
        onClick={() => goTo(Step.Nationality)}
        disabled={!canContinue}
      >
        Continue
      </PrimaryButton>
    </StepShell>
  )
}
