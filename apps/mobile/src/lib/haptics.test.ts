import * as Haptics from 'expo-haptics'
import { haptics } from './haptics'

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('haptics', () => {
  it('maps semantic helpers to the right native calls', () => {
    haptics.selection()
    expect(Haptics.selectionAsync).toHaveBeenCalled()

    haptics.impactLight()
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light)

    haptics.success()
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success)

    haptics.warning()
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Warning)

    haptics.error()
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error)
  })

  it('swallows native rejections instead of crashing the interaction', async () => {
    ;(Haptics.impactAsync as jest.Mock).mockRejectedValueOnce(new Error('no haptics hardware'))

    expect(() => haptics.impactLight()).not.toThrow()
    // Let the rejected promise settle — an unhandled rejection would fail the test run
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
})
