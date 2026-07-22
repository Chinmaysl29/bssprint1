// ── Places API helpers ─────────────────────────────────────────────────────────

export interface NearbyPlace {
  placeId: string
  name: string
  vicinity: string
  lat: number
  lng: number
  category: NearbyCategory
}

export type NearbyCategory =
  | 'subway_station'
  | 'bus_station'
  | 'hospital'
  | 'university'
  | 'restaurant'
  | 'atm'
  | 'pharmacy'
  | 'shopping_mall'

export interface NearbyConfig {
  type: NearbyCategory
  label: string
  icon: string
  color: string
}

export const NEARBY_CATEGORIES: NearbyConfig[] = [
  { type: 'subway_station',  label: 'Metro Station', icon: '🚇', color: '#2563EB' },
  { type: 'bus_station',     label: 'Bus Stop',      icon: '🚌', color: '#059669' },
  { type: 'hospital',        label: 'Hospital',      icon: '🏥', color: '#DC2626' },
  { type: 'university',      label: 'College',       icon: '🎓', color: '#7C3AED' },
  { type: 'restaurant',      label: 'Restaurant',    icon: '🍽️', color: '#D97706' },
  { type: 'atm',             label: 'ATM',           icon: '🏧', color: '#0891B2' },
  { type: 'pharmacy',        label: 'Medical Store', icon: '💊', color: '#BE185D' },
  { type: 'shopping_mall',   label: 'Mall',          icon: '🛍️', color: '#4338CA' },
]

/**
 * Fetch nearby places for a single category within a radius.
 * Returns empty array on failure (graceful degradation).
 */
export async function fetchNearbyPlaces(
  map: google.maps.Map,
  center: google.maps.LatLngLiteral,
  type: NearbyCategory,
  radiusMeters = 1500
): Promise<NearbyPlace[]> {
  return new Promise((resolve) => {
    const service = new google.maps.places.PlacesService(map)
    service.nearbySearch(
      { location: center, radius: radiusMeters, type },
      (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results
        ) {
          resolve([])
          return
        }
        const places: NearbyPlace[] = results.slice(0, 4).map((r) => ({
          placeId: r.place_id ?? '',
          name: r.name ?? '',
          vicinity: r.vicinity ?? '',
          lat: r.geometry?.location?.lat() ?? 0,
          lng: r.geometry?.location?.lng() ?? 0,
          category: type,
        }))
        resolve(places)
      }
    )
  })
}
