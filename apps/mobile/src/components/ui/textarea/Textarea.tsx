import { useTheme } from '@/hooks/useTheme'
import { createTextareaRecipe } from '@/recipes/textarea'
import { useState } from 'react'
import { TextInput } from 'react-native'
import type { TextareaProps } from './Textarea.types'

export function Textarea({ style, editable = true, ...props }: TextareaProps) {
  const theme = useTheme()
  const recipe = createTextareaRecipe(theme)
  const [focused, setFocused] = useState(false)

  const isDisabled = editable === false

  return (
    <TextInput
      multiline
      style={[
        recipe.base.input,
        focused && { borderColor: recipe.states.focused.borderColor },
        isDisabled && { opacity: recipe.states.disabled.opacity },
        style,
      ]}
      editable={editable}
      placeholderTextColor={theme.colors.mutedForeground}
      onFocus={(e) => {
        setFocused(true)
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        props.onBlur?.(e)
      }}
      {...props}
    />
  )
}
