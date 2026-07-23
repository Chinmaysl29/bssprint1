'use client'
import { useState } from 'react'
import { Building2, MapPin, Layers, DoorOpen, BedDouble, Users, MoreHorizontal, Plus, Upload, Eye, Pencil, Trash2 } from 'lucide-react'
import { buildings } from '../data/dummy'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { LocationPicker, type LocationData } from '@/components/maps/LocationPicker'
import { createRecord } from '@/lib/dataStore'

type Building = typeof buildings[0]

function BuildingCard({ b, onView, onEdit, onDelete }: { b: Building; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const occupancyPct = Math.round((b.occupied / b.beds) * 100)
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.06)', transition: 'box-shadow 0.2s' }}>
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,49,0.5), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>{b.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <MapPin size={11} color="#B3CFE5" />
            <span style={{ color: '#B3CFE5', fontSize: 11 }}>{b.address}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
          {[
            { label: 'Floors', value: b.floors, icon: Layers },
            { label: 'Rooms', value: b.rooms, icon: DoorOpen },
            { label: 'Beds', value: b.beds, icon: BedDouble },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: '#F6FAFD', borderRadius: 10, padding: '8px 4px' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0A1931', margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Occupancy bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#6B7FA3' }}>Occupancy</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#0A1931' }}>{occupancyPct}%</span>
          </div>
          <div style={{ height: 6, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${occupancyPct}%`, background: '#1A3D63', borderRadius: 4, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <span style={{ fontSize: 10, color: '#2563EB' }}>● {b.occupied} Occupied</span>
            <span style={{ fontSize: 10, color: '#6B7FA3' }}>● {b.vacant} Vacant</span>
            <span style={{ fontSize: 10, color: '#D97706' }}>● {b.reserved} Reserved</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onView} style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: '#1A3D63', fontWeight: 500 }}>
            <Eye size={13} /> View
          </button>
          <button onClick={onEdit} style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: '#1A3D63', fontWeight: 500 }}>
            <Pencil size={13} /> Edit
          </button>
          <button onClick={onDelete} style={{ padding: '8px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={13} color="#DC2626" />
          </button>
        </div>
      </div>
    </div>
  )
}

function BuildingForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [floors, setFloors] = useState('')
  const [rooms, setRooms] = useState('')
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!location) { setLocationError('Please pick a location on the map.'); return }
    if (!name.trim()) return
    setLocationError('')
    setSaving(true)
    // TODO: replace hard-coded owner_id with real session user id
    await createRecord('pg_properties', {
      name,
      location: location.formattedAddress,
      latitude: location.lat,
      longitude: location.lng,
      formatted_address: location.formattedAddress,
      city: location.city,
      state: location.state,
      pincode: location.pincode,
      place_id: location.placeId,
      floors: floors ? Number(floors) : null,
      rooms: rooms ? Number(rooms) : null,
      status: 'pending',
    })
    setSaving(false)
    onClose()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Building Name */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Building Name</label>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. Sunrise PG"
          style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Location picker — replaces plain Address + City inputs */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>
          Location <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <LocationPicker
          value={location}
          onChange={(d) => { setLocation(d); if (d) setLocationError('') }}
          error={locationError}
        />
      </div>

      {/* Derived read-only fields (populated after map selection) */}
      {location && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'City', value: location.city },
            { label: 'State', value: location.state },
            { label: 'Pincode', value: location.pincode },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#6B7FA3', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input readOnly value={f.value}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #E8EEF5', borderRadius: 8, fontSize: 12, background: '#F6FAFD', color: '#0A1931', boxSizing: 'border-box', outline: 'none', cursor: 'default' }} />
            </div>
          ))}
        </div>
      )}

      {/* Floors / Rooms */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Total Floors', placeholder: '4', value: floors, set: setFloors },
          { label: 'Total Rooms', placeholder: '24', value: rooms, set: setRooms },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input type="number" placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !name.trim() || !location}>
          {saving ? 'Saving…' : 'Save Building'}
        </Button>
      </div>
    </div>
  )
}

export default function BuildingsPage() {
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [selected, setSelected] = useState<Building | null>(null)

  const filtered = buildings.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Buildings"
        subtitle={`${buildings.length} buildings registered`}
        actions={
          <>
            <Button variant="secondary" icon={Upload} size="sm">Import</Button>
            <Button icon={Plus} onClick={() => setModal('add')}>Add Building</Button>
          </>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <SearchBar placeholder="Search buildings..." value={search} onChange={setSearch} />
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {filtered.map(b => (
          <BuildingCard
            key={b.id} b={b}
            onView={() => { setSelected(b) }}
            onEdit={() => { setSelected(b); setModal('edit') }}
            onDelete={() => {}}
          />
        ))}
      </div>

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Add New Building">
        <BuildingForm onClose={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'edit'} onClose={() => setModal(null)} title="Edit Building">
        <BuildingForm onClose={() => setModal(null)} />
      </Modal>
    </div>
  )
}
