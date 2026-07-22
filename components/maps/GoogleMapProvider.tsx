'use client'
import React, { type ReactNode } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import { MapErrorState } from './MapErrorState'

interface GoogleMapProviderProps {
  children: ReactNode
}

/**
 * Loads the Maps JS API once per render tree.
 * Reads key from NEXT_PUBLIC_GOOGLE_MAPS_API_KEY — never hardcoded.
 * Renders MapErrorState if the key is absent.
 */
export function GoogleMapProvider({ children }: GoogleMapProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <MapErrorState
        message="NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Add it to .env.local."
        height={200}
      />
    )
  }

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['places', 'geometry']}
      language="en"
      region="IN"
    >
      {children}
    </APIProvider>
  )
}
