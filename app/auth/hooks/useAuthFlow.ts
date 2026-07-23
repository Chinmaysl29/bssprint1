'use client'
import { useContext } from 'react'
import { AuthFlowContext, type AuthFlowContextValue } from '../components/AuthFlowProvider'

export function useAuthFlow(): AuthFlowContextValue {
  const ctx = useContext(AuthFlowContext)
  if (!ctx) {
    throw new Error('useAuthFlow must be used inside <AuthFlowProvider>')
  }
  return ctx
}
