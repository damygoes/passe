import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PublicUser, UpdateUser } from '@passe/types/user'
import { usePasseApi } from '../context'
import { queryKeys } from '../query-keys'

export function useUser() {
  const { fetchApi } = usePasseApi()
  return useQuery({
    queryKey: queryKeys.user(),
    queryFn: () => fetchApi<PublicUser>('/api/user'),
  })
}

export function useUpdateUser() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUser) =>
      fetchApi<PublicUser>('/api/user', { method: 'PATCH', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user() })
    },
  })
}

export function useDeleteAccount() {
  const { fetchApi } = usePasseApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => fetchApi<{ deleted: boolean }>('/api/user', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
