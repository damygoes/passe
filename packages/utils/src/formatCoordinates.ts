// The memory-detail location row's coordinate string ("35.1688° N, 5.2636° W").
export function formatCoordinates(lat: number, lng: number): string {
  const latHemisphere = lat >= 0 ? 'N' : 'S'
  const lngHemisphere = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}° ${latHemisphere}, ${Math.abs(lng).toFixed(4)}° ${lngHemisphere}`
}
