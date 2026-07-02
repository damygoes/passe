import { Icon } from '@/components/ui/icon'
import { useTheme } from '@/hooks/useTheme'
import { createInputRecipe } from '@/recipes/input'
import { useState } from 'react'
import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native'
import type { InputProps } from './Input.types'

const HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 }

export function Input({
  icon,
  iconPosition = 'start',
  iconSize = 'md',
  isLoading = false,
  onIconPress,
  style,
  inputStyle,
  editable = true,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme()
  const recipe = createInputRecipe(theme)
  const [focused, setFocused] = useState(false)

  const isDisabled = editable === false

  const iconNode = isLoading ? (
    <ActivityIndicator color={theme.colors.mutedForeground} />
  ) : icon ? (
    onIconPress ? (
      <TouchableOpacity onPress={onIconPress} hitSlop={HIT_SLOP}>
        <Icon name={icon} size={iconSize} color={theme.colors.mutedForeground} />
      </TouchableOpacity>
    ) : (
      <Icon name={icon} size={iconSize} color={theme.colors.mutedForeground} />
    )
  ) : null

  return (
    <View
      style={[
        recipe.base.wrapper,
        focused && recipe.states.focused.wrapper,
        isDisabled && recipe.states.disabled.wrapper,
        style,
      ]}
    >
      {iconNode && iconPosition === 'start' && (
        <View style={recipe.iconWrapper.start}>{iconNode}</View>
      )}
      <TextInput
        style={[recipe.base.input, isDisabled && recipe.states.disabled.input, inputStyle]}
        editable={editable}
        placeholderTextColor={theme.colors.mutedForeground}
        onFocus={(e) => {
          setFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          onBlur?.(e)
        }}
        {...rest}
      />
      {iconNode && iconPosition === 'end' && (
        <View style={recipe.iconWrapper.end}>{iconNode}</View>
      )}
    </View>
  )
}
