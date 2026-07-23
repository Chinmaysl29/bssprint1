'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, width = 520 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,25,49,0.35)', backdropFilter: 'blur(2px)' }} />
      <div style={{
        position: 'relative', background: '#fff', borderRadius: 16, width, maxWidth: '95vw',
        boxShadow: '0 20px 60px rgba(10,25,49,0.18)', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0A1931' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}>
            <X size={16} color="#6B7FA3" />
          </button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  )
}
