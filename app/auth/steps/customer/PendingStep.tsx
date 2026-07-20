'use client'
import React from 'react'
import { Clock, CheckCircle, Circle, ArrowRight, Mail } from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { Step } from '../../types/auth'

const TIMELINE = [
  { label: 'Application Submitted', done: true },
  { label: 'Documents Under Review', done: false, active: true },
  { label: 'Identity Verified', done: false },
  { label: 'Access Approved', done: false },
]

export function PendingStep() {
  const { goTo, state } = useAuthFlow()
  const { formData } = state

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center shadow-sm">
          <Clock size={32} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Verification Pending</h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Our team is reviewing your documents. This usually takes 1–3 business hours.
          </p>
        </div>
      </div>

      {/* Status card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-amber-800">Current Status</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-200 text-amber-800">
            Under Review
          </span>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          We'll send a confirmation to{' '}
          <strong>{formData.email}</strong> once your verification is complete.
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
        <p className="text-sm font-bold text-slate-700 mb-1">Verification Timeline</p>
        {TIMELINE.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item.done ? (
              <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            ) : item.active ? (
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              </div>
            ) : (
              <Circle size={20} className="text-slate-300 flex-shrink-0" />
            )}
            <span
              className={[
                'text-sm font-medium',
                item.done
                  ? 'text-green-700'
                  : item.active
                  ? 'text-blue-700 font-semibold'
                  : 'text-slate-400',
              ].join(' ')}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Estimated time */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Mail size={16} className="text-blue-500 flex-shrink-0" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Estimated review time: <strong>1–3 business hours</strong>. You'll receive an email
          notification when approved.
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => goTo(Step.CustomerDashboard)}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Go to Dashboard
        <ArrowRight size={17} strokeWidth={2.5} />
      </button>
    </div>
  )
}
