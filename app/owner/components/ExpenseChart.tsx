'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { expenseCategoryData } from '../data/dummy'

const COLORS = ['#1A3D63', '#4A7FA7', '#B3CFE5', '#6B7FA3', '#0A1931', '#D9E3EC']

export default function ExpenseChart() {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '24px', border: '1px solid #E8EEF5', boxShadow: '0 1px 4px rgba(10,25,49,0.06)' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#0A1931', margin: 0 }}>Expense Distribution</p>
        <p style={{ fontSize: 12, color: '#6B7FA3', margin: '4px 0 0' }}>By category this month</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={expenseCategoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {expenseCategoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 10, border: '1px solid #E8EEF5' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
