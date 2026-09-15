'use client'

import { useRouter } from '@/i18n/navigation'
import { tripRoute } from '@/lib/routes'
import { Dialog, DialogContent, DialogTitle } from '@passe/ui/dialog'
import { useTranslations } from 'next-intl'
import { MemoryForm } from '../components/memories/MemoryForm'

interface Props {
  tripId: string
}

// Rendered as an always-open, route-backed dialog (not a click-to-open
// trigger) so /trips/[id]/memories/new stays a real, deep-linkable page —
// dismissing it (backdrop, Escape, or Cancel inside MemoryForm) navigates
// back to the trip instead of just closing in place. The design shows a
// "Step 2 of 3" label alongside the title, but web has no actual multi-step
// flow (that's mobile's wizard) — showing it here without real steps 1/3
// would be misleading, so this is just the title.
export function NewMemoryView({ tripId }: Props) {
  const t = useTranslations('trips.new_memory')
  const router = useRouter()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.push(tripRoute(tripId))
      }}
    >
      <DialogContent size="xl">
        <DialogTitle>{t('title')}</DialogTitle>
        <MemoryForm tripId={tripId} />
      </DialogContent>
    </Dialog>
  )
}
