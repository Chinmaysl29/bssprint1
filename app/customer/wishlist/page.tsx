'use client'
import { useState } from 'react'
import { Heart, Trash2, Share2, ArrowRight, Star, MapPin } from 'lucide-react'
import Link from 'next/link'
import { wishlist as initialWishlist } from '../data/dummy'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { AccommodationCategory, CategoryBadge, CategoryChips } from '../components/AccommodationCategory'

export default function WishlistPage() {
  const [list, setList] = useState(initialWishlist)
  const [category, setCategory] = useState<AccommodationCategory | ''>('')
  const remove = (id: string) => setList(l => l.filter(p => p.id !== id))
  const filteredList = category ? list.filter(pg => pg.category === category) : list

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>My Wishlist</h1>
        <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>{filteredList.length} saved PGs</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E8EEF5', borderRadius: 16, padding: 16, marginBottom: 22, boxShadow: '0 4px 18px rgba(10,25,49,0.05)' }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#0A1931', margin: '0 0 10px' }}>Filter by accommodation type</p>
        <CategoryChips selected={category} onSelect={setCategory} />
      </div>

      {filteredList.length === 0 ? (
        <EmptyState icon={Heart} title="No saved PGs" subtitle="Save PGs you like to compare and book later"
          action={<Link href="/customer/search" style={{ textDecoration: 'none' }}><Button>Explore PGs</Button></Link>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filteredList.map(pg => (
            <div key={pg.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
              <div style={{ position: 'relative', height: 180 }}>
                <img src={pg.images[0]} alt={pg.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,25,49,0.4), transparent)' }} />
                <button onClick={() => remove(pg.id)} style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Heart size={14} color="#DC2626" fill="#DC2626" />
                </button>
                <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '2px 8px' }}>
                      <Star size={10} color="#F59E0B" fill="#F59E0B" />
                      <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{pg.rating}</span>
                    </div>
                    <CategoryBadge category={pg.category} subtle />
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 18px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 4px' }}>{pg.name}</h3>
                <div style={{ marginBottom: 8 }}><CategoryBadge category={pg.category} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                  <MapPin size={11} color="#6B7FA3" />
                  <span style={{ fontSize: 11, color: '#6B7FA3' }}>{pg.location} · {pg.distance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: '#0A1931', margin: 0 }}>₹{pg.price.toLocaleString()}</p>
                    <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>per month</p>
                  </div>
                  <span style={{ fontSize: 12, color: '#1D4ED8', fontWeight: 600 }}>{pg.availableBeds} beds available</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => remove(pg.id)} style={{ padding: '8px 10px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={14} color="#DC2626" />
                  </button>
                  <button style={{ padding: '8px 10px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', display: 'flex' }}>
                    <Share2 size={14} color="#4A7FA7" />
                  </button>
                  <Link href={`/customer/booking?pgId=${pg.id}`} style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: '#0A1931', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                    Book Now <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
