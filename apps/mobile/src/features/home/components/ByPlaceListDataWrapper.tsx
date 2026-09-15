import { useAllMemories } from '@passe/hooks'
import { getPlacesByCountry } from '@passe/utils'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

const VISIBLE_PLACES = 4

export function ByPlaceListDataWrapper() {
  const t = useTranslations('trips.home')
  const tStats = useTranslations('trips.stats')
  const router = useRouter()
  const { colors, fonts, spacing, fontSizes, borderRadius } = useTheme()
  const { data: allMemories = [], isLoading, isError } = useAllMemories()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: borderRadius.xl + spacing[2],
          backgroundColor: colors.popover,
          padding: spacing[5],
        },
        headerRow: {
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        },
        heading: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          paddingVertical: spacing[2] + 2,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        lastRow: { borderBottomWidth: 0 },
        place: { fontFamily: fonts.display, fontSize: fontSizes.xl, color: colors.foreground },
        count: {
          fontFamily: fonts.mono,
          fontSize: 11,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        more: {
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.mutedForeground,
          paddingTop: spacing[3],
        },
        skeleton: { height: 220, width: '100%', borderRadius: borderRadius.xl + spacing[2] },
      }),
    [colors, fonts, spacing, fontSizes, borderRadius],
  )

  if (isLoading) return <Skeleton style={styles.skeleton} />
  if (isError) return null

  const thisYear = new Date().getFullYear()
  const memoriesThisYear = allMemories.filter(
    (memory) => new Date(memory.capturedAt).getFullYear() === thisYear,
  )
  const places = getPlacesByCountry({ memories: memoriesThisYear })
  if (places.length === 0) return null

  const visible = places.slice(0, VISIBLE_PLACES)
  const remaining = places.length - visible.length

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{t('by_place_heading')}</Text>
        <Button variant="ghost" size="sm" onPress={() => router.push('/(app)/map')}>
          {t('see_map')}
        </Button>
      </View>
      {visible.map((place, index) => (
        <View
          key={place.country}
          style={[styles.row, index === visible.length - 1 && remaining === 0 && styles.lastRow]}
        >
          <Text style={styles.place}>{place.country}</Text>
          <Text style={styles.count}>
            {place.cityCount} {tStats('cities', { count: place.cityCount })}
          </Text>
        </View>
      ))}
      {remaining > 0 && <Text style={styles.more}>{t('by_place_more', { count: remaining })}</Text>}
    </View>
  )
}
