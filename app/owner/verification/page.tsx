'use client'
import Link from 'next/link'
import {
  Shield, Building2, User, Home, Check, Clock, AlertTriangle, X,
  Mail, FileText, CreditCard, CheckCircle, ArrowRight, MessageSquare,
  Phone, ExternalLink, RefreshCw, ChevronRight, Upload
} from 'lucide-react'

const CHECKLIST_ITEMS = [
  { icon: Mail, label: 'Email Verified', sublabel: 'ravi.kumar@email.com', done: true, href: '/owner/auth/verify-email' },
  { icon: User, label: 'Profile Completed', sublabel: 'Personal & business info', done: true, href: '/owner/verification/profile' },
  { icon: FileText, label: 'Aadhaar Uploaded', sublabel: 'Front & back uploaded', done: true, href: '/owner/verification/identity' },
  { icon: FileText, label: 'PAN Card Uploaded', sublabel: 'Document verified', done: true, href: '/owner/verification/identity' },
  { icon: CreditCard, label: 'Bank Details Submitted', sublabel: 'SBI · ••••3456', done: true, href: '/owner/verification/bank' },
  { icon: Home, label: 'Property Documents Uploaded', sublabel: 'Sale deed uploaded', done: true, href: '/owner/verification/property' },
  { icon: Shield, label: 'Verification Submitted', sublabel: 'Under review by HomiePG', done: true, href: '/owner/verification/status' },
]

const VERIFICATION_CARDS = [
  {
    key: 'business',
    icon: Building2,
    title: 'Business Verification',
    description: 'Your business details, property registration, and ownership documents are being reviewed.',
    status: 'under_review',
    statusLabel: 'Under Review',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    iconBg: '#FEF3C7',
    updatedAt: '9 Jul 2025, 14:32',
    verifiedAt: null,
    documents: [
      { name: 'Sale Deed', status: 'uploaded' },
      { name: 'Business Name Proof', status: 'pending' },
    ],
    docsCount: 1,
    docsTotal: 2,
  },
  {
    key: 'owner',
    icon: User,
    title: 'Owner Verification',
    description: 'Your identity documents and personal details are being cross-verified with government databases.',
    status: 'under_review',
    statusLabel: 'Under Review',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    iconBg: '#DBEAFE',
    updatedAt: '9 Jul 2025, 14:32',
    verifiedAt: null,
    documents: [
      { name: 'Aadhaar Card', status: 'uploaded' },
      { name: 'PAN Card', status: 'uploaded' },
      { name: 'Profile Photo', status: 'uploaded' },
    ],
    docsCount: 3,
    docsTotal: 3,
  },
  {
    key: 'pg',
    icon: Home,
    title: 'PG Verification',
    description: 'Your PG properties will be verified once your owner and business verifications are approved.',
    status: 'pending',
    statusLabel: 'Pending',
    color: '#6B7FA3',
    bg: '#F6FAFD',
    border: '#D9E3EC',
    iconBg: '#EDF4FB',
    updatedAt: '9 Jul 2025, 14:32',
    verifiedAt: null,
    documents: [
      { name: 'Property Details', status: 'uploaded' },
      { name: 'Bank Account', status: 'uploaded' },
    ],
    docsCount: 2,
    docsTotal: 2,
  },
]

function StatusIcon({ status }: { status: string }) {
  if (status === 'approved') return <CheckCircle size={14} color="#16A34A" strokeWidth={2.5} />
  if (status === 'rejected') return <X size={14} color="#DC2626" strokeWidth={2.5} />
  if (status === 'under_review') return (
    <span style={{ width: 12, height: 12, border: '2px solid rgba(29,78,216,0.3)', borderTopColor: '#1D4ED8', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
  )
  return <Clock size={12} color="#9BADC2" strokeWidth={2} />
}

export default function VerificationPage() {
  const completedCount = CHECKLIST_ITEMS.filter(i => i.done).length
  const progress = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100)

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: '0 0 4px', letterSpacing: '-0.02em' }}>Verification Centre</h1>
          <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>Track your verification progress and document status in real-time</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: '#F6FAFD', border: '1.5px solid #D9E3EC', borderRadius: 11, fontSize: 12, fontWeight: 700, color: '#4A7FA7', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh Status
        </button>
      </div>

      {/* Overall Progress */}
      <div style={{ background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', borderRadius: 20, padding: '24px 28px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -24, right: -24, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -16, left: '40%', width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,127,167,0.15)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Overall Verification Progress</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 20, padding: '4px 12px' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FBBF24', boxShadow: '0 0 6px rgba(251,191,36,0.8)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#FBBF24' }}>Pending Review</span>
              </div>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4ADE80, #22C55E)', borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <span style={{ fontSize: 12, color: 'rgba(179,207,229,0.75)' }}>✓ {completedCount}/{CHECKLIST_ITEMS.length} steps complete</span>
              <span style={{ fontSize: 12, color: 'rgba(179,207,229,0.75)' }}>Documents: 5/5 uploaded</span>
              <span style={{ fontSize: 12, color: 'rgba(179,207,229,0.75)' }}>Est. review: 24–48 hrs</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(74,222,128,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#4ADE80' }}>{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 28 }}>
        {VERIFICATION_CARDS.map((card) => (
          <div key={card.key} style={{ background: '#fff', border: '1.5px solid #E8EEF5', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(10,25,49,0.07)', transition: 'all 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 30px rgba(10,25,49,0.14)'; el.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 12px rgba(10,25,49,0.07)'; el.style.transform = 'translateY(0)' }}
          >
            {/* Card header strip */}
            <div style={{ height: 4, background: card.status === 'approved' ? 'linear-gradient(90deg, #22C55E, #16A34A)' : card.status === 'under_review' ? 'linear-gradient(90deg, #3B82F6, #1D4ED8)' : '#E8EEF5' }} />
            <div style={{ padding: '20px 22px 22px' }}>
              {/* Icon + Title */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <card.icon size={22} color={card.color} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0A1931', margin: '0 0 3px' }}>{card.title}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: card.bg, border: `1px solid ${card.border}`, borderRadius: 16, padding: '3px 10px' }}>
                    <StatusIcon status={card.status} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: card.color }}>{card.statusLabel}</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12, color: '#6B7FA3', margin: '0 0 16px', lineHeight: 1.55 }}>{card.description}</p>

              {/* Docs progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7FA3' }}>Documents</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0A1931' }}>{card.docsCount}/{card.docsTotal}</span>
                </div>
                <div style={{ height: 5, background: '#EDF4FB', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${(card.docsCount / card.docsTotal) * 100}%`, background: card.docsCount === card.docsTotal ? 'linear-gradient(90deg, #22C55E, #16A34A)' : 'linear-gradient(90deg, #4A7FA7, #1A3D63)', borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {card.documents.map((doc) => (
                    <div key={doc.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: doc.status === 'uploaded' ? '#DCFCE7' : '#F0F4F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {doc.status === 'uploaded' ? <Check size={9} color="#16A34A" strokeWidth={3} /> : <Clock size={9} color="#B3CFE5" />}
                      </div>
                      <span style={{ fontSize: 11, color: doc.status === 'uploaded' ? '#0A1931' : '#B3CFE5', fontWeight: doc.status === 'uploaded' ? 600 : 400 }}>{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ paddingTop: 12, borderTop: '1px solid #F0F4F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#B3CFE5' }}>Updated {card.updatedAt}</span>
                <Link href={`/owner/verification/${card.key}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#4A7FA7' }}>
                  View Details <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checklist + Support Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        {/* Checklist */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 26px', border: '1.5px solid #E8EEF5', boxShadow: '0 2px 12px rgba(10,25,49,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: 0 }}>Verification Checklist</p>
            <div style={{ background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 8, padding: '4px 12px' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#16A34A' }}>{completedCount}/{CHECKLIST_ITEMS.length} Done</span>
            </div>
          </div>

          {/* Checklist items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {CHECKLIST_ITEMS.map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12,
                  background: item.done ? '#FAFCFF' : '#FFF8F8', marginBottom: 6,
                  border: `1px solid ${item.done ? '#E8EEF5' : '#FEE2E2'}`,
                  transition: 'all 0.15s', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = item.done ? '#F0F7FF' : '#FFF0F0'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = item.done ? '#FAFCFF' : '#FFF8F8'}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.done ? '#DCFCE7' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.done ? <CheckCircle size={16} color="#16A34A" strokeWidth={2.5} /> : <item.icon size={16} color="#DC2626" strokeWidth={1.5} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: '#6B7FA3', margin: '1px 0 0' }}>{item.sublabel}</p>
                  </div>
                  {item.done ? (
                    <span style={{ fontSize: 10, background: '#DCFCE7', color: '#16A34A', padding: '3px 9px', borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>✓ Done</span>
                  ) : (
                    <span style={{ fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '3px 9px', borderRadius: 8, fontWeight: 700, flexShrink: 0 }}>Pending</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support + Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Current status summary */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '22px 22px', border: '1.5px solid #E8EEF5', boxShadow: '0 2px 12px rgba(10,25,49,0.07)' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#0A1931', margin: '0 0 14px' }}>Estimated Timeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Documents Review', time: 'In progress', color: '#3B82F6' },
                { label: 'Owner Verification', time: '2–6 hours', color: '#9BADC2' },
                { label: 'Business Check', time: '6–12 hours', color: '#9BADC2' },
                { label: 'Final Approval', time: '24–48 hours', color: '#9BADC2' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F6FAFD', borderRadius: 9 }}>
                  <span style={{ fontSize: 12, color: '#0A1931', fontWeight: 600 }}>{step.label}</span>
                  <span style={{ fontSize: 11, color: step.color, fontWeight: 700 }}>{step.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Card */}
          <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', borderRadius: 18, padding: '22px', boxShadow: '0 8px 28px rgba(10,25,49,0.2)' }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Need Help?</p>
            <p style={{ fontSize: 11, color: 'rgba(179,207,229,0.8)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Our verification team is available Mon–Sat, 9AM–6PM IST
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:support@homiepg.com" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: 11, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
              >
                <Mail size={15} color="rgba(179,207,229,0.9)" strokeWidth={1.5} />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>support@homiepg.com</span>
                <ExternalLink size={11} color="rgba(179,207,229,0.5)" style={{ marginLeft: 'auto' }} />
              </a>
              <a href="tel:+918001234567" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: 11, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
              >
                <Phone size={15} color="rgba(179,207,229,0.9)" strokeWidth={1.5} />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>+91 800-123-4567</span>
                <ExternalLink size={11} color="rgba(179,207,229,0.5)" style={{ marginLeft: 'auto' }} />
              </a>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 14px', background: '#fff', border: 'none', borderRadius: 11, fontSize: 12, fontWeight: 700, color: '#0A1931', cursor: 'pointer' }}>
                <MessageSquare size={14} />
                Open Support Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
