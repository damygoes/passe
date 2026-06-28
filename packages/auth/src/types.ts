export type PlanType = 'free' | 'explorer' | 'collector'

export interface ClerkWebhookUser {
  id: string
  email_addresses: Array<{ id: string; email_address: string }>
  primary_email_address_id: string | null
  username: string | null
  first_name: string | null
  last_name: string | null
  image_url: string
}

export type ClerkWebhookEvent =
  | { type: 'user.created' | 'user.updated'; data: ClerkWebhookUser }
  | { type: 'user.deleted'; data: { id: string; deleted: true } }
