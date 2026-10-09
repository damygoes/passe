import { PLAN_LIMITS, isGatedFeature, upgradePlanFor } from '@passe/auth/plan-gates'
import { queryKeys, useUser } from '@passe/hooks'
import { createLogger } from '@passe/logger'
import type { PaidPlan } from '@passe/types'
import type { AuthUser } from '@passe/types/user'
import { useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases'
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { FeatureHighlightList } from '@/features/account/components/FeatureHighlightList'
import { PaywallFooterLinks } from '@/features/account/components/PaywallFooterLinks'
import { PaywallHero } from '@/features/account/components/PaywallHero'
import { PlanOptionCard } from '@/features/account/components/PlanOptionCard'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { haptics } from '@/lib/haptics'

const log = createLogger({ context: { module: 'features/account/PaywallScreen' } })

// Store product IDs are cc.passe.explorer.monthly / cc.passe.collector.monthly (see manual
// RevenueCat/App Store Connect setup) — matching on that substring avoids depending on
// RevenueCat's own package-identifier naming, which can be ambiguous across store products.
function resolvePlanForPackage(pkg: PurchasesPackage): PaidPlan | null {
  const productId = pkg.product.identifier
  if (productId.includes('collector')) return 'collector'
  if (productId.includes('explorer')) return 'explorer'
  return null
}

export function PaywallScreen() {
  const { colors, spacing } = useTheme()
  const t = useTranslations('account.paywall')
  const tPricing = useTranslations('landing.pricing')
  const { data: user } = useUser()
  const queryClient = useQueryClient()

  // Upgrade CTAs tag themselves with the feature that blocked the user (see
  // paywallRoute) so this screen can pitch the plan that actually unlocks it.
  // Untrusted param, hence isGatedFeature; null when untagged, unrecognised, or
  // the user is already on the best plan for that feature.
  const { reason: reasonParam } = useLocalSearchParams<{ reason?: string }>()
  const reason = isGatedFeature(reasonParam) ? reasonParam : undefined
  const requestedPlan = reason ? upgradePlanFor(reason, user?.plan ?? 'free') : null

  const [offering, setOffering] = useState<PurchasesOffering | null>(null)
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [purchasingPackageId, setPurchasingPackageId] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PaidPlan | null>(null)

  useEffect(() => {
    let cancelled = false
    Purchases.getOfferings()
      .then((offerings) => {
        if (!cancelled) setOffering(offerings.current)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingOfferings(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // The RevenueCat webhook lands slightly after the client-side purchase call resolves —
  // poll for a few seconds rather than assuming the first refetch already reflects the new plan.
  // Returns whether the plan actually changed, so callers can tell a stalled sync from a real one.
  const pollForPlanUpdate = async (previousPlan: string | undefined) => {
    for (let attempt = 0; attempt < 5; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await queryClient.invalidateQueries({ queryKey: queryKeys.user() })
      const latest = queryClient.getQueryData<AuthUser>(queryKeys.user())
      if (latest && latest.plan !== previousPlan) return true
    }
    return false
  }

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setActionError(null)
    setPurchasingPackageId(pkg.identifier)
    const previousPlan = user?.plan
    try {
      await Purchases.purchasePackage(pkg)
      haptics.success()
      void pollForPlanUpdate(previousPlan).then((synced) => {
        if (!synced) log.warn('RevenueCat purchase did not sync to plan within polling window')
      })
      router.back()
    } catch (err) {
      const code = (err as { code?: PURCHASES_ERROR_CODE }).code
      if (code !== PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        setActionError(t('purchase_error'))
      }
    } finally {
      setPurchasingPackageId(null)
    }
  }

  const handleRestore = async () => {
    setActionError(null)
    setIsRestoring(true)
    const previousPlan = user?.plan
    try {
      const customerInfo = await Purchases.restorePurchases()
      const hasActiveEntitlement = Object.keys(customerInfo.entitlements.active).some(
        (id) => id === 'explorer' || id === 'collector',
      )
      if (!hasActiveEntitlement) {
        setActionError(t('restore_not_found'))
        return
      }
      haptics.success()
      const synced = await pollForPlanUpdate(previousPlan)
      if (!synced) log.warn('RevenueCat restore did not sync to plan within polling window')
      router.back()
    } catch {
      setActionError(t('purchase_error'))
    } finally {
      setIsRestoring(false)
    }
  }

  const purchasablePackages = useMemo(
    () =>
      (offering?.availablePackages ?? [])
        .map((pkg) => ({ pkg, plan: resolvePlanForPackage(pkg) }))
        .filter((entry): entry is { pkg: PurchasesPackage; plan: PaidPlan } => entry.plan !== null),
    [offering],
  )

  // Default to a plan so the primary CTA is legible and actionable as soon as offerings
  // load, rather than sitting in a low-contrast disabled state — until the user taps a
  // card, `selectedPlan` stays null and this default is used instead. Skips the user's
  // current plan (its card is already shown as current/disabled) in favor of an upgrade.
  // Collector is the top tier, so there's no upgrade to default to — leave every card
  // unhighlighted rather than pre-selecting a downgrade to Explorer.
  // A tagged reason wins: matched against purchasablePackages so a plan with no store
  // product can never be pre-selected, which also narrows PlanType to PaidPlan.
  const defaultPlan = useMemo(() => {
    const requestedEntry = purchasablePackages.find((entry) => entry.plan === requestedPlan)
    if (requestedEntry) return requestedEntry.plan
    if (user?.plan === 'collector') return null
    const defaultEntry =
      purchasablePackages.find((entry) => entry.plan !== user?.plan) ?? purchasablePackages[0]
    return defaultEntry?.plan ?? null
  }, [purchasablePackages, requestedPlan, user?.plan])
  const effectiveSelectedPlan = selectedPlan ?? defaultPlan

  const selectedPackage = purchasablePackages.find(
    (entry) => entry.plan === effectiveSelectedPlan,
  )?.pkg

  function buildBullets(plan: PaidPlan) {
    const limits = PLAN_LIMITS[plan]
    const exportBullets = limits.pdfExport
      ? [
          tPricing('bullets.pdf_export_yes'),
          tPricing('bullets.zine_export_yes'),
          tPricing('bullets.postcard_export_yes'),
        ]
      : []
    return [
      limits.maxTrips === Infinity
        ? tPricing('bullets.trips_unlimited')
        : tPricing('bullets.trips', { count: limits.maxTrips }),
      limits.maxMemoriesPerTrip === Infinity
        ? tPricing('bullets.memories_unlimited')
        : tPricing('bullets.memories', { count: limits.maxMemoriesPerTrip }),
      limits.publicPortfolio ? tPricing('bullets.portfolio_yes') : tPricing('bullets.portfolio_no'),
      ...exportBullets,
    ]
  }

  const features = [
    { icon: 'luggage' as const, label: t('feature_trips') },
    { icon: 'camera' as const, label: t('feature_memories') },
    { icon: 'globe' as const, label: t('feature_portfolio') },
    { icon: 'document' as const, label: t('feature_pdf_export') },
  ]

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        scrollContent: { flexGrow: 1 },
        body: { padding: spacing[6], gap: spacing[6] },
        plans: { gap: spacing[4] },
        footer: { gap: spacing[3] },
      }),
    [colors, spacing],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PaywallHero
          title={t('hero_title')}
          subtitle={reason ? t(`reason_subtitle.${reason}`) : t('hero_subtitle')}
        />

        <View style={styles.body}>
          <FeatureHighlightList features={features} />

          {isLoadingOfferings ? (
            <Spinner />
          ) : loadError || !offering ? (
            <ErrorBanner message={t('load_error')} />
          ) : (
            <View style={styles.plans}>
              {purchasablePackages.map(({ pkg, plan }) => (
                <PlanOptionCard
                  key={pkg.identifier}
                  plan={plan}
                  planName={tPricing(`plans.${plan}.name`)}
                  tagline={tPricing(`plans.${plan}.tagline`)}
                  priceString={pkg.product.priceString}
                  perMonthLabel={tPricing('per_month')}
                  bullets={buildBullets(plan)}
                  isSelected={effectiveSelectedPlan === plan}
                  isCurrent={user?.plan === plan}
                  currentPlanLabel={t('current_plan_badge')}
                  unlocksLabel={
                    reason && plan === requestedPlan ? tPricing(`unlocks.${reason}`) : undefined
                  }
                  onSelect={() => setSelectedPlan(plan)}
                />
              ))}
            </View>
          )}

          {actionError && (
            <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />
          )}

          <View style={styles.footer}>
            <Button
              size="md"
              variant="primary"
              fullWidth
              disabled={!selectedPackage || purchasingPackageId !== null}
              loading={
                selectedPackage != null && purchasingPackageId === selectedPackage.identifier
              }
              onPress={() => selectedPackage && handlePurchase(selectedPackage)}
            >
              {effectiveSelectedPlan
                ? t('select_plan_cta', { plan: tPricing(`plans.${effectiveSelectedPlan}.name`) })
                : t('select_a_plan')}
            </Button>

            <PaywallFooterLinks
              restoreLabel={t('restore_purchases')}
              onRestorePress={handleRestore}
              isRestoring={isRestoring}
              restoreDisabled={isRestoring || purchasingPackageId !== null}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
