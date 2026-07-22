'use client'
import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  onClick?: () => void
}

interface ProgressChecklistProps {
  items: ChecklistItem[]
}

export function ProgressChecklist({ items }: ProgressChecklistProps) {
  const doneCount = items.filter((i) => i.done).length
  const pct = Math.round((doneCount / items.length) * 100)

  return (
    <div className="flex flex-col gap-4">
      {/* Circular / linear progress */}
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
        {/* SVG circle */}
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28" cy="28" r="22"
              fill="none" stroke="#e2e8f0" strokeWidth="5"
            />
            <circle
              cx="28" cy="28" r="22"
              fill="none" stroke="#2563eb" strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-700">
            {pct}%
          </span>
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">
            {doneCount} of {items.length} complete
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete all steps to unlock full access
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.done ? undefined : item.onClick}
            disabled={item.done}
            className={[
              'flex items-center gap-3 w-full p-3.5 rounded-xl text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              item.done
                ? 'bg-green-50 cursor-default'
                : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm cursor-pointer',
            ].join(' ')}
          >
            {item.done ? (
              <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
            ) : (
              <Circle size={20} className="text-slate-300 flex-shrink-0" />
            )}
            <span
              className={[
                'text-sm font-medium',
                item.done ? 'text-green-700 line-through decoration-green-300' : 'text-slate-700',
              ].join(' ')}
            >
              {item.label}
            </span>
            {!item.done && (
              <span className="ml-auto text-xs text-blue-600 font-semibold">
                Start →
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
