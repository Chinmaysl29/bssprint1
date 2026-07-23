'use client'
import { useState } from 'react'
import { Upload, Eye, Trash2, RefreshCw, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'
import { documents as initialDocs } from '../data/dummy'

const statusConfig = {
  uploaded: { icon: CheckCircle, color: '#1D4ED8', bg: '#EFF6FF', label: 'Uploaded' },
  pending:  { icon: Clock,         color: '#D97706', bg: '#FFFBEB', label: 'Pending' },
  rejected: { icon: XCircle,       color: '#DC2626', bg: '#FEF2F2', label: 'Rejected' },
}

const docIcons: Record<string, string> = {
  'Aadhaar Card': '🪪', 'PAN Card': '💳', 'College ID': '🎓',
  'Employee ID': '🏢', 'Passport': '🛂', 'Driving License': '🚗',
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState(initialDocs)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const uploaded = docs.filter(d => d.status === 'uploaded').length
  const pending  = docs.filter(d => d.status === 'pending').length
  const rejected = docs.filter(d => d.status === 'rejected').length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>Documents</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>Upload and manage your KYC documents</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Uploaded', count: uploaded, color: '#1D4ED8', bg: '#EFF6FF' },
          { label: 'Pending', count: pending, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Rejected', count: rejected, color: '#DC2626', bg: '#FEF2F2' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: s.color, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#0A1931', margin: 0 }}>{s.count}</p>
            </div>
            <p style={{ fontSize: 28, margin: 0 }}>{s.label === 'Uploaded' ? '✅' : s.label === 'Pending' ? '⏳' : '❌'}</p>
          </div>
        ))}
      </div>

      {/* Document Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {docs.map(doc => {
          const cfg = statusConfig[doc.status as keyof typeof statusConfig]
          const StatusIcon = cfg.icon
          const isDrag = dragOver === doc.id

          return (
            <div key={doc.id} style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${isDrag ? '#4A7FA7' : '#E8EEF5'}`, padding: 20, boxShadow: isDrag ? '0 4px 20px rgba(74,127,167,0.15)' : '0 1px 4px rgba(10,25,49,0.05)', transition: 'all 0.2s' }}
              onDragOver={e => { e.preventDefault(); setDragOver(doc.id) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => { e.preventDefault(); setDragOver(null); setDocs(d => d.map(x => x.id === doc.id ? { ...x, status: 'uploaded', uploadDate: new Date().toISOString().split('T')[0] } : x)) }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    {docIcons[doc.type] ?? '📄'}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{doc.type}</p>
                    {doc.uploadDate && <p style={{ fontSize: 10, color: '#6B7FA3', margin: '3px 0 0' }}>Uploaded {doc.uploadDate}</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: cfg.bg, padding: '4px 10px', borderRadius: 20 }}>
                  <StatusIcon size={11} color={cfg.color} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                </div>
              </div>

              {/* Upload area for pending/rejected */}
              {(doc.status === 'pending' || doc.status === 'rejected') ? (
                <div style={{
                  border: `2px dashed ${isDrag ? '#4A7FA7' : '#D9E3EC'}`, borderRadius: 10, padding: '20px',
                  textAlign: 'center', background: isDrag ? '#EDF4FB' : '#F6FAFD', cursor: 'pointer', marginBottom: 14, transition: 'all 0.2s',
                }}>
                  <Upload size={20} color={isDrag ? '#4A7FA7' : '#B3CFE5'} style={{ marginBottom: 6 }} />
                  <p style={{ fontSize: 12, color: '#6B7FA3', margin: 0 }}>Drag & drop or click to upload</p>
                  <p style={{ fontSize: 10, color: '#B3CFE5', margin: '4px 0 0' }}>PDF, JPG, PNG (max 5MB)</p>
                </div>
              ) : (
                <div style={{ background: '#F6FAFD', borderRadius: 10, padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={18} color="#4A7FA7" strokeWidth={1.5} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{doc.type.toLowerCase().replace(' ', '_')}.pdf</p>
                    <p style={{ fontSize: 10, color: doc.verified ? '#1D4ED8' : '#D97706', margin: '2px 0 0', fontWeight: 600 }}>
                      {doc.verified ? '✓ Verified' : '⏳ Under review'}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                {doc.status === 'uploaded' ? (
                  <>
                    <button style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#0A1931' }}>
                      <Eye size={12} /> View
                    </button>
                    <button style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#0A1931' }}>
                      <RefreshCw size={12} /> Replace
                    </button>
                    <button style={{ padding: '8px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', display: 'flex' }}>
                      <Trash2 size={12} color="#DC2626" />
                    </button>
                  </>
                ) : (
                  <button style={{ flex: 1, padding: '10px', background: '#0A1931', border: 'none', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    <Upload size={13} /> Upload Document
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
