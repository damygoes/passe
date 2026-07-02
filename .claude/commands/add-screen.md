---
description: Scaffold a new screen under src/features/ with the established mobile architecture pattern
---

Scaffold a new mobile screen for the feature and name given in `$ARGUMENTS` (format: `<feature> <Name>`, e.g. `trips TripDetail`).

Follow these rules exactly:

1. **Feature screen** — create `apps/mobile/src/features/<feature>/screens/<Name>Screen.tsx`:
   - Named export: `export function <Name>Screen()`
   - Uses `useTheme()` from `@/hooks/useTheme` for colors, spacing, typography
   - Uses `useRouter()` from `expo-router` if navigation is needed
   - Styles defined via `StyleSheet.create()` at the bottom of the file
   - Placeholder `View` with a `Text` label so the screen renders immediately

   ```tsx
   import { StyleSheet, View, Text } from 'react-native'
   import { useTheme } from '@/hooks/useTheme'

   export function <Name>Screen() {
     const { colors, spacing, typography } = useTheme()

     return (
       <View style={styles.container}>
         <Text style={styles.title}><Name></Text>
       </View>
     )
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
     },
     title: {
       fontSize: 24,
     },
   })
   ```

2. **Route file** — create `apps/mobile/src/app/(app)/<feature>/<name>.tsx` (kebab-case filename):
   - One-line default export that renders the screen component
   - No logic, no hooks, no imports beyond the screen itself

   ```tsx
   export { <Name>Screen as default } from '@/features/<feature>/screens/<Name>Screen'
   ```

3. If a `<feature>/` folder does not yet exist under `src/features/`, create the `screens/` and `components/` subdirectories too.

4. After scaffolding, list what the developer still needs to fill in (data hooks, props, real UI, etc.).
