import { apiError, apiSuccess, requireAuth } from '@/lib/api'
import { reverseGeocode } from '@/lib/geocode'

// GET /api/geocode/reverse?lat=&lng=
export async function GET(req: Request) {
  const { error } = await requireAuth()
  if (error) return error

  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return apiError('Invalid coordinates', 400)
  }

  const result = await reverseGeocode(lat, lng)
  return apiSuccess(result)
}
