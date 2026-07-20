'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void
}) {
  const pages = Math.ceil(total / perPage)
  if (pages <= 1) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderTop: '1px solid #E8EEF5' }}>
      <span style={{ fontSize: 12, color: '#6B7FA3' }}>
        Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
      </span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onChange(page - 1)} disabled={page === 1} style={{ padding: '6px 10px', background: '#fff', border: '1px solid #D9E3EC', borderRadius: 8, cursor: 'pointer', display: 'flex', opacity: page === 1 ? 0.4 : 1 }}>
          <ChevronLeft size={14} color="#4A7FA7" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} style={{
            padding: '6px 12px', background: p === page ? '#1A3D63' : '#fff',
            color: p === page ? '#fff' : '#0A1931', border: '1px solid #D9E3EC',
            borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: p === page ? 600 : 400,
          }}>{p}</button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages} style={{ padding: '6px 10px', background: '#fff', border: '1px solid #D9E3EC', borderRadius: 8, cursor: 'pointer', display: 'flex', opacity: page === pages ? 0.4 : 1 }}>
          <ChevronRight size={14} color="#4A7FA7" />
        </button>
      </div>
    </div>
  )
}
