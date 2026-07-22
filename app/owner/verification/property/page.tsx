'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Upload, X, Check, FileText, AlertCircle, ChevronRight, Eye, Image } from 'lucide-react'

type UploadState = { file: File | null; preview: string | null; status: 'idle' | 'uploading' | 'uploaded'; progress: number }
const initUpload = (): UploadState => ({ file: null, preview: null, status: 'idle', progress: 0 })

const PROPERTY_DOC_TYPES = [
  { key: 'deed', label: 'Sale Deed', description: 'Original property sale deed / title document', icon: FileText, color: '#0A1931', bg: '#EDF4FB' },
  { key: 'rental', label: 'Rental Agreement', description: 'Valid rental/lease agreement for the property', icon: FileText, color: '#D97706', bg: '#FEF3C7' },
  { key: 'tax', label: 'Property Tax Receipt', description: 'Latest property tax payment receipt', icon: FileText, color: '#059669', bg: '#D1FAE5' },
  { key: 'municipal', label: 'Municipal Certificate', description: 'Municipal license or No-Objection Certificate', icon: FileText, color: '#7C3AED', bg: '#F0E6FF' },
]

function PropertyDocCard({
  docType, upload, onUpload, onRemove, isSelected, onSelect, isDisabled
}: {
  docType: typeof PROPERTY_DOC_TYPES[0]; upload: UploadState
  onUpload: (f: File) => void; onRemove: () => void
  isSelected: boolean; onSelect: () => void; isDisabled: boolean
}) {
  const [dragging, setDragging] = useState(false)
  const isPdf = upload.file?.type === 'application/pdf'

  return (
    <div style={{
      border: `2px solid ${upload.status === 'uploaded' ? '#86EFAC' : isSelected ? '#4A7FA7' : '#E8EEF5'}`,
      borderRadius: 16, background: upload.status === 'uploaded' ? '#F0FDF4' : isSelected ? '#F0F7FF' : '#FAFCFF',
      transition: 'all 0.22s', cursor: isDisabled && !isSelected ? 'not-allowed' : 'pointer',
      opacity: isDisabled && !isSelected ? 0.5 : 1,
    }}>
      {/* Header */}
      <div
        onClick={!isDisabled || isSelected ? onSelect : undefined}
        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 12, background: upload.status === 'uploaded' ? '#DCFCE7' : docType.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <docType.icon size={20} color={upload.status === 'uploaded' ? '#16A34A' : docType.color} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{docType.label}</p>
          <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{docType.description}</p>
        </div>
        <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${isSelected ? '#0A1931' : '#D9E3EC'}`, background: isSelected ? '#0A1931' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
        </div>
      </div>

      {/* Upload section (only visible when selected or uploaded) */}
      {(isSelected || upload.status === 'uploaded') && (
        <div style={{ padding: '0 20px 20px' }}>
          {upload.status !== 'uploaded' ? (
            <label
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onUpload(f) }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '22px 16px',
                border: `2px dashed ${dragging ? '#4A7FA7' : '#D9E3EC'}`, borderRadius: 12, cursor: 'pointer',
                background: dragging ? 'rgba(74,127,167,0.04)' : 'transparent', transition: 'all 0.2s',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 14, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={20} color="#4A7FA7" strokeWidth={1.5} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', margin: '0 0 3px' }}>
                  {dragging ? 'Drop here' : 'Upload Document'}
                </p>
                <p style={{ fontSize: 11, color: '#9BADC2', margin: 0 }}>JPG, PNG, PDF · Max 5MB</p>
              </div>
              <input type="file" accept="image/*,application/pdf" onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f) }} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '12px 16px' }}>
              {isPdf ? (
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} color="#16A34A" strokeWidth={1.5} />
                </div>
              ) : upload.preview ? (
                <img src={upload.preview} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid #BBF7D0' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Image size={22} color="#16A34A" strokeWidth={1.5} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{upload.file?.name}</p>
                <p style={{ fontSize: 11, color: '#22C55E', margin: 0 }}>{((upload.file?.size ?? 0) / 1024).toFixed(0)} KB · Uploaded</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {upload.preview && !isPdf && (
                  <button type="button" onClick={() => window.open(upload.preview!, '_blank')} style={{ width: 28, height: 28, borderRadius: 8, background: '#DCFCE7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={13} color="#16A34A" />
                  </button>
                )}
                <button type="button" onClick={onRemove} style={{ width: 28, height: 28, borderRadius: 8, background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={13} color="#DC2626" />
                </button>
              </div>
            </div>
          )}

          {upload.status === 'uploading' && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 4, background: '#E8EEF5', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${upload.progress}%`, background: 'linear-gradient(90deg, #4A7FA7, #0A1931)', borderRadius: 2, transition: 'width 0.15s' }} />
              </div>
              <p style={{ fontSize: 11, color: '#4A7FA7', margin: '5px 0 0', textAlign: 'right' }}>{upload.progress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PropertyDocumentsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>('deed')
  const [uploads, setUploads] = useState<Record<string, UploadState>>({
    deed: initUpload(), rental: initUpload(), tax: initUpload(), municipal: initUpload()
  })
  const [loading, setLoading] = useState(false)

  const handleUpload = (key: string) => async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return
    setUploads(u => ({ ...u, [key]: { file, preview: null, status: 'uploading', progress: 0 } }))
    for (let p = 10; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 80))
      setUploads(u => ({ ...u, [key]: { ...u[key], progress: Math.min(p, 100) } }))
    }
    const preview = file.type.startsWith('image/') ? await new Promise<string>(res => {
      const reader = new FileReader(); reader.onload = e => res(e.target?.result as string); reader.readAsDataURL(file)
    }) : null
    setUploads(u => ({ ...u, [key]: { file, preview, status: 'uploaded', progress: 100 } }))
  }

  const handleRemove = (key: string) => () => {
    setUploads(u => ({ ...u, [key]: initUpload() }))
  }

  const uploadedCount = Object.values(uploads).filter(u => u.status === 'uploaded').length
  const hasAtLeastOne = uploadedCount >= 1

  const handleSubmit = async () => {
    if (!hasAtLeastOne) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    router.push('/owner/verification/review')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 18px', marginBottom: 14, backdropFilter: 'blur(8px)' }}>
            <Home size={12} color="#fff" strokeWidth={2.5} />
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>KYC VERIFICATION · PROPERTY DOCUMENTS</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Property Ownership Proof</h1>
          <p style={{ fontSize: 13, color: 'rgba(179,207,229,0.8)', margin: 0 }}>Upload at least one valid property document. Multiple documents improve verification speed.</p>
        </div>

        {/* Progress */}
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Property documents uploaded</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{uploadedCount} / 4</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(uploadedCount / 4) * 100}%`, background: 'linear-gradient(90deg, #FBBF24, #F59E0B)', borderRadius: 3, transition: 'width 0.4s' }} />
            </div>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(179,207,229,0.75)', fontWeight: 500, whiteSpace: 'nowrap' }}>Min. 1 required</span>
        </div>

        {/* Document Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {PROPERTY_DOC_TYPES.map(docType => (
            <PropertyDocCard
              key={docType.key}
              docType={docType}
              upload={uploads[docType.key]}
              onUpload={handleUpload(docType.key)}
              onRemove={handleRemove(docType.key)}
              isSelected={selectedType === docType.key}
              onSelect={() => setSelectedType(docType.key)}
              isDisabled={selectedType !== docType.key && uploads[docType.key].status !== 'uploaded'}
            />
          ))}
        </div>

        {/* Info */}
        <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <AlertCircle size={15} color="rgba(179,207,229,0.8)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: '0 0 4px' }}>Accepted Documents</p>
              <p style={{ fontSize: 11, color: 'rgba(179,207,229,0.7)', margin: 0, lineHeight: 1.7 }}>
                Sale Deed · Rental Agreement · Property Tax Receipt · Municipal Certificate<br />
                Format: JPG, PNG, PDF · Max 5MB each · Must be current & valid
              </p>
            </div>
          </div>
        </div>

        {/* Continue */}
        <button
          onClick={handleSubmit}
          disabled={!hasAtLeastOne || loading}
          style={{
            width: '100%', padding: '15px', borderRadius: 14,
            background: !hasAtLeastOne ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #fff, #EDF4FB)',
            color: !hasAtLeastOne ? 'rgba(255,255,255,0.4)' : '#0A1931',
            border: 'none', fontSize: 14, fontWeight: 800, cursor: !hasAtLeastOne ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            boxShadow: hasAtLeastOne ? '0 8px 32px rgba(10,25,49,0.3)' : 'none', transition: 'all 0.2s',
          }}>
          {loading ? (
            <><span style={{ width: 16, height: 16, border: '2px solid rgba(10,25,49,0.3)', borderTopColor: '#0A1931', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />Saving...</>
          ) : !hasAtLeastOne ? 'Upload at least 1 property document to continue' : (
            <>Review & Submit Application <ChevronRight size={18} strokeWidth={2.5} /></>
          )}
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(179,207,229,0.5)', marginTop: 14 }}>Step 5c of 7 · Property Documents</p>
      </div>
    </div>
  )
}
