'use client'
import {
  Building2, Layers, DoorOpen, BedDouble, Users, TrendingUp,
  IndianRupee, Clock, ArrowDownCircle, ArrowUpCircle, Plus, FileText,
  Shield, User, CheckCircle, ChevronRight
} from 'lucide-react'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import OccupancyChart from '../components/OccupancyChart'
import ExpenseChart from '../components/ExpenseChart'
import Button from '../components/Button'
import Link from 'next/link'

const stats = [
  { title: 'Total Buildings', value: 3, icon: Building2, accent: '#1A3D63' },
  { title: 'Total Floors', value: 14, icon: Layers, accent: '#1A3D63' },
  { title: 'Total Rooms', value: 72, icon: DoorOpen, accent: '#4A7FA7' },
  { title: 'Total Beds', value: 216, icon: BedDouble, accent: '#4A7FA7' },
  { title: 'Occupied Beds', value: 172, icon: Users, accent: '#1A3D63', trend: { value: 4.2, label: 'vs last month' } },
  { title: 'Vacant Beds', value: 32, icon: BedDouble, accent: '#4A7FA7' },
  { title: 'Reserved Beds', value: 12, icon: Clock, accent: '#6B7FA3' },
  { title: "Today's Check-ins", value: 3, icon: ArrowDownCircle, accent: '#1A3D63' },
  { title: "Today's Check-outs", value: 1, icon: ArrowUpCircle, accent: '#4A7FA7' },
  { title: 'Monthly Revenue', value: '₹1,58,000', icon: IndianRupee, accent: '#1A3D63', trend: { value: 2.8, label: 'vs last month' } },
  { title: 'Pending Rent', value: '₹17,500', icon: Clock, accent: '#D97706' },
  { title: 'Monthly Expenses', value: '₹74,000', icon: TrendingUp, accent: '#4A7FA7' },
]

const quickActions = [
  { label: 'Add Building', href: '/owner/buildings', icon: Building2 },
  { label: 'Add Room', href: '/owner/rooms', icon: DoorOpen },
  { label: 'Add Bed', href: '/owner/beds', icon: BedDouble },
  { label: 'Register Resident', href: '/owner/residents/checkin', icon: Users },
  { label: 'Generate Receipt', href: '/owner/payments/receipts', icon: FileText },
]

export default function OwnerDashboard() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0A1931', margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '4px 0 0' }}>Welcome back, Ravi. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Verification Status Cards */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#0A1931', margin: 0 }}>Verification Status</p>
            <p style={{ fontSize: 12, color: '#6B7FA3', margin: '2px 0 0' }}>Complete verification to enable bookings and payouts</p>
          </div>
          <Link href="/owner/verification" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#EDF4FB', border: '1.5px solid #D9E3EC', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#1A3D63', cursor: 'pointer' }}>
              <Shield size={13} /> View Verification Centre
            </button>
          </Link>
        </div>

        {/* Overall Progress Banner */}
        <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', borderRadius: 16, padding: '16px 22px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Overall Verification Progress</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#FBBF24' }}>Pending Review</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #FBBF24, #F59E0B)', borderRadius: 3, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <span style={{ fontSize: 11, color: 'rgba(179,207,229,0.7)' }}>Documents: 5/5 uploaded</span>
              <span style={{ fontSize: 11, color: 'rgba(179,207,229,0.7)' }}>Under review by team</span>
              <span style={{ fontSize: 11, color: 'rgba(179,207,229,0.7)' }}>Est. 24–48 hrs</span>
            </div>
          </div>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#FBBF24' }}>60%</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            {
              icon: Building2, title: 'Business Verification',
              status: 'under_review', statusLabel: 'Under Review', statusColor: '#D97706', statusBg: '#FFFBEB', statusBorder: '#FDE68A',
              docs: ['Business Registration', 'Property Deed'], docsCount: 2, docsTotal: 2,
              lastUpdated: '9 Jul 2025, 14:32', description: 'Business details & property registration check',
            },
            {
              icon: User, title: 'Owner Verification',
              status: 'under_review', statusLabel: 'Under Review', statusColor: '#1D4ED8', statusBg: '#EFF6FF', statusBorder: '#BFDBFE',
              docs: ['Aadhaar', 'PAN Card', 'Owner Photo'], docsCount: 3, docsTotal: 3,
              lastUpdated: '9 Jul 2025, 14:32', description: 'Identity & background verification',
            },
            {
              icon: Shield, title: 'PG Verification',
              status: 'pending', statusLabel: 'Pending', statusColor: '#6B7FA3', statusBg: '#F6FAFD', statusBorder: '#E8EEF5',
              docs: ['Property Deed', 'Bank Account'], docsCount: 1, docsTotal: 2,
              lastUpdated: '9 Jul 2025, 14:32', description: 'PG property & legitimacy check',
            },
          ].map((item, i) => (
            <Link key={i} href="/owner/verification" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#fff', border: '1.5px solid #E8EEF5', borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 8px rgba(10,25,49,0.06)',
                  cursor: 'pointer', transition: 'all 0.2s', height: '100%', boxSizing: 'border-box',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 28px rgba(10,25,49,0.14)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 8px rgba(10,25,49,0.06)'; el.style.transform = 'translateY(0)' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg, #EDF4FB, #D9E3EC)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={22} color="#0A1931" strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#0A1931', margin: '0 0 3px' }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0, lineHeight: 1.4 }}>{item.description}</p>
                  </div>
                </div>

                {/* Status badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: item.statusBg, border: `1px solid ${item.statusBorder}`, marginBottom: 14 }}>
                  {item.status === 'under_review' && (
                    <span style={{ width: 10, height: 10, border: `1.5px solid ${item.statusColor}40`, borderTopColor: item.statusColor, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  )}
                  {item.status === 'approved' && <CheckCircle size={11} color={item.statusColor} />}
                  {item.status === 'pending' && <Clock size={10} color={item.statusColor} />}
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  <span style={{ fontSize: 11, fontWeight: 700, color: item.statusColor }}>{item.statusLabel}</span>
                </div>

                {/* Documents progress */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#6B7FA3' }}>Documents</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0A1931' }}>{item.docsCount}/{item.docsTotal}</span>
                  </div>
                  <div style={{ height: 5, background: '#EDF4FB', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(item.docsCount / item.docsTotal) * 100}%`, background: item.docsCount === item.docsTotal ? 'linear-gradient(90deg, #22C55E, #16A34A)' : 'linear-gradient(90deg, #4A7FA7, #0A1931)', borderRadius: 3 }} />
                  </div>
                </div>

                {/* Doc tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {item.docs.map(doc => (
                    <span key={doc} style={{ fontSize: 10, background: '#F0F4F9', color: '#4A7FA7', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>✓ {doc}</span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F0F4F9' }}>
                  <span style={{ fontSize: 10, color: '#B3CFE5' }}>Updated {item.lastUpdated}</span>
                  <span style={{ fontSize: 11, color: '#4A7FA7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    View Details <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} accent={s.accent} trend={(s as any).trend} />
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <RevenueChart />
        <OccupancyChart />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <ExpenseChart />

        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E8EEF5', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 16px' }}>Quick Actions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map(a => (
              <Link key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 10,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  <div style={{ background: '#EDF4FB', borderRadius: 8, padding: 8 }}>
                    <a.icon size={16} color="#1A3D63" strokeWidth={1.5} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0A1931' }}>{a.label}</span>
                  <Plus size={14} color="#6B7FA3" style={{ marginLeft: 'auto' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
