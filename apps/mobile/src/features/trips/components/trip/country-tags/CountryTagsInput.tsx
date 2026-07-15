import { useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/hooks/useTheme'

interface CountryTagsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  removeLabel: string
}

export function CountryTagsInput({
  value,
  onChange,
  placeholder,
  removeLabel,
}: CountryTagsInputProps) {
  const { colors, spacing, fontSizes, borderRadius } = useTheme()
  const [draft, setDraft] = useState('')

  const addCountry = () => {
    const country = draft.trim()
    if (!country) return
    const exists = value.some((c) => c.toLowerCase() === country.toLowerCase())
    if (!exists) onChange([...value, country])
    setDraft('')
  }

  const removeCountry = (country: string) => {
    onChange(value.filter((c) => c !== country))
  }

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { gap: spacing[2] },
        chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
        chip: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing[1],
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.full,
          paddingLeft: spacing[3],
          paddingRight: spacing[2],
          paddingVertical: spacing[1],
        },
        chipText: { fontSize: fontSizes.xs, color: colors.secondaryForeground, fontWeight: '500' },
        removeButton: { padding: 2 },
      }),
    [colors, spacing, fontSizes, borderRadius],
  )

  return (
    <View style={styles.wrapper}>
      <Input
        value={draft}
        onChangeText={setDraft}
        placeholder={placeholder}
        icon="globe"
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={addCountry}
        onBlur={addCountry}
      />
      {value.length > 0 && (
        <View style={styles.chipRow}>
          {value.map((country) => (
            <View key={country} style={styles.chip}>
              <Text style={styles.chipText}>{country}</Text>
              <Pressable
                onPress={() => removeCountry(country)}
                accessibilityLabel={`${removeLabel} ${country}`}
                style={styles.removeButton}
                hitSlop={8}
              >
                <Icon name="close" size="xs" color={colors.secondaryForeground} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
