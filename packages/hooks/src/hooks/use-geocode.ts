import { useMutation } from '@tanstack/react-query'
import { usePasseApi } from '../context'

interface ReverseGeocodeResult {
  city: string | null
  country: string | null
}

// Wraps GET /api/geocode/reverse — used by the "Use current location" button
// to turn GPS coordinates into a city/country pair.
export function useReverseGeocode() {
  const { fetchApi } = usePasseApi()

  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      fetchApi<ReverseGeocodeResult>(`/api/geocode/reverse?lat=${lat}&lng=${lng}`),
  })
}
