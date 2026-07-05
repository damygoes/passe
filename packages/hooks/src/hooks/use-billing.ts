import { useMutation } from '@tanstack/react-query'
import type { BillingRedirect, PaidPlan } from '@passe/types/billing'
import { usePasseApi } from '../context'

// Both hooks resolve a Stripe-hosted page URL — the caller redirects with
// window.location.assign(url). Plan changes land via the Stripe webhook and
// are picked up by useUser() on the next fetch, so nothing is invalidated here.

export function useCreateCheckoutSession() {
  const { fetchApi } = usePasseApi()
  return useMutation({
    mutationFn: (plan: PaidPlan) =>
      fetchApi<BillingRedirect>('/api/billing/checkout', { method: 'POST', body: { plan } }),
  })
}

export function useCreatePortalSession() {
  const { fetchApi } = usePasseApi()
  return useMutation({
    mutationFn: () => fetchApi<BillingRedirect>('/api/billing/portal', { method: 'POST' }),
  })
}
