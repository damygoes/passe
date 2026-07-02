import { colors } from '@passe/theme'

export type SemanticColors = {
  background: string
  foreground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  popover: string
  popoverForeground: string
  border: string
  input: string
  ring: string
  destructive: string
}

export const lightColors: SemanticColors = {
  background: colors.agedCream.DEFAULT,
  foreground: colors.darkEspresso.DEFAULT,
  primary: colors.terracotta.DEFAULT,
  primaryForeground: colors.agedCream.DEFAULT,
  secondary: colors.sandyBeige.DEFAULT,
  secondaryForeground: colors.darkEspresso.DEFAULT,
  muted: colors.sandyBeige.light,
  mutedForeground: colors.mutedTaupe.DEFAULT,
  accent: colors.sandyBeige.DEFAULT,
  accentForeground: colors.darkEspresso.DEFAULT,
  popover: colors.warmWhite.DEFAULT,
  popoverForeground: colors.darkEspresso.DEFAULT,
  border: colors.sandyBeige.dark,
  input: colors.sandyBeige.DEFAULT,
  ring: colors.terracotta.DEFAULT,
  destructive: '#ef4444',
}

// Dark-mode values that appear as hardcoded hex in tokens.css `.dark {}` block
// are reproduced as literals here. All other values derive from the shared palette.
export const darkColors: SemanticColors = {
  background: '#1a0f08',
  foreground: colors.agedCream.DEFAULT,
  primary: colors.terracotta.DEFAULT,
  primaryForeground: colors.agedCream.DEFAULT,
  secondary: '#3a2518',
  secondaryForeground: colors.sandyBeige.DEFAULT,
  muted: '#2a180e',
  mutedForeground: colors.mutedTaupe.light,
  accent: '#3a2518',
  accentForeground: colors.sandyBeige.DEFAULT,
  popover: colors.darkEspresso.DEFAULT,
  popoverForeground: colors.agedCream.DEFAULT,
  border: '#4a3020',
  input: '#3a2518',
  ring: colors.terracotta.DEFAULT,
  destructive: '#ef4444',
}
