import { fireEvent, render, screen } from '@testing-library/react-native'
import { UpgradeBanner } from './UpgradeBanner'

describe('UpgradeBanner', () => {
  it('renders the message and calls onPressUpgrade when the CTA is tapped', () => {
    const onPressUpgrade = jest.fn()
    render(
      <UpgradeBanner
        message="You've reached the trip limit for your plan."
        ctaLabel="Upgrade"
        onPressUpgrade={onPressUpgrade}
      />,
    )

    expect(screen.getByText("You've reached the trip limit for your plan.")).toBeTruthy()

    fireEvent.press(screen.getByText('Upgrade'))
    expect(onPressUpgrade).toHaveBeenCalledTimes(1)
  })
})
