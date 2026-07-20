'use client'
import React, { useState } from 'react'
import {
  CheckCircle, LayoutDashboard, Upload, X, FileText,
  Building, CreditCard, ClipboardCheck, Info
} from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'
import { ProgressChecklist, type ChecklistItem } from '../../components/ProgressChecklist'
import { StepShell } from '../../components/StepShell'

// ── Placeholder upload modal ──────────────────────────────────────────────────
interface MockUploadPanelProps {
  title: string
  onClose: () => void
}

function MockUploadPanel({ title, onClose }: MockUploadPanelProps) {
  const [uploaded, setUploaded] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        {!uploaded ? (
          <div
            onClick={() => setUploaded(true)}
            className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Upload size={22} className="text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Click to upload (mock)</p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10 MB</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-700">document_mock.pdf</p>
              <p className="text-xs text-green-600">Uploaded successfully (mock)</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          {uploaded ? 'Done' : 'Close'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export function OwnerOnboardingDashboard() {
  const { state } = useAuthFlow()
  const { formData } = state

  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [completedItems, setCompletedItems] = useState<string[]>(['email_verified'])

  const markDone = (id: string) => {
    setCompletedItems((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setOpenPanel(null)
  }

  const items: ChecklistItem[] = [
    { id: 'email_verified', label: '✅  Email Verified', done: true },
    {
      id: 'complete_profile',
      label: 'Complete Profile',
      done: completedItems.includes('complete_profile'),
      onClick: () => setOpenPanel('complete_profile'),
    },
    {
      id: 'identity_docs',
      label: 'Upload Identity Documents',
      done: completedItems.includes('identity_docs'),
      onClick: () => setOpenPanel('identity_docs'),
    },
    {
      id: 'property_docs',
      label: 'Upload Property Documents',
      done: completedItems.includes('property_docs'),
      onClick: () => setOpenPanel('property_docs'),
    },
    {
      id: 'bank_details',
      label: 'Upload Bank Details',
      done: completedItems.includes('bank_details'),
      onClick: () => setOpenPanel('bank_details'),
    },
    {
      id: 'submit_verification',
      label: 'Submit Verification',
      done: completedItems.includes('submit_verification'),
      onClick: () => markDone('submit_verification'),
    },
  ]

  const panelTitles: Record<string, string> = {
    complete_profile: 'Complete Your Profile',
    identity_docs: 'Upload Identity Documents (Aadhaar / PAN)',
    property_docs: 'Upload Property Documents',
    bank_details: 'Upload Bank Details',
  }

  return (
    <>
      <StepShell
        title={`Welcome, ${formData.fullName.split(' ')[0]}! 🎉`}
        subtitle="Your email is verified. Complete the checklist to unlock your full owner dashboard."
        maxWidth="max-w-lg"
      >
        {/* Limited access banner */}
        <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Limited Access Mode</strong> — Full dashboard access will be
            granted after Admin approval of your submitted documents.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Building, label: 'Properties', value: '0', color: 'blue' },
            { icon: LayoutDashboard, label: 'Residents', value: '0', color: 'indigo' },
            { icon: CreditCard, label: 'Revenue', value: '₹0', color: 'violet' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl bg-${color}-50 border border-${color}-100`}
            >
              <Icon size={20} className={`text-${color}-500`} />
              <p className={`text-lg font-black text-${color}-700`}>{value}</p>
              <p className={`text-xs text-${color}-500 font-medium`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardCheck size={16} className="text-slate-600" />
            <h3 className="font-bold text-slate-700 text-sm">
              Onboarding Checklist
            </h3>
          </div>
          <ProgressChecklist items={items} />
        </div>

        {/* Go to owner dashboard */}
        <a
          href="/owner/dashboard"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-blue-600 text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <LayoutDashboard size={17} />
          Go to Owner Dashboard
        </a>
      </StepShell>

      {/* Upload Modal */}
      {openPanel && panelTitles[openPanel] && (
        <MockUploadPanel
          title={panelTitles[openPanel]}
          onClose={() => {
            markDone(openPanel)
          }}
        />
      )}
    </>
  )
}
