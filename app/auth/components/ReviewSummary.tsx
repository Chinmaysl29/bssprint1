'use client'
import React from 'react'
import { Edit2 } from 'lucide-react'
import type { AuthFormData } from '../types/auth'
import { Step } from '../types/auth'

interface ReviewSection {
  title: string
  step: Step
  rows: { label: string; value: string }[]
}

interface ReviewSummaryProps {
  formData: AuthFormData
  onEdit: (step: Step) => void
}

export function ReviewSummary({ formData, onEdit }: ReviewSummaryProps) {
  const sections: ReviewSection[] = [
    {
      title: 'Personal Info',
      step: Step.BasicInfo,
      rows: [
        { label: 'Full Name', value: formData.fullName || '—' },
        { label: 'Phone', value: formData.phone ? `+91 ${formData.phone}` : '—' },
        { label: 'Email', value: formData.email || '—' },
      ],
    },
    {
      title: 'Booking For',
      step: Step.BookingFor,
      rows: [
        {
          label: 'Booking For',
          value:
            formData.bookingFor === 'myself'
              ? 'Myself'
              : formData.bookingFor === 'someone_else'
              ? `Someone Else${formData.guardianName ? ` (${formData.guardianName})` : ''}`
              : '—',
        },
      ],
    },
    {
      title: 'Nationality & Documents',
      step: Step.Nationality,
      rows: [
        {
          label: 'Nationality',
          value:
            formData.nationality === 'indian'
              ? '🇮🇳 Indian Citizen'
              : formData.nationality === 'foreign'
              ? '🌍 Foreign National'
              : '—',
        },
        ...(formData.nationality === 'indian'
          ? [
              {
                label: 'Aadhaar',
                value: formData.indianDocs.aadhaar?.name || '—',
              },
              {
                label: 'PAN Card',
                value: formData.indianDocs.pan?.name || 'Not provided',
              },
              {
                label:
                  formData.indianDocs.idType === 'college'
                    ? 'College ID'
                    : 'Employee ID',
                value: formData.indianDocs.idFile?.name || '—',
              },
            ]
          : formData.nationality === 'foreign'
          ? [
              {
                label: 'Passport',
                value: formData.foreignDocs.passport?.name || '—',
              },
              {
                label: 'Visa',
                value: formData.foreignDocs.visa?.name || '—',
              },
              {
                label: 'Purpose of Stay',
                value: formData.foreignDocs.purposeOfStay === 'others'
                  ? `Others: ${formData.foreignDocs.purposeOther}`
                  : formData.foreignDocs.purposeOfStay || '—',
              },
            ]
          : []),
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {sections.map((sec) => (
        <div
          key={sec.title}
          className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
        >
          {/* Section header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-700">{sec.title}</span>
            <button
              type="button"
              onClick={() => onEdit(sec.step)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1"
            >
              <Edit2 size={12} />
              Edit
            </button>
          </div>
          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {sec.rows.map((row) => (
              <div key={row.label} className="flex gap-3 px-4 py-2.5">
                <span className="text-xs text-slate-400 w-32 flex-shrink-0 pt-0.5">
                  {row.label}
                </span>
                <span className="text-sm font-medium text-slate-800 break-all">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
