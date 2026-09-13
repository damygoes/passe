import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { WIZARD_STEP_COUNT } from './useAddMemoryWizard'

interface WizardHeaderProps {
  step: number
  onCancel: () => void
  onBack: () => void
}

export function WizardHeader({ step, onCancel, onBack }: WizardHeaderProps) {
  const t = useTranslations('trips.new_memory')
  const { colors, fonts, spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        cancelButton: { paddingLeft: 0 },
        backContent: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        backLabel: { fontSize: 14, color: colors.mutedForeground },
        stepLabel: {
          fontFamily: fonts.mono,
          fontSize: 10.5,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: colors.mutedForeground,
        },
      }),
    [colors, fonts, spacing],
  )

  return (
    <View style={styles.row}>
      {step > 1 ? (
        <Button variant="ghost" size="sm" style={styles.cancelButton} onPress={onBack}>
          <View style={styles.backContent}>
            <Icon name="chevron-left" size="sm" color={colors.mutedForeground} />
            <Text style={styles.backLabel}>{t('wizard.back_step')}</Text>
          </View>
        </Button>
      ) : (
        <Button variant="ghost" size="sm" style={styles.cancelButton} onPress={onCancel}>
          {t('cancel')}
        </Button>
      )}
      <Text style={styles.stepLabel}>
        {t('wizard.step_label', { current: step, total: WIZARD_STEP_COUNT })}
      </Text>
    </View>
  )
}
