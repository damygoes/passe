import { useMutation } from '@tanstack/react-query'
import { usePasseApi } from '../context'

interface ReverseGeocodeResult {
  city: string | null
  country: string | null
  placeName: string | null
}

// Wraps GET /api/geocode/reverse — used by the "Use current location" button
// to turn GPS coordinates into a city/country pair, plus a placeName
// (full-address) pre-fill the caller may use or ignore.
export function useReverseGeocode() {
  const { fetchApi } = usePasseApi()

  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      fetchApi<ReverseGeocodeResult>(`/api/geocode/reverse?lat=${lat}&lng=${lng}`),
  })
}
