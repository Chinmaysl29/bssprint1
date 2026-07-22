'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, Heart, Share2, BadgeCheck, Wifi, UtensilsCrossed, Car, Dumbbell, Zap, Waves, ChevronLeft, ChevronRight, Phone, MessageCircle, BedDouble } from 'lucide-react'
import { pgListings } from '../../data/dummy'
import Button from '../../components/Button'
import StatusBadge from '../../components/StatusBadge'
import { CategoryBadge } from '../../components/AccommodationCategory'

const amenityIcons: Record<string, any> = { WiFi: Wifi, Food: UtensilsCrossed, Parking: Car, Gym: Dumbbell, 'Power Backup': Zap, Laundry: Waves }

const dummyReviews = [
  { id: 1, name: 'Rohit S.', avatar: 'RS', rating: 5, comment: 'Excellent PG! Very clean and well-maintained. Owner is responsive.', date: 'March 2024' },
  { id: 2, name: 'Priya M.', avatar: 'PM', rating: 4, comment: 'Good location and facilities. Food could be improved slightly.', date: 'February 2024' },
  { id: 3, name: 'Kiran D.', avatar: 'KD', rating: 5, comment: 'Best PG in the area. WiFi is fast, rooms are spacious.', date: 'January 2024' },
]

export default function PGDetailsPage() {
  const { id } = useParams()
  const pg = pgListings.find(p => p.id === id) ?? pgListings[0]
  const [imgIdx, setImgIdx] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 12, color: '#6B7FA3' }}>
        <Link href="/customer/search" style={{ color: '#4A7FA7', textDecoration: 'none', fontWeight: 600 }}>Search</Link>
        <span>/</span>
        <span style={{ color: '#0A1931', fontWeight: 600 }}>{pg.name}</span>
      </div>

      {/* Image Gallery */}
      <div style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', marginBottom: 28, height: 420 }}>
        <img src={pg.images[imgIdx]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,49,0.5) 0%, transparent 50%)' }} />

        {/* Nav arrows */}
        {pg.images.length > 1 && <>
          <button onClick={() => setImgIdx(i => (i - 1 + pg.images.length) % pg.images.length)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={18} color="#0A1931" />
          </button>
          <button onClick={() => setImgIdx(i => (i + 1) % pg.images.length)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={18} color="#0A1931" />
          </button>
        </>}

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: 9 }}><CategoryBadge category={pg.category} subtle /></div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{pg.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={13} color="#B3CFE5" />
              <span style={{ color: '#B3CFE5', fontSize: 13 }}>{pg.location}</span>
              <span style={{ color: '#B3CFE5' }}>·</span>
              <span style={{ color: '#B3CFE5', fontSize: 13 }}>{pg.distance}</span>
              {pg.verified && (
                <span style={{ background: '#fff', color: '#0A1931', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <BadgeCheck size={10} /> Verified
                </span>
              )}
            </div>
          </div>
          {/* Thumbnail strip */}
          <div style={{ display: 'flex', gap: 6 }}>
            {pg.images.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)} style={{ width: 52, height: 38, borderRadius: 8, overflow: 'hidden', border: i === imgIdx ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', padding: 0, background: 'none' }}>
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left: Details */}
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
            {['overview', 'rooms', 'reviews', 'rules'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                background: activeTab === t ? '#0A1931' : 'transparent', color: activeTab === t ? '#fff' : '#6B7FA3',
              }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              <p style={{ fontSize: 14, color: '#4A7FA7', lineHeight: 1.7, marginBottom: 24 }}>{pg.description}</p>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 14px' }}>Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                {pg.amenities.map(a => {
                  const Icon = amenityIcons[a]
                  return (
                    <div key={a} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', background: '#F6FAFD', borderRadius: 12, border: '1px solid #E8EEF5' }}>
                      {Icon ? <Icon size={18} color="#4A7FA7" strokeWidth={1.5} /> : <BedDouble size={18} color="#4A7FA7" strokeWidth={1.5} />}
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#0A1931' }}>{a}</span>
                    </div>
                  )
                })}
              </div>

              {/* Map placeholder */}
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 12px' }}>Location</h3>
              <div style={{ height: 180, background: 'linear-gradient(135deg, #EDF4FB, #B3CFE5)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D9E3EC', marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <MapPin size={28} color="#4A7FA7" strokeWidth={1.5} />
                  <p style={{ fontSize: 12, color: '#4A7FA7', margin: '8px 0 0', fontWeight: 600 }}>{pg.location}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>Google Maps placeholder</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'rooms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[{ type: 'Triple Sharing', beds: 3, available: 1, price: pg.price }, { type: 'Double Sharing', beds: 2, available: 0, price: pg.price + 2000 }, { type: 'Single', beds: 1, available: 1, price: pg.price + 4000 }].map(r => (
                <div key={r.type} style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>{r.type}</p>
                    <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0' }}>{r.beds} bed room · {r.available} available</p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#0A1931', margin: 0 }}>₹{r.price.toLocaleString()}/mo</p>
                    {r.available > 0
                      ? <Link href={`/customer/booking?pgId=${pg.id}`}><Button size="sm">Book Now</Button></Link>
                      : <StatusBadge status="occupied" />
                    }
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: '#F6FAFD', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 48, fontWeight: 800, color: '#0A1931', margin: 0, lineHeight: 1 }}>{pg.rating}</p>
                  <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '6px 0 4px' }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} color="#F59E0B" fill={s <= pg.rating ? '#F59E0B' : 'none'} />)}
                  </div>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>{pg.reviews} reviews</p>
                </div>
                <div style={{ flex: 1 }}>
                  {[5,4,3,2,1].map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#6B7FA3', minWidth: 8 }}>{s}</span>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <div style={{ flex: 1, height: 5, background: '#E8EEF5', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s === 5 ? 65 : s === 4 ? 20 : s === 3 ? 10 : s === 2 ? 3 : 2}%`, background: '#0A1931', borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {dummyReviews.map(r => (
                <div key={r.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #E8EEF5', padding: 18, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 11, fontWeight: 700 }}>{r.avatar}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{r.name}</p>
                        <p style={{ fontSize: 11, color: '#6B7FA3', margin: '2px 0 0' }}>{r.date}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} color="#F59E0B" fill={s <= r.rating ? '#F59E0B' : 'none'} />)}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#4A7FA7', margin: 0, lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rules' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pg.rules.map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: '#F6FAFD', borderRadius: 10, border: '1px solid #E8EEF5' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4A7FA7', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#0A1931' }}>{rule}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Booking card */}
        <div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 24, position: 'sticky', top: 80, boxShadow: '0 4px 20px rgba(10,25,49,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#0A1931', margin: 0 }}>₹{pg.price.toLocaleString()}</p>
                <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>per month + ₹{pg.deposit.toLocaleString()} deposit</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#0A1931', borderRadius: 8, padding: '4px 8px' }}>
                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{pg.rating}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <div style={{ padding: '12px 14px', background: '#F6FAFD', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>Accommodation Type</span>
                <CategoryBadge category={pg.category} />
              </div>
              <div style={{ padding: '12px 14px', background: '#F6FAFD', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>Available Beds</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{pg.availableBeds}</span>
              </div>
              <div style={{ padding: '12px 14px', background: '#F6FAFD', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>Gender</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{pg.gender}</span>
              </div>
              <div style={{ padding: '12px 14px', background: '#F6FAFD', borderRadius: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#6B7FA3' }}>Room Type</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1931' }}>{pg.type}</span>
              </div>
            </div>

            <Link href={`/customer/booking?pgId=${pg.id}`} style={{ textDecoration: 'none' }}>
              <Button fullWidth size="lg">Book Now</Button>
            </Link>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button onClick={() => setWishlisted(w => !w)} style={{ flex: 1, padding: '10px', background: wishlisted ? '#EDF4FB' : '#F6FAFD', border: `1px solid ${wishlisted ? '#B3CFE5' : '#E8EEF5'}`, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0A1931' }}>
                <Heart size={14} fill={wishlisted ? '#0A1931' : 'none'} /> Save
              </button>
              <button style={{ flex: 1, padding: '10px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#0A1931' }}>
                <Share2 size={14} /> Share
              </button>
            </div>

            {/* Owner */}
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid #E8EEF5' }}>
              <p style={{ fontSize: 11, color: '#6B7FA3', margin: '0 0 10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 12, fontWeight: 700 }}>{pg.ownerAvatar}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{pg.owner}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: '#0A1931', fontWeight: 500 }}>
                  <Phone size={13} /> Call
                </button>
                <button style={{ flex: 1, padding: '8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, color: '#0A1931', fontWeight: 500 }}>
                  <MessageCircle size={13} /> Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
