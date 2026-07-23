'use client'
import { useState } from 'react'
import { BedDouble, User, Plus } from 'lucide-react'
import { beds, rooms } from '../data/dummy'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import Drawer from '../components/Drawer'
import StatusBadge from '../components/StatusBadge'

type Bed = typeof beds[0]

const bedColors = {
  available:   { bg: '#EFF6FF', border: '#BFDBFE', dot: '#3B82F6', text: '#1D4ED8' },
  occupied:    { bg: '#FEF2F2', border: '#FECACA', dot: '#EF4444', text: '#991B1B' },
  reserved:    { bg: '#FFFBEB', border: '#FDE68A', dot: '#F59E0B', text: '#92400E' },
  maintenance: { bg: '#F5F3FF', border: '#DDD6FE', dot: '#8B5CF6', text: '#5B21B6' },
}

function BedTicket({ bed, onClick }: { bed: Bed; onClick: () => void }) {
  const cfg = bedColors[bed.status as keyof typeof bedColors] ?? bedColors.available
  return (
    <button onClick={onClick} style={{
      width: '100%', background: cfg.bg, border: `1.5px solid ${cfg.border}`,
      borderRadius: 12, padding: '12px', cursor: 'pointer', textAlign: 'left',
      transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ticket notch */}
      <div style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#F6FAFD', border: `1.5px solid ${cfg.border}` }} />
      <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, borderRadius: '50%', background: '#F6FAFD', border: `1.5px solid ${cfg.border}` }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <BedDouble size={14} color={cfg.dot} strokeWidth={1.5} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: cfg.text }}>{bed.label}</span>
      </div>

      <div style={{ borderTop: `1px dashed ${cfg.border}`, paddingTop: 8 }}>
        {bed.resident ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={10} color="#fff" />
            </div>
            <span style={{ fontSize: 11, color: cfg.text, fontWeight: 500 }}>{bed.resident}</span>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: cfg.text, opacity: 0.7 }}>{bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}</span>
        )}
      </div>
    </button>
  )
}

export default function BedsPage() {
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)

  // Group beds by room
  const grouped = rooms.map(room => ({
    room,
    beds: beds.filter(b => b.roomId === room.id),
  })).filter(g => g.beds.length > 0)

  const counts = {
    available:   beds.filter(b => b.status === 'available').length,
    occupied:    beds.filter(b => b.status === 'occupied').length,
    reserved:    beds.filter(b => b.status === 'reserved').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  }

  return (
    <div>
      <PageHeader
        title="Bed Management"
        subtitle={`${beds.length} beds across all rooms`}
        actions={<Button icon={Plus}>Add Bed</Button>}
      />

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([status, count]) => {
          const cfg = bedColors[status as keyof typeof bedColors]
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 10, padding: '8px 14px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.dot }} />
              <span style={{ fontSize: 12, color: '#0A1931', fontWeight: 500 }}>{count} {status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          )
        })}
      </div>

      {/* Rooms grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {grouped.map(({ room, beds: roomBeds }) => (
          <div key={room.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E8EEF5', background: '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1931' }}>Room {room.number}</span>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>·</span>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>{room.building}</span>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>·</span>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>{room.floor}</span>
              </div>
              <StatusBadge status={room.status} />
            </div>
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {roomBeds.map(bed => (
                <BedTicket key={bed.id} bed={bed} onClick={() => setSelectedBed(bed)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bed Detail Drawer */}
      <Drawer open={!!selectedBed} onClose={() => setSelectedBed(null)} title="Bed Details">
        {selectedBed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#F6FAFD', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BedDouble size={26} color="#1A3D63" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#0A1931', margin: 0 }}>{selectedBed.label}</p>
                <p style={{ fontSize: 13, color: '#6B7FA3', margin: '4px 0 0' }}>Room {selectedBed.room} · {selectedBed.building}</p>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7FA3', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</p>
              <StatusBadge status={selectedBed.status} />
            </div>

            {selectedBed.resident && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7FA3', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Resident</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F6FAFD', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                    {selectedBed.resident.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0A1931', margin: 0 }}>{selectedBed.resident}</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <Button variant="secondary">Change Status</Button>
              {!selectedBed.resident && <Button>Assign Resident</Button>}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
