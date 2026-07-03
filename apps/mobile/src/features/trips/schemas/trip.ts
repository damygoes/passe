import { z } from 'zod'

type TranslateFn = (key: string) => string

export function createTripSchema(t: TranslateFn) {
  return z
    .object({
      title: z.string().min(1, t('title_required')).max(100, t('title_max')),
      description: z.string().max(500, t('description_max')).optional(),
      countries: z.array(z.string()).min(1, t('countries_required')),
      startDate: z.date({ message: t('start_date_required') }),
      endDate: z.date({ message: t('end_date_required') }),
      isPublic: z.boolean(),
    })
    .refine((d) => d.endDate >= d.startDate, {
      message: t('end_before_start'),
      path: ['endDate'],
    })
}

export type TripFormValues = z.infer<ReturnType<typeof createTripSchema>>
