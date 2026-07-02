import { useTheme } from '@/hooks/useTheme'
import { createDropdownMenuRecipe } from '@/recipes/dropdown-menu'
import { createContext, useContext, useRef, useState } from 'react'
import {
  Modal,
  Pressable,
  Text,
  View,
  type LayoutRectangle,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import type {
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from './DropdownMenu.types'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerLayout: LayoutRectangle | null
  setTriggerLayout: (layout: LayoutRectangle) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerLayout, setTriggerLayout }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { setOpen, setTriggerLayout } = useContext(DropdownMenuContext)
  const ref = useRef<View>(null)

  const handlePress = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height })
      setOpen(true)
    })
  }

  return (
    <View ref={ref} collapsable={false}>
      <Pressable onPress={handlePress}>{children}</Pressable>
    </View>
  )
}

export function DropdownMenuContent({ style, children, ...props }: DropdownMenuContentProps) {
  const { open, setOpen, triggerLayout } = useContext(DropdownMenuContext)
  const theme = useTheme()
  const recipe = createDropdownMenuRecipe(theme)
  const { spacing } = theme
  const opacity = useSharedValue(open ? 1 : 0)
  const translateY = useSharedValue(open ? 0 : -4)

  if (open) {
    opacity.value = withTiming(1, { duration: 120 })
    translateY.value = withTiming(0, { duration: 120 })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const top = triggerLayout ? triggerLayout.y + triggerLayout.height + spacing[1] : 0
  const left = triggerLayout ? triggerLayout.x : 0

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
      {/* Backdrop — full-screen tap-to-close */}
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => setOpen(false)}
      />
      {/* Content — rendered on top; inner Pressable absorbs touches to prevent backdrop close */}
      <Animated.View
        style={[recipe.base.content, { position: 'absolute', top, left }, animatedStyle, style]}
        {...props}
      >
        <Pressable onPress={() => {}}>{children}</Pressable>
      </Animated.View>
    </Modal>
  )
}

export function DropdownMenuGroup({ style, children, ...props }: DropdownMenuGroupProps) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  )
}

export function DropdownMenuLabel({ style, children, ...props }: DropdownMenuLabelProps) {
  const { colors, fontSizes, fontWeights, spacing } = useTheme()

  return (
    <View
      style={[{ paddingHorizontal: spacing[3], paddingVertical: spacing[1] }, style]}
      {...props}
    >
      <Text style={{ fontSize: fontSizes.xs, fontWeight: fontWeights.medium, color: colors.mutedForeground }}>
        {children}
      </Text>
    </View>
  )
}

export function DropdownMenuItem({
  variant = 'default',
  onPress,
  style,
  children,
  icon,
  ...props
}: DropdownMenuItemProps) {
  const { setOpen } = useContext(DropdownMenuContext)
  const theme = useTheme()
  const recipe = createDropdownMenuRecipe(theme)

  return (
    <Pressable
      onPress={() => {
        onPress?.()
        setOpen(false)
      }}
      style={({ pressed }) => [
        recipe.base.item,
        pressed && { backgroundColor: theme.colors.muted },
        style,
      ]}
      {...props}
    >
      {icon}
      <Text style={[recipe.base.label, recipe.variants[variant].label]}>{children}</Text>
    </Pressable>
  )
}

export function DropdownMenuSeparator({ style, ...props }: DropdownMenuSeparatorProps) {
  const theme = useTheme()
  const recipe = createDropdownMenuRecipe(theme)

  return <View style={[recipe.base.separator, style]} {...props} />
}
