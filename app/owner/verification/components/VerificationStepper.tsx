'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, User, Shield, Building2, CreditCard, ClipboardList, Send } from 'lucide-react'

const steps = [
  { label: 'Profile',   href: '/owner/verification/profile',  icon: User },
  { label: 'Identity',  href: '/owner/verification/identity', icon: Shield },
  { label: 'Bank',      href: '/owner/verification/bank',     icon: CreditCard },
  { label: 'Property',  href: '/owner/verification/property', icon: Building2 },
  { label: 'Review',    href: '/owner/verification/review',   icon: ClipboardList },
  { label: 'Submit',    href: '/owner/verification/status',   icon: Send },
]

export default function VerificationStepper({ completedSteps = [] }: { completedSteps?: number[] }) {
  const pathname = usePathname()
  const current = steps.findIndex(s => pathname.startsWith(s.href))

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32, flexWrap: 'wrap', rowGap: 12 }}>
      {steps.map((step, i) => {
        const done = completedSteps.includes(i) || i < current
        const active = i === current
        const Icon = step.icon
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <Link href={step.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? '#0A1931' : active ? '#EDF4FB' : '#F6FAFD',
                border: active ? '2.5px solid #0A1931' : done ? 'none' : '2px solid #D9E3EC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? '0 0 0 4px rgba(10,25,49,0.08)' : 'none',
                transition: 'all 0.2s',
              }}>
                {done
                  ? <Check size={15} color="#fff" strokeWidth={2.5} />
                  : <Icon size={15} color={active ? '#0A1931' : '#B3CFE5'} strokeWidth={1.5} />
                }
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : done ? 600 : 400, color: active ? '#0A1931' : done ? '#4A7FA7' : '#B3CFE5', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                {step.label}
              </span>
            </Link>
            {i < steps.length - 1 && (
              <div style={{ width: 40, height: 2, background: done ? '#0A1931' : '#E8EEF5', margin: '0 4px 16px', transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
