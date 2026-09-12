import { StyleSheet, type ViewStyle } from 'react-native'

import type { AppTheme } from '@/hooks/useTheme'

interface SwitchRecipe {
  width: number
  height: number
  thumbSize: number
  thumbInset: number
  track: {
    base: ViewStyle
    checked: ViewStyle
    unchecked: ViewStyle
    disabled: ViewStyle
  }
  thumb: ViewStyle
}

// 46x27 track / 21px thumb, per the redesign's toggle spec. The "on" state is
// deep-olive (not the terracotta primary) — matches Switch on web and every
// other private-badge/map-pin/toggle-on use of the accent-2 color.
export function createSwitchRecipe(theme: AppTheme): SwitchRecipe {
  const { palette, borderRadius } = theme
  const width = 46
  const height = 27
  const thumbSize = 21
  const thumbInset = 3

  return {
    width,
    height,
    thumbSize,
    thumbInset,
    track: {
      base: StyleSheet.create({
        style: { width, height, borderRadius: borderRadius.full, justifyContent: 'center' },
      }).style,
      checked: StyleSheet.create({
        style: { backgroundColor: palette.deepOlive.DEFAULT },
      }).style,
      unchecked: StyleSheet.create({
        style: { backgroundColor: palette.sandyBeige.dark },
      }).style,
      disabled: StyleSheet.create({ style: { opacity: 0.45 } }).style,
    },
    thumb: StyleSheet.create({
      style: {
        width: thumbSize,
        height: thumbSize,
        borderRadius: thumbSize / 2,
        backgroundColor: palette.warmWhite.DEFAULT,
      },
    }).style,
  }
}
