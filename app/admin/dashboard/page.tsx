'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

type User = {
  id: string
  name: string
  email: string
  role: string
  status: string
  created_at: string
}

type Owner = {
  id: string
  user_id: string
  business_name: string
  verified: boolean
}

export default function AdminDashboard() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchOwners() {
    const { data, error } = await supabase.from('owners').select('*')
    if (!error && data) setOwners(data)
  }

  async function fetchPendingUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending')
    if (!error && data) setPendingUsers(data)
  }

  async function approveUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({ status: 'approved' })
      .eq('id', userId)
    if (!error) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
    }
  }

  useEffect(() => {
    async function load() {
      await Promise.all([fetchOwners(), fetchPendingUsers()])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      {/* Pending Approvals */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Pending Approvals ({pendingUsers.length})</h2>
        {pendingUsers.length === 0 ? (
          <p>No pending users.</p>
        ) : (
          <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => approveUser(user.id)}>Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* All Owners */}
      <section>
        <h2>All Owners ({owners.length})</h2>
        {owners.length === 0 ? (
          <p>No owners registered yet.</p>
        ) : (
          <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.business_name}</td>
                  <td>{owner.verified ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
