import { colors as brandColors } from '@passe/theme'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { FormField } from '@/components/ui/form-field'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'

interface StepTagsPrivacyProps {
  tagsInput: string
  onChangeTagsInput: (value: string) => void
  isPublic: boolean
  onChangeIsPublic: (isPublic: boolean) => void
}

export function StepTagsPrivacy({
  tagsInput,
  onChangeTagsInput,
  isPublic,
  onChangeIsPublic,
}: StepTagsPrivacyProps) {
  const t = useTranslations('trips.new_memory')
  const { colors, fonts, fontSizes, spacing, borderRadius } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontFamily: fonts.display,
          fontSize: fontSizes['2xl'],
          color: colors.foreground,
          marginTop: spacing[4],
          marginBottom: spacing[1],
        },
        form: { gap: spacing[4] },
        privacyRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[4],
          borderRadius: borderRadius.xl,
          backgroundColor: `${brandColors.deepOlive.DEFAULT}1F`,
          padding: spacing[4],
        },
        privacyText: { flex: 1, gap: 2 },
        privacyTitle: { fontSize: fontSizes.sm, color: brandColors.deepOlive.dark },
        privacyDescription: { fontSize: fontSizes.xs, color: `${brandColors.deepOlive.dark}D9` },
      }),
    [colors, fonts, fontSizes, spacing, borderRadius],
  )

  return (
    <View>
      <Text style={styles.title}>{t('wizard.step3_title')}</Text>
      <View style={styles.form}>
        <FormField
          label={t('tags_label')}
          placeholder={t('tags_placeholder')}
          value={tagsInput}
          onChangeText={onChangeTagsInput}
        />

        <View style={styles.privacyRow}>
          <View style={styles.privacyText}>
            <Text style={styles.privacyTitle}>{t('privacy_title')}</Text>
            <Text style={styles.privacyDescription}>{t('privacy_description')}</Text>
          </View>
          <Switch checked={!isPublic} onCheckedChange={(checked) => onChangeIsPublic(!checked)} />
        </View>
      </View>
    </View>
  )
}
