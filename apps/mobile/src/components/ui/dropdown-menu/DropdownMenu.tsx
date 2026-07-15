import { useTheme } from '@/hooks/useTheme'
import { createDropdownMenuRecipe } from '@/recipes/dropdown-menu'
import { createContext, useContext, useRef, useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type LayoutRectangle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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

interface ContentSize {
  width: number
  height: number
}

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerLayout: LayoutRectangle | null
  setTriggerLayout: (layout: LayoutRectangle) => void
  contentSize: ContentSize | null
  setContentSize: (size: ContentSize | null) => void
}

export const DropdownMenuContext = createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
  triggerLayout: null,
  setTriggerLayout: () => {},
  contentSize: null,
  setContentSize: () => {},
})

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null)
  const [contentSize, setContentSize] = useState<ContentSize | null>(null)

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, triggerLayout, setTriggerLayout, contentSize, setContentSize }}
    >
      {children}
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const { setOpen, setTriggerLayout, setContentSize } = useContext(DropdownMenuContext)
  const ref = useRef<View>(null)

  const handlePress = () => {
    ref.current?.measureInWindow((x, y, width, height) => {
      // Reset first so the freshly opened menu re-measures instead of flashing at
      // whatever position/size was computed the last time it was open.
      setContentSize(null)
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
  const { open, setOpen, triggerLayout, contentSize, setContentSize } =
    useContext(DropdownMenuContext)
  const theme = useTheme()
  const recipe = createDropdownMenuRecipe(theme)
  const { spacing } = theme
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const margin = spacing[2]

  // Only reveal once the content has been measured and placed — otherwise the user would
  // briefly see it at last render's position/size (or the unplaced default) before it snaps.
  const placed = open && triggerLayout !== null && contentSize !== null

  const opacity = useSharedValue(0)
  const translateY = useSharedValue(-4)

  if (placed) {
    opacity.value = withTiming(1, { duration: 120 })
    translateY.value = withTiming(0, { duration: 120 })
  } else {
    opacity.value = 0
    translateY.value = -4
  }

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  let top = 0
  let left = 0
  let maxHeight: number | undefined

  if (triggerLayout) {
    // Default/first-pass position — used to measure real content size; invisible until placed.
    top = triggerLayout.y + triggerLayout.height + spacing[1]
    left = triggerLayout.x

    if (contentSize) {
      const spaceBelow =
        windowHeight - insets.bottom - (triggerLayout.y + triggerLayout.height) - margin
      const spaceAbove = triggerLayout.y - insets.top - margin
      const fitsBelow = contentSize.height <= spaceBelow
      const openAbove = !fitsBelow && (contentSize.height <= spaceAbove || spaceAbove > spaceBelow)

      top = openAbove
        ? triggerLayout.y - contentSize.height - spacing[1]
        : triggerLayout.y + triggerLayout.height + spacing[1]
      maxHeight = openAbove ? spaceAbove : spaceBelow

      const minTop = insets.top + margin
      const maxTop = Math.max(windowHeight - insets.bottom - margin - contentSize.height, minTop)
      top = Math.min(Math.max(top, minTop), maxTop)

      const maxLeft = Math.max(windowWidth - contentSize.width - margin, margin)
      left = Math.min(Math.max(triggerLayout.x, margin), maxLeft)
    }
  }

  function handleContentLayout(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout
    if (!contentSize || contentSize.width !== width || contentSize.height !== height) {
      setContentSize({ width, height })
    }
  }

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
      {/* Backdrop — full-screen tap-to-close */}
      <Pressable
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={() => setOpen(false)}
      />
      {/* Content — rendered on top; inner Pressable absorbs touches to prevent backdrop close */}
      <Animated.View
        onLayout={handleContentLayout}
        style={[
          recipe.base.content,
          { position: 'absolute', top, left },
          maxHeight !== undefined && { maxHeight },
          animatedStyle,
          style,
        ]}
        {...props}
      >
        <ScrollView bounces={false}>
          <Pressable onPress={() => {}}>{children}</Pressable>
        </ScrollView>
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
