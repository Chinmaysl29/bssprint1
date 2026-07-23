import type { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        {children}
      </table>
    </div>
  )
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#6B7FA3', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E8EEF5', whiteSpace: 'nowrap', background: '#F6FAFD' }}>
      {children}
    </th>
  )
}

export function Td({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: '12px 16px', borderBottom: '1px solid #F6FAFD', verticalAlign: 'middle', ...style }}>
      {children}
    </td>
  )
}

export function Tr({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.background = '#F6FAFD' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
    >
      {children}
    </tr>
  )
}
