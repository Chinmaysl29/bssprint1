import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Owners from './pages/Owners'
import DocumentVerification from './pages/DocumentVerification'
import PropertyApproval from './pages/PropertyApproval'
import Users from './pages/Users'
import Complaints from './pages/Complaints'
import Revenue from './pages/Revenue'
import Analytics from './pages/Analytics'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) return <Login />

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/documents" element={<DocumentVerification />} />
          <Route path="/properties" element={<PropertyApproval />} />
          <Route path="/users" element={<Users />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
