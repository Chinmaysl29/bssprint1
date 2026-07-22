import { Download } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'
import { revenueData, growthData, occupancyData, cityOccupancy, properties } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'

const COLORS = ['#0A1931', '#1A3D63', '#4A7FA7', '#B3CFE5']

const vacancyData = properties.filter(p => p.status === 'live').map(p => ({
  name: p.name.replace(' PG', ''),
  occupancy: Math.round((p.occupied / p.beds) * 100),
  vacant: p.beds - p.occupied,
  beds: p.beds,
}))

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Platform-wide performance and trends"
        actions={<Button variant="secondary" icon={Download} size="sm">Export Report</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <Card>
          <CardHeader title="Occupancy Trend" subtitle="Platform-wide monthly occupancy %" />
          <div style={{ padding: '14px 14px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={occupancyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A1931" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A1931" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Area type="monotone" dataKey="occupancy" name="Occupancy" stroke="#0A1931" strokeWidth={2.5} fill="url(#occ)" dot={{ fill: '#0A1931', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Revenue & P&L" subtitle="Monthly revenue vs commission" />
          <div style={{ padding: '14px 14px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${Number(v) / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="totalRent" name="Revenue" fill="#0A1931" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="commission" name="Commission" fill="#4A7FA7" radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        <Card>
          <CardHeader title="Platform Growth" subtitle="New registrations & bookings" />
          <div style={{ padding: '14px 14px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="customers" name="New Customers" stroke="#0A1931" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#4A7FA7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="owners" name="New Owners" stroke="#B3CFE5" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Vacancy by Property" subtitle="Occupancy % per live property" />
          <div style={{ padding: '14px 14px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vacancyData} layout="vertical" margin={{ top: 4, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Bar dataKey="occupancy" fill="#0A1931" radius={[0, 5, 5, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card>
          <CardHeader title="City-wise Distribution" subtitle="Beds and occupancy by city" />
          <div style={{ padding: '14px 14px 4px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={cityOccupancy} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="city" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="beds" name="Total Beds" fill="#0A1931" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="occupied" name="Occupied" fill="#4A7FA7" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Property Status Mix" />
          <div style={{ padding: '14px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Live', value: properties.filter(p => p.status === 'live').length },
                    { name: 'Pending', value: properties.filter(p => p.status === 'pending').length },
                    { name: 'Rejected', value: properties.filter(p => p.status === 'rejected').length },
                    { name: 'Suspended', value: properties.filter(p => p.status === 'suspended').length },
                  ]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value"
                >
                  {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
