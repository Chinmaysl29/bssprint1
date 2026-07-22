import { useState } from 'react'
import { Eye, ArrowUpCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import { complaints as initialComplaints } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import SearchInput from '../components/ui/SearchInput'
import StatCard from '../components/ui/StatCard'
import { Table, Th, Td, Tr } from '../components/ui/Table'

type Complaint = typeof initialComplaints[0]

function ComplaintDetailModal({ c, onClose, onUpdate }: {
  c: Complaint; onClose: () => void; onUpdate: (id: string, status: string, note: string) => void
}) {
  const [note, setNote] = useState(c.adminNote)

  return (
    <Modal open onClose={onClose} title={`Complaint ${c.id}`} width={600}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 12, background: '#F6FAFD', borderRadius: 12, padding: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Badge status={c.status} />
              <Badge status={c.priority} />
              <span style={{ fontSize: 11, color: '#6B7FA3', background: '#EDF4FB', padding: '2px 8px', borderRadius: 6 }}>{c.category}</span>
            </div>
            <p style={{ fontSize: 14, color: '#0A1931', fontWeight: 600, margin: '0 0 4px' }}>{c.description}</p>
            <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>Raised on {c.raisedDate}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Resident', c.resident], ['Property', c.property], ['Owner', c.owner], ['Complaint ID', c.id]].map(([k, v]) => (
            <div key={k} style={{ background: '#F6FAFD', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#6B7FA3', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Note</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add admin observation or action taken..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #E8EEF5' }}>
          <Button variant="secondary" icon={ArrowUpCircle} size="sm" onClick={() => { onUpdate(c.id, 'in_progress', note); onClose() }}>Escalate</Button>
          <Button variant="secondary" icon={CheckCircle} size="sm" onClick={() => { onUpdate(c.id, 'resolved', note); onClose() }}>Mark Resolved</Button>
          <Button variant="danger" size="sm" onClick={() => { onUpdate(c.id, 'closed', note); onClose() }}>Force Close</Button>
          <Button size="sm" onClick={() => { onUpdate(c.id, c.status, note); onClose() }}>Save Note</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(initialComplaints)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selected, setSelected] = useState<Complaint | null>(null)

  const handleUpdate = (id: string, status: string, note: string) => {
    setComplaints(c => c.map(x => x.id === id ? { ...x, status, adminNote: note } : x))
  }

  const filtered = complaints.filter(c => {
    const ms = c.resident.toLowerCase().includes(search.toLowerCase()) ||
      c.property.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    const mst = statusFilter === 'all' || c.status === statusFilter
    const mp = priorityFilter === 'all' || c.priority === priorityFilter
    return ms && mst && mp
  })

  return (
    <div>
      <PageHeader title="Complaints Monitor" subtitle="Platform-wide complaint management" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard title="Open" value={complaints.filter(c => c.status === 'open').length} icon={AlertTriangle} accent="#DC2626" />
        <StatCard title="In Progress" value={complaints.filter(c => c.status === 'in_progress').length} icon={ArrowUpCircle} accent="#D97706" />
        <StatCard title="Resolved" value={complaints.filter(c => c.status === 'resolved').length} icon={CheckCircle} accent="#1D4ED8" />
        <StatCard title="Critical" value={complaints.filter(c => c.priority === 'critical').length} icon={AlertTriangle} accent="#DC2626" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search complaints..." />
        <StatusPills value={statusFilter} onChange={setStatusFilter} options={['all', 'open', 'in_progress', 'resolved', 'closed']} />
        <StatusPills value={priorityFilter} onChange={setPriorityFilter} options={['all', 'critical', 'high', 'medium', 'low']} />
        <span style={{ fontSize: 11, color: '#6B7FA3', marginLeft: 'auto' }}>{filtered.length} complaints</span>
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              {['ID', 'Property', 'Resident', 'Owner', 'Category', 'Priority', 'Status', 'Raised', 'Admin Note', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <Tr key={c.id}>
                <Td><span style={{ fontSize: 11, fontWeight: 700, color: '#0A1931', fontFamily: 'monospace', background: '#F6FAFD', padding: '2px 6px', borderRadius: 4 }}>{c.id}</span></Td>
                <Td><p style={{ fontSize: 11, fontWeight: 600, color: '#0A1931', margin: 0 }}>{c.property}</p></Td>
                <Td><span style={{ fontSize: 11, color: '#4A7FA7', fontWeight: 500 }}>{c.resident}</span></Td>
                <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{c.owner}</span></Td>
                <Td><span style={{ fontSize: 10, background: '#EDF4FB', color: '#1A3D63', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{c.category}</span></Td>
                <Td><Badge status={c.priority} size="xs" /></Td>
                <Td><Badge status={c.status} size="xs" /></Td>
                <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{c.raisedDate}</span></Td>
                <Td>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: 0, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.adminNote || <span style={{ color: '#B3CFE5', fontStyle: 'italic' }}>No note</span>}
                  </p>
                </Td>
                <Td>
                  <button onClick={() => setSelected(c)} style={{ padding: '5px 10px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#1A3D63', fontWeight: 600 }}>
                    <Eye size={12} /> View
                  </button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {selected && <ComplaintDetailModal c={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
    </div>
  )
}

function StatusPills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 3, background: '#fff', padding: 3, borderRadius: 8, border: '1px solid #E8EEF5' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: '4px 11px', borderRadius: 6, fontSize: 10, fontWeight: 500, cursor: 'pointer', border: 'none', background: value === o ? '#0A1931' : 'transparent', color: value === o ? '#fff' : '#6B7FA3', whiteSpace: 'nowrap' }}>
          {o.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </button>
      ))}
    </div>
  )
}
