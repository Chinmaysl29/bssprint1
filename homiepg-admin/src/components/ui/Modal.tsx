import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, width = 500 }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [onClose])
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(10,25,49,0.4)', backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 14, width, maxWidth: '96vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(10,25,49,0.2)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFCFE' }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0A1931' }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, padding: 6, cursor: 'pointer', display: 'flex' }}><X size={15} color="#6B7FA3" /></button>
        </div>
        <div style={{ overflowY: 'auto', padding: 22 }}>{children}</div>
      </div>
    </div>
  )
}
