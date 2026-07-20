'use client'
import { useState } from 'react'
import { Download, Eye, RotateCcw, CalendarCheck, Search } from 'lucide-react'
import Link from 'next/link'
import { bookings } from '../data/dummy'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import Pagination from '../components/Pagination'

export default function BookingsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 5

  const filtered = bookings.filter(b => {
    const ms = b.pg.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'all' || b.status === filter
    return ms && mf
  })
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>My Bookings</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>Track all your booking history</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active', count: bookings.filter(b => b.status === 'active').length, color: '#1D4ED8', bg: '#EFF6FF' },
          { label: 'Pending', count: bookings.filter(b => b.status === 'pending').length, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Completed', count: bookings.filter(b => b.status === 'completed').length, color: '#475569', bg: '#F1F5F9' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: s.color, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#0A1931', margin: 0 }}>{s.count}</p>
            </div>
            <CalendarCheck size={28} color={s.color} strokeWidth={1.5} style={{ opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #D9E3EC', borderRadius: 10, padding: '8px 14px', minWidth: 220 }}>
          <Search size={14} color="#6B7FA3" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..."
            style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0A1931', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'active', 'pending', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
              borderColor: filter === f ? '#0A1931' : '#D9E3EC', background: filter === f ? '#0A1931' : '#fff',
              color: filter === f ? '#fff' : '#6B7FA3',
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F6FAFD' }}>
              {['Booking ID', 'PG & Room', 'Bed', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E8EEF5', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((b, i) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #F6FAFD', background: i % 2 === 0 ? '#fff' : '#FAFCFE' }}>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', background: '#F6FAFD', padding: '3px 8px', borderRadius: 6, fontFamily: 'monospace' }}>{b.id}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{b.pg}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{b.room}</p>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#4A7FA7', fontWeight: 500 }}>{b.bed}</td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#6B7FA3' }}>{b.date}</td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>₹{b.amount.toLocaleString()}</p>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>+₹{b.deposit.toLocaleString()} dep.</p>
                </td>
                <td style={{ padding: '14px 20px' }}><StatusBadge status={b.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '6px 8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}><Eye size={13} color="#1A3D63" /></button>
                    {b.receipt && <button style={{ padding: '6px 8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}><Download size={13} color="#1A3D63" /></button>}
                    {b.status === 'completed' && (
                      <Link href={`/customer/booking?pgId=1`} style={{ padding: '6px 8px', background: '#EDF4FB', border: '1px solid #B3CFE5', borderRadius: 7, cursor: 'pointer', display: 'flex', textDecoration: 'none' }}>
                        <RotateCcw size={13} color="#1A3D63" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '0 20px' }}>
          <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
