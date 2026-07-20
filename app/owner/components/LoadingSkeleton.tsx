'use client'

export function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E8EEF5', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[80, 60, 100, 40].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 20 : 14, width: `${w}%`, background: 'linear-gradient(90deg, #E8EEF5 25%, #F6FAFD 50%, #E8EEF5 75%)', backgroundSize: '200% 100%', borderRadius: 6, animation: 'shimmer 1.4s infinite' }} />
      ))}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E8EEF5', overflow: 'hidden' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', gap: 16 }}>
        {[120, 80, 100, 80, 60].map((w, i) => (
          <div key={i} style={{ height: 14, width: w, background: '#E8EEF5', borderRadius: 4 }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ padding: '14px 24px', borderBottom: '1px solid #F6FAFD', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E8EEF5', flexShrink: 0 }} />
          {[140, 80, 100, 80, 60].map((w, i) => (
            <div key={i} style={{ height: 12, width: w, background: '#E8EEF5', borderRadius: 4 }} />
          ))}
        </div>
      ))}
    </div>
  )
}
