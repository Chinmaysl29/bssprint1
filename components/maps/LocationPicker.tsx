'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { MapPin, Search, CheckCircle, AlertCircle } from 'lucide-react'
import { GoogleMapProvider } from './GoogleMapProvider'
import { MapSkeleton } from './MapSkeleton'
import { reverseGeocode, type LatLng } from '@/lib/maps/geocoding'

// Bengaluru city centre
const DEFAULT_CENTER: LatLng = { lat: 12.9716, lng: 77.5946 }
const DEFAULT_ZOOM = 13

export interface LocationData {
  lat: number
  lng: number
  formattedAddress: string
  city: string
  state: string
  pincode: string
  placeId: string
}

interface LocationPickerProps {
  value: LocationData | null
  onChange: (data: LocationData | null) => void
  error?: string
}

/* ── inner component that uses the map instance ───────────────────────────── */
function LocationPickerInner({ value, onChange, error }: LocationPickerProps) {
  const map = useMap()
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [markerPos, setMarkerPos] = useState<LatLng>(
    value ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER
  )
  const [geocoding, setGeocoding] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  /* init Places Autocomplete once map & input are ready */
  useEffect(() => {
    if (!inputRef.current || !window.google) return
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'in' },
      fields: ['geometry', 'formatted_address', 'place_id', 'address_components'],
      bounds: new google.maps.LatLngBounds(
        { lat: 12.7343, lng: 77.3795 }, // SW Bengaluru
        { lat: 13.1733, lng: 77.8826 }  // NE Bengaluru
      ),
      strictBounds: false,
    })
    autocompleteRef.current = ac

    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      if (!place.geometry?.location) return
      const ll: LatLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }
      setMarkerPos(ll)
      map?.panTo(ll)
      map?.setZoom(16)

      // parse address components
      let city = '', state = '', pincode = ''
      for (const c of (place.address_components ?? [])) {
        if (c.types.includes('locality')) city = c.long_name
        else if (c.types.includes('sublocality_level_1') && !city) city = c.long_name
        if (c.types.includes('administrative_area_level_1')) state = c.long_name
        if (c.types.includes('postal_code')) pincode = c.long_name
      }
      onChange({ lat: ll.lat, lng: ll.lng, formattedAddress: place.formatted_address ?? '', city, state, pincode, placeId: place.place_id ?? '' })
    })

    return () => google.maps.event.clearInstanceListeners(ac)
  }, [map, onChange])

  /* drag-end → reverse geocode */
  const handleDragEnd = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const ll: LatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    setMarkerPos(ll)
    setGeocoding(true)
    setApiError(null)
    try {
      const result = await reverseGeocode(ll)
      if (result) {
        onChange({ lat: ll.lat, lng: ll.lng, ...result })
        if (inputRef.current) inputRef.current.value = result.formattedAddress
      } else {
        setApiError('Could not resolve address for this location.')
        onChange(null)
      }
    } catch {
      setApiError('Geocoding failed. Please try again.')
      onChange(null)
    } finally {
      setGeocoding(false)
    }
  }, [onChange])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Search input */}
      <div style={{ position: 'relative' }}>
        <Search size={15} color="#6B7FA3" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search address, area or landmark…"
          defaultValue={value?.formattedAddress ?? ''}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 12px 10px 36px',
            border: `1.5px solid ${error ? '#FCA5A5' : '#D9E3EC'}`,
            borderRadius: 10, fontSize: 13, outline: 'none',
            background: '#FAFCFF', color: '#0A1931',
            boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.08)' : 'none',
          }}
        />
      </div>

      {/* Map */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${error ? '#FCA5A5' : '#E8EEF5'}` }}>
        <Map
          defaultCenter={markerPos}
          defaultZoom={DEFAULT_ZOOM}
          mapId="location-picker"
          style={{ height: 320, width: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={async (e) => {
            if (!e.detail.latLng) return
            const ll = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng }
            await handleDragEnd({ latLng: { lat: () => ll.lat, lng: () => ll.lng } } as google.maps.MapMouseEvent)
          }}
        >
          <AdvancedMarker
            position={markerPos}
            draggable
            onDragEnd={handleDragEnd}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50% 50% 50% 4px',
                transform: 'rotate(-45deg)', background: '#0A1931',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(10,25,49,0.4)',
              }}>
                <MapPin size={18} color="#fff" strokeWidth={2} style={{ transform: 'rotate(45deg)' }} />
              </div>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(10,25,49,0.3)', marginTop: 2 }} />
            </div>
          </AdvancedMarker>
        </Map>
      </div>

      {/* Status bar */}
      {geocoding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#4A7FA7', padding: '8px 12px', background: '#EDF4FB', borderRadius: 8 }}>
          <span style={{ width: 14, height: 14, border: '2px solid #B3CFE5', borderTopColor: '#4A7FA7', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
          Resolving address…
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {value && !geocoding && !error && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#059669', padding: '8px 12px', background: '#ECFDF5', borderRadius: 8, border: '1px solid #A7F3D0' }}>
          <CheckCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <span style={{ fontWeight: 600 }}>Location set: </span>
            {value.formattedAddress}
            {value.city && <span style={{ color: '#6B7FA3' }}> · {value.city}, {value.state} {value.pincode}</span>}
          </div>
        </div>
      )}

      {apiError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#DC2626', padding: '8px 12px', background: '#FEF2F2', borderRadius: 8 }}>
          <AlertCircle size={14} />
          {apiError}
        </div>
      )}

      {error && !apiError && (
        <p style={{ fontSize: 12, color: '#DC2626', margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <p style={{ fontSize: 11, color: '#9BADC2', margin: 0 }}>
        Drag the marker or click on the map to adjust the exact location. Address is auto-filled.
      </p>
    </div>
  )
}

/* ── public component wrapped in provider ───────────────────────────────────── */
export function LocationPicker(props: LocationPickerProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <MapSkeleton height={370} borderRadius={12} />

  return (
    <GoogleMapProvider>
      <LocationPickerInner {...props} />
    </GoogleMapProvider>
  )
}
