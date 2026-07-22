'use client'
import Link from 'next/link'
import { CheckCircle, Clock, LayoutDashboard, MessageSquare, RefreshCw, Mail, Shield, Building2, User, Home, FileText, Sparkles } from 'lucide-react'

const TIMELINE_STEPS = [
  { step: 1, label: 'Application Submitted', sublabel: 'Documents received by HomiePG', status: 'done', time: 'Just now' },
  { step: 2, label: 'Documents Under Review', sublabel: 'Authenticity check & OCR validation', status: 'active', time: 'In progress' },
  { step: 3, label: 'Owner Verification', sublabel: 'Identity & background verification', status: 'pending', time: '2–6 hours' },
  { step: 4, label: 'Business Verification', sublabel: 'Business registration & tax checks', status: 'pending', time: '6–12 hours' },
  { step: 5, label: 'Property Verification', sublabel: 'Property ownership & address validation', status: 'pending', time: '12–24 hours' },
  { step: 6, label: 'Final Approval', sublabel: 'Dashboard access granted · Bookings enabled', status: 'pending', time: '24–48 hours' },
]

const CHECKLIST = [
  { icon: Mail, label: 'Email Verified', done: true },
  { icon: User, label: 'Profile Completed', done: true },
  { icon: FileText, label: 'Aadhaar Uploaded', done: true },
  { icon: FileText, label: 'PAN Card Uploaded', done: true },
  { icon: Building2, label: 'Bank Details Submitted', done: true },
  { icon: Home, label: 'Property Documents Uploaded', done: true },
  { icon: Shield, label: 'Application Submitted', done: true },
]

export default function VerificationStatusPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', padding: '50px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Hero Success */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
            {/* Rings */}
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1.5px solid rgba(74,222,128,0.2)', animation: 'pulse-ring 2.5s ease-out infinite' }} />
            <style>{`
              @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
              @keyframes bounce-in { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity: 1; } }
              @keyframes spin { to { transform: rotate(360deg) } }
            `}</style>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 16px 48px rgba(34,197,94,0.4)',
              animation: 'bounce-in 0.6s ease',
            }}>
              <CheckCircle size={48} color="#fff" strokeWidth={1.8} />
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '6px 18px', marginBottom: 16 }}>
            <Sparkles size={12} color="#4ADE80" />
            <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700, letterSpacing: '0.06em' }}>APPLICATION SUBMITTED SUCCESSFULLY</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            You're on your way!
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(179,207,229,0.85)', margin: '0 0 8px', lineHeight: 1.6, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
            Your verification request has been submitted successfully. Our team will review your documents and respond within 24–48 hours.
          </p>

          {/* Status Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 12, padding: '10px 20px', marginTop: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 8px rgba(251,191,36,0.8)', animation: 'pulse-ring 1.5s ease-out infinite' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Verification Pending</span>
            <span style={{ fontSize: 12, color: 'rgba(179,207,229,0.7)' }}>· Est. 24–48 hours</span>
          </div>
        </div>

        {/* Timeline + Checklist Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Timeline Card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 8px 40px rgba(10,25,49,0.2)' }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#0A1931', margin: '0 0 22px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="#4A7FA7" strokeWidth={2} /> Review Timeline
            </p>
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 15, top: 20, bottom: 20, width: 2, background: '#EDF4FB', zIndex: 0 }} />

              {TIMELINE_STEPS.map((step, i) => (
                <div key={step.step} style={{ display: 'flex', gap: 14, marginBottom: i < TIMELINE_STEPS.length - 1 ? 18 : 0, position: 'relative', zIndex: 1 }}>
                  {/* Icon */}
                  <div style={{ flexShrink: 0, position: 'relative' }}>
                    {step.status === 'done' ? (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(34,197,94,0.4)' }}>
                        <CheckCircle size={16} color="#fff" strokeWidth={2} />
                      </div>
                    ) : step.status === 'active' ? (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(59,130,246,0.4)' }}>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%', display: 'block', animation: 'spin 0.9s linear infinite' }} />
                      </div>
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDF4FB', border: '2px solid #D9E3EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#9BADC2' }}>{step.step}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: step.status === 'pending' ? '#9BADC2' : '#0A1931', margin: '0 0 2px' }}>{step.label}</p>
                    <p style={{ fontSize: 11, color: step.status === 'pending' ? '#C8D9E8' : '#6B7FA3', margin: '0 0 3px', lineHeight: 1.4 }}>{step.sublabel}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, color: step.status === 'done' ? '#16A34A' : step.status === 'active' ? '#3B82F6' : '#B3CFE5' }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist Card */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px 24px', boxShadow: '0 8px 40px rgba(10,25,49,0.2)' }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#0A1931', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="#16A34A" strokeWidth={2} /> Submission Checklist
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {CHECKLIST.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < CHECKLIST.length - 1 ? '1px solid #F0F4F9' : 'none' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: item.done ? '#DCFCE7' : '#F0F4F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.done ? <CheckCircle size={14} color="#16A34A" strokeWidth={2.5} /> : <item.icon size={14} color="#D9E3EC" strokeWidth={1.5} />}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: item.done ? 600 : 400, color: item.done ? '#0A1931' : '#9BADC2' }}>{item.label}</span>
                  {item.done && <CheckCircle size={11} color="#16A34A" strokeWidth={3} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </div>
              ))}
            </div>

            {/* All done badge */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={16} color="#16A34A" strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>All 7/7 items complete</span>
            </div>
          </div>
        </div>

        {/* What's Next card */}
        <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 18, padding: '22px 28px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 14px' }}>What happens next?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { icon: Mail, title: 'Email Updates', desc: 'You\'ll receive real-time updates at ravi.kumar@email.com' },
              { icon: Clock, title: '24–48 Hours', desc: 'Our team completes verification within 2 business days' },
              { icon: LayoutDashboard, title: 'Dashboard Access', desc: 'Once approved, your full dashboard is unlocked immediately' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={18} color="rgba(179,207,229,0.9)" strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0 }}>{item.title}</p>
                <p style={{ fontSize: 11, color: 'rgba(179,207,229,0.7)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 14 }}>
          <Link href="/owner/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
            <button style={{
              width: '100%', padding: '15px', borderRadius: 14,
              background: 'linear-gradient(135deg, #fff, #EDF4FB)',
              color: '#0A1931', border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 8px 32px rgba(10,25,49,0.3)',
            }}>
              <LayoutDashboard size={18} strokeWidth={2} />
              Go to Dashboard
            </button>
          </Link>
          <button style={{
            padding: '15px 22px', borderRadius: 14,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <MessageSquare size={17} strokeWidth={1.8} />
            Contact Support
          </button>
          <button style={{
            padding: '15px 22px', borderRadius: 14,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(255,255,255,0.2)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <RefreshCw size={17} strokeWidth={1.8} />
            Refresh Status
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(179,207,229,0.4)', marginTop: 24 }}>
          Reference ID: HMG-2025-09847 · Submitted: 9 July 2025, 14:32 IST
        </p>
      </div>
    </div>
  )
}
