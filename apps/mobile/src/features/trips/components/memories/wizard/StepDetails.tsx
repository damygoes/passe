import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { Icon } from '@/components/ui/icon'
import { DateField } from '@/features/trips/components/trip/date-field/DateField'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface StepDetailsProps {
  note: string
  onChangeNote: (value: string) => void
  capturedAt: Date
  onChangeCapturedAt: (date: Date) => void
  city: string
  onChangeCity: (value: string) => void
  country: string
  onChangeCountry: (value: string) => void
  placeName: string
  onChangePlaceName: (value: string) => void
  isLocating: boolean
  locationError: string | null
  isBusy: boolean
  onUseLocation: () => void
}

export function StepDetails({
  note,
  onChangeNote,
  capturedAt,
  onChangeCapturedAt,
  city,
  onChangeCity,
  country,
  onChangeCountry,
  placeName,
  onChangePlaceName,
  isLocating,
  locationError,
  isBusy,
  onUseLocation,
}: StepDetailsProps) {
  const t = useTranslations('trips.new_memory')
  const tNew = useTranslations('trips.new')
  const { colors, fonts, fontSizes, spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        form: { gap: spacing[4] },
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          color: colors.foreground,
          marginTop: spacing[4],
          marginBottom: spacing[1],
        },
        locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
        locationLabel: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.primary },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive },
        row: { flexDirection: 'row', gap: spacing[3] },
        rowField: { flex: 1 },
      }),
    [colors, fonts, fontSizes, spacing],
  )

  return (
    <View>
      <Text style={styles.title}>{t('wizard.step2_title')}</Text>
      <View style={styles.form}>
        <FormField
          label={t('note_label')}
          placeholder={t('note_placeholder')}
          value={note}
          onChangeText={onChangeNote}
          multiline
          numberOfLines={4}
        />

        <DateField
          label={t('date_label')}
          value={capturedAt}
          onChange={onChangeCapturedAt}
          placeholder={t('date_label')}
          doneLabel={tNew('date_done')}
        />

        <View style={styles.row}>
          <View style={styles.rowField}>
            <FormField
              label={t('city_label')}
              placeholder={t('city_placeholder')}
              value={city}
              onChangeText={onChangeCity}
            />
          </View>
          <View style={styles.rowField}>
            <FormField
              label={t('country_label')}
              placeholder={t('country_placeholder')}
              value={country}
              onChangeText={onChangeCountry}
            />
          </View>
        </View>

        <View>
          <FormField
            label={t('place_name_label')}
            labelRight={
              <Button
                variant="ghost"
                size="sm"
                onPress={onUseLocation}
                disabled={isBusy || isLocating}
              >
                <View style={styles.locationRow}>
                  <Icon name="location" size="sm" color={colors.primary} />
                  <Text style={styles.locationLabel}>
                    {isLocating ? t('locating') : t('use_current_location')}
                  </Text>
                </View>
              </Button>
            }
            placeholder={t('place_name_placeholder')}
            value={placeName}
            onChangeText={onChangePlaceName}
          />
          {locationError && <Text style={styles.errorText}>{locationError}</Text>}
        </View>
      </View>
    </View>
  )
}
