'use client'
import { Check } from 'lucide-react'

const steps = ['Account Type', 'Register', 'Verify Email', 'Login']

export default function AuthStepper({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#0A1931' : active ? '#fff' : 'rgba(255,255,255,0.15)',
                border: active ? '2.5px solid #fff' : done ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: active ? '0 0 0 4px rgba(255,255,255,0.15)' : 'none',
                transition: 'all 0.25s',
              }}>
                {done
                  ? <Check size={13} color="#fff" strokeWidth={2.5} />
                  : <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#0A1931' : 'rgba(255,255,255,0.5)' }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? '#fff' : done ? 'rgba(179,207,229,0.8)' : 'rgba(179,207,229,0.4)', whiteSpace: 'nowrap', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 56, height: 1.5, background: i < current ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', margin: '0 4px 14px', transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
