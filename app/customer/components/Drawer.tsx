'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Drawer({ open, onClose, title, children, width = 420 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,49,0.35)', backdropFilter: 'blur(3px)', zIndex: 200 }} />}
      <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width, maxWidth: '100vw', background: '#fff', zIndex: 210, boxShadow: '-8px 0 48px rgba(10,25,49,0.14)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0A1931' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex' }}><X size={16} color="#6B7FA3" /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
      </div>
    </>
  )
}
