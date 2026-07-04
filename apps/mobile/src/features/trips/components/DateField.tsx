import { formatTripDateFull } from '@passe/utils'
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker'
import { useMemo, useState } from 'react'
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'

interface DateFieldProps {
  label: string
  value?: Date
  onChange: (date: Date) => void
  placeholder: string
  doneLabel: string
  error?: string
  minimumDate?: Date
}

export function DateField({
  label,
  value,
  onChange,
  placeholder,
  doneLabel,
  error,
  minimumDate,
}: DateFieldProps) {
  const { colors, spacing, fontSizes, borderRadius, fonts } = useTheme()
  const [show, setShow] = useState(false)

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { gap: spacing[2] },
        label: { fontSize: fontSizes.sm, fontWeight: '500', color: colors.foreground },
        trigger: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: error ? colors.destructive : colors.border,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.background,
          paddingHorizontal: spacing[3],
          height: 44,
        },
        triggerText: { fontSize: fontSizes.sm, fontFamily: fonts.body, color: colors.foreground },
        placeholderText: { color: colors.mutedForeground },
        errorText: { fontSize: fontSizes.xs, color: colors.destructive },
        modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
        modalSheet: {
          backgroundColor: colors.background,
          borderTopLeftRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          padding: spacing[4],
          gap: spacing[3],
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        },
        // The iOS inline picker has an intrinsic (fixed) width; centering it in the
        // sheet keeps the calendar balanced instead of pinned to the left edge.
        picker: { alignSelf: 'center' },
        modalActions: { alignSelf: 'stretch', alignItems: 'flex-end' },
      }),
    [colors, spacing, fontSizes, borderRadius, fonts, error],
  )

  // datetimepicker v9 deprecated `onChange` in favour of the split listeners.
  // On Android the picker is a dialog, so a selection closes it; on iOS it stays
  // open inside our modal until the user taps Done.
  const handleValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    if (Platform.OS !== 'ios') setShow(false)
    onChange(date)
  }
  const handleDismiss = () => setShow(false)

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.trigger} onPress={() => setShow(true)}>
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {value ? formatTripDateFull(value) : placeholder}
        </Text>
        <Icon name="calendar" size="sm" color={colors.mutedForeground} />
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {show &&
        (Platform.OS === 'ios' ? (
          <Modal transparent animationType="slide" onRequestClose={() => setShow(false)}>
            <Pressable style={styles.modalBackdrop} onPress={() => setShow(false)}>
              <Pressable style={styles.modalSheet}>
                <DateTimePicker
                  value={value ?? minimumDate ?? new Date()}
                  mode="date"
                  display="inline"
                  minimumDate={minimumDate}
                  style={styles.picker}
                  onValueChange={handleValueChange}
                  onDismiss={handleDismiss}
                />
                <View style={styles.modalActions}>
                  <Button size="sm" onPress={() => setShow(false)}>
                    {doneLabel}
                  </Button>
                </View>
              </Pressable>
            </Pressable>
          </Modal>
        ) : (
          <DateTimePicker
            value={value ?? minimumDate ?? new Date()}
            mode="date"
            display="default"
            minimumDate={minimumDate}
            onValueChange={handleValueChange}
            onDismiss={handleDismiss}
          />
        ))}
    </View>
  )
}
