# HomiePG Admin Panel - Complete Implementation Specification

## Project Overview
**Standalone React Admin Panel for HomiePG Platform**
- Port: 3001 (independent from customer/owner app)
- Tech: Vite + React + TypeScript + Tailwind CSS + Zustand + React Router + Recharts
- Purpose: Super Administrator control panel for platform governance

---

## ✅ ALREADY SCAFFOLDED
```
homiepg-admin/
├── Dependencies installed:
│   ├── tailwindcss @tailwindcss/vite
│   ├── lucide-react recharts
│   ├── react-router-dom zustand
├── Ready for development: npm run dev
```

---

## 📁 FOLDER STRUCTURE TO CREATE

```
homiepg-admin/src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   └── charts/
│       ├── RevenueChart.tsx
│       ├── GrowthChart.tsx
│       └── OccupancyChart.tsx
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Owners.tsx
│   ├── OwnerDetail.tsx
│   ├── DocumentVerification.tsx
│   ├── PropertyApproval.tsx
│   ├── PropertyDetail.tsx
│   ├── Users.tsx
│   ├── Complaints.tsx
│   ├── Revenue.tsx
│   ├── Analytics.tsx
│   ├── Notifications.tsx
│   └── Settings.tsx
├── store/
│   ├── authStore.ts
│   └── dataStore.ts
├── api/
│   └── mockApi.ts
├── data/
│   └── seedData.ts
├── types/
│   └── index.ts
├── utils/
│   ├── auth.ts
│   └── format.ts
├── App.tsx
└── main.tsx
```

---

## 🎨 TAILWIND CONFIGURATION

**tailwind.config.js:**
```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A1931',
        secondary: '#1A3D63',
        accent: '#4A7FA7',
        softBlue: '#B3CFE5',
        background: '#F6FAFD',
      },
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background font-sans text-primary;
  }
}
```

---

## 🔐 AUTH & ROUTING

**src/store/authStore.ts:**
```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: { email: string; name: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: async (email, password) => {
        // Mock login - accepts admin@homiepg.com / admin123
        if (email === 'admin@homiepg.com' && password === 'admin123') {
          const mockToken = 'mock-jwt-token-' + Date.now()
          set({
            isAuthenticated: true,
            token: mockToken,
            user: { email, name: 'Super Administrator' },
          })
          return true
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

**src/App.tsx:**
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
// ... import other pages

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/owners" element={<Owners />} />
          <Route path="/owners/:id" element={<OwnerDetail />} />
          <Route path="/documents" element={<DocumentVerification />} />
          <Route path="/properties" element={<PropertyApproval />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
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
```

---

## 📊 SEED DATA STRUCTURE

**src/data/seedData.ts** - Create mock data for:

```ts
export const owners = [
  {
    id: '1',
    name: 'Ravi Kumar',
    email: 'ravi@email.com',
    phone: '9876543200',
    joinDate: '2024-01-15',
    status: 'active', // active | suspended | pending
    verification: 'verified', // verified | pending | rejected
    properties: 3,
    totalBeds: 72,
    totalRevenue: 456000,
  },
  // ... 4 more owners
]

export const properties = [
  {
    id: '1',
    name: 'Sunrise PG',
    ownerId: '1',
    ownerName: 'Ravi Kumar',
    address: '12, MG Road, Koramangala, Bangalore',
    city: 'Bangalore',
    status: 'live', // pending | approved | rejected | live | suspended
    submittedDate: '2024-02-01',
    approvedDate: '2024-02-05',
    buildings: 2,
    rooms: 24,
    beds: 72,
    occupied: 58,
    rent: 8000,
    images: ['url1', 'url2'],
    amenities: ['WiFi', 'Food', 'Parking', 'Laundry'],
  },
  // ... 7 more properties
]

export const residents = [
  {
    id: '1',
    name: 'Arjun Mehta',
    email: 'arjun@email.com',
    phone: '9876543210',
    property: 'Sunrise PG',
    room: '101',
    bed: 'Bed A',
    checkIn: '2024-03-01',
    rent: 8000,
    deposit: 16000,
    kycStatus: 'verified', // verified | pending | rejected
  },
  // ... 19 more residents
]

export const complaints = [
  {
    id: 'CMP001',
    property: 'Sunrise PG',
    propertyId: '1',
    resident: 'Arjun Mehta',
    residentId: '1',
    owner: 'Ravi Kumar',
    category: 'Maintenance', // Maintenance | Food | Hygiene | Behavior | Payment | Other
    description: 'AC not working in Room 101',
    status: 'open', // open | in_progress | resolved | closed
    priority: 'high', // low | medium | high | critical
    raisedDate: '2024-06-01',
    assignedTo: 'Ravi Kumar',
  },
  // ... 9 more complaints
]

export const documents = [
  {
    id: '1',
    ownerId: '1',
    ownerName: 'Ravi Kumar',
    type: 'Aadhaar Card', // Aadhaar | PAN | Business License | Property Ownership
    fileName: 'aadhaar_front.pdf',
    uploadDate: '2024-01-16',
    status: 'pending', // pending | approved | rejected
    reviewedBy: null,
    reviewDate: null,
  },
  // ... more documents
]

export const platformRevenue = [
  {
    month: 'Jan 2024',
    totalBookings: 45,
    totalRent: 342000,
    commission: 6840, // 2%
    ownerPayouts: 335160,
  },
  // ... 5 more months
]
```

---

## 🎨 CORE UI COMPONENTS

**src/components/ui/Badge.tsx:**
```tsx
type Status = 'active' | 'pending' | 'approved' | 'rejected' | 'suspended' | 'verified' | 'open' | 'resolved'

const statusColors: Record<Status, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  approved: { bg: 'bg-blue-100', text: 'text-blue-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700' },
  suspended: { bg: 'bg-gray-100', text: 'text-gray-700' },
  verified: { bg: 'bg-green-100', text: 'text-green-700' },
  open: { bg: 'bg-red-100', text: 'text-red-700' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700' },
}

export default function Badge({ status }: { status: Status }) {
  const colors = statusColors[status]
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
```

---

## 📄 KEY PAGE IMPLEMENTATIONS

### 1. Dashboard (Home)
**Features:**
- 8 KPI cards: Total Owners, Total Properties, Total Beds, Total Customers, Platform Revenue, Pending Approvals, Pending Documents, Open Complaints
- 3 Charts: Monthly Revenue Trend (Line), New Sign-ups (Bar), Platform Occupancy (Donut)
- Recent Activity Feed (last 10 actions - new owner, new property, complaint, approval, etc.)
- Quick Actions: Approve pending documents, Review properties, Handle complaints

### 2. PG Owner Management
**Table Columns:** Name, Email, Phone, Properties, Beds, Revenue, Status, Verification, Join Date, Actions
**Actions:** View Profile, Suspend/Activate, Delete
**Filters:** Status (all/active/suspended), Verification (all/verified/pending/rejected)
**Owner Detail Page:** Personal info, All properties list, Financial summary, Document status, Activity log

### 3. Document Verification Queue
**List View:** Pending documents with Owner name, Document type, Upload date
**Detail Panel:** Document preview (placeholder image/PDF icon), Owner info, Document metadata
**Actions:** Approve, Reject (with mandatory reason textarea), Request Re-upload
**Status Tabs:** Pending, Approved, Rejected, All

### 4. Property Approval
**Card Grid:** Property cards with image, name, owner, location, beds, status
**Detail Modal:** Full property info, Photo gallery, Room/bed breakdown, Amenities checklist, Owner contact
**Actions:** Approve, Reject (with reason), Request Changes, Suspend (if live)
**Filters:** Status (pending/approved/rejected/live/suspended), City dropdown

### 5. Platform Users
**Two Tabs:** Customers | PG Owners
**Table:** Name, Email, Phone, Join Date, Status, Booking/Property Count, Actions
**Actions:** View Profile, Suspend/Ban, View History
**Search:** By name/email/phone

### 6. Complaints Monitor
**Table:** ID, Property, Resident, Owner, Category, Priority, Status, Raised Date, Actions
**Filters:** Status, Priority, Category, Date range
**Actions:** View Details, Escalate, Add Admin Note, Mark Resolved, Force Close
**Detail Modal:** Full complaint thread, Admin notes section, Status history

### 7. Revenue & Financial
**Summary Cards:** Total Revenue, Platform Commission (2%), Owner Payouts, Pending Settlements
**Table:** Month, Total Bookings, Total Rent Collected, Commission Earned, Owner Payouts, Net Platform Revenue
**Filters:** Date range, Owner dropdown, Property dropdown
**Export Button:** Download CSV (UI only - mock download)

### 8. Reports & Analytics
**4 Chart Sections:**
- Occupancy Trends (Line chart - last 6 months)
- Revenue vs P&L (Stacked bar)
- Vacancy Heatmap (City-wise bar chart)
- Growth Metrics (New owners, customers, bookings - multi-line)
**Date Range Filter:** Last 30 days, Last 90 days, Last 6 months, Custom

### 9. Notifications Management
**Two Sections:**
- **System Logs:** Auto-generated notifications (bookings, approvals, complaints) - read-only table
- **Broadcast Announcement:** Form to send platform-wide message (Title, Message textarea, Target audience radio: All/Owners/Customers, Send button)

### 10. Settings
**Tabs:**
- **Profile:** Admin name, email, password change form
- **Platform Config:** Commission % input, Supported cities multi-select (Bangalore, Mumbai, Delhi, Pune, Hyderabad), Platform status toggle (Active/Maintenance)
- **System:** Version info, Last backup date, Database status indicator

---

## 🎯 SIDEBAR NAVIGATION

```tsx
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'PG Owners', path: '/owners' },
  { icon: FileCheck, label: 'Documents', path: '/documents', badge: 5 },
  { icon: Building2, label: 'Properties', path: '/properties', badge: 3 },
  { icon: UserCog, label: 'Users', path: '/users' },
  { icon: AlertTriangle, label: 'Complaints', path: '/complaints', badge: 2 },
  { icon: IndianRupee, label: 'Revenue', path: '/revenue' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]
```

---

## 🚀 TO RUN THE ADMIN PANEL

```bash
cd homiepg-admin
npm install  # Already done
npm run dev  # Runs on http://localhost:5173 (Vite default)
```

**Change port to 3001:**
Edit `vite.config.ts`:
```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3001 },
})
```

**Login Credentials:**
- Email: `admin@homiepg.com`
- Password: `admin123`

---

## 📝 IMPLEMENTATION CHECKLIST

- [x] Scaffold Vite + React + TypeScript
- [x] Install all dependencies
- [ ] Configure Tailwind CSS
- [ ] Create seed data (seedData.ts)
- [ ] Build auth store (Zustand)
- [ ] Create UI components (Button, Card, Badge, Table, Modal)
- [ ] Build Layout (Sidebar + Header)
- [ ] Implement Login page
- [ ] Build Dashboard with KPIs + Charts
- [ ] Create all 10 module pages
- [ ] Add routing (React Router)
- [ ] Test all flows end-to-end

---

## 💡 DESIGN PRINCIPLES

1. **Data-Dense UI:** Tables with 8-10 columns, compact spacing, small fonts (12-13px)
2. **Enterprise Colors:** Navy (#0A1931) primary, muted blues, status badges (green/amber/red)
3. **Consistent Status:** Use Badge component everywhere - green=good, yellow=pending, red=alert
4. **Action-Oriented:** Every row has View/Edit/Delete/Approve buttons
5. **Responsive:** Down to tablet (768px), desktop-first is acceptable
6. **Mock Backend:** All API calls return promises with setTimeout(200ms) simulating network delay

---

**This spec contains everything needed to build a fully functional admin panel. Start with Layout → Dashboard → then build each module page systematically.**
