'use client'
import React from 'react'
import { MapPinOff, AlertTriangle } from 'lucide-react'

interface MapErrorStateProps {
  height?: number | string
  message?: string
  borderRadius?: number
}

export function MapErrorState({
  height = 400,
  borderRadius = 14,
  message,
}: MapErrorStateProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const display =
    message ??
    (!apiKey
      ? 'Google Maps API key is not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local.'
      : 'Map could not be loaded. Check your API key, quota, or network connection.')

  return (
    <div
      style={{
        height,
        borderRadius,
        background: '#FFF8F8',
        border: '1px solid #FECACA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MapPinOff size={24} color="#DC2626" strokeWidth={1.5} />
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#DC2626', margin: '0 0 4px' }}>
          Map unavailable
        </p>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0, maxWidth: 320, lineHeight: 1.6 }}>
          {display}
        </p>
      </div>
    </div>
  )
}
