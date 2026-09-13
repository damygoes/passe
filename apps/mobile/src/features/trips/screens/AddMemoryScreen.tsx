import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn } from 'react-native-reanimated'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { useTranslations } from '@/i18n/useTranslations'
import { StepDetails } from '@/features/trips/components/memories/wizard/StepDetails'
import { StepPhoto } from '@/features/trips/components/memories/wizard/StepPhoto'
import { StepTagsPrivacy } from '@/features/trips/components/memories/wizard/StepTagsPrivacy'
import { WizardHeader } from '@/features/trips/components/memories/wizard/WizardHeader'
import {
  useAddMemoryWizard,
  WIZARD_STEP_COUNT,
} from '@/features/trips/components/memories/wizard/useAddMemoryWizard'

export function AddMemoryScreen() {
  const { id: tripId } = useLocalSearchParams<{ id: string }>()
  const t = useTranslations('trips.new_memory')
  const router = useRouter()
  const { colors, spacing } = useTheme()
  const wizard = useAddMemoryWizard(tripId)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: { flex: 1, backgroundColor: colors.background },
        flex: { flex: 1 },
        scrollContent: { flexGrow: 1, padding: spacing[6] },
        footer: { marginTop: spacing[6] },
      }),
    [colors, spacing],
  )

  function handleContinue() {
    if (wizard.step === 1 && !wizard.validatePhotoStep()) return
    wizard.goToStep(wizard.step + 1)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <WizardHeader
            step={wizard.step}
            onCancel={() => router.back()}
            onBack={() => wizard.goToStep(wizard.step - 1)}
          />

          <Animated.View key={wizard.step} entering={FadeIn.duration(180)}>
            {wizard.step === 1 && (
              <StepPhoto
                photos={wizard.photos}
                isUploading={wizard.isUploading}
                isBusy={wizard.isBusy}
                atMemoryLimit={wizard.atMemoryLimit}
                contentError={wizard.contentError}
                globalError={wizard.globalError}
                onPickFromLibrary={wizard.handlePickFromLibrary}
                onTakePhoto={wizard.handleTakePhoto}
                onRemove={wizard.handleRemovePhoto}
                onPressUpgrade={() => router.push('/(app)/account/paywall')}
              />
            )}
            {wizard.step === 2 && (
              <StepDetails
                note={wizard.note}
                onChangeNote={wizard.setNote}
                capturedAt={wizard.capturedAt}
                onChangeCapturedAt={wizard.setCapturedAt}
                city={wizard.city}
                onChangeCity={wizard.setCity}
                country={wizard.country}
                onChangeCountry={wizard.setCountry}
                placeName={wizard.placeName}
                onChangePlaceName={wizard.setPlaceName}
                isLocating={wizard.isLocating}
                locationError={wizard.locationError}
                isBusy={wizard.isBusy}
                onUseLocation={wizard.handleUseLocation}
              />
            )}
            {wizard.step === 3 && (
              <StepTagsPrivacy
                tagsInput={wizard.tagsInput}
                onChangeTagsInput={wizard.setTagsInput}
                isPublic={wizard.isPublic}
                onChangeIsPublic={wizard.setIsPublic}
              />
            )}
          </Animated.View>

          <View style={styles.footer}>
            {wizard.step < WIZARD_STEP_COUNT ? (
              <Button onPress={handleContinue} disabled={wizard.isBusy} fullWidth>
                {t('wizard.continue')}
              </Button>
            ) : (
              <Button
                onPress={wizard.handleSave}
                loading={wizard.isPending}
                disabled={wizard.isBusy}
                fullWidth
              >
                {wizard.isPending ? t('creating') : t('create')}
              </Button>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
