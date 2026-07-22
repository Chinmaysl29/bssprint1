'use client'
import type { ReactNode } from 'react'

export default function AuthCard({ children, width = 460 }: { children: ReactNode; width?: number }) {
  return (
    <div style={{
      width, maxWidth: '100%',
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(20px)',
      borderRadius: 22,
      boxShadow: '0 32px 80px rgba(10,25,49,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}
