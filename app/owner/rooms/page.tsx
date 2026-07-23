'use client'
import { useState } from 'react'
import { Plus, Eye, Pencil, Trash2, DoorOpen } from 'lucide-react'
import { rooms } from '../data/dummy'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import StatusBadge from '../components/StatusBadge'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'

const typeColors: Record<string, string> = {
  Single: '#EFF6FF', Double: '#F0FDF4', Triple: '#FFFBEB', Dormitory: '#F5F3FF'
}

export default function RoomsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const perPage = 8

  const filtered = rooms.filter(r => {
    const matchSearch = r.number.includes(search) || r.building.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || r.status === filter
    return matchSearch && matchFilter
  })
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle={`${rooms.length} rooms across all buildings`}
        actions={<Button icon={Plus} onClick={() => setModal(true)}>Add Room</Button>}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar placeholder="Search rooms..." value={search} onChange={setSearch} />
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'available', 'occupied', 'maintenance'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid',
              borderColor: filter === f ? '#1A3D63' : '#D9E3EC',
              background: filter === f ? '#1A3D63' : '#fff',
              color: filter === f ? '#fff' : '#6B7FA3',
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {paginated.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 20, boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DoorOpen size={18} color="#1A3D63" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: 0 }}>Room {r.number}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{r.floor}</p>
                </div>
              </div>
              <StatusBadge status={r.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div style={{ background: '#F6FAFD', borderRadius: 8, padding: '8px 10px' }}>
                <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0 }}>Building</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: '2px 0 0' }}>{r.building}</p>
              </div>
              <div style={{ background: typeColors[r.type] || '#F6FAFD', borderRadius: 8, padding: '8px 10px' }}>
                <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0 }}>Type</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: '2px 0 0' }}>{r.type}</p>
              </div>
              <div style={{ background: '#F6FAFD', borderRadius: 8, padding: '8px 10px' }}>
                <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0 }}>Occupied</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A3D63', margin: '2px 0 0' }}>{r.occupied}/{r.capacity}</p>
              </div>
              <div style={{ background: '#F6FAFD', borderRadius: 8, padding: '8px 10px' }}>
                <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0 }}>Vacant</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#4A7FA7', margin: '2px 0 0' }}>{r.vacant}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#1A3D63', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Eye size={12} /> View
              </button>
              <button style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#1A3D63', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <Pencil size={12} /> Edit
              </button>
              <button style={{ padding: '8px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', display: 'flex' }}>
                <Trash2 size={13} color="#DC2626" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > perPage && (
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5' }}>
          <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} />
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Room">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ l: 'Room Number', p: '101' }, { l: 'Floor', p: 'Ground Floor' }].map(f => (
              <div key={f.l}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>{f.l}</label>
                <input placeholder={f.p} style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Building</label>
            <select style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
              <option>Sunrise PG</option><option>Green Valley PG</option><option>Blue Ridge PG</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Room Type</label>
            <select style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
              <option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={() => setModal(false)}>Save Room</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
