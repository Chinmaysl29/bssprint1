'use client'
import { useState } from 'react'
import { Plus, Phone, ChefHat, Sparkles, Shield, User, Crown, Users } from 'lucide-react'
import { employees } from '../data/dummy'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'

const roleIcons: Record<string, any> = {
  Cook: ChefHat, Cleaner: Sparkles, Security: Shield, Receptionist: User, Manager: Crown,
}
const roleColors: Record<string, string> = {
  Cook: '#FEF9C3', Cleaner: '#EFF6FF', Security: '#FEF2F2', Receptionist: '#F0FDF4', Manager: '#F5F3FF',
}

export default function EmployeesPage() {
  const [modal, setModal] = useState(false)
  const totalSalary = employees.reduce((a, e) => a + e.salary, 0)

  return (
    <div>
      <PageHeader
        title="Employee Management"
        subtitle={`${employees.length} staff members`}
        actions={<Button icon={Plus} onClick={() => setModal(true)}>Add Employee</Button>}
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        <div style={{ background: '#0A1931', borderRadius: 14, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, color: '#B3CFE5', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Staff</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: 0 }}>{employees.length}</p>
          </div>
          <Users size={28} color="#4A7FA7" strokeWidth={1.5} />
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, color: '#6B7FA3', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Salaries</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#0A1931', margin: 0 }}>₹{totalSalary.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 11, color: '#6B7FA3', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Attendance</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#0A1931', margin: 0 }}>
              {Math.round(employees.reduce((a, e) => a + e.attendance, 0) / employees.length)}/30
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {employees.map(e => {
          const Icon = roleIcons[e.role] || User
          const attendancePct = Math.round((e.attendance / 30) * 100)
          return (
            <div key={e.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8EEF5', padding: 24, boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1A3D63', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 16, fontWeight: 700 }}>{e.avatar}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>{e.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: roleColors[e.role] || '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={12} color="#1A3D63" strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: 12, color: '#4A7FA7', fontWeight: 500 }}>{e.role}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={13} color="#6B7FA3" strokeWidth={1.5} />
                  <span style={{ fontSize: 12, color: '#6B7FA3' }}>{e.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#6B7FA3' }}>Monthly Salary</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0A1931' }}>₹{e.salary.toLocaleString()}</span>
                </div>

                {/* Attendance */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: '#6B7FA3' }}>Attendance</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#0A1931' }}>{e.attendance}/30</span>
                  </div>
                  <div style={{ height: 5, background: '#E8EEF5', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${attendancePct}%`, background: '#1A3D63', borderRadius: 4 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <StatusBadge status={e.status} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Employee">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[{ l: 'Full Name', p: 'Ramesh Kumar' }, { l: 'Phone', p: '9876500000' }].map(f => (
            <div key={f.l}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>{f.l}</label>
              <input placeholder={f.p} style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Role</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none' }}>
              {Object.keys(roleIcons).map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', display: 'block', marginBottom: 6 }}>Monthly Salary (₹)</label>
            <input type="number" placeholder="15000" style={{ width: '100%', padding: '10px 12px', border: '1px solid #D9E3EC', borderRadius: 9, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={() => setModal(false)}>Save Employee</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
