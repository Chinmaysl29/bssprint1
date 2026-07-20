'use client'
import { useState } from 'react'
import { Plus, Eye, Pencil, Trash2, Phone, Mail, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { residents } from '../data/dummy'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'

export default function ResidentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 8

  const filtered = residents.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) || r.room.includes(search)
    const matchFilter = filter === 'all' || r.status === filter
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <PageHeader
        title="Residents"
        subtitle={`${residents.length} residents registered`}
        actions={
          <Link href="/owner/residents/checkin" style={{ textDecoration: 'none' }}>
            <Button icon={Plus}>Check-In Resident</Button>
          </Link>
        }
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar placeholder="Search residents..." value={search} onChange={setSearch} />
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'active', 'inactive'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
              borderColor: filter === f ? '#1A3D63' : '#D9E3EC',
              background: filter === f ? '#1A3D63' : '#fff',
              color: filter === f ? '#fff' : '#6B7FA3',
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F6FAFD' }}>
              {['Resident', 'Contact', 'Room / Bed', 'Move-in', 'Rent', 'KYC', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E8EEF5', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #F6FAFD', background: i % 2 === 0 ? '#fff' : '#FAFCFE' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.avatar}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', margin: 0 }}>{r.name}</p>
                      <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{r.building}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4A7FA7' }}><Phone size={11} /> {r.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B7FA3' }}><Mail size={11} /> {r.email}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#0A1931', margin: 0 }}>Room {r.room}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{r.bed}</p>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 12, color: '#6B7FA3' }}>{r.moveIn}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#0A1931' }}>₹{r.rent.toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <UserCheck size={13} color={r.kyc === 'approved' ? '#2563EB' : r.kyc === 'rejected' ? '#DC2626' : '#D97706'} />
                    <StatusBadge status={r.kyc} />
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}><StatusBadge status={r.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '6px 8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
                      <Eye size={13} color="#1A3D63" />
                    </button>
                    <button style={{ padding: '6px 8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
                      <Pencil size={13} color="#1A3D63" />
                    </button>
                    <Link href="/owner/residents/checkout" style={{ padding: '6px 8px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 7, cursor: 'pointer', display: 'flex', textDecoration: 'none' }}>
                      <span style={{ fontSize: 11, color: '#92400E', fontWeight: 600 }}>Out</span>
                    </Link>
                  </div>
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
