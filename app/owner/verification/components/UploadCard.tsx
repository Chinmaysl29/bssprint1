'use client'
import { useState, useRef } from 'react'
import { Upload, FileText, X, Eye, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'

interface UploadCardProps {
  label: string
  description?: string
  required?: boolean
  accept?: string
  maxSizeMB?: number
  initialStatus?: string
  hint?: string
}

export default function UploadCard({ label, description, required = true, accept = '.pdf,.png,.jpg,.jpeg', maxSizeMB = 5, initialStatus = 'pending', hint }: UploadCardProps) {
  const [status, setStatus] = useState(initialStatus)
  const [file, setFile] = useState<{ name: string; size: number } | null>(
    initialStatus === 'uploaded' || initialStatus === 'verified' || initialStatus === 'rejected'
      ? { name: `${label.toLowerCase().replace(/\s+/g, '_')}.pdf`, size: 1.2 }
      : null
  )
  const [drag, setDrag] = useState(false)
  const [progress, setProgress] = useState(initialStatus !== 'pending' ? 100 : 0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setError('')
    if (f.size > maxSizeMB * 1024 * 1024) { setError(`File too large. Max ${maxSizeMB}MB allowed.`); return }
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'png', 'jpg', 'jpeg'].includes(ext ?? '')) { setError('Unsupported format. Use PDF, PNG, JPG or JPEG.'); return }
    setFile({ name: f.name, size: f.size / (1024 * 1024) })
    setUploading(true)
    setProgress(0)
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(t); setUploading(false); setStatus('uploaded'); return 100 }
        return p + 10
      })
    }, 80)
  }

  const reset = () => { setFile(null); setStatus('pending'); setProgress(0); setError('') }

  const isUploaded = status === 'uploaded' || status === 'verified' || status === 'rejected'

  return (
    <div style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${drag ? '#4A7FA7' : isUploaded ? '#B3CFE5' : '#E8EEF5'}`, overflow: 'hidden', transition: 'all 0.2s', boxShadow: drag ? '0 0 0 3px rgba(74,127,167,0.1)' : '0 1px 4px rgba(10,25,49,0.05)' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F6FAFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>
            {label}
            {required ? <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span> : <span style={{ fontSize: 10, color: '#6B7FA3', marginLeft: 6, fontWeight: 500 }}>(Optional)</span>}
          </p>
          {description && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{description}</p>}
        </div>
        <StatusBadge status={status} size="xs" />
      </div>

      {/* Upload zone */}
      <div style={{ padding: '14px 18px' }}>
        {!isUploaded ? (
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
            onClick={() => ref.current?.click()}
            style={{
              border: `2px dashed ${drag ? '#4A7FA7' : '#D9E3EC'}`, borderRadius: 10,
              padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
              background: drag ? '#EDF4FB' : '#FAFCFF', transition: 'all 0.2s',
            }}
          >
            <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            <div style={{ width: 40, height: 40, borderRadius: 12, background: drag ? '#B3CFE5' : '#E8EEF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <Upload size={18} color={drag ? '#1A3D63' : '#6B7FA3'} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: drag ? '#1A3D63' : '#0A1931', margin: '0 0 4px' }}>
              {drag ? 'Drop to upload' : 'Drag & drop or click to upload'}
            </p>
            <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0 }}>PDF, PNG, JPG, JPEG · Max {maxSizeMB}MB</p>
            {hint && <p style={{ fontSize: 10, color: '#4A7FA7', margin: '6px 0 0', fontWeight: 500 }}>💡 {hint}</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F6FAFD', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={16} color="#1A3D63" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file?.name}</p>
              <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{file?.size.toFixed(1)} MB · {status === 'verified' ? '✓ Verified' : status === 'rejected' ? '✗ Rejected' : '⏳ Under review'}</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ padding: '5px 7px', background: '#EDF4FB', border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
                <Eye size={13} color="#1A3D63" />
              </button>
              <button onClick={reset} style={{ padding: '5px 7px', background: '#FEF2F2', border: 'none', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
                <RefreshCw size={13} color="#DC2626" />
              </button>
            </div>
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: '#6B7FA3' }}>Uploading...</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#0A1931' }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: '#E8EEF5', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #0A1931, #4A7FA7)', borderRadius: 2, transition: 'width 0.1s' }} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}>
            <AlertCircle size={12} color="#DC2626" />
            <p style={{ fontSize: 11, color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Rejection note */}
        {status === 'rejected' && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 12px', marginTop: 10 }}>
            <p style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, margin: '0 0 2px' }}>Document Rejected</p>
            <p style={{ fontSize: 10, color: '#EF4444', margin: 0 }}>Admin note: Image is blurry. Please re-upload a clear, readable copy.</p>
          </div>
        )}
      </div>
    </div>
  )
}
