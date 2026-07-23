'use client'
import React from 'react'
import { Check } from 'lucide-react'
import { Step } from '../types/auth'

interface StepMeta {
  label: string
  step: Step
}

const OWNER_STEPS: StepMeta[] = [
  { label: 'Welcome', step: Step.Welcome },
  { label: 'Your Info', step: Step.BasicInfo },
  { label: 'Account Type', step: Step.UserType },
  { label: 'Confirm', step: Step.OwnerConfirm },
  { label: 'Verify Email', step: Step.EmailVerification },
  { label: 'Onboarding', step: Step.OwnerOnboarding },
]

const CUSTOMER_STEPS: StepMeta[] = [
  { label: 'Welcome', step: Step.Welcome },
  { label: 'Your Info', step: Step.BasicInfo },
  { label: 'Account Type', step: Step.UserType },
  { label: 'Booking For', step: Step.BookingFor },
  { label: 'Nationality', step: Step.Nationality },
  { label: 'Documents', step: Step.IndianDocuments },
  { label: 'Review', step: Step.ReviewInfo },
  { label: 'Done', step: Step.Submitted },
]

// Step order for progress calculation
const ALL_STEPS_ORDER = [
  Step.Welcome,
  Step.BasicInfo,
  Step.UserType,
  Step.OwnerConfirm,
  Step.EmailVerification,
  Step.OwnerOnboarding,
  Step.BookingFor,
  Step.Nationality,
  Step.IndianDocuments,
  Step.ForeignDocuments,
  Step.ReviewInfo,
  Step.Submitted,
  Step.Pending,
  Step.CustomerDashboard,
]

interface StepperProps {
  currentStep: Step
  userType: 'owner' | 'customer' | null
}

export function Stepper({ currentStep, userType }: StepperProps) {
  const steps = userType === 'owner' ? OWNER_STEPS : CUSTOMER_STEPS

  // Determine which index in the steps array is current or past
  const currentIndex = steps.findIndex((s) => s.step === currentStep)
  const displayIndex = currentIndex === -1 ? 0 : currentIndex

  // Don't show stepper on welcome screen
  if (currentStep === Step.Welcome) return null

  return (
    <div
      className="w-full px-4 py-4"
      role="navigation"
      aria-label="Registration progress"
    >
      {/* Mobile: compact progress bar */}
      <div className="flex items-center justify-between mb-1 md:hidden">
        <span className="text-xs font-semibold text-slate-500">
          Step {displayIndex + 1} of {steps.length}
        </span>
        <span className="text-xs font-semibold text-blue-600">
          {steps[displayIndex]?.label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden md:hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((displayIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop: step pills */}
      <div className="hidden md:flex items-center justify-center gap-0">
        {steps.map((s, i) => {
          const isDone = i < displayIndex
          const isCurrent = i === displayIndex
          const isPending = i > displayIndex

          return (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center gap-1">
                {/* Circle */}
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    isDone
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200'
                      : 'bg-slate-100 text-slate-400',
                  ].join(' ')}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isDone ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={[
                    'text-[10px] font-medium whitespace-nowrap transition-colors duration-300',
                    isCurrent
                      ? 'text-blue-600'
                      : isDone
                      ? 'text-slate-600'
                      : 'text-slate-400',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className={[
                    'h-[2px] flex-1 max-w-[40px] mx-1 mb-4 rounded-full transition-all duration-500',
                    i < displayIndex ? 'bg-blue-600' : 'bg-slate-200',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
