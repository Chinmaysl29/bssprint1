// ── Distance helpers ───────────────────────────────────────────────────────────

export interface LatLng {
  lat: number
  lng: number
}

const EARTH_RADIUS_KM = 6371

/**
 * Haversine formula — returns distance in kilometres between two points.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/**
 * Human-readable distance string.
 * < 1 km → "850 m", ≥ 1 km → "2.3 km"
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

/** Radius filter option */
export interface RadiusOption {
  label: string
  km: number
}

export const RADIUS_OPTIONS: RadiusOption[] = [
  { label: '1 km', km: 1 },
  { label: '2 km', km: 2 },
  { label: '3 km', km: 3 },
  { label: '5 km', km: 5 },
  { label: '10 km', km: 10 },
]
