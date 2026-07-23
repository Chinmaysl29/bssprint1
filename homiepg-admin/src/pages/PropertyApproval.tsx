import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Ban, MapPin, BedDouble, Building2, Wifi, UtensilsCrossed, Car, Dumbbell } from 'lucide-react'
import { properties as initialProps } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import SearchInput from '../components/ui/SearchInput'

type Prop = typeof initialProps[0]

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi size={12} />, Food: <UtensilsCrossed size={12} />, Parking: <Car size={12} />, Gym: <Dumbbell size={12} />,
}

function PropertyDetailModal({ prop, onClose, onAction }: { prop: Prop; onClose: () => void; onAction: (id: string, action: string, reason?: string) => void }) {
  const [reason, setReason] = useState('')
  return (
    <Modal open onClose={onClose} title={`Property Review — ${prop.name}`} width={660}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Hero */}
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 180 }}>
          <img src={prop.image} alt={prop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,49,0.5), transparent)' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>{prop.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <MapPin size={11} color="#B3CFE5" />
              <span style={{ color: '#B3CFE5', fontSize: 11 }}>{prop.address}</span>
            </div>
          </div>
          <div style={{ position: 'absolute', top: 12, right: 12 }}><Badge status={prop.status} /></div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[['Owner', prop.owner], ['Buildings', prop.buildings], ['Rooms', prop.rooms], ['Beds', prop.beds], ['Rent', `₹${prop.rent.toLocaleString()}/mo`], ['Gender', prop.gender], ['City', prop.city], ['Submitted', prop.submittedDate]].map(([k, v]) => (
            <div key={k} style={{ background: '#F6FAFD', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#6B7FA3', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amenities</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {prop.amenities.map(a => (
              <span key={a} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#EDF4FB', color: '#1A3D63', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20 }}>
                {amenityIcons[a]} {a}
              </span>
            ))}
          </div>
        </div>

        {/* Reason */}
        {(prop.status === 'pending' || prop.status === 'approved') && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rejection Reason (required if rejecting)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 8, fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #E8EEF5' }}>
          {prop.status === 'pending' && <>
            <Button variant="danger" icon={XCircle} onClick={() => { if (!reason) return alert('Reason required'); onAction(prop.id, 'rejected', reason); onClose() }}>Reject</Button>
            <Button variant="success" icon={CheckCircle} onClick={() => { onAction(prop.id, 'approved'); onClose() }}>Approve</Button>
          </>}
          {prop.status === 'approved' && <Button variant="success" icon={CheckCircle} onClick={() => { onAction(prop.id, 'live'); onClose() }}>Mark as Live</Button>}
          {prop.status === 'live' && <Button variant="danger" icon={Ban} onClick={() => { onAction(prop.id, 'suspended'); onClose() }}>Suspend</Button>}
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function PropertyApprovalPage() {
  const [props, setProps] = useState(initialProps)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [detailProp, setDetailProp] = useState<Prop | null>(null)

  const handleAction = (id: string, action: string) => {
    setProps(p => p.map(x => x.id === id ? { ...x, status: action, approvedDate: action === 'approved' ? new Date().toISOString().split('T')[0] : x.approvedDate } : x))
  }

  const filtered = props.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    const mf = statusFilter === 'all' || p.status === statusFilter
    return ms && mf
  })

  return (
    <div>
      <PageHeader title="Property Approvals" subtitle="Review and approve PG listings" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {['pending', 'approved', 'live', 'rejected', 'suspended'].map(s => (
          <div key={s} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #E8EEF5', textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#0A1931', margin: '0 0 4px' }}>{props.filter(p => p.status === s).length}</p>
            <Badge status={s} size="xs" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search properties..." />
        <div style={{ display: 'flex', gap: 4, background: '#fff', padding: 3, borderRadius: 8, border: '1px solid #E8EEF5' }}>
          {['all', 'pending', 'approved', 'live', 'rejected', 'suspended'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none', background: statusFilter === s ? '#0A1931' : 'transparent', color: statusFilter === s ? '#fff' : '#6B7FA3' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
            <div style={{ position: 'relative', height: 140 }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,49,0.4), transparent)' }} />
              <div style={{ position: 'absolute', top: 10, right: 10 }}><Badge status={p.status} size="xs" /></div>
              <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, margin: 0 }}>{p.name}</p>
              </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: 11, color: '#6B7FA3', margin: '0 0 8px' }}>{p.owner} · {p.city}</p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: '#4A7FA7' }}><BedDouble size={11} style={{ display: 'inline', verticalAlign: 'text-top' }} /> {p.beds} beds</span>
                <span style={{ fontSize: 11, color: '#4A7FA7' }}><Building2 size={11} style={{ display: 'inline', verticalAlign: 'text-top' }} /> {p.buildings} buildings</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#0A1931' }}>₹{p.rent.toLocaleString()}/mo</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setDetailProp(p)} style={{ flex: 1, padding: '7px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Eye size={12} /> Review
                </button>
                {p.status === 'pending' && (
                  <button onClick={() => handleAction(p.id, 'approved')} style={{ flex: 1, padding: '7px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <CheckCircle size={12} /> Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {detailProp && <PropertyDetailModal prop={detailProp} onClose={() => setDetailProp(null)} onAction={handleAction} />}
    </div>
  )
}
