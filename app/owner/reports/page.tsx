'use client'
import { useState } from 'react'
import { Download, TrendingUp, Users, BedDouble, IndianRupee } from 'lucide-react'
import { revenueData, occupancyData } from '../data/dummy'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import PageHeader from '../components/PageHeader'
import Button from '../components/Button'
import StatCard from '../components/StatCard'

const profitData = revenueData.map(r => ({ ...r, profitMargin: Math.round((r.profit / r.revenue) * 100) }))

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('revenue')
  const tabs = ['revenue', 'occupancy', 'profit', 'vacancy']

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive performance overview"
        actions={<Button variant="secondary" icon={Download}>Export Report</Button>}
      />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard title="Avg Occupancy" value="87%" icon={BedDouble} accent="#1A3D63" trend={{ value: 3.2, label: 'vs last quarter' }} />
        <StatCard title="Total Revenue" value="₹9.15L" icon={IndianRupee} accent="#1A3D63" trend={{ value: 8.5, label: 'vs last quarter' }} />
        <StatCard title="Total Expenses" value="₹4.37L" icon={TrendingUp} accent="#4A7FA7" />
        <StatCard title="Net Profit" value="₹4.78L" icon={IndianRupee} accent="#1A3D63" trend={{ value: 12.3, label: 'vs last quarter' }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', padding: 4, borderRadius: 10, border: '1px solid #E8EEF5', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
            background: activeTab === t ? '#1A3D63' : 'transparent',
            color: activeTab === t ? '#fff' : '#6B7FA3',
          }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Revenue vs Expenses */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E8EEF5', gridColumn: '1 / -1' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Revenue vs Expenses vs Profit</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A3D63" stopOpacity={0.12} /><stop offset="95%" stopColor="#1A3D63" stopOpacity={0} /></linearGradient>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4A7FA7" stopOpacity={0.12} /><stop offset="95%" stopColor="#4A7FA7" stopOpacity={0} /></linearGradient>
                <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6B7FA3" stopOpacity={0.12} /><stop offset="95%" stopColor="#6B7FA3" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 10, border: '1px solid #E8EEF5' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1A3D63" strokeWidth={2} fill="url(#gr)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#4A7FA7" strokeWidth={2} fill="url(#ge)" />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#6B7FA3" strokeWidth={2} fill="url(#gp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Trend */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E8EEF5' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Occupancy Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={occupancyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8EEF5' }} />
              <Bar dataKey="occupancy" fill="#1A3D63" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Buildings Comparison */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid #E8EEF5' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: '0 0 20px' }}>Buildings Comparison</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { name: 'Sunrise PG', occupancy: 80, revenue: 58000 },
              { name: 'Green Valley', occupancy: 75, revenue: 41000 },
              { name: 'Blue Ridge', occupancy: 87, revenue: 68000 },
            ]} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E8EEF5' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="occupancy" name="Occupancy %" fill="#1A3D63" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="revenue" name="Revenue" fill="#4A7FA7" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
