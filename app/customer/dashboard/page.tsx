'use client'
import { useState } from 'react'
import { CalendarCheck, Heart, Bell, Clock, MapPin, Star, ArrowRight, BedDouble, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { pgListings, bookings, notifications } from '../data/dummy'
import PGCard from '../components/PGCard'
import StatusBadge from '../components/StatusBadge'
import { AccommodationCategory, accommodationCategories, CategoryBadge, CategorySelector, getAccommodationCategory } from '../components/AccommodationCategory'

function StatCard({ title, value, sub, icon: Icon, accent = '#4A7FA7', href }: any) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: '1px solid #E8EEF5', boxShadow: '0 1px 4px rgba(10,25,49,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'box-shadow 0.2s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: accent, borderRadius: '14px 0 0 14px' }} />
        <div>
          <p style={{ fontSize: 11, color: '#6B7FA3', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{title}</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#0A1931', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
          {sub && <p style={{ fontSize: 11, color: '#6B7FA3', margin: '4px 0 0' }}>{sub}</p>}
        </div>
        <div style={{ background: accent + '18', borderRadius: 12, padding: 12 }}>
          <Icon size={22} color={accent} strokeWidth={1.5} />
        </div>
      </div>
    </Link>
  )
}

const timelineEvents = [
  { icon: CheckCircle, color: '#2563EB', label: 'Booking Confirmed', sub: 'Sunrise PG, Room 101', time: '2h ago' },
  { icon: Bell, color: '#D97706', label: 'Rent Reminder', sub: 'Payment due June 1', time: '5h ago' },
  { icon: Star, color: '#6366F1', label: 'Review Requested', sub: 'Rate Green Valley PG', time: '2d ago' },
  { icon: AlertCircle, color: '#DC2626', label: 'KYC Rejected', sub: 'Employee ID rejected', time: '3d ago' },
]

export default function CustomerDashboard() {
  const activeBooking = bookings.find(b => b.status === 'active')
  const pendingBooking = bookings.find(b => b.status === 'pending')
  const [selectedCategory, setSelectedCategory] = useState<AccommodationCategory>('girls')
  const categoryCounts = accommodationCategories.reduce((acc, category) => ({
    ...acc,
    [category.key]: pgListings.filter(pg => pg.category === category.key).length,
  }), {} as Record<AccommodationCategory, number>)
  const selectedCategoryInfo = getAccommodationCategory(selectedCategory)
  const recentSearches = [
    { category: 'girls', location: 'Bangalore', budget: 'Under ₹10,000' },
    { category: 'coliving', location: 'Whitefield', budget: '' },
    { category: 'boys', location: 'HSR Layout', budget: 'Food included' },
  ]

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0A1931', margin: 0, letterSpacing: '-0.03em' }}>
          Good morning, Arjun 👋
        </h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '6px 0 0' }}>Here&apos;s an overview of your stay and bookings.</p>
      </div>

      <div style={{ marginBottom: 18, background: '#fff', border: '1px solid #D9E3EC', borderRadius: 18, padding: 14, boxShadow: '0 8px 26px rgba(10,25,49,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 14, padding: '12px 14px' }}>
          <MapPin size={17} color="#4A7FA7" strokeWidth={1.5} />
          <input placeholder={`Search ${selectedCategoryInfo.label} by area, city, or landmark...`} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: '#0A1931', fontSize: 14 }} />
          <Link href={`/customer/search?category=${selectedCategory}`} style={{ textDecoration: 'none', padding: '8px 13px', borderRadius: 10, background: '#0A1931', color: '#fff', fontSize: 12, fontWeight: 750, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Explore <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <CategorySelector selected={selectedCategory} onSelect={setSelectedCategory} counts={categoryCounts} />

      <div style={{ marginBottom: 28, background: '#fff', border: '1px solid #E8EEF5', borderRadius: 16, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 850, color: '#0A1931', margin: 0 }}>Recent Searches</h2>
            <p style={{ fontSize: 12, color: '#6B7FA3', margin: '3px 0 0' }}>Pick up right where you left off</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {recentSearches.map((search, index) => {
            const item = getAccommodationCategory(search.category)
            return (
              <Link key={index} href={`/customer/search?category=${search.category}`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 12px', border: '1px solid #D9E3EC', borderRadius: 999, background: '#F6FAFD', color: '#0A1931', fontSize: 12, fontWeight: 650 }}>
                <span>{item.emoji}</span>
                {item.label} • {search.location}{search.budget ? ` • ${search.budget}` : ''}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard title="Active Booking" value={1} sub="Sunrise PG" icon={BedDouble} accent="#0A1931" href="/customer/bookings" />
        <StatCard title="Pending" value={1} sub="Awaiting confirmation" icon={Clock} accent="#D97706" href="/customer/bookings" />
        <StatCard title="Saved PGs" value={2} sub="In wishlist" icon={Heart} accent="#4A7FA7" href="/customer/wishlist" />
        <StatCard title="Notifications" value={2} sub="Unread" icon={Bell} accent="#6366F1" href="/customer/notifications" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 28 }}>
        {/* Active Booking Card */}
        <div>
          {activeBooking && (
            <div style={{ background: 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)', borderRadius: 18, padding: 28, color: '#fff', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ position: 'absolute', bottom: -20, right: 40, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div>
                  <p style={{ fontSize: 11, color: '#B3CFE5', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Current Stay</p>
                  <div style={{ marginBottom: 8 }}><CategoryBadge category={activeBooking.category} subtle /></div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{activeBooking.pg}</h2>
                  <p style={{ fontSize: 13, color: '#B3CFE5', margin: '0 0 18px' }}>{activeBooking.room} · {activeBooking.bed}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    {[['Move-in', activeBooking.moveIn], ['Monthly Rent', `₹${activeBooking.amount.toLocaleString()}`], ['Status', 'Active']].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ fontSize: 10, color: '#7A9AB5', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <BedDouble size={48} color="rgba(179,207,229,0.3)" strokeWidth={1} />
              </div>
            </div>
          )}

          {/* Upcoming move-in */}
          {pendingBooking && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} color="#D97706" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>Upcoming Move-in</p>
                  <p style={{ fontSize: 12, color: '#6B7FA3', margin: '3px 0 0' }}>{pendingBooking.pg} · {pendingBooking.moveIn}</p>
                </div>
              </div>
              <StatusBadge status="pending" />
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 16px' }}>Recent Activity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timelineEvents.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < timelineEvents.length - 1 ? 16 : 0, position: 'relative' }}>
                {i < timelineEvents.length - 1 && <div style={{ position: 'absolute', left: 15, top: 28, width: 1, height: 'calc(100% - 4px)', background: '#E8EEF5' }} />}
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: e.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                  <e.icon size={14} color={e.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{e.label}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{e.sub}</p>
                  <p style={{ fontSize: 10, color: '#B3CFE5', margin: '2px 0 0' }}>{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended PGs */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0A1931', margin: 0 }}>Recommended Stays</h2>
            <p style={{ fontSize: 12, color: '#6B7FA3', margin: '3px 0 0' }}>Grouped by accommodation type</p>
          </div>
          <Link href="/customer/search" style={{ display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: '#4A7FA7' }}>
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {accommodationCategories.map(category => {
            const items = pgListings.filter(pg => pg.category === category.key)
            return (
              <section key={category.key}>
                <h3 style={{ fontSize: 15, fontWeight: 850, color: '#0A1931', margin: '0 0 12px' }}>
                  Recommended {category.label}{category.key === 'coliving' ? ' Spaces' : 's'}
                </h3>
                <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 6 }}>
                  {items.map(pg => (
                    <div key={pg.id} style={{ minWidth: 300, maxWidth: 330, flex: '0 0 31%' }}>
                      <PGCard pg={pg} />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
