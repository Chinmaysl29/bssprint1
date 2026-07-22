'use client'
import { useState } from 'react'
import { SlidersHorizontal, Grid, List, X, ChevronDown, MapPin } from 'lucide-react'
import { pgListings } from '../data/dummy'
import PGCard from '../components/PGCard'
import StatusBadge from '../components/StatusBadge'
import { AccommodationCategory, CategoryChips, getAccommodationCategory } from '../components/AccommodationCategory'

const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad']
const areas = ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'BTM Layout']
const roomTypes = ['Single', 'Double Sharing', 'Triple Sharing', 'Dormitory']
const amenitiesList = ['Girls PG', 'Boys PG', 'Co-Living', 'WiFi', 'Food', 'Laundry', 'Parking', 'Gym', 'Power Backup', 'AC', 'Attached Bathroom', 'Pet Friendly']

export default function SearchPage() {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [budget, setBudget] = useState([3000, 20000])
  const [category, setCategory] = useState<AccommodationCategory | ''>(() => {
    if (typeof window === 'undefined') return ''
    const value = new URLSearchParams(window.location.search).get('category')
    return value === 'girls' || value === 'boys' || value === 'coliving' ? value : ''
  })
  const [gender, setGender] = useState('')
  const [roomType, setRoomType] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sort, setSort] = useState('recommended')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [wishlist, setWishlist] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(true)

  const toggleAmenity = (a: string) =>
    setSelectedAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])

  const activeCategory = category

  const filtered = pgListings.filter(pg => {
    if (search && !pg.name.toLowerCase().includes(search.toLowerCase()) && !pg.location.toLowerCase().includes(search.toLowerCase())) return false
    if (city && pg.city !== city) return false
    if (area && pg.area !== area) return false
    if (activeCategory && pg.category !== activeCategory) return false
    if (gender && pg.gender !== gender && pg.gender !== 'Both') return false
    if (pg.price < budget[0] || pg.price > budget[1]) return false
    if (roomType && pg.type !== roomType) return false
    if (selectedAmenities.some(a => !['Girls PG', 'Boys PG', 'Co-Living'].includes(a) && !pg.amenities.includes(a))) return false
    return true
  })

  return (
    <div>
      {/* Top search bar */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: '0 0 16px', letterSpacing: '-0.02em' }}>Find Your Perfect PG</h1>
        <div style={{ display: 'flex', gap: 10, background: '#fff', border: '1px solid #D9E3EC', borderRadius: 14, padding: '10px 14px', boxShadow: '0 2px 8px rgba(10,25,49,0.06)' }}>
          <MapPin size={18} color="#4A7FA7" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeCategory ? getAccommodationCategory(activeCategory).label : 'by PG name, area or city'}...`}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#0A1931', background: 'transparent' }} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#6B7FA3', background: 'transparent', cursor: 'pointer' }}>
            <option value="recommended">Recommended</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="distance">Nearest First</option>
          </select>
          <div style={{ width: 1, background: '#E8EEF5' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setView('grid')} style={{ padding: 7, background: view === 'grid' ? '#0A1931' : '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
              <Grid size={15} color={view === 'grid' ? '#fff' : '#6B7FA3'} />
            </button>
            <button onClick={() => setView('list')} style={{ padding: 7, background: view === 'list' ? '#0A1931' : '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 7, cursor: 'pointer', display: 'flex' }}>
              <List size={15} color={view === 'list' ? '#fff' : '#6B7FA3'} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Filters sidebar */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 20, position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <SlidersHorizontal size={15} color="#0A1931" strokeWidth={1.5} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>Filters</span>
              </div>
              <button onClick={() => { setCity(''); setArea(''); setCategory(''); setGender(''); setRoomType(''); setSelectedAmenities([]) }}
                style={{ fontSize: 11, color: '#4A7FA7', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
            </div>

            {/* City */}
            <FilterSection title="City">
              <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #D9E3EC', borderRadius: 8, fontSize: 12, outline: 'none', color: '#0A1931' }}>
                <option value="">All Cities</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </FilterSection>

            {/* Accommodation Type */}
            <FilterSection title="Accommodation Type">
              <CategoryChips selected={category} onSelect={setCategory} />
            </FilterSection>

            {/* Budget */}
            <FilterSection title={`Budget: ₹${budget[0].toLocaleString()} – ₹${budget[1].toLocaleString()}`}>
              <input type="range" min={3000} max={20000} step={500} value={budget[1]} onChange={e => setBudget([budget[0], +e.target.value])}
                style={{ width: '100%', accentColor: '#0A1931' }} />
            </FilterSection>

            {/* Gender */}
            <FilterSection title="Gender">
              <div style={{ display: 'flex', gap: 8 }}>
                {['Male', 'Female', 'Both'].map(g => (
                  <button key={g} onClick={() => setGender(gender === g ? '' : g)} style={{
                    flex: 1, padding: '7px 4px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid',
                    borderColor: gender === g ? '#0A1931' : '#D9E3EC', background: gender === g ? '#0A1931' : '#fff',
                    color: gender === g ? '#fff' : '#6B7FA3',
                  }}>{g}</button>
                ))}
              </div>
            </FilterSection>

            {/* Room Type */}
            <FilterSection title="Room Type">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {roomTypes.map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#0A1931' }}>
                    <input type="radio" name="roomType" checked={roomType === r} onChange={() => setRoomType(roomType === r ? '' : r)} style={{ accentColor: '#0A1931' }} />
                    {r}
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Quick Filters */}
            <FilterSection title="Quick Filters">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {amenitiesList.map(a => {
                  const isCategoryChip = ['Girls PG', 'Boys PG', 'Co-Living'].includes(a)
                  const isActive = selectedAmenities.includes(a)
                    || (a === 'Girls PG' && category === 'girls')
                    || (a === 'Boys PG' && category === 'boys')
                    || (a === 'Co-Living' && category === 'coliving')
                  return (
                    <button key={a} onClick={() => {
                      if (a === 'Girls PG') setCategory(category === 'girls' ? '' : 'girls')
                      else if (a === 'Boys PG') setCategory(category === 'boys' ? '' : 'boys')
                      else if (a === 'Co-Living') setCategory(category === 'coliving' ? '' : 'coliving')
                      else toggleAmenity(a)
                    }} style={{
                      padding: isCategoryChip ? '7px 11px' : '5px 10px', borderRadius: 20, fontSize: 11, fontWeight: isCategoryChip ? 700 : 500, cursor: 'pointer', border: '1px solid',
                      borderColor: isActive ? '#0A1931' : '#D9E3EC',
                      background: isActive ? '#EDF4FB' : '#fff',
                      color: isActive ? '#0A1931' : '#6B7FA3',
                    }}>{a}</button>
                  )
                })}
              </div>
            </FilterSection>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#6B7FA3', margin: 0 }}>
              <span style={{ fontWeight: 700, color: '#0A1931' }}>{filtered.length}</span> PGs found
            </p>
          </div>

          <div style={{ display: view === 'grid' ? 'grid' : 'flex', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined, flexDirection: view === 'list' ? 'column' : undefined, gap: 18 }}>
            {filtered.map(pg => (
              <PGCard key={pg.id} pg={pg} wishlisted={wishlist.includes(pg.id)} onWishlist={id => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#0A1931' }}>No PGs found</p>
              <p style={{ fontSize: 13, color: '#6B7FA3' }}>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ marginBottom: 18, borderBottom: '1px solid #F6FAFD', paddingBottom: 18 }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', marginBottom: open ? 10 : 0, padding: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>{title}</span>
        <ChevronDown size={13} color="#6B7FA3" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && children}
    </div>
  )
}
