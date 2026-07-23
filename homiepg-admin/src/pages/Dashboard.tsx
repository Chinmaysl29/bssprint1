import { Users, Building2, BedDouble, UserCheck, IndianRupee, Clock, AlertTriangle, FileCheck, CalendarCheck } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts'
import StatCard from '../components/ui/StatCard'
import Card, { CardHeader } from '../components/ui/Card'
import { owners, properties, residents, complaints, revenueData, growthData, occupancyData, activityFeed } from '../data/seedData'

const activityIcons: Record<string, React.ReactNode> = {
  new_owner:    <Users size={14} color="#1D4ED8" />,
  new_property: <Building2 size={14} color="#1D4ED8" />,
  complaint:    <AlertTriangle size={14} color="#DC2626" />,
  document:     <FileCheck size={14} color="#D97706" />,
  booking:      <CalendarCheck size={14} color="#1D4ED8" />,
  property:     <Building2 size={14} color="#DC2626" />,
}
const activityBg: Record<string, string> = {
  new_owner: '#EFF6FF', new_property: '#EFF6FF', complaint: '#FEF2F2',
  document: '#FFFBEB', booking: '#EFF6FF', property: '#FEF2F2',
}

export default function Dashboard() {
  const totalBeds = properties.filter(p => p.status === 'live').reduce((a, p) => a + p.beds, 0)
  const totalOccupied = properties.filter(p => p.status === 'live').reduce((a, p) => a + p.occupied, 0)
  const totalRevenue = revenueData.reduce((a, r) => a + r.commission, 0)
  const openComplaints = complaints.filter(c => c.status === 'open').length

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0A1931', margin: 0 }}>Platform Overview</h1>
        <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0' }}>Real-time HomiePG ecosystem dashboard</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard title="PG Owners" value={owners.length} sub={`${owners.filter(o => o.status === 'active').length} active`} icon={Users} accent="#0A1931" trend={{ value: 12, label: 'this month' }} />
        <StatCard title="Live Properties" value={properties.filter(p => p.status === 'live').length} sub={`${properties.filter(p => p.status === 'pending').length} pending`} icon={Building2} accent="#1A3D63" />
        <StatCard title="Total Beds" value={totalBeds} sub={`${totalOccupied} occupied`} icon={BedDouble} accent="#4A7FA7" />
        <StatCard title="Total Residents" value={residents.length} sub="Active residents" icon={UserCheck} accent="#0A1931" trend={{ value: 8, label: 'this month' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard title="Platform Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="Total commission earned" icon={IndianRupee} accent="#0A1931" trend={{ value: 14, label: 'vs last period' }} />
        <StatCard title="Pending Approvals" value={properties.filter(p => p.status === 'pending').length} sub="Properties awaiting review" icon={Clock} accent="#D97706" />
        <StatCard title="Pending Documents" value={3} sub="KYC docs to verify" icon={FileCheck} accent="#D97706" />
        <StatCard title="Open Complaints" value={openComplaints} sub={`${complaints.filter(c => c.priority === 'critical').length} critical`} icon={AlertTriangle} accent="#DC2626" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, marginBottom: 18 }}>
        <Card>
          <CardHeader title="Monthly Revenue & Commission" subtitle="Platform earnings overview" />
          <div style={{ padding: '16px 16px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A1931" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A1931" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A7FA7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4A7FA7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${Number(v) / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="totalRent" name="Total Rent" stroke="#0A1931" strokeWidth={2} fill="url(#gr)" />
                <Area type="monotone" dataKey="commission" name="Commission" stroke="#4A7FA7" strokeWidth={2} fill="url(#gc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Occupancy Rate" subtitle="Platform-wide monthly %" />
          <div style={{ padding: '16px 16px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={occupancyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Bar dataKey="occupancy" fill="#0A1931" radius={[5, 5, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
        <Card>
          <CardHeader title="Platform Growth" subtitle="New owners, customers & bookings" />
          <div style={{ padding: '16px 16px 4px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={growthData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="customers" name="Customers" stroke="#0A1931" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#4A7FA7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="owners" name="Owners" stroke="#B3CFE5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent Activity" subtitle="Platform-wide events" />
          <div style={{ padding: '8px 0' }}>
            {activityFeed.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', gap: 10, padding: '10px 18px', borderBottom: i < activityFeed.length - 1 ? '1px solid #F6FAFD' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: activityBg[a.type] || '#F6FAFD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {activityIcons[a.type]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: '#0A1931', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{a.message}</p>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: '3px 0 0' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
