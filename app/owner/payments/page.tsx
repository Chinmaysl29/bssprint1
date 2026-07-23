'use client'
import { useState } from 'react'
import Link from 'next/link'
import { IndianRupee, FileText, Wallet, Receipt, Zap, Users } from 'lucide-react'
import { payments } from '../data/dummy'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'

const tabs = [
  { label: 'Rent Collection', href: '/owner/payments' },
  { label: 'Deposits', href: '/owner/payments/deposits' },
  { label: 'Receipts', href: '/owner/payments/receipts' },
  { label: 'Expenses', href: '/owner/payments/expenses' },
]

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 6

  const filtered = payments.filter(p => {
    const matchSearch = p.resident.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.status === filter
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const collected = payments.filter(p => p.status === 'paid').reduce((a, p) => a + p.rent, 0)
  const pending = payments.filter(p => p.status === 'pending').reduce((a, p) => a + p.rent, 0)
  const overdue = payments.filter(p => p.status === 'overdue').reduce((a, p) => a + p.rent, 0)

  return (
    <div>
      <PageHeader title="Financial Management" subtitle="Track rent, payments and expenses" />

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
        {tabs.map(t => (
          <Link key={t.href} href={t.href} style={{
            textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: t.href === '/owner/payments' ? '#1A3D63' : 'transparent',
            color: t.href === '/owner/payments' ? '#fff' : '#6B7FA3',
          }}>{t.label}</Link>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard title="Collected" value={`₹${collected.toLocaleString()}`} icon={IndianRupee} accent="#1A3D63" />
        <StatCard title="Pending" value={`₹${pending.toLocaleString()}`} icon={Wallet} accent="#D97706" />
        <StatCard title="Overdue" value={`₹${overdue.toLocaleString()}`} icon={Zap} accent="#DC2626" />
        <StatCard title="Total Residents" value={payments.length} icon={Users} accent="#4A7FA7" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar placeholder="Search residents..." value={search} onChange={setSearch} />
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'paid', 'pending', 'overdue'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
              borderColor: filter === f ? '#1A3D63' : '#D9E3EC',
              background: filter === f ? '#1A3D63' : '#fff',
              color: filter === f ? '#fff' : '#6B7FA3',
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F6FAFD' }}>
              {['Resident', 'Room', 'Rent', 'Due Date', 'Status', 'Receipt', 'Action'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E8EEF5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #F6FAFD', background: i % 2 === 0 ? '#fff' : '#FAFCFE' }}>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{p.resident}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7FA3' }}>Room {p.room}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 700, color: '#0A1931' }}>₹{p.rent.toLocaleString()}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#6B7FA3' }}>{p.dueDate}</td>
                <td style={{ padding: '14px 20px' }}><StatusBadge status={p.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  {p.receipt
                    ? <span style={{ fontSize: 12, color: '#1A3D63', fontWeight: 600 }}>{p.receipt}</span>
                    : <span style={{ fontSize: 12, color: '#9CA3AF' }}>—</span>
                  }
                </td>
                <td style={{ padding: '14px 20px' }}>
                  {p.status !== 'paid'
                    ? <Button size="sm" icon={IndianRupee}>Collect</Button>
                    : <Button size="sm" variant="secondary" icon={FileText}>Receipt</Button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} />
      </div>
    </div>
  )
}
