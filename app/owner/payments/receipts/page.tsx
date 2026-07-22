'use client'
import { useState } from 'react'
import { FileText, Download, Printer, Search } from 'lucide-react'
import Link from 'next/link'
import { payments } from '../../data/dummy'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import SearchBar from '../../components/SearchBar'

const tabs = [
  { label: 'Rent Collection', href: '/owner/payments' },
  { label: 'Deposits', href: '/owner/payments/deposits' },
  { label: 'Receipts', href: '/owner/payments/receipts' },
  { label: 'Expenses', href: '/owner/payments/expenses' },
]

const paidPayments = payments.filter(p => p.receipt)

export default function ReceiptsPage() {
  const [search, setSearch] = useState('')
  const filtered = paidPayments.filter(p => p.resident.toLowerCase().includes(search.toLowerCase()) || (p.receipt || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader title="Financial Management" subtitle="Generate and manage receipts" />

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
        {tabs.map(t => (
          <Link key={t.href} href={t.href} style={{
            textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: t.href === '/owner/payments/receipts' ? '#1A3D63' : 'transparent',
            color: t.href === '/owner/payments/receipts' ? '#fff' : '#6B7FA3',
          }}>{t.label}</Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <SearchBar placeholder="Search receipts..." value={search} onChange={setSearch} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map(p => (
          <div key={p.id} style={{
            background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(10,25,49,0.06)', position: 'relative',
          }}>
            {/* Receipt header */}
            <div style={{ background: '#0A1931', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>HomiePG</p>
                <p style={{ color: '#B3CFE5', fontSize: 11, margin: '2px 0 0' }}>Payment Receipt</p>
              </div>
              <span style={{ color: '#B3CFE5', fontSize: 12, fontWeight: 600 }}>{p.receipt}</span>
            </div>

            {/* Perforated line */}
            <div style={{ height: 12, background: '#fff', borderTop: '2px dashed #E8EEF5', borderBottom: '2px dashed #E8EEF5', margin: '0' }} />

            <div style={{ padding: '16px 20px' }}>
              {[['Resident', p.resident], ['Room', `Room ${p.room}`], ['Amount', `₹${p.rent.toLocaleString()}`], ['Date', p.dueDate]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F6FAFD' }}>
                  <span style={{ fontSize: 12, color: '#6B7FA3' }}>{k}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1931' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px dashed #E8EEF5', display: 'flex', gap: 8 }}>
              <Button variant="secondary" size="sm" icon={Download}>Download</Button>
              <Button variant="ghost" size="sm" icon={Printer}>Print</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
