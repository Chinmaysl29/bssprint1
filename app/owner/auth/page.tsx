'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  Building2, User, ArrowRight, Check, Star, Shield, TrendingUp,
  BarChart3, BedDouble, Users, IndianRupee, Search, Heart, CalendarCheck,
} from 'lucide-react'

const ownerFeatures = [
  { icon: Building2, text: 'Manage multiple PG properties' },
  { icon: BedDouble, text: 'Real-time bed & room tracking' },
  { icon: Users, text: 'Resident check-in & KYC' },
  { icon: IndianRupee, text: 'Payments, receipts & reports' },
  { icon: BarChart3, text: 'Analytics & occupancy charts' },
]

const customerFeatures = [
  { icon: Search, text: 'Browse 500+ verified PG listings' },
  { icon: Heart, text: 'Save favourites & compare PGs' },
  { icon: CalendarCheck, text: 'Book rooms instantly online' },
  { icon: Shield, text: 'KYC-verified safe stays' },
  { icon: Star, text: 'Review & rate your stay' },
]

export default function ChooseAccountPage() {
  const [selected, setSelected] = useState<'owner' | 'customer' | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, width: '100%', maxWidth: 680 }}>
      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '5px 16px', marginBottom: 18 }}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.04em' }}>TRUSTED BY 500+ PG OWNERS</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Welcome to <span style={{ background: 'linear-gradient(90deg, #B3CFE5, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HomiePG</span>
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(179,207,229,0.8)', margin: 0, lineHeight: 1.6 }}>
          India's most trusted PG management platform.<br />Choose how you want to get started.
        </p>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%' }}>
        {/* Owner Card */}
        <button
          onClick={() => setSelected('owner')}
          style={{
            background: selected === 'owner' ? '#fff' : 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
            border: `2px solid ${selected === 'owner' ? '#fff' : 'rgba(255,255,255,0.18)'}`,
            borderRadius: 22,
            padding: '28px 26px 26px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
            transform: selected === 'owner' ? 'scale(1.02) translateY(-2px)' : 'scale(1)',
            boxShadow: selected === 'owner' ? '0 24px 64px rgba(10,25,49,0.35)' : '0 4px 20px rgba(10,25,49,0.12)',
            position: 'relative',
            outline: 'none',
          }}
        >
          {selected === 'owner' && (
            <div style={{ position: 'absolute', top: 16, right: 16, width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #0A1931, #1A3D63)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(10,25,49,0.3)' }}>
              <Check size={13} color="#fff" strokeWidth={3} />
            </div>
          )}
          {/* Icon */}
          <div style={{ width: 58, height: 58, borderRadius: 18, background: selected === 'owner' ? 'linear-gradient(135deg, #EDF4FB, #D9E3EC)' : 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, border: selected === 'owner' ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
            <Building2 size={26} color={selected === 'owner' ? '#0A1931' : '#fff'} strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: 19, fontWeight: 800, color: selected === 'owner' ? '#0A1931' : '#fff', margin: '0 0 6px', letterSpacing: '-0.03em' }}>PG Owner</p>
          <p style={{ fontSize: 12, color: selected === 'owner' ? '#6B7FA3' : 'rgba(179,207,229,0.75)', margin: '0 0 20px', lineHeight: 1.55 }}>
            List, manage and grow your paying guest properties with powerful tools.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ownerFeatures.map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: selected === 'owner' ? '#EDF4FB' : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <f.icon size={11} color={selected === 'owner' ? '#1A3D63' : '#B3CFE5'} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 12, color: selected === 'owner' ? '#4A7FA7' : 'rgba(179,207,229,0.75)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
          {selected === 'owner' && (
            <div style={{ marginTop: 20, padding: '8px 12px', background: '#EDF4FB', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Shield size={13} color="#1A3D63" />
              <span style={{ fontSize: 11, color: '#1A3D63', fontWeight: 600 }}>Free to join · Verification required</span>
            </div>
          )}
        </button>

        {/* Customer Card */}
        <Link href="/customer/auth" style={{ textDecoration: 'none', display: 'block' }}>
          <button
            onClick={() => setSelected('customer')}
            style={{
              width: '100%',
              height: '100%',
              background: selected === 'customer' ? '#fff' : 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              border: `2px solid ${selected === 'customer' ? '#fff' : 'rgba(255,255,255,0.18)'}`,
              borderRadius: 22,
              padding: '28px 26px 26px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
              transform: selected === 'customer' ? 'scale(1.02) translateY(-2px)' : 'scale(1)',
              boxShadow: selected === 'customer' ? '0 24px 64px rgba(10,25,49,0.35)' : '0 4px 20px rgba(10,25,49,0.12)',
              position: 'relative',
              outline: 'none',
            }}
          >
            {selected === 'customer' && (
              <div style={{ position: 'absolute', top: 16, right: 16, width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #0A1931, #1A3D63)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={13} color="#fff" strokeWidth={3} />
              </div>
            )}
            <div style={{ width: 58, height: 58, borderRadius: 18, background: selected === 'customer' ? 'linear-gradient(135deg, #EDF4FB, #D9E3EC)' : 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, border: selected === 'customer' ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
              <User size={26} color={selected === 'customer' ? '#0A1931' : '#fff'} strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: 19, fontWeight: 800, color: selected === 'customer' ? '#0A1931' : '#fff', margin: '0 0 6px', letterSpacing: '-0.03em' }}>Customer</p>
            <p style={{ fontSize: 12, color: selected === 'customer' ? '#6B7FA3' : 'rgba(179,207,229,0.75)', margin: '0 0 20px', lineHeight: 1.55 }}>
              Find, book and settle into your perfect PG accommodation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {customerFeatures.map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: selected === 'customer' ? '#EDF4FB' : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={11} color={selected === 'customer' ? '#1A3D63' : '#B3CFE5'} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 12, color: selected === 'customer' ? '#4A7FA7' : 'rgba(179,207,229,0.75)', fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </button>
        </Link>
      </div>

      {/* CTA for Owner */}
      {selected === 'owner' && (
        <Link href="/owner/auth/register" style={{ textDecoration: 'none', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#fff', color: '#0A1931', border: 'none',
            borderRadius: 16, padding: '16px 40px', fontSize: 15, fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 12px 40px rgba(10,25,49,0.3)',
            transition: 'all 0.2s', letterSpacing: '-0.02em',
          }}>
            <Building2 size={19} strokeWidth={1.8} />
            Get Started as PG Owner
            <ArrowRight size={19} strokeWidth={2.5} />
          </button>
        </Link>
      )}

      {/* Trust badges */}
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center', marginTop: -8 }}>
        {[
          { icon: Shield, text: '256-bit SSL Encrypted' },
          { icon: Star, text: '4.8★ Owner Rating' },
          { icon: TrendingUp, text: '₹2Cr+ Revenue Managed' },
        ].map(b => (
          <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <b.icon size={13} color="rgba(179,207,229,0.55)" strokeWidth={1.5} />
            <span style={{ fontSize: 11, color: 'rgba(179,207,229,0.55)', fontWeight: 500 }}>{b.text}</span>
          </div>
        ))}
      </div>

      {/* Sign in link */}
      <p style={{ fontSize: 13, color: 'rgba(179,207,229,0.65)', margin: '-12px 0 0' }}>
        Already have an account?{' '}
        <Link href="/owner/auth/login" style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>Sign in to Dashboard</Link>
      </p>
    </div>
  )
}
