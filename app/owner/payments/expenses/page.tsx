'use client'
import { useState } from 'react'
import { Plus, Zap, Droplets, Wifi, Wrench, ChefHat, Sparkles, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { expenses, expenseCategoryData } from '../../data/dummy'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import ExpenseChart from '../../components/ExpenseChart'
import Modal from '../../components/Modal'

const catIcons: Record<string, any> = {
  Electricity: Zap, Water: Droplets, Internet: Wifi,
  Maintenance: Wrench, Food: ChefHat, Cleaning: Sparkles,
}
const catColors: Record<string, string> = {
  Electricity: '#FFFBEB', Water: '#EFF6FF', Internet: '#F5F3FF',
  Maintenance: '#FEF2F2', Food: '#F0FDF4', Cleaning: '#F0F9FF',
}

const tabs = [
  { label: 'Rent Collection', href: '/owner/payments' },
  { label: 'Deposits', href: '/owner/payments/deposits' },
  { label: 'Receipts', href: '/owner/payments/receipts' },
  { label: 'Expenses', href: '/owner/payments/expenses' },
]

export default function ExpensesPage() {
  const [modal, setModal] = useState(false)
  const total = expenses.reduce((a, e) => a + e.amount, 0)

  return (
    <div>
      <PageHeader title="Financial Management" subtitle="Manage expenses and bills"
        actions={<Button icon={Plus} onClick={() => setModal(true)}>Add Expense</Button>}
      />

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
        {tabs.map(t => (
          <Link key={t.href} href={t.href} style={{
            textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            background: t.href === '/owner/payments/expenses' ? '#1A3D63' : 'transparent',
            color: t.href === '/owner/payments/expenses' ? '#fff' : '#6B7FA3',
          }}>{t.label}</Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <ExpenseChart />

        {/* Summary */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 24, boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 16px' }}>Category Summary</p>
          {expenseCategoryData.map(e => (
            <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F6FAFD' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: catColors[e.name] || '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {catIcons[e.name] && (() => { const I = catIcons[e.name]; return <I size={14} color="#1A3D63" strokeWidth={1.5} /> })()}
                </div>
                <span style={{ fontSize: 13, color: '#0A1931' }}>{e.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>₹{e.value.toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>Total</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1A3D63' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Expense Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {expenses.map(e => {
          const Icon = catIcons[e.category] || MoreHorizontal
          return (
            <div key={e.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 20, boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: catColors[e.category] || '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color="#1A3D63" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{e.category}</p>
                    <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{e.date}</p>
                  </div>
                </div>
                <StatusBadge status={e.status} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0A1931', margin: '0 0 6px' }}>₹{e.amount.toLocaleString()}</p>
              <p style={{ fontSize: 12, color: '#6B7FA3', margin: 0 }}>{e.description}</p>
            </div>
          )
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Expense">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Category</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
              {Object.keys(catIcons).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Amount (₹)</label>
            <input type="number" placeholder="0" style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={() => setModal(false)}>Save Expense</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
