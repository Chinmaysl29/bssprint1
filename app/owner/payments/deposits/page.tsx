'use client'
import { useState } from 'react'
import Link from 'next/link'
import { IndianRupee, ArrowUpCircle } from 'lucide-react'
import { residents } from '../../data/dummy'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import SearchBar from '../../components/SearchBar'
import StatusBadge from '../../components/StatusBadge'

const tabs = [
  { label: 'Rent Collection', href: '/owner/payments' },
  { label: 'Deposits', href: '/owner/payments/deposits' },
  { label: 'Receipts', href: '/owner/payments/receipts' },
  { label: 'Expenses', href: '/owner/payments/expenses' },
]

export default function DepositsPage() {
  const [search, setSearch] = useState('')
  const filtered = residents.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  const totalDeposits = residents.reduce((a, r) => a + r.deposit, 0)

  return (
    <div>
      <PageHeader title="Financial Management" subtitle="Security deposits overview" />

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
        {tabs.map(t => (
          <Link key={t.href} href={t.href} style={{
            textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: t.href === '/owner/payments/deposits' ? '#1A3D63' : 'transparent',
            color: t.href === '/owner/payments/deposits' ? '#fff' : '#6B7FA3',
          }}>{t.label}</Link>
        ))}
      </div>

      {/* Summary */}
      <div style={{ background: '#0A1931', borderRadius: 14, padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 12, color: '#B3CFE5', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Deposits Held</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: '#fff', margin: 0 }}>₹{totalDeposits.toLocaleString()}</p>
        </div>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IndianRupee size={24} color="#B3CFE5" strokeWidth={1.5} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <SearchBar placeholder="Search residents..." value={search} onChange={setSearch} />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F6FAFD' }}>
              {['Resident', 'Room', 'Deposit Amount', 'Move-in', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E8EEF5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #F6FAFD', background: i % 2 === 0 ? '#fff' : '#FAFCFE' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 11, fontWeight: 700 }}>{r.avatar}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{r.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6B7FA3' }}>Room {r.room}</td>
                <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 700, color: '#0A1931' }}>₹{r.deposit.toLocaleString()}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#6B7FA3' }}>{r.moveIn}</td>
                <td style={{ padding: '14px 20px' }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  {r.status === 'inactive'
                    ? <Button size="sm" variant="danger" icon={ArrowUpCircle}>Refund</Button>
                    : <span style={{ fontSize: 12, color: '#9CA3AF' }}>Active</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
