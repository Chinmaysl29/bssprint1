'use client'
import React, { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step } from '../../types/auth'

export function SubmittedStep() {
  const { goTo } = useAuthFlow()

  // Auto-advance to pending after 2s
  useEffect(() => {
    const t = setTimeout(() => goTo(Step.Pending), 2200)
    return () => clearTimeout(t)
  }, [goTo])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
      {/* Animated checkmark */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
          <CheckCircle
            size={52}
            className="text-green-500 animate-fade-in"
            strokeWidth={1.5}
          />
        </div>
        {/* Ripple */}
        <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-30" />
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h2 className="text-2xl font-black text-slate-900">
          Submitted! 🎉
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your verification documents have been received. We're taking you to
          your status screen…
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
        Redirecting…
      </div>
    </div>
  )
}
