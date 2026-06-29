import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateTrip, Trip, UpdateTrip } from '@passe/types/trip'
import { usePasseApi } from '../context'
import { queryKeys } from '../query-keys'

export function useTrips() {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.trips(),
    queryFn: () => fetchApi<Trip[]>('/api/trips'),
  })
}

export function useTrip(id: string) {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.trip(id),
    queryFn: () => fetchApi<Trip>(`/api/trips/${id}`),
    enabled: Boolean(id),
  })
}

export function useCreateTrip() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTrip) =>
      fetchApi<Trip>('/api/trips', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips() })
    },
  })
}

export function useUpdateTrip() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateTrip) =>
      fetchApi<Trip>(`/api/trips/${id}`, { method: 'PATCH', body: data }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips() })
      queryClient.invalidateQueries({ queryKey: queryKeys.trip(id) })
    },
  })
}

export function useDeleteTrip() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetchApi<{ id: string }>(`/api/trips/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trips() })
      queryClient.removeQueries({ queryKey: queryKeys.trip(id) })
    },
  })
}
