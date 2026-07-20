import { useState } from 'react'
import { Eye, Ban, Trash2, Building2, BedDouble, IndianRupee } from 'lucide-react'
import { owners, properties } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import SearchInput from '../components/ui/SearchInput'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'
import { Table, Th, Td, Tr } from '../components/ui/Table'

type Owner = typeof owners[0]

function OwnerDetailModal({ owner, onClose }: { owner: Owner; onClose: () => void }) {
  const ownerProps = properties.filter(p => p.ownerId === owner.id)
  return (
    <Modal open onClose={onClose} title={`Owner Profile — ${owner.name}`} width={640}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 16, background: '#F6FAFD', borderRadius: 12, padding: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
            {owner.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: 0 }}>{owner.name}</p>
              <Badge status={owner.status} />
              <Badge status={owner.verification} />
            </div>
            <p style={{ fontSize: 12, color: '#6B7FA3', margin: 0 }}>{owner.email} · {owner.phone}</p>
            <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>Joined {owner.joinDate} · {owner.city}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {([
            { label: 'Properties', value: owner.properties, Icon: Building2 },
            { label: 'Total Beds', value: owner.beds, Icon: BedDouble },
            { label: 'Revenue', value: `₹${owner.revenue.toLocaleString()}`, Icon: IndianRupee },
          ] as const).map(s => (
            <div key={s.label} style={{ background: '#F6FAFD', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#0A1931', margin: '0 0 3px' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', margin: '0 0 10px' }}>Properties</p>
          {ownerProps.length === 0 ? (
            <p style={{ fontSize: 12, color: '#6B7FA3' }}>No properties yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ownerProps.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F6FAFD', borderRadius: 9, border: '1px solid #E8EEF5' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{p.address}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#6B7FA3' }}>{p.beds} beds</span>
                    <Badge status={p.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', borderTop: '1px solid #E8EEF5', paddingTop: 16 }}>
          <Button variant="danger" icon={Ban} onClick={onClose}>{owner.status === 'active' ? 'Suspend Owner' : 'Activate Owner'}</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function OwnersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verFilter, setVerFilter] = useState('all')
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)

  const filtered = owners.filter(o => {
    const ms = o.name.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase())
    const mst = statusFilter === 'all' || o.status === statusFilter
    const mv = verFilter === 'all' || o.verification === verFilter
    return ms && mst && mv
  })

  return (
    <div>
      <PageHeader title="PG Owner Management" subtitle={`${owners.length} registered owners`} />

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search owners..." />
        <FilterPills value={statusFilter} onChange={setStatusFilter} options={['all', 'active', 'suspended', 'pending']} />
        <FilterPills value={verFilter} onChange={setVerFilter} options={['all', 'verified', 'pending', 'rejected']} />
        <span style={{ fontSize: 11, color: '#6B7FA3', marginLeft: 'auto' }}>{filtered.length} results</span>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              {['Owner', 'Contact', 'City', 'Properties', 'Beds', 'Revenue', 'Status', 'Verification', 'Joined', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <Tr key={o.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                      {o.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{o.name}</p>
                  </div>
                </Td>
                <Td>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>{o.email}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{o.phone}</p>
                </Td>
                <Td><span style={{ fontSize: 11, color: '#4A7FA7', fontWeight: 500 }}>{o.city}</span></Td>
                <Td><span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{o.properties}</span></Td>
                <Td><span style={{ fontSize: 12, color: '#0A1931' }}>{o.beds}</span></Td>
                <Td><span style={{ fontSize: 12, fontWeight: 600, color: '#0A1931' }}>₹{o.revenue.toLocaleString()}</span></Td>
                <Td><Badge status={o.status} /></Td>
                <Td><Badge status={o.verification} /></Td>
                <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{o.joinDate}</span></Td>
                <Td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setSelectedOwner(o)} style={iconBtn}><Eye size={13} color="#1A3D63" /></button>
                    <button style={iconBtn}><Ban size={13} color="#D97706" /></button>
                    <button style={{ ...iconBtn, background: '#FEF2F2', borderColor: '#FECACA' }}><Trash2 size={13} color="#DC2626" /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {selectedOwner && <OwnerDetailModal owner={selectedOwner} onClose={() => setSelectedOwner(null)} />}
    </div>
  )
}

const iconBtn: React.CSSProperties = { padding: '5px 7px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 6, cursor: 'pointer', display: 'flex' }

function FilterPills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: '1px solid',
          borderColor: value === o ? '#0A1931' : '#D9E3EC', background: value === o ? '#0A1931' : '#fff',
          color: value === o ? '#fff' : '#6B7FA3', transition: 'all 0.15s',
        }}>{o.charAt(0).toUpperCase() + o.slice(1)}</button>
      ))}
    </div>
  )
}
