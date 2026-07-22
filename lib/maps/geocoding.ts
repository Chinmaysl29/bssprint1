// ── Geocoding helpers ──────────────────────────────────────────────────────────
// TODO: wire GOOGLE_GEOCODING_API_KEY to backend proxy for server-side calls
// Client-side usage reads NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY from env.

export interface LatLng {
  lat: number
  lng: number
}

export interface ReverseGeocodeResult {
  formattedAddress: string
  city: string
  state: string
  pincode: string
  placeId: string
}

/**
 * Parses a Google address_components array into structured fields.
 */
export function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[]
): Pick<ReverseGeocodeResult, 'city' | 'state' | 'pincode'> {
  let city = ''
  let state = ''
  let pincode = ''

  for (const c of components) {
    if (c.types.includes('locality')) city = c.long_name
    else if (c.types.includes('sublocality_level_1') && !city) city = c.long_name
    if (c.types.includes('administrative_area_level_1')) state = c.long_name
    if (c.types.includes('postal_code')) pincode = c.long_name
  }

  return { city, state, pincode }
}

/**
 * Reverse geocode a lat/lng using the Maps JS API Geocoder (browser-side).
 * Returns null on failure instead of throwing.
 */
export async function reverseGeocode(
  latLng: LatLng
): Promise<ReverseGeocodeResult | null> {
  if (typeof window === 'undefined' || !window.google) return null

  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status !== 'OK' || !results || results.length === 0) {
        resolve(null)
        return
      }
      const r = results[0]
      const parsed = parseAddressComponents(r.address_components)
      resolve({
        formattedAddress: r.formatted_address,
        placeId: r.place_id,
        ...parsed,
      })
    })
  })
}

/**
 * Forward geocode a place name / address string.
 * Returns null on failure.
 */
export async function forwardGeocode(
  address: string
): Promise<(LatLng & { placeId: string; formattedAddress: string }) | null> {
  if (typeof window === 'undefined' || !window.google) return null

  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status !== 'OK' || !results || results.length === 0) {
        resolve(null)
        return
      }
      const r = results[0]
      resolve({
        lat: r.geometry.location.lat(),
        lng: r.geometry.location.lng(),
        placeId: r.place_id,
        formattedAddress: r.formatted_address,
      })
    })
  })
}
