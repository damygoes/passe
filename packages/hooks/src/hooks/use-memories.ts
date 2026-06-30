import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateMemory, Memory, UpdateMemory } from '@passe/types/memory'
import { usePasseApi } from '../context'
import { queryKeys } from '../query-keys'

export function useMemories(tripId: string) {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.memories(tripId),
    queryFn: () => fetchApi<Memory[]>(`/api/trips/${tripId}/memories`),
    enabled: Boolean(tripId),
  })
}

export function useAllMemories() {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.allMemories(),
    queryFn: () => fetchApi<Memory[]>('/api/memories'),
  })
}

export function useCreateMemory() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMemory) =>
      fetchApi<Memory>(`/api/trips/${data.tripId}/memories`, { method: 'POST', body: data }),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories(tripId) })
    },
  })
}

export function useUpdateMemory() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, id, ...data }: { tripId: string; id: string } & UpdateMemory) =>
      fetchApi<Memory>(`/api/trips/${tripId}/memories/${id}`, { method: 'PATCH', body: data }),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories(tripId) })
    },
  })
}

export function useDeleteMemory() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, id }: { tripId: string; id: string }) =>
      fetchApi<{ id: string }>(`/api/trips/${tripId}/memories/${id}`, { method: 'DELETE' }),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.memories(tripId) })
    },
  })
}
