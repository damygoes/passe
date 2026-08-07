import { PLAN_LIMITS } from '@passe/auth/plan-gates'
import { queryKeys, useUser } from '@passe/hooks'
import type { PaidPlan } from '@passe/types'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases'
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Spinner } from '@/components/ui/spinner'
import { AccountFormLayout } from '@/features/account/components/AccountFormLayout'
import { ErrorBanner } from '@/features/account/components/ErrorBanner'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

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

  const [offering, setOffering] = useState<PurchasesOffering | null>(null)
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [purchasingPackageId, setPurchasingPackageId] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

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
  const pollForPlanUpdate = async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await queryClient.invalidateQueries({ queryKey: queryKeys.user() })
    }
  }

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setActionError(null)
    setActionSuccess(null)
    setPurchasingPackageId(pkg.identifier)
    try {
      await Purchases.purchasePackage(pkg)
      setActionSuccess(t('purchase_success'))
      void pollForPlanUpdate()
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
    setActionSuccess(null)
    setIsRestoring(true)
    try {
      await Purchases.restorePurchases()
      setActionSuccess(t('restore_success'))
      void pollForPlanUpdate()
    } catch {
      setActionError(t('purchase_error'))
    } finally {
      setIsRestoring(false)
    }
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        list: { gap: spacing[4] },
        headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        headerText: { flex: 1, gap: spacing[1] },
        bulletList: { gap: spacing[2] },
        bulletRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
        bulletText: { fontSize: 14, color: colors.foreground },
        priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing[1] },
        price: { fontSize: 20, fontWeight: '700', color: colors.foreground },
        successText: { fontSize: 14, color: colors.primary },
      }),
    [spacing, colors],
  )

  return (
    <AccountFormLayout title={t('title')} description={t('subtitle')}>
      {isLoadingOfferings ? (
        <Spinner />
      ) : loadError || !offering ? (
        <ErrorBanner message={t('load_error')} />
      ) : (
        <View style={styles.list}>
          {offering.availablePackages.map((pkg) => {
            const plan = resolvePlanForPackage(pkg)
            if (!plan) return null

            const limits = PLAN_LIMITS[plan]
            const isCurrent = user?.plan === plan
            const bullets = [
              limits.maxTrips === Infinity
                ? tPricing('bullets.trips_unlimited')
                : tPricing('bullets.trips', { count: limits.maxTrips }),
              limits.maxMemoriesPerTrip === Infinity
                ? tPricing('bullets.memories_unlimited')
                : tPricing('bullets.memories', { count: limits.maxMemoriesPerTrip }),
              limits.publicPortfolio
                ? tPricing('bullets.portfolio_yes')
                : tPricing('bullets.portfolio_no'),
            ]

            return (
              <Card key={pkg.identifier}>
                <CardHeader style={styles.headerRow}>
                  <View style={styles.headerText}>
                    <CardTitle>{tPricing(`plans.${plan}.name`)}</CardTitle>
                    <CardDescription>{tPricing(`plans.${plan}.tagline`)}</CardDescription>
                  </View>
                  {isCurrent && <Badge>{t('current_plan_badge')}</Badge>}
                </CardHeader>
                <CardContent style={styles.bulletList}>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{pkg.product.priceString}</Text>
                    <Text style={styles.bulletText}>{tPricing('per_month')}</Text>
                  </View>
                  {bullets.map((bullet) => (
                    <View key={bullet} style={styles.bulletRow}>
                      <Icon name="check" size="sm" color={colors.primary} />
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={isCurrent || purchasingPackageId !== null}
                    loading={purchasingPackageId === pkg.identifier}
                    onPress={() => handlePurchase(pkg)}
                    fullWidth
                  >
                    {isCurrent
                      ? t('current_plan_badge')
                      : t('upgrade_to', { plan: tPricing(`plans.${plan}.name`) })}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </View>
      )}

      {actionError && <ErrorBanner message={actionError} />}
      {actionSuccess && <Text style={styles.successText}>{actionSuccess}</Text>}

      <Button
        variant="ghost"
        onPress={handleRestore}
        loading={isRestoring}
        disabled={isRestoring || purchasingPackageId !== null}
      >
        {t('restore_purchases')}
      </Button>
    </AccountFormLayout>
  )
}
