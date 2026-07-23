'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Heart, Star, MapPin, Wifi, UtensilsCrossed, Car, Dumbbell, BadgeCheck, ArrowRight } from 'lucide-react'
import { CategoryBadge } from './AccommodationCategory'

type PG = {
  id: string; name: string; location: string; price: number; rating: number;
  reviews: number; availableBeds: number; gender: string; verified: boolean;
  distance: string; type: string; food: boolean; wifi: boolean; parking: boolean; gym: boolean;
  category?: string; images: string[]
}

export default function PGCard({ pg, onWishlist, wishlisted }: { pg: PG; onWishlist?: (id: string) => void; wishlisted?: boolean }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [hovered, setHovered] = useState(false)

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: hovered ? '0 8px 28px rgba(10,25,49,0.12)' : '0 1px 4px rgba(10,25,49,0.06)', transition: 'all 0.2s', cursor: 'pointer' }}>

      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={pg.images[imgIdx]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.03)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,49,0.4) 0%, transparent 60%)' }} />

        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          {pg.verified && (
            <span style={{ background: '#0A1931', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
              <BadgeCheck size={10} />Verified
            </span>
          )}
          <CategoryBadge category={pg.category} subtle />
        </div>

        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); onWishlist?.(pg.id) }} style={{ position: 'absolute', top: 10, right: 10, background: wishlisted ? '#0A1931' : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
          <Heart size={15} color={wishlisted ? '#fff' : '#0A1931'} fill={wishlisted ? '#fff' : 'none'} />
        </button>

        {/* Image dots */}
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
          {pg.images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
              style={{ width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0A1931', margin: 0 }}>{pg.name}</h3>
            <div style={{ marginTop: 6 }}>
              <CategoryBadge category={pg.category} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <MapPin size={11} color="#6B7FA3" strokeWidth={1.5} />
              <span style={{ fontSize: 11, color: '#6B7FA3' }}>{pg.location}</span>
              <span style={{ fontSize: 11, color: '#B3CFE5' }}>·</span>
              <span style={{ fontSize: 11, color: '#6B7FA3' }}>{pg.distance}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#0A1931', margin: 0 }}>₹{pg.price.toLocaleString()}</p>
            <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>per month</p>
          </div>
        </div>

        {/* Rating + availability */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#0A1931', borderRadius: 6, padding: '3px 7px' }}>
              <Star size={10} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{pg.rating}</span>
            </div>
            <span style={{ fontSize: 11, color: '#6B7FA3' }}>({pg.reviews} reviews)</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: pg.availableBeds > 0 ? '#1D4ED8' : '#DC2626' }}>
            {pg.availableBeds > 0 ? `${pg.availableBeds} beds available` : 'Full'}
          </span>
        </div>

        {/* Amenities */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {pg.wifi && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#4A7FA7', background: '#EDF4FB', padding: '3px 8px', borderRadius: 6 }}><Wifi size={9} />WiFi</span>}
          {pg.food && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#4A7FA7', background: '#EDF4FB', padding: '3px 8px', borderRadius: 6 }}><UtensilsCrossed size={9} />Food</span>}
          {pg.parking && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#4A7FA7', background: '#EDF4FB', padding: '3px 8px', borderRadius: 6 }}><Car size={9} />Parking</span>}
          {pg.gym && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#4A7FA7', background: '#EDF4FB', padding: '3px 8px', borderRadius: 6 }}><Dumbbell size={9} />Gym</span>}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/customer/pg/${pg.id}`} style={{ flex: 1, padding: '9px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 9, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#0A1931' }}>View Details</Link>
          <Link href={`/customer/booking?pgId=${pg.id}`} style={{ flex: 1, padding: '9px', background: '#0A1931', borderRadius: 9, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', fontSize: 12, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            Book Now <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
