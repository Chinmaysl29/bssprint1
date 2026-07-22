'use client'
import React from 'react'
import { Check } from 'lucide-react'

interface SelectableCardProps {
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  disabled?: boolean
}

export function SelectableCard({
  selected,
  onSelect,
  icon,
  title,
  description,
  badge,
  disabled = false,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        'relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        selected
          ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-100'
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Check indicator */}
      <div
        className={[
          'absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-200',
          selected
            ? 'bg-blue-600 border-blue-600'
            : 'border-slate-300 bg-white',
        ].join(' ')}
      >
        {selected && <Check size={12} color="white" strokeWidth={3} />}
      </div>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div
          className={[
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors duration-200',
            selected ? 'bg-blue-100' : 'bg-slate-100',
          ].join(' ')}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={[
                'font-bold text-base transition-colors duration-200',
                selected ? 'text-blue-700' : 'text-slate-800',
              ].join(' ')}
            >
              {title}
            </span>
            {badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </button>
  )
}
