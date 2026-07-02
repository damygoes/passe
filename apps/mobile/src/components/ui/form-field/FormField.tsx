import { Text, View } from 'react-native'

import { Input } from '@/components/ui/input'
import { useTheme } from '@/hooks/useTheme'
import { createFormFieldRecipe } from '@/recipes/form-field'
import type { FormFieldProps } from './FormField.types'

export function FormField({ label, labelRight, error, ...inputProps }: FormFieldProps) {
  const theme = useTheme()
  const recipe = createFormFieldRecipe(theme)

  return (
    <View style={recipe.base.wrapper}>
      <View style={recipe.base.labelRow}>
        <Text style={recipe.base.label}>{label}</Text>
        {labelRight}
      </View>
      <Input aria-invalid={!!error} {...inputProps} />
      {error && <Text style={recipe.base.errorText}>{error}</Text>}
    </View>
  )
}
