import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Skeleton } from '@/components/ui/skeleton'
import { useTheme } from '@/hooks/useTheme'

export function ProfileFormSkeleton() {
  const { spacing } = useTheme()

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: { gap: spacing[4] },
        field: { gap: spacing[2] },
        label: { height: 16, width: 96 },
        input: { height: 44, width: '100%' },
        textarea: { height: 88, width: '100%' },
        button: { height: 44, width: 128 },
      }),
    [spacing],
  )

  return (
    <View style={styles.wrapper}>
      {['email', 'displayName', 'username'].map((field) => (
        <View key={field} style={styles.field}>
          <Skeleton style={styles.label} />
          <Skeleton style={styles.input} />
        </View>
      ))}
      <View style={styles.field}>
        <Skeleton style={styles.label} />
        <Skeleton style={styles.textarea} />
      </View>
      <Skeleton style={styles.button} />
    </View>
  )
}
