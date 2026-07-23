'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, width = 540 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number
}) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,25,49,0.4)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 18, width, maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(10,25,49,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0A1931' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex' }}><X size={16} color="#6B7FA3" /></button>
        </div>
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  )
}
