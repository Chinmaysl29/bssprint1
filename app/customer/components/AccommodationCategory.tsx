'use client'

import { Check } from 'lucide-react'

export type AccommodationCategory = 'girls' | 'boys' | 'coliving'

export const accommodationCategories: {
  key: AccommodationCategory
  label: string
  emoji: string
  title: string
  description: string
}[] = [
  {
    key: 'girls',
    label: 'Girls PG',
    emoji: '👩',
    title: 'Girls PG',
    description: 'Safe, verified homes with comfort-first amenities.',
  },
  {
    key: 'boys',
    label: 'Boys PG',
    emoji: '👨',
    title: 'Boys PG',
    description: 'Practical, well-connected stays for students and pros.',
  },
  {
    key: 'coliving',
    label: 'Co-Living',
    emoji: '🏠',
    title: 'Co-Living',
    description: 'Premium shared living with community spaces.',
  },
]

export function getAccommodationCategory(key?: string) {
  return accommodationCategories.find(category => category.key === key) ?? accommodationCategories[2]
}

export function CategoryBadge({ category, subtle = false }: { category?: string; subtle?: boolean }) {
  const item = getAccommodationCategory(category)

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: subtle ? '4px 9px' : '5px 11px',
      borderRadius: 999,
      background: subtle ? 'rgba(246,250,253,0.94)' : '#F6FAFD',
      border: '1px solid #D9E3EC',
      color: '#0A1931',
      fontSize: subtle ? 10 : 11,
      fontWeight: 750,
      letterSpacing: '-0.01em',
      boxShadow: subtle ? '0 6px 18px rgba(10,25,49,0.08)' : 'none',
      whiteSpace: 'nowrap',
    }}>
      <span aria-hidden="true">{item.emoji}</span>
      {item.label}
    </span>
  )
}

export function CategorySelector({
  selected,
  onSelect,
  counts,
}: {
  selected: AccommodationCategory
  onSelect: (category: AccommodationCategory) => void
  counts: Record<AccommodationCategory, number>
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, gap: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: '#4A7FA7', margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 800 }}>Accommodation type</p>
          <h2 style={{ fontSize: 18, fontWeight: 850, color: '#0A1931', margin: 0, letterSpacing: '-0.03em' }}>What are you looking for?</h2>
        </div>
        <p style={{ fontSize: 12, color: '#6B7FA3', margin: 0 }}>Choose one category to personalize recommendations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
        {accommodationCategories.map(category => {
          const active = selected === category.key
          return (
            <button
              key={category.key}
              onClick={() => onSelect(category.key)}
              style={{
                textAlign: 'left',
                background: active ? 'linear-gradient(135deg, #0A1931 0%, #1A3D63 100%)' : '#FFFFFF',
                border: `1px solid ${active ? '#0A1931' : '#D9E3EC'}`,
                borderRadius: 20,
                padding: 18,
                cursor: 'pointer',
                boxShadow: active ? '0 18px 38px rgba(10,25,49,0.18)' : '0 6px 20px rgba(10,25,49,0.06)',
                transform: active ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.22s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: active ? 'radial-gradient(circle at 85% 10%, rgba(255,255,255,0.16), transparent 34%)' : 'radial-gradient(circle at 85% 10%, rgba(74,127,167,0.12), transparent 32%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: active ? 'rgba(255,255,255,0.13)' : '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {category.emoji}
                </div>
                {active && (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} color="#0A1931" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div style={{ position: 'relative', marginTop: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 850, color: active ? '#FFFFFF' : '#0A1931', margin: '0 0 5px', letterSpacing: '-0.02em' }}>{category.title}</h3>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: active ? '#B3CFE5' : '#6B7FA3', margin: '0 0 14px' }}>{category.description}</p>
                <span style={{ display: 'inline-flex', padding: '5px 10px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.12)' : '#F6FAFD', color: active ? '#FFFFFF' : '#4A7FA7', fontSize: 11, fontWeight: 750, border: `1px solid ${active ? 'rgba(255,255,255,0.18)' : '#D9E3EC'}` }}>
                  {counts[category.key] ?? 0} available PGs
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CategoryChips({
  selected,
  onSelect,
  includeAll = true,
}: {
  selected: AccommodationCategory | ''
  onSelect: (category: AccommodationCategory | '') => void
  includeAll?: boolean
}) {
  const options = includeAll ? [{ key: '' as const, label: 'All Stays', emoji: '✨' }, ...accommodationCategories] : accommodationCategories

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(option => {
        const active = selected === option.key
        return (
          <button
            key={option.key || 'all'}
            onClick={() => onSelect(active ? '' : option.key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 999,
              border: `1px solid ${active ? '#0A1931' : '#D9E3EC'}`,
              background: active ? '#0A1931' : '#FFFFFF',
              color: active ? '#FFFFFF' : '#0A1931',
              fontSize: 12,
              fontWeight: 750,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: active ? '0 8px 18px rgba(10,25,49,0.14)' : 'none',
            }}
          >
            <span aria-hidden="true">{option.emoji}</span>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
