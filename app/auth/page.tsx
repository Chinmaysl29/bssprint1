'use client'
import React from 'react'
import { AuthFlowProvider } from './components/AuthFlowProvider'
import { AuthFlow } from './AuthFlow'

export default function AuthPage() {
  return (
    <AuthFlowProvider>
      <AuthFlow />
    </AuthFlowProvider>
  )
}
