'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { revenueData } from '../data/dummy'

export default function RevenueChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '24px', border: '1px solid #E8EEF5', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>Revenue vs Expenses</p>
        <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0' }}>Monthly overview for 2024</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1A3D63" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1A3D63" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A7FA7" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4A7FA7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
          <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 10, border: '1px solid #E8EEF5', boxShadow: '0 4px 12px rgba(10,25,49,0.08)' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1A3D63" strokeWidth={2} fill="url(#rev)" />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#4A7FA7" strokeWidth={2} fill="url(#exp)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
