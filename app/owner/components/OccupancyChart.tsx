'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { occupancyData } from '../data/dummy'

export default function OccupancyChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '24px', border: '1px solid #E8EEF5', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>Occupancy Rate</p>
        <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0' }}>Monthly occupancy %</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={occupancyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF5" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6B7FA3' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
          <Tooltip formatter={(v) => [`${Number(v)}%`, 'Occupancy']} contentStyle={{ borderRadius: 10, border: '1px solid #E8EEF5' }} />
          <Bar dataKey="occupancy" fill="#1A3D63" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
