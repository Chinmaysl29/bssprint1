'use client'
import { Search } from 'lucide-react'

export default function SearchBar({ placeholder = 'Search...', value, onChange }: {
  placeholder?: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #D9E3EC', borderRadius: 10, padding: '9px 14px', minWidth: 260 }}>
      <Search size={15} color="#6B7FA3" strokeWidth={1.5} />
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0A1931', background: 'transparent', width: '100%' }}
      />
    </div>
  )
}
