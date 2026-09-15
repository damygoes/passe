import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateTrip, Trip, UpdateTrip } from '@passe/types/trip'
import { usePasseApi } from '../context'
import { queryKeys } from '../query-keys'

export function useTrips() {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.trips(),
    queryFn: ({ signal }) => fetchApi<Trip[]>('/api/trips', { signal }),
  })
}

export function useTrip(id: string) {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.trip(id),
    queryFn: ({ signal }) => fetchApi<Trip>(`/api/trips/${id}`, { signal }),
    enabled: Boolean(id),
  })
}

export function useCreateTrip() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTrip) => fetchApi<Trip>('/api/trips', { method: 'POST', body: data }),
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
    mutationFn: (id: string) => fetchApi<{ id: string }>(`/api/trips/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      queryClient.cancelQueries({ queryKey: queryKeys.trip(id) })
      queryClient.cancelQueries({ queryKey: queryKeys.memories(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.trips() })
      queryClient.invalidateQueries({ queryKey: queryKeys.allMemories() })
      // refetchType: 'none' — any still-mounted useTrip(id)/useMemories(id) observer
      // (e.g. the detail screen mid-navigation-away) would otherwise refetch the
      // just-deleted resource and log a spurious 404. removeQueries() eagerly wipes
      // the cache entry out from under a live observer, which triggers exactly that
      // refetch; marking stale-but-not-refetching lets the observer's own unmount
      // clean it up instead.
      queryClient.invalidateQueries({ queryKey: queryKeys.trip(id), refetchType: 'none' })
      queryClient.invalidateQueries({ queryKey: queryKeys.memories(id), refetchType: 'none' })
    },
  })
}
