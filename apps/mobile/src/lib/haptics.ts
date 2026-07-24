import * as Haptics from 'expo-haptics'

// Fire-and-forget: haptic feedback must never crash or delay an interaction,
// even on hardware without a vibration engine.
function fire(trigger: () => Promise<void>): void {
  trigger().catch(() => {})
}

export const haptics = {
  /** Picker-style tick — dense/repeated interactions (list taps, selection toggles) */
  selection: () => fire(() => Haptics.selectionAsync()),
  /** Soft tap — primary press feedback on cards and large touch targets */
  impactLight: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** A completed action the user waited on (save, upload, export) */
  success: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** Confirming a destructive action */
  warning: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  /** A failed action the user waited on */
  error: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
}
