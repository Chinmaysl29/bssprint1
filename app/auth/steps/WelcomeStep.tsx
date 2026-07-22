'use client'
import React from 'react'
import { ArrowRight, Building, Star, Shield } from 'lucide-react'
import { useAuthFlow } from '../hooks/useAuthFlow'
import { Step } from '../types/auth'

export function WelcomeStep() {
  const { goTo } = useAuthFlow()

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-12">
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl shadow-black/20 text-center flex flex-col items-center gap-6">

          {/* Logo mark */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center">
              <Building size={32} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                HomiePG
              </h1>
              <p className="text-blue-200 text-sm font-medium mt-0.5">
                Cloud-based PG Management & Booking Platform
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-white/90 text-base leading-relaxed max-w-sm">
            Find your perfect PG, or manage your properties — all in one place.
          </p>

          {/* Trust badges */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {[
              { icon: Shield, text: 'Secure & Verified' },
              { icon: Star, text: '4.9 ★ Rated' },
              { icon: Building, text: '500+ PG Listings' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5"
              >
                <Icon size={13} className="text-blue-200" />
                <span className="text-xs font-semibold text-white/80">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => goTo(Step.BasicInfo)}
            className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-black/20 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 active:scale-[0.98]"
          >
            Get Started
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          {/* Sign in link */}
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <a
              href="/owner/auth/login"
              className="text-white font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* CSS for blobs */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}
