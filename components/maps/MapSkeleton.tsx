'use client'
import React from 'react'

interface MapSkeletonProps {
  height?: number | string
  borderRadius?: number
}

export function MapSkeleton({ height = 400, borderRadius = 14 }: MapSkeletonProps) {
  return (
    <div
      style={{
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #EDF4FB 25%, #D9E3EC 50%, #EDF4FB 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.6s infinite',
        border: '1px solid #D9E3EC',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.5 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#B3CFE5' }} />
        <div style={{ width: 100, height: 10, borderRadius: 5, background: '#B3CFE5' }} />
      </div>
    </div>
  )
}
