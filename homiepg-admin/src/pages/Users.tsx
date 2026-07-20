import { useState } from 'react'
import { Eye, Ban, Trash2 } from 'lucide-react'
import { owners, customers } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import SearchInput from '../components/ui/SearchInput'
import { Table, Th, Td, Tr } from '../components/ui/Table'
export default function UsersPage() {
  const [tab, setTab] = useState<'customers' | 'owners'>('customers')
  const [search, setSearch] = useState('')

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )
  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Platform Users" subtitle={`${customers.length} customers · ${owners.length} PG owners`} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 3, background: '#fff', padding: 3, borderRadius: 8, border: '1px solid #E8EEF5' }}>
          {(['customers', 'owners'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 18px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', background: tab === t ? '#0A1931' : 'transparent', color: tab === t ? '#fff' : '#6B7FA3' }}>
              {t === 'customers' ? `Customers (${customers.length})` : `PG Owners (${owners.length})`}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder={`Search ${tab}...`} />
      </div>

      {tab === 'customers' && (
        <Card>
          <Table>
            <thead>
              <tr>{['Customer', 'Contact', 'Join Date', 'Current PG', 'Bookings', 'KYC', 'Status', 'Actions'].map(h => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {filteredCustomers.map(c => (
                <Tr key={c.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 9, fontWeight: 700 }}>
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{c.name}</p>
                    </div>
                  </Td>
                  <Td><p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>{c.email}</p><p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{c.phone}</p></Td>
                  <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{c.joinDate}</span></Td>
                  <Td><span style={{ fontSize: 11, color: '#4A7FA7', fontWeight: 500 }}>{c.currentPg ?? '—'}</span></Td>
                  <Td><span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{c.bookings}</span></Td>
                  <Td><Badge status={c.kyc} size="xs" /></Td>
                  <Td><Badge status={c.status} size="xs" /></Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={iconBtn}><Eye size={12} color="#1A3D63" /></button>
                      <button style={iconBtn}><Ban size={12} color="#D97706" /></button>
                      <button style={{ ...iconBtn, background: '#FEF2F2', borderColor: '#FECACA' }}><Trash2 size={12} color="#DC2626" /></button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === 'owners' && (
        <Card>
          <Table>
            <thead>
              <tr>{['Owner', 'Contact', 'City', 'Join Date', 'Properties', 'Beds', 'Verification', 'Status', 'Actions'].map(h => <Th key={h}>{h}</Th>)}</tr>
            </thead>
            <tbody>
              {filteredOwners.map(o => (
                <Tr key={o.id}>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 9, fontWeight: 700 }}>
                        {o.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{o.name}</p>
                    </div>
                  </Td>
                  <Td><p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>{o.email}</p><p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{o.phone}</p></Td>
                  <Td><span style={{ fontSize: 11, color: '#4A7FA7' }}>{o.city}</span></Td>
                  <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{o.joinDate}</span></Td>
                  <Td><span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{o.properties}</span></Td>
                  <Td><span style={{ fontSize: 12, color: '#0A1931' }}>{o.beds}</span></Td>
                  <Td><Badge status={o.verification} size="xs" /></Td>
                  <Td><Badge status={o.status} size="xs" /></Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={iconBtn}><Eye size={12} color="#1A3D63" /></button>
                      <button style={iconBtn}><Ban size={12} color="#D97706" /></button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  )
}

const iconBtn: React.CSSProperties = { padding: '4px 6px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 6, cursor: 'pointer', display: 'flex' }
