'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Check, ArrowRight, Eye, FileText, ShieldCheck, AlertCircle, ChevronRight, User } from 'lucide-react'

type UploadState = {
  file: File | null
  preview: string | null
  status: 'idle' | 'uploading' | 'uploaded' | 'error'
  progress: number
}

function initUpload(): UploadState { return { file: null, preview: null, status: 'idle', progress: 0 } }

function DocumentUploadCard({
  title, subtitle, icon: Icon, side, upload, onUpload, onRemove, accept = 'image/*,application/pdf', required = false
}: {
  title: string; subtitle: string; icon: any; side?: string; upload: UploadState
  onUpload: (f: File) => void; onRemove: () => void; accept?: string; required?: boolean
}) {
  const [dragging, setDragging] = useState(false)

  const handleFile = (f: File) => {
    if (f.size > 5 * 1024 * 1024) return
    onUpload(f)
  }

  const isPdf = upload.file?.type === 'application/pdf'

  return (
    <div style={{
      border: `1.5px solid ${upload.status === 'uploaded' ? '#86EFAC' : dragging ? '#4A7FA7' : '#E8EEF5'}`,
      borderRadius: 16, background: upload.status === 'uploaded' ? '#F0FDF4' : '#FAFCFF',
      overflow: 'hidden', transition: 'all 0.25s',
    }}>
      {/* Card Header */}
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: upload.status === 'uploaded' ? '#DCFCE7' : '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} color={upload.status === 'uploaded' ? '#16A34A' : '#1A3D63'} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{title}</p>
            {side && <span style={{ fontSize: 10, background: '#EDF4FB', color: '#4A7FA7', padding: '2px 8px', borderRadius: 8, fontWeight: 600 }}>{side}</span>}
            {required && <span style={{ fontSize: 10, color: '#DC2626', fontWeight: 700 }}>*</span>}
          </div>
          <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{subtitle}</p>
        </div>
        {upload.status === 'uploaded' && (
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={13} color="#fff" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div style={{ padding: '14px 20px 20px' }}>
        {upload.status !== 'uploaded' ? (
          <label
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              padding: '22px', border: `2px dashed ${dragging ? '#4A7FA7' : '#D9E3EC'}`,
              borderRadius: 12, cursor: 'pointer',
              background: dragging ? 'rgba(74,127,167,0.05)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={20} color="#4A7FA7" strokeWidth={1.5} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', margin: '0 0 3px' }}>
                {dragging ? 'Drop file here' : 'Click or drag & drop'}
              </p>
              <p style={{ fontSize: 11, color: '#9BADC2', margin: 0 }}>JPG, PNG, PDF · Max 5MB</p>
            </div>
            <input type="file" accept={accept} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} style={{ display: 'none' }} />
          </label>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 12, padding: '12px 16px' }}>
            {/* Preview or file icon */}
            {isPdf ? (
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} color="#16A34A" strokeWidth={1.5} />
              </div>
            ) : upload.preview ? (
              <img src={upload.preview} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1.5px solid #BBF7D0' }} />
            ) : null}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#16A34A', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {upload.file?.name}
              </p>
              <p style={{ fontSize: 11, color: '#22C55E', margin: 0 }}>
                {((upload.file?.size ?? 0) / 1024).toFixed(0)} KB · Uploaded
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {upload.preview && !isPdf && (
                <button
                  type="button"
                  onClick={() => window.open(upload.preview!, '_blank')}
                  style={{ width: 28, height: 28, borderRadius: 8, background: '#DCFCE7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Preview"
                >
                  <Eye size={13} color="#16A34A" />
                </button>
              )}
              <button
                type="button"
                onClick={onRemove}
                style={{ width: 28, height: 28, borderRadius: 8, background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Remove"
              >
                <X size={13} color="#DC2626" />
              </button>
            </div>
          </div>
        )}

        {/* Progress bar while uploading */}
        {upload.status === 'uploading' && (
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 4, background: '#E8EEF5', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${upload.progress}%`, background: 'linear-gradient(90deg, #4A7FA7, #0A1931)', borderRadius: 2, transition: 'width 0.15s' }} />
            </div>
            <p style={{ fontSize: 11, color: '#4A7FA7', margin: '5px 0 0', textAlign: 'right' }}>{upload.progress}% uploaded</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function IdentityVerificationPage() {
  const router = useRouter()
  const [aadharFront, setAadharFront] = useState<UploadState>(initUpload())
  const [aadharBack, setAadharBack] = useState<UploadState>(initUpload())
  const [pan, setPan] = useState<UploadState>(initUpload())
  const [ownerPhoto, setOwnerPhoto] = useState<UploadState>(initUpload())
  const [loading, setLoading] = useState(false)

  const handleUpload = (setter: React.Dispatch<React.SetStateAction<UploadState>>) => async (file: File) => {
    setter({ file, preview: null, status: 'uploading', progress: 0 })
    // Simulate upload progress
    for (let p = 10; p <= 100; p += 15) {
      await new Promise(r => setTimeout(r, 80))
      setter(s => ({ ...s, progress: Math.min(p, 100) }))
    }
    const preview = file.type.startsWith('image/') ? await new Promise<string>(r => {
      const reader = new FileReader(); reader.onload = e => r(e.target?.result as string); reader.readAsDataURL(file)
    }) : null
    setter({ file, preview, status: 'uploaded', progress: 100 })
  }

  const handleRemove = (setter: React.Dispatch<React.SetStateAction<UploadState>>) => () => setter(initUpload())

  const allUploaded = [aadharFront, aadharBack, pan, ownerPhoto].every(u => u.status === 'uploaded')
  const uploadedCount = [aadharFront, aadharBack, pan, ownerPhoto].filter(u => u.status === 'uploaded').length

  const handleContinue = async () => {
    if (!allUploaded) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    router.push('/owner/verification/bank')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 18px', marginBottom: 14, backdropFilter: 'blur(8px)' }}>
            <ShieldCheck size={12} color="#4ADE80" strokeWidth={2.5} />
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600, letterSpacing: '0.04em' }}>KYC VERIFICATION · STEP 5 OF 7</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Identity Documents</h1>
          <p style={{ fontSize: 13, color: 'rgba(179,207,229,0.8)', margin: 0 }}>Upload clear, legible copies. Files are encrypted and stored securely.</p>
        </div>

        {/* Progress */}
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Identity Documents Uploaded</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{uploadedCount} / 4</span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(uploadedCount / 4) * 100}%`, background: 'linear-gradient(90deg, #4ADE80, #22C55E)', borderRadius: 3, transition: 'width 0.4s' }} />
            </div>
          </div>
          {allUploaded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={14} color="#4ADE80" strokeWidth={3} />
              <span style={{ fontSize: 12, color: '#4ADE80', fontWeight: 700 }}>All uploaded!</span>
            </div>
          )}
        </div>

        {/* Document Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Aadhaar Section */}
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 32px rgba(10,25,49,0.15)' }}>
            <div style={{ padding: '18px 24px 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #EDF4FB, #D9E3EC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#1A3D63" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>Aadhaar Card</p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>Upload both front and back sides separately</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 10, background: aadharFront.status === 'uploaded' && aadharBack.status === 'uploaded' ? '#DCFCE7' : '#EDF4FB', color: aadharFront.status === 'uploaded' && aadharBack.status === 'uploaded' ? '#16A34A' : '#4A7FA7', padding: '3px 10px', borderRadius: 8, fontWeight: 700 }}>
                  {aadharFront.status === 'uploaded' && aadharBack.status === 'uploaded' ? '✓ Complete' : 'Required'}
                </span>
              </div>
            </div>
            <div style={{ padding: '12px 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <DocumentUploadCard
                title="Aadhaar Front" subtitle="Photo side" icon={FileText} side="FRONT"
                upload={aadharFront} onUpload={handleUpload(setAadharFront)} onRemove={handleRemove(setAadharFront)} required
              />
              <DocumentUploadCard
                title="Aadhaar Back" subtitle="Address side" icon={FileText} side="BACK"
                upload={aadharBack} onUpload={handleUpload(setAadharBack)} onRemove={handleRemove(setAadharBack)} required
              />
            </div>
          </div>

          {/* PAN Card */}
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 32px rgba(10,25,49,0.15)' }}>
            <div style={{ padding: '18px 24px 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="#D97706" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>PAN Card</p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>Government-issued Permanent Account Number card</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 10, background: pan.status === 'uploaded' ? '#DCFCE7' : '#EDF4FB', color: pan.status === 'uploaded' ? '#16A34A' : '#4A7FA7', padding: '3px 10px', borderRadius: 8, fontWeight: 700 }}>
                {pan.status === 'uploaded' ? '✓ Uploaded' : 'Required'}
              </span>
            </div>
            <div style={{ padding: '12px 24px 24px' }}>
              <DocumentUploadCard
                title="PAN Card" subtitle="JPG, PNG, or PDF format accepted" icon={FileText}
                upload={pan} onUpload={handleUpload(setPan)} onRemove={handleRemove(setPan)} required
              />
            </div>
          </div>

          {/* Owner Photo */}
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 32px rgba(10,25,49,0.15)' }}>
            <div style={{ padding: '18px 24px 6px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #F0E6FF, #E9D5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#7C3AED" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>Owner Profile Photo</p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>Professional passport-size photo, clear face visible</p>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 10, background: ownerPhoto.status === 'uploaded' ? '#DCFCE7' : '#EDF4FB', color: ownerPhoto.status === 'uploaded' ? '#16A34A' : '#4A7FA7', padding: '3px 10px', borderRadius: 8, fontWeight: 700 }}>
                {ownerPhoto.status === 'uploaded' ? '✓ Uploaded' : 'Required'}
              </span>
            </div>
            <div style={{ padding: '12px 24px 24px' }}>
              <DocumentUploadCard
                title="Passport Photo" subtitle="JPG or PNG only, white background preferred" icon={User}
                upload={ownerPhoto} onUpload={handleUpload(setOwnerPhoto)} onRemove={handleRemove(setOwnerPhoto)}
                accept="image/*" required
              />
            </div>
          </div>

          {/* Tips */}
          <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '14px 20px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={16} color="rgba(179,207,229,0.7)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: '0 0 4px' }}>Upload Guidelines</p>
                <ul style={{ fontSize: 11, color: 'rgba(179,207,229,0.7)', margin: 0, padding: '0 0 0 14px', lineHeight: 1.8 }}>
                  <li>Ensure all text and numbers are clearly visible</li>
                  <li>Avoid glare, shadows, or cut-off corners</li>
                  <li>Accepted formats: JPG, PNG, PDF · Max size: 5MB per file</li>
                  <li>Documents must be valid and not expired</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!allUploaded || loading}
            style={{
              padding: '15px', borderRadius: 14,
              background: !allUploaded ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #fff, #EDF4FB)',
              color: !allUploaded ? 'rgba(255,255,255,0.4)' : '#0A1931',
              border: 'none', fontSize: 14, fontWeight: 800, cursor: !allUploaded ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxShadow: allUploaded ? '0 8px 32px rgba(10,25,49,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(10,25,49,0.3)', borderTopColor: '#0A1931', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                {!allUploaded ? `Upload ${4 - uploadedCount} more document${4 - uploadedCount > 1 ? 's' : ''} to continue` : 'Continue to Bank Details'}
                <ChevronRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    </div>
  )
}
