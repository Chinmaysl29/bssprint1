'use client'
import { useState } from 'react'
import { Star, Pencil, Trash2, ThumbsUp, Plus } from 'lucide-react'
import { reviews, pendingReviews } from '../data/dummy'
import Button from '../components/Button'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={() => onChange?.(s)} onMouseEnter={() => onChange && setHover(s)} onMouseLeave={() => onChange && setHover(0)}
          style={{ background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default', padding: 1 }}>
          <Star size={onChange ? 24 : 14} color="#F59E0B" fill={s <= (hover || value) ? '#F59E0B' : 'none'} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [selectedPending, setSelectedPending] = useState('')

  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0A1931', margin: 0 }}>Reviews</h1>
          <p style={{ fontSize: 13, color: '#6B7FA3', margin: '5px 0 0' }}>Your reviews help others find great PGs</p>
        </div>
        {pendingReviews.length > 0 && <Button icon={Plus} onClick={() => setModalOpen(true)}>Write Review</Button>}
      </div>

      {/* Rating overview */}
      <div style={{ background: 'linear-gradient(135deg, #0A1931, #1A3D63)', borderRadius: 18, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 40, marginBottom: 28, color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 52, fontWeight: 800, margin: 0, lineHeight: 1 }}>{avgRating.toFixed(1)}</p>
          <StarRating value={Math.round(avgRating)} />
          <p style={{ fontSize: 12, color: '#B3CFE5', margin: '6px 0 0' }}>{reviews.length} reviews given</p>
        </div>
        <div style={{ flex: 1 }}>
          {[5,4,3,2,1].map(s => {
            const count = reviews.filter(r => r.rating === s).length
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#B3CFE5', minWidth: 6 }}>{s}</span>
                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / reviews.length) * 100}%`, background: '#B3CFE5', borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
                <span style={{ fontSize: 11, color: '#B3CFE5', minWidth: 10 }}>{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending reviews */}
      {pendingReviews.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 12px' }}>Pending Reviews</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {pendingReviews.map(p => (
              <div key={p.id} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, maxWidth: 400 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: 0 }}>{p.pg}</p>
                  <p style={{ fontSize: 11, color: '#6B7FA3', margin: '3px 0 0' }}>Stayed till {p.moveOut}</p>
                </div>
                <Button size="sm" icon={Star} onClick={() => { setSelectedPending(p.pg); setModalOpen(true) }}>Review</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Reviews */}
      <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1931', margin: '0 0 14px' }}>My Reviews</p>
      {reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" subtitle="Reviews you write will appear here" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 22, boxShadow: '0 1px 4px rgba(10,25,49,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0A1931', margin: '0 0 4px' }}>{r.pg}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <StarRating value={r.rating} />
                    <span style={{ fontSize: 11, color: '#6B7FA3' }}>{r.date}</span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ padding: '7px 8px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 8, cursor: 'pointer', display: 'flex' }}><Pencil size={13} color="#4A7FA7" /></button>
                  <button style={{ padding: '7px 8px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, cursor: 'pointer', display: 'flex' }}><Trash2 size={13} color="#DC2626" /></button>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#4A7FA7', margin: '0 0 12px', lineHeight: 1.7 }}>{r.comment}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 20, cursor: 'pointer', fontSize: 11, color: '#6B7FA3', fontWeight: 500 }}>
                  <ThumbsUp size={11} /> {r.helpful} Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Review ${selectedPending || 'PG'}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6B7FA3', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Rating</p>
            <StarRating value={newRating} onChange={setNewRating} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Review</label>
            <textarea rows={5} value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Share your experience about cleanliness, food, owner behavior, facilities..."
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #D9E3EC', borderRadius: 10, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button disabled={!newRating || !newComment} onClick={() => setModalOpen(false)} icon={Star}>Submit Review</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
