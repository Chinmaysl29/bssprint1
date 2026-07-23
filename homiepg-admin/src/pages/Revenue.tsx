import { useState } from 'react'
import { Download, IndianRupee, TrendingUp, Users, Building2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { revenueData, owners, properties } from '../data/seedData'
import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import Card, { CardHeader } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Table, Th, Td, Tr } from '../components/ui/Table'

const totalRevenue = revenueData.reduce((a, r) => a + r.totalRent, 0)
const totalCommission = revenueData.reduce((a, r) => a + r.commission, 0)
const totalPayout = revenueData.reduce((a, r) => a + r.ownerPayout, 0)
const totalBookings = revenueData.reduce((a, r) => a + r.bookings, 0)

export default function RevenuePage() {
  const [dateRange, setDateRange] = useState('6m')

  const perOwner = owners.map(o => ({
    ...o,
    commission: Math.round(o.revenue * 0.02),
    payout: Math.round(o.revenue * 0.98),
    propCount: properties.filter(p => p.ownerId === o.id && p.status === 'live').length,
  }))

  return (
    <div>
      <PageHeader
        title="Revenue & Financial Tracking"
        subtitle="Platform commission and owner payout summary"
        actions={<Button variant="secondary" icon={Download} size="sm">Export CSV</Button>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard title="Total Rent Collected" value={`₹${(totalRevenue / 100000).toFixed(1)}L`} icon={IndianRupee} accent="#0A1931" trend={{ value: 14, label: 'vs last period' }} />
        <StatCard title="Platform Commission (2%)" value={`₹${totalCommission.toLocaleString()}`} icon={TrendingUp} accent="#1A3D63" />
        <StatCard title="Owner Payouts" value={`₹${(totalPayout / 100000).toFixed(1)}L`} icon={Users} accent="#4A7FA7" />
        <StatCard title="Total Bookings" value={totalBookings} icon={Building2} accent="#0A1931" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <CardHeader
            title="Monthly Revenue Breakdown"
            subtitle="Rent collected vs commission vs payouts"
            actions={
              <div style={{ display: 'flex', gap: 3 }}>
                {['3m', '6m'].map(r => (
                  <button key={r} onClick={() => setDateRange(r)} style={{ padding: '3px 10px', borderRadius: 5, fontSize: 10, fontWeight: 500, cursor: 'pointer', border: '1px solid', borderColor: dateRange === r ? '#0A1931' : '#D9E3EC', background: dateRange === r ? '#0A1931' : '#fff', color: dateRange === r ? '#fff' : '#6B7FA3' }}>{r}</button>
                ))}
              </div>
            }
          />
          <div style={{ padding: '14px 14px 4px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${Number(v) / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8EEF5', fontSize: 11 }} />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="totalRent" name="Total Rent" fill="#0A1931" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="commission" name="Commission" fill="#4A7FA7" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="ownerPayout" name="Payout" fill="#B3CFE5" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Commission by Owner" />
          <div style={{ padding: '8px 0' }}>
            {perOwner.filter(o => o.revenue > 0).map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid #F6FAFD' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0A1931', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B3CFE5', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                  {o.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#0A1931', margin: 0 }}>{o.name}</p>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>{o.propCount} properties · ₹{o.revenue.toLocaleString()} revenue</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0A1931', margin: 0 }}>₹{o.commission.toLocaleString()}</p>
                  <p style={{ fontSize: 10, color: '#6B7FA3', margin: '2px 0 0' }}>commission</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Monthly Revenue Detail" actions={<Button variant="secondary" icon={Download} size="xs">Export</Button>} />
        <Table>
          <thead>
            <tr>{['Month', 'Bookings', 'Total Rent', 'Platform Commission (2%)', 'Owner Payouts', 'Net P&L'].map(h => <Th key={h}>{h}</Th>)}</tr>
          </thead>
          <tbody>
            {revenueData.map(r => (
              <Tr key={r.month}>
                <Td><span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>{r.month} 2024</span></Td>
                <Td><span style={{ fontSize: 13, fontWeight: 600, color: '#0A1931' }}>{r.bookings}</span></Td>
                <Td><span style={{ fontSize: 12, color: '#0A1931' }}>₹{r.totalRent.toLocaleString()}</span></Td>
                <Td><span style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8' }}>₹{r.commission.toLocaleString()}</span></Td>
                <Td><span style={{ fontSize: 12, color: '#6B7FA3' }}>₹{r.ownerPayout.toLocaleString()}</span></Td>
                <Td><span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>₹{r.commission.toLocaleString()}</span></Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <div style={{ padding: '12px 18px', borderTop: '1px solid #E8EEF5', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0A1931' }}>Total</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0A1931' }}>₹{totalCommission.toLocaleString()} commission</span>
        </div>
      </Card>
    </div>
  )
}
