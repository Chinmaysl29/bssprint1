'use client'
import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, CheckCircle, FileText, Image } from 'lucide-react'
import type { MockFile } from '../types/auth'
import { formatFileSize } from '../lib/mock'

interface UploadCardProps {
  label: string
  required?: boolean
  accept?: string
  hint?: string
  value: MockFile | null
  onChange: (file: MockFile | null) => void
}

export function UploadCard({
  label,
  required = false,
  accept = 'image/*,application/pdf',
  hint,
  value,
  onChange,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const processFile = useCallback(
    (file: File) => {
      const mock: MockFile = {
        name: file.name,
        size: file.size,
        type: file.type,
      }
      onChange(mock)
    },
    [onChange]
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  const isImage = value?.type.startsWith('image/')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {!required && (
          <span className="text-xs font-normal text-slate-400 ml-1.5">
            (Optional)
          </span>
        )}
      </label>

      {value ? (
        /* ── Uploaded state ── */
        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-green-200 bg-green-50">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            {isImage ? (
              <Image size={20} className="text-green-600" />
            ) : (
              <FileText size={20} className="text-green-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {value.name}
            </p>
            <p className="text-xs text-slate-500">{formatFileSize(value.size)}</p>
          </div>
          <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label="Remove file"
          >
            <X size={14} className="text-slate-500 hover:text-red-500" />
          </button>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label={`Upload ${label}`}
          className={[
            'flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            dragging
              ? 'border-blue-500 bg-blue-50 scale-[1.01]'
              : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50',
          ].join(' ')}
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
            <Upload size={20} className="text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">
              {dragging ? 'Drop to upload' : 'Click or drag & drop'}
            </p>
            {hint && (
              <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  )
}
