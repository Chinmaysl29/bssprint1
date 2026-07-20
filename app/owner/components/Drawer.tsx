'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Drawer({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,49,0.3)', backdropFilter: 'blur(2px)', zIndex: 150 }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: 420, maxWidth: '100vw',
        background: '#fff', zIndex: 160, boxShadow: '-8px 0 40px rgba(10,25,49,0.12)',
        transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.25s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0A1931' }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex' }}>
            <X size={16} color="#6B7FA3" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>{children}</div>
      </div>
    </>
  )
}
