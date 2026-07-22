import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #D9E3EC', borderRadius: 8, padding: '7px 12px', minWidth: 220 }}>
      <Search size={13} color="#6B7FA3" strokeWidth={1.5} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ border: 'none', outline: 'none', fontSize: 12, color: '#0A1931', background: 'transparent', width: '100%' }} />
    </div>
  )
}
