'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Layers } from 'lucide-react'
import { floors } from '../data/dummy'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'

export default function FloorsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(false)
  const perPage = 8

  const filtered = floors.filter(f =>
    f.number.toLowerCase().includes(search.toLowerCase()) ||
    f.building.toLowerCase().includes(search.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div>
      <PageHeader
        title="Floors"
        subtitle={`${floors.length} floors across all buildings`}
        actions={<Button icon={Plus} onClick={() => setModal(true)}>Add Floor</Button>}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <SearchBar placeholder="Search floors..." value={search} onChange={setSearch} />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F6FAFD' }}>
              {['Floor', 'Building', 'Rooms', 'Beds', 'Occupancy', 'Actions'].map(h => (
                <th key={h} style={{ padding: '13px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E8EEF5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((f, i) => (
              <tr key={f.id} style={{ borderBottom: '1px solid #F6FAFD', background: i % 2 === 0 ? '#fff' : '#FAFCFE' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Layers size={15} color="#1A3D63" strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{f.number}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#1A3D63' }}>{f.building}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#0A1931', fontWeight: 500 }}>{f.rooms}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#0A1931', fontWeight: 500 }}>{f.beds}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden', minWidth: 80 }}>
                      <div style={{ height: '100%', width: `${f.occupancy}%`, background: '#1A3D63', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', minWidth: 36 }}>{f.occupancy}%</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: '6px 8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
                      <Pencil size={13} color="#1A3D63" />
                    </button>
                    <button style={{ padding: '6px 8px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
                      <Trash2 size={13} color="#DC2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} total={filtered.length} perPage={perPage} onChange={setPage} />
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Floor">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Building</label>
            <select style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
              <option>Sunrise PG</option><option>Green Valley PG</option><option>Blue Ridge PG</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Floor Name</label>
            <input placeholder="e.g. Ground Floor" style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={() => setModal(false)}>Save Floor</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
