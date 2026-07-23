import { useState } from 'react'
import { FileText, CheckCircle, XCircle, Clock, Eye, RefreshCw } from 'lucide-react'
import { documents as initialDocs } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Table, Th, Td, Tr } from '../components/ui/Table'
import SearchInput from '../components/ui/SearchInput'
import StatCard from '../components/ui/StatCard'

type Doc = typeof initialDocs[0]

function ReviewModal({ doc, onClose, onAction }: { doc: Doc; onClose: () => void; onAction: (id: string, action: 'approved' | 'rejected', note: string) => void }) {
  const [note, setNote] = useState(doc.note)
  return (
    <Modal open onClose={onClose} title="Document Review" width={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Doc preview placeholder */}
        <div style={{ height: 200, background: 'linear-gradient(135deg, #EDF4FB, #B3CFE5)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #D9E3EC', gap: 10 }}>
          <FileText size={36} color="#4A7FA7" strokeWidth={1} />
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1A3D63', margin: 0 }}>{doc.fileName}</p>
          <p style={{ fontSize: 11, color: '#6B7FA3', margin: 0 }}>Document Preview Placeholder</p>
        </div>

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[['Owner', doc.owner], ['Document Type', doc.type], ['Uploaded', doc.uploadDate], ['Current Status', doc.status]].map(([k, v]) => (
            <div key={k} style={{ background: '#F6FAFD', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 10, color: '#6B7FA3', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{k === 'Current Status' ? <Badge status={v} size="xs" /> : v}</p>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7FA3', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Note (required for rejection)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Enter reason if rejecting..."
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #E8EEF5' }}>
          <Button variant="secondary" icon={RefreshCw} onClick={() => { onAction(doc.id, 'rejected', 'Please re-upload'); onClose() }}>Request Re-upload</Button>
          <Button variant="danger" icon={XCircle} onClick={() => { if (!note) return alert('Note required for rejection'); onAction(doc.id, 'rejected', note); onClose() }}>Reject</Button>
          <Button variant="success" icon={CheckCircle} onClick={() => { onAction(doc.id, 'approved', ''); onClose() }}>Approve</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function DocumentVerificationPage() {
  const [docs, setDocs] = useState(initialDocs)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('pending')
  const [reviewDoc, setReviewDoc] = useState<Doc | null>(null)

  const handleAction = (id: string, action: 'approved' | 'rejected', note: string) => {
    setDocs(d => d.map(x => x.id === id ? { ...x, status: action, reviewedBy: 'Super Admin', reviewDate: new Date().toISOString().split('T')[0], note } : x))
  }

  const filtered = docs.filter(d => {
    const ms = d.owner.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase())
    const mt = tab === 'all' || d.status === tab
    return ms && mt
  })

  const pending = docs.filter(d => d.status === 'pending').length
  const approved = docs.filter(d => d.status === 'approved').length
  const rejected = docs.filter(d => d.status === 'rejected').length

  return (
    <div>
      <PageHeader title="Document Verification" subtitle="Review and approve KYC & business documents" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard title="Pending Review" value={pending} icon={Clock} accent="#D97706" />
        <StatCard title="Approved" value={approved} icon={CheckCircle} accent="#1D4ED8" />
        <StatCard title="Rejected" value={rejected} icon={XCircle} accent="#DC2626" />
      </div>

      {/* Tabs + Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        <TabPills value={tab} onChange={setTab} options={['pending', 'approved', 'rejected', 'all']} />
        <SearchInput value={search} onChange={setSearch} placeholder="Search owner or document type..." />
      </div>

      <Card>
        <Table>
          <thead>
            <tr>
              {['Document', 'Owner', 'Type', 'Uploaded', 'Status', 'Reviewed By', 'Review Date', 'Actions'].map(h => <Th key={h}>{h}</Th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <Tr key={d.id}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={14} color="#4A7FA7" />
                    </div>
                    <p style={{ fontSize: 11, color: '#0A1931', fontWeight: 600, margin: 0, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.fileName}</p>
                  </div>
                </Td>
                <Td><span style={{ fontSize: 12, fontWeight: 600, color: '#0A1931' }}>{d.owner}</span></Td>
                <Td><span style={{ fontSize: 11, color: '#4A7FA7', fontWeight: 500 }}>{d.type}</span></Td>
                <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{d.uploadDate}</span></Td>
                <Td><Badge status={d.status} /></Td>
                <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{d.reviewedBy ?? '—'}</span></Td>
                <Td><span style={{ fontSize: 11, color: '#6B7FA3' }}>{d.reviewDate ?? '—'}</span></Td>
                <Td>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button onClick={() => setReviewDoc(d)} style={{ padding: '5px 10px', background: '#F6FAFD', border: '1px solid #E8EEF5', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#1A3D63', fontWeight: 600 }}>
                      <Eye size={12} /> Review
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {reviewDoc && <ReviewModal doc={reviewDoc} onClose={() => setReviewDoc(null)} onAction={handleAction} />}
    </div>
  )
}

function TabPills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#fff', padding: 3, borderRadius: 8, border: '1px solid #E8EEF5' }}>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{
          padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', border: 'none',
          background: value === o ? '#0A1931' : 'transparent', color: value === o ? '#fff' : '#6B7FA3',
        }}>{o.charAt(0).toUpperCase() + o.slice(1)}</button>
      ))}
    </div>
  )
}
