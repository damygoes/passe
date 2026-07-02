import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { createContext, useContext, useEffect } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogProps,
  AlertDialogTextSubProps,
  AlertDialogTriggerProps,
} from './AlertDialog.types'

interface AlertDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue>({
  open: false,
  setOpen: () => {},
})

export function AlertDialog({ open = false, onOpenChange, children }: AlertDialogProps) {
  return (
    <AlertDialogContext.Provider value={{ open, setOpen: (v) => onOpenChange?.(v) }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const { setOpen } = useContext(AlertDialogContext)
  return <Pressable onPress={() => setOpen(true)}>{children}</Pressable>
}

export function AlertDialogContent({ style, children, ...props }: AlertDialogContentProps) {
  const { open, setOpen } = useContext(AlertDialogContext)
  const { colors, borderRadius, spacing } = useTheme()
  const backdropOpacity = useSharedValue(0)
  const contentOpacity = useSharedValue(0)
  const contentScale = useSharedValue(0.95)

  useEffect(() => {
    backdropOpacity.value = withTiming(open ? 0.5 : 0, { duration: 150 })
    contentOpacity.value = withTiming(open ? 1 : 0, { duration: 150 })
    contentScale.value = withTiming(open ? 1 : 0.95, { duration: 150 })
  }, [open, backdropOpacity, contentOpacity, contentScale])

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.value }))
  const contentAnim = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }))

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
      {/* Backdrop */}
      <Animated.View
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' },
          backdropStyle,
        ]}
      />
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => setOpen(false)}
      />
      {/* Content — centered, absorbs its own touches */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} pointerEvents="box-none">
        <Animated.View
          style={[
            {
              backgroundColor: colors.popover,
              borderRadius: borderRadius.xl,
              padding: spacing[6],
              width: '90%',
              maxWidth: 340,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            },
            contentAnim,
            style,
          ]}
          {...props}
        >
          <Pressable onPress={() => {}}>{children}</Pressable>
        </Animated.View>
      </View>
    </Modal>
  )
}

export function AlertDialogHeader({ style, children, ...props }: AlertDialogHeaderProps) {
  const { spacing } = useTheme()
  return (
    <View style={[{ marginBottom: spacing[4], gap: spacing[1] }, style]} {...props}>
      {children}
    </View>
  )
}

export function AlertDialogTitle({ style, children, ...props }: AlertDialogTextSubProps) {
  const { colors, fontSizes, fontWeights } = useTheme()
  return (
    <Text
      style={[{ fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.popoverForeground }, style]}
      {...props}
    >
      {children}
    </Text>
  )
}

export function AlertDialogDescription({ style, children, ...props }: AlertDialogTextSubProps) {
  const { colors, fontSizes } = useTheme()
  return (
    <Text style={[{ fontSize: fontSizes.sm, color: colors.mutedForeground }, style]} {...props}>
      {children}
    </Text>
  )
}

export function AlertDialogFooter({ style, children, ...props }: AlertDialogFooterProps) {
  const { spacing } = useTheme()
  return (
    <View
      style={[{ flexDirection: 'row', gap: spacing[2], justifyContent: 'flex-end', marginTop: spacing[4] }, style]}
      {...props}
    >
      {children}
    </View>
  )
}

export function AlertDialogAction({ children, onPress, ...props }: AlertDialogActionProps) {
  const { setOpen } = useContext(AlertDialogContext)
  return (
    <Button
      variant="primary"
      size="sm"
      onPress={(e) => {
        onPress?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

export function AlertDialogCancel({ children, onPress, ...props }: AlertDialogCancelProps) {
  const { setOpen } = useContext(AlertDialogContext)
  return (
    <Button
      variant="secondary"
      size="sm"
      onPress={(e) => {
        onPress?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
