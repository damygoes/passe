import { useMemories, useTrip, useUser } from '@passe/hooks'
import { formatMemoryDate, formatTripDate, getUniqueCities } from '@passe/utils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { PressableScale } from '@/components/ui/pressable-scale'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { NoPublicMemoriesEmpty } from '@/features/portfolio/components/NoPublicMemoriesEmpty'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

// A native preview of what this trip's public page (passe.cc/u/<username>/trips/<id>)
// looks like to a visitor — reached only from the owner's own "My portfolio" screen,
// never from an anonymous deep link. Mirrors apps/web's PortfolioTripView layout.
//
// Renders its own back row instead of a native header: react-native-screens on
// iOS 26 devices clips content that bleeds under a transparent header (same
// reasoning as TripDetailScreen/MemoryDetailScreen — see the trips _layout).
export function PublicTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const t = useTranslations('trips.public_trip')
  const tPortfolio = useTranslations('portfolio')
  const tCommon = useTranslations('common')
  const { colors, spacing, fonts, fontSizes } = useTheme()

  const { data: user } = useUser()
  const { data: trip, isLoading: tripLoading, isError: tripError } = useTrip(id)
  const {
    data: memories = [],
    isLoading: memoriesLoading,
    isError: memoriesError,
  } = useMemories(id)

  const isLoading = tripLoading || memoriesLoading
  const isError = tripError || memoriesError || (!isLoading && (!trip || !user))

  const publicMemories = memories.filter((memory) => memory.isPublic)
  const { uniqueCities } = getUniqueCities({ allMemories: publicMemories })

  const quoteMemory = publicMemories.find((memory) => memory.note)
  const galleryMemories = publicMemories.filter((memory) => memory.id !== quoteMemory?.id)
  const heroMemory = galleryMemories[0] ?? quoteMemory
  const restMemories = galleryMemories.filter((memory) => memory.id !== heroMemory?.id)
  const singleMemory = restMemories[0]
  const pairMemories = restMemories.slice(1, 3)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        backRow: {
          paddingHorizontal: spacing[4],
          paddingTop: spacing[2],
          paddingBottom: spacing[2],
        },
        backButton: { alignSelf: 'flex-start', padding: spacing[2] },
        scrollContent: { paddingBottom: spacing[10] },
        loading: { padding: spacing[6] },
        loadingBlock: { height: 240, borderRadius: 26, width: '100%' },
        error: { padding: spacing[6] },
        intro: { paddingHorizontal: spacing[6], gap: spacing[2] },
        url: { fontSize: fontSizes.xs, letterSpacing: 1, color: colors.mutedForeground },
        eyebrow: {
          fontSize: fontSizes.xs,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
          marginTop: spacing[3],
        },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['4xl'],
          lineHeight: fontSizes['4xl'] * 1.05,
          color: colors.foreground,
        },
        description: { fontSize: fontSizes.base, lineHeight: 24, color: colors.mutedForeground },
        hero: {
          height: 280,
          width: '100%',
          marginTop: spacing[6],
          backgroundColor: colors.secondary,
        },
        quoteBlock: { paddingHorizontal: spacing[6], marginTop: spacing[8], gap: spacing[3] },
        quote: {
          fontFamily: fonts.display,
          fontStyle: 'italic',
          fontSize: fontSizes.xl,
          lineHeight: 28,
          color: colors.foreground,
        },
        quoteMeta: {
          fontSize: fontSizes.xs,
          letterSpacing: 1,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
        singlePhoto: {
          height: 230,
          borderRadius: 26,
          marginTop: spacing[8],
          marginHorizontal: spacing[6],
          backgroundColor: colors.secondary,
        },
        pairRow: {
          flexDirection: 'row',
          gap: spacing[3],
          marginTop: spacing[8],
          marginHorizontal: spacing[6],
        },
        pairPhoto: {
          flex: 1,
          height: 150,
          borderRadius: 22,
          backgroundColor: colors.secondary,
        },
        closing: {
          alignItems: 'center',
          paddingHorizontal: spacing[6],
          marginTop: spacing[10],
          paddingTop: spacing[6],
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: spacing[3],
        },
        closingTitle: {
          fontFamily: fonts.display,
          fontSize: fontSizes.xl,
          color: colors.foreground,
        },
        emptyWrap: { paddingHorizontal: spacing[6], marginTop: spacing[8] },
      }),
    [colors, spacing, fonts, fontSizes],
  )

  const backRow = (
    <View style={styles.backRow}>
      <PressableScale
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={tCommon('back')}
      >
        <Icon name="chevron-left" size="md" color={colors.foreground} />
      </PressableScale>
    </View>
  )

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {backRow}
        <View style={styles.loading}>
          <Skeleton style={styles.loadingBlock} />
        </View>
      </SafeAreaView>
    )
  }

  if (isError || !trip || !user) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {backRow}
        <View style={styles.error}>
          <ErrorBanner message={t('error')} />
        </View>
      </SafeAreaView>
    )
  }

  const countries = trip.countries.join(', ')
  const daysCount = Math.round(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )
  const description = [
    daysCount > 0
      ? t('description_days', { days: daysCount, countries })
      : t('description_generic', { countries }),
    publicMemories.length < memories.length
      ? t('shared_partial', { shared: publicMemories.length, total: memories.length })
      : t('shared_all'),
  ].join(' ')
  const place = uniqueCities.size > 0 ? [...uniqueCities].join(', ') : countries

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      {backRow}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.intro}>
          <Text style={styles.url}>
            {tPortfolio('public_url', { username: user.username })}/{t('url_suffix')}
          </Text>
          <Text style={styles.eyebrow}>
            {[formatTripDate(trip.startDate).toUpperCase(), place].filter(Boolean).join(' · ')}
          </Text>
          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {publicMemories.length === 0 ? (
          <View style={styles.emptyWrap}>
            <NoPublicMemoriesEmpty />
          </View>
        ) : (
          <>
            {heroMemory?.media[0] && (
              <Image
                source={{ uri: heroMemory.media[0].url }}
                style={styles.hero}
                contentFit="cover"
                accessibilityLabel={t('photo_alt')}
              />
            )}

            {quoteMemory?.note && (
              <View style={styles.quoteBlock}>
                <Text style={styles.quote}>“{quoteMemory.note}”</Text>
                <Text style={styles.quoteMeta}>
                  {[quoteMemory.city, formatMemoryDate(quoteMemory.capturedAt)]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              </View>
            )}

            {singleMemory?.media[0] && (
              <Image
                source={{ uri: singleMemory.media[0].url }}
                style={styles.singlePhoto}
                contentFit="cover"
                accessibilityLabel={t('photo_alt')}
              />
            )}

            {pairMemories.length > 0 && (
              <View style={styles.pairRow}>
                {pairMemories.map(
                  (memory) =>
                    memory.media[0] && (
                      <Image
                        key={memory.id}
                        source={{ uri: memory.media[0].url }}
                        style={styles.pairPhoto}
                        contentFit="cover"
                        accessibilityLabel={t('photo_alt')}
                      />
                    ),
                )}
              </View>
            )}

            <View style={styles.closing}>
              <Text style={styles.closingTitle}>{t('kept_by', { name: user.displayName })}</Text>
              <Button
                size="sm"
                variant="secondary"
                onPress={() => router.push('/(app)/account/portfolio')}
              >
                {t('see_other_trips', { name: user.displayName })}
              </Button>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
