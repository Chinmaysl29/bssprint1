import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Get Started — HomiePG',
  description: 'Create your HomiePG account as a PG Owner or Customer.',
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
