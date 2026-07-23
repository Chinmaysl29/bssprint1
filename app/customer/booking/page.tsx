'use client'
import { Suspense, useState } from 'react'
import { Check, ChevronRight, Building2, Layers, DoorOpen, BedDouble, CheckCircle, Info } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { pgListings, buildings, floors, rooms, beds } from '../data/dummy'
import Button from '../components/Button'
import Drawer from '../components/Drawer'
import { CategoryBadge, getAccommodationCategory } from '../components/AccommodationCategory'

const steps = ['Building', 'Floor', 'Room', 'Bed', 'Summary']
const stepIcons = [Building2, Layers, DoorOpen, BedDouble, CheckCircle]

const bedColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
  available:   { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', label: 'Available' },
  occupied:    { bg: '#EEF2FF', border: '#C7D2FE', text: '#4338CA', label: 'Occupied' },
  reserved:    { bg: '#F1F5F9', border: '#CBD5E1', text: '#475569', label: 'Reserved' },
  maintenance: { bg: '#F8FAFC', border: '#E2E8F0', text: '#94A3B8', label: 'Maintenance' },
}

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
      {steps.map((label, i) => {
        const Icon = stepIcons[i]
        const done = i < current; const active = i === current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? '#0A1931' : active ? '#fff' : '#F6FAFD',
                border: active ? '2.5px solid #0A1931' : done ? 'none' : '2px solid #D9E3EC',
                boxShadow: active ? '0 0 0 4px rgba(10,25,49,0.08)' : 'none',
                transition: 'all 0.25s',
              }}>
                {done ? <Check size={18} color="#fff" strokeWidth={2.5} /> : <Icon size={18} color={active ? '#0A1931' : '#B3CFE5'} strokeWidth={1.5} />}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? '#0A1931' : done ? '#4A7FA7' : '#B3CFE5', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 80, height: 2, background: i < current ? '#0A1931' : '#E8EEF5', margin: '0 6px 20px', transition: 'background 0.3s' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

type Bed = typeof beds[0]

export default function BookingPage() {
  return (
    <Suspense fallback={<p style={{ color: '#6B7FA3' }}>Loading booking...</p>}>
      <BookingContent />
    </Suspense>
  )
}

function BookingContent() {
  const params = useSearchParams()
  const pgId = params.get('pgId') ?? '1'
  const pg = pgListings.find(p => p.id === pgId) ?? pgListings[0]

  const [step, setStep] = useState(0)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [drawerBed, setDrawerBed] = useState<Bed | null>(null)
  const [moveInDate, setMoveInDate] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const pgBuildings = buildings.filter(b => b.pgId === pgId)
  const floorList = floors.filter(f => f.buildingId === selectedBuilding)
  const roomList = rooms.filter(r => r.floorId === selectedFloor)
  const bedList = beds.filter(b => b.roomId === selectedRoom)

  if (confirmed) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1s ease-in-out' }}>
        <CheckCircle size={40} color="#0A1931" strokeWidth={1.5} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0A1931', margin: '0 0 8px' }}>Booking Confirmed!</h2>
        <p style={{ fontSize: 14, color: '#6B7FA3', margin: 0 }}>Your booking at {pg.name} has been sent to the owner for confirmation.</p>
      </div>
      <div style={{ background: '#F6FAFD', borderRadius: 14, padding: 24, width: 340, border: '1px solid #E8EEF5' }}>
        {[['Accommodation Type', getAccommodationCategory(pg.category).label], ['PG', pg.name], ['Bed', selectedBed?.label ?? '—'], ['Rent', `₹${selectedBed?.price?.toLocaleString()}/mo`], ['Move-in', moveInDate || '—'], ['Status', 'Pending confirmation']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E8EEF5' }}>
            <span style={{ fontSize: 12, color: '#6B7FA3' }}>{k}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link href="/customer/bookings" style={{ textDecoration: 'none' }}><Button>View My Bookings</Button></Link>
        <Link href="/customer/search" style={{ textDecoration: 'none' }}><Button variant="secondary">Search More PGs</Button></Link>
      </div>
    </div>
  )

  return (
    <div>
      <Link href={`/customer/pg/${pgId}`} style={{ fontSize: 13, color: '#4A7FA7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        ← Back to {pg.name}
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: '0 0 4px' }}>Book Your Bed</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        <CategoryBadge category={pg.category} />
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>{pg.name} · {pg.location}</p>
      </div>

      <StepBar current={step} />

      {/* Step content */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Step 0: Building */}
        {step === 0 && (
          <StepSection title="Select Building" subtitle="Choose which building you prefer">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {pgBuildings.map(b => (
                <SelectCard key={b.id} selected={selectedBuilding === b.id} onClick={() => setSelectedBuilding(b.id)}
                  icon={<Building2 size={22} color={selectedBuilding === b.id ? '#0A1931' : '#4A7FA7'} strokeWidth={1.5} />}
                  title={b.name} subtitle={`${b.floors} floors`} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 1: Floor */}
        {step === 1 && (
          <StepSection title="Select Floor" subtitle="Pick your preferred floor">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {floorList.map(f => (
                <SelectCard key={f.id} selected={selectedFloor === f.id} onClick={() => setSelectedFloor(f.id)}
                  icon={<Layers size={22} color={selectedFloor === f.id ? '#0A1931' : '#4A7FA7'} strokeWidth={1.5} />}
                  title={f.name} subtitle={`${f.rooms} rooms`} />
              ))}
            </div>
          </StepSection>
        )}

        {/* Step 2: Room */}
        {step === 2 && (
          <StepSection title="Select Room" subtitle="Choose your room type">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {roomList.map(r => {
                const roomBeds = beds.filter(b => b.roomId === r.id)
                const avail = roomBeds.filter(b => b.status === 'available').length
                return (
                  <button key={r.id} onClick={() => setSelectedRoom(r.id)} style={{
                    width: '100%', textAlign: 'left', padding: '18px 20px', borderRadius: 14,
                    border: `2px solid ${selectedRoom === r.id ? '#0A1931' : '#E8EEF5'}`,
                    background: selectedRoom === r.id ? '#F6FAFD' : '#fff', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: selectedRoom === r.id ? '#EDF4FB' : '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DoorOpen size={20} color={selectedRoom === r.id ? '#0A1931' : '#4A7FA7'} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>{r.name}</p>
                        <p style={{ fontSize: 12, color: '#6B7FA3', margin: '3px 0 0' }}>{r.type} · {r.capacity} beds</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: avail > 0 ? '#1D4ED8' : '#DC2626', margin: 0 }}>{avail > 0 ? `${avail} available` : 'Full'}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </StepSection>
        )}

        {/* Step 3: Bed — BookMyShow style */}
        {step === 3 && (
          <StepSection title="Select Bed" subtitle="Tap an available bed to select it">
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              {Object.entries(bedColors).map(([status, cfg]) => (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: cfg.bg, border: `1.5px solid ${cfg.border}` }} />
                  <span style={{ fontSize: 11, color: '#6B7FA3', fontWeight: 500 }}>{cfg.label}</span>
                </div>
              ))}
            </div>

            {/* Screen-like header */}
            <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', borderRadius: 12, padding: '10px 20px', textAlign: 'center', marginBottom: 28 }}>
              <span style={{ fontSize: 11, color: '#B3CFE5', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Room — All Beds</span>
            </div>

            {/* Beds grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, maxWidth: 460, margin: '0 auto 28px' }}>
              {bedList.map(bed => {
                const cfg = bedColors[bed.status] ?? bedColors.available
                const isSelected = selectedBed?.id === bed.id
                const isAvail = bed.status === 'available'
                return (
                  <button key={bed.id}
                    onClick={() => { if (isAvail) { setSelectedBed(isSelected ? null : bed) } else { setDrawerBed(bed) } }}
                    style={{
                      padding: '16px 12px', borderRadius: 14, cursor: isAvail ? 'pointer' : 'default',
                      border: `2px solid ${isSelected ? '#0A1931' : cfg.border}`,
                      background: isSelected ? '#0A1931' : cfg.bg,
                      transition: 'all 0.2s', position: 'relative',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                    }}>
                    {isSelected && <div style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} color="#0A1931" strokeWidth={3} /></div>}
                    <BedDouble size={24} color={isSelected ? '#fff' : cfg.text} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#fff' : cfg.text, margin: '0 0 4px', textAlign: 'center' }}>{bed.label}</p>
                    <p style={{ fontSize: 10, color: isSelected ? '#B3CFE5' : cfg.text + '99', margin: 0, textAlign: 'center' }}>₹{bed.price.toLocaleString()}/mo</p>
                    {!isAvail && <button onClick={(e) => { e.stopPropagation(); setDrawerBed(bed) }} style={{ position: 'absolute', bottom: 6, right: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><Info size={12} color={cfg.text} /></button>}
                  </button>
                )
              })}
            </div>

            {selectedBed && (
              <div style={{ background: '#EDF4FB', borderRadius: 12, padding: '14px 18px', border: '1px solid #B3CFE5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Selected: {selectedBed.label}</p>
                  <p style={{ fontSize: 12, color: '#4A7FA7', margin: '3px 0 0' }}>₹{selectedBed.price.toLocaleString()}/month</p>
                </div>
                <CheckCircle size={20} color="#0A1931" />
              </div>
            )}
          </StepSection>
        )}

        {/* Step 4: Summary */}
        {step === 4 && selectedBed && (
          <StepSection title="Booking Summary" subtitle="Review your booking before confirming">
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', padding: '20px 24px' }}>
                <p style={{ color: '#B3CFE5', fontSize: 11, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Booking at</p>
                <p style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>{pg.name}</p>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {[
                  ['Accommodation Type', getAccommodationCategory(pg.category).label],
                  ['Building', pgBuildings.find(b => b.id === selectedBuilding)?.name ?? '—'],
                  ['Floor', floorList.find(f => f.id === selectedFloor)?.name ?? '—'],
                  ['Room', roomList.find(r => r.id === selectedRoom)?.name ?? '—'],
                  ['Bed', selectedBed.label],
                  ['Monthly Rent', `₹${selectedBed.price.toLocaleString()}`],
                  ['Security Deposit', `₹${(selectedBed.price * 2).toLocaleString()}`],
                  ['Taxes & Fees', '₹0 (waived for first month)'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F6FAFD' }}>
                    <span style={{ fontSize: 13, color: '#6B7FA3' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1931' }}>Total Due Now</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#0A1931' }}>₹{(selectedBed.price * 3).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', display: 'block', marginBottom: 8 }}>Preferred Move-in Date</label>
              <input type="date" value={moveInDate} onChange={e => setMoveInDate(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', gap: 10 }}>
              <Info size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.5 }}>Your booking will be confirmed after owner approval. Deposit is payable after confirmation.</p>
            </div>
          </StepSection>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid #E8EEF5' }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Previous</Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={(step === 0 && !selectedBuilding) || (step === 1 && !selectedFloor) || (step === 2 && !selectedRoom) || (step === 3 && !selectedBed)}
              iconRight={ChevronRight}
            >Continue</Button>
          ) : (
            <Button onClick={() => setConfirmed(true)} disabled={!moveInDate} icon={CheckCircle}>Confirm Booking</Button>
          )}
        </div>
      </div>

      {/* Bed detail drawer */}
      <Drawer open={!!drawerBed} onClose={() => setDrawerBed(null)} title="Bed Details">
        {drawerBed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: '#F6FAFD', borderRadius: 14, padding: 24, textAlign: 'center' }}>
              <BedDouble size={40} color="#1A3D63" strokeWidth={1.5} style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0A1931', margin: '0 0 4px' }}>{drawerBed.label}</h3>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bedColors[drawerBed.status]?.bg, color: bedColors[drawerBed.status]?.text }}>
                {bedColors[drawerBed.status]?.label ?? drawerBed.status}
              </span>
            </div>
            {[['Price', `₹${drawerBed.price.toLocaleString()}/month`], ['Room', roomList.find(r => r.id === drawerBed.roomId)?.name ?? '—'], ['Status', drawerBed.status]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F6FAFD' }}>
                <span style={{ fontSize: 13, color: '#6B7FA3' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{v}</span>
              </div>
            ))}
            {drawerBed.status === 'available' && (
              <Button onClick={() => { setSelectedBed(drawerBed); setDrawerBed(null) }} fullWidth>Select This Bed</Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}

function StepSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0A1931', margin: '0 0 6px' }}>{title}</h2>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function SelectCard({ selected, onClick, icon, title, subtitle }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '22px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
      border: `2px solid ${selected ? '#0A1931' : '#E8EEF5'}`,
      background: selected ? '#F6FAFD' : '#fff',
      transform: selected ? 'scale(1.02)' : 'scale(1)',
      boxShadow: selected ? '0 4px 16px rgba(10,25,49,0.10)' : 'none',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: selected ? '#EDF4FB' : '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>{title}</p>
        <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>{subtitle}</p>
      </div>
      {selected && <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={11} color="#fff" strokeWidth={3} /></div>}
    </button>
  )
}
