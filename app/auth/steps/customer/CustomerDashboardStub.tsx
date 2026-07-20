'use client'
import React from 'react'
import { Search, MapPin, Star, Home, User, Bell } from 'lucide-react'
import { useAuthFlow } from '../../hooks/useAuthFlow'

// Mock PG listing cards
const MOCK_PGS = [
  {
    id: 1,
    name: 'The Nest PG',
    location: 'Koramangala, Bangalore',
    price: 8500,
    rating: 4.8,
    tag: 'Near Metro',
    color: 'bg-blue-100',
  },
  {
    id: 2,
    name: 'Green Leaf Residency',
    location: 'HSR Layout, Bangalore',
    price: 7200,
    rating: 4.6,
    tag: 'Co-ed',
    color: 'bg-green-100',
  },
  {
    id: 3,
    name: 'Sunrise PG for Girls',
    location: 'BTM Layout, Bangalore',
    price: 6500,
    rating: 4.5,
    tag: 'Girls Only',
    color: 'bg-rose-100',
  },
]

export function CustomerDashboardStub() {
  const { state } = useAuthFlow()
  const name = state.formData.fullName?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Home size={14} className="text-white" />
          </div>
          <span className="font-black text-blue-600 text-base">HomiePG</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Bell size={15} className="text-slate-500" />
          </button>
          <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={15} className="text-white" />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Welcome */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-black text-slate-900">
            Welcome, {name}! 👋
          </h1>
          <p className="text-sm text-slate-500">
            Verification pending — browse PGs while you wait.
          </p>
        </div>

        {/* Search bar (mock) */}
        <div className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <span className="text-sm text-slate-400 flex-1">
            Search by area, college, or PG name…
          </span>
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin size={14} className="text-white" />
          </div>
        </div>

        {/* PG listing stubs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-slate-800 text-sm">Popular near you</p>
            <a
              href="/customer/search"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Browse all →
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_PGS.map((pg) => (
              <a
                key={pg.id}
                href="/customer/search"
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {/* Placeholder image */}
                <div
                  className={`w-16 h-16 rounded-xl ${pg.color} flex items-center justify-center flex-shrink-0`}
                >
                  <Home size={24} className="text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-800 text-sm truncate">{pg.name}</p>
                    <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      {pg.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} /> {pg.location}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-black text-slate-800">
                      ₹{pg.price.toLocaleString()}
                      <span className="text-xs font-medium text-slate-400">/mo</span>
                    </span>
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                      <Star size={10} fill="currentColor" /> {pg.rating}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Note about limited access */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          <span className="text-lg flex-shrink-0">⏳</span>
          <p className="leading-relaxed">
            <strong>Pending Verification</strong> — You can browse listings now. Booking
            will be enabled once your identity documents are approved.
          </p>
        </div>
      </div>
    </div>
  )
}
