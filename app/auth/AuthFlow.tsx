'use client'
import React from 'react'
import { useAuthFlow } from './hooks/useAuthFlow'
import { Step } from './types/auth'
import { Stepper } from './components/Stepper'

// Steps
import { WelcomeStep } from './steps/WelcomeStep'
import { BasicInfoStep } from './steps/BasicInfoStep'
import { UserTypeStep } from './steps/UserTypeStep'

// Owner steps
import { OwnerConfirmStep } from './steps/owner/OwnerConfirmStep'
import { EmailVerificationStep } from './steps/owner/EmailVerificationStep'
import { OwnerOnboardingDashboard } from './steps/owner/OwnerOnboardingDashboard'

// Customer steps
import { BookingForStep } from './steps/customer/BookingForStep'
import { NationalityStep } from './steps/customer/NationalityStep'
import { IndianDocumentsStep } from './steps/customer/IndianDocumentsStep'
import { ForeignDocumentsStep } from './steps/customer/ForeignDocumentsStep'
import { ReviewStep } from './steps/customer/ReviewStep'
import { SubmittedStep } from './steps/customer/SubmittedStep'
import { PendingStep } from './steps/customer/PendingStep'
import { CustomerDashboardStub } from './steps/customer/CustomerDashboardStub'

// Map step → component
const STEP_MAP: Record<Step, React.ComponentType> = {
  [Step.Welcome]: WelcomeStep,
  [Step.BasicInfo]: BasicInfoStep,
  [Step.UserType]: UserTypeStep,

  // Owner
  [Step.OwnerConfirm]: OwnerConfirmStep,
  [Step.EmailVerification]: EmailVerificationStep,
  [Step.OwnerOnboarding]: OwnerOnboardingDashboard,

  // Customer
  [Step.BookingFor]: BookingForStep,
  [Step.Nationality]: NationalityStep,
  [Step.IndianDocuments]: IndianDocumentsStep,
  [Step.ForeignDocuments]: ForeignDocumentsStep,
  [Step.ReviewInfo]: ReviewStep,
  [Step.Submitted]: SubmittedStep,
  [Step.Pending]: PendingStep,
  [Step.CustomerDashboard]: CustomerDashboardStub,
}

// Steps that take over the full viewport (no card wrapper/stepper)
const FULL_SCREEN_STEPS = new Set<Step>([
  Step.Welcome,
  Step.OwnerOnboarding,
  Step.CustomerDashboard,
])

export function AuthFlow() {
  const { state } = useAuthFlow()
  const { step, formData } = state

  const StepComponent = STEP_MAP[step]
  const isFullScreen = FULL_SCREEN_STEPS.has(step)

  if (isFullScreen) {
    return (
      <div
        key={step}
        className="animate-fade-in"
        aria-live="polite"
        aria-atomic="true"
      >
        <StepComponent />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 flex flex-col"
      aria-live="polite"
    >
      {/* Sticky header with stepper */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center pt-4 pb-1 gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="font-black text-blue-600 text-lg tracking-tight">HomiePG</span>
        </div>
        <Stepper currentStep={step} userType={formData.userType} />
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center py-6 px-4">
        <div
          key={step}
          className="w-full animate-slide-up"
          aria-atomic="true"
        >
          <StepComponent />
        </div>
      </div>
    </div>
  )
}
