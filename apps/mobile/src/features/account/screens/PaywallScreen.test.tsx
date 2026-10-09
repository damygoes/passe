import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { mockBack, setMockSearchParams } from '@/test/expo-router-mock'
import { PaywallScreen } from './PaywallScreen'

const mockUseUser = jest.fn()
const mockInvalidateQueries = jest.fn()
const mockGetQueryData = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  queryKeys: { user: () => ['user'] },
}))
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
    getQueryData: mockGetQueryData,
  }),
}))

const mockGetOfferings = jest.fn()
const mockPurchasePackage = jest.fn()
const mockRestorePurchases = jest.fn()
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    getOfferings: (...args: unknown[]) => mockGetOfferings(...args),
    purchasePackage: (...args: unknown[]) => mockPurchasePackage(...args),
    restorePurchases: (...args: unknown[]) => mockRestorePurchases(...args),
  },
  PURCHASES_ERROR_CODE: { PURCHASE_CANCELLED_ERROR: 'PURCHASE_CANCELLED_ERROR' },
}))

function fakePackage(plan: 'explorer' | 'collector') {
  return {
    identifier: `${plan}_monthly`,
    product: {
      identifier: `cc.passe.${plan}.monthly`,
      priceString: plan === 'explorer' ? '€4.99' : '€9.99',
    },
  }
}

function fakeOffering() {
  return { current: { availablePackages: [fakePackage('explorer'), fakePackage('collector')] } }
}

beforeEach(() => {
  jest.useFakeTimers()
  setMockSearchParams({})
  mockUseUser.mockReturnValue({ data: { plan: 'free' } })
  mockGetOfferings.mockResolvedValue(fakeOffering())
})

afterEach(() => {
  jest.useRealTimers()
})

describe('PaywallScreen', () => {
  it('renders available packages with prices once offerings load', async () => {
    render(<PaywallScreen />)

    expect(await screen.findByText('€4.99')).toBeTruthy()
    expect(screen.getByText('€9.99')).toBeTruthy()
  })

  it('marks the current plan and disables its button', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'explorer' } })
    render(<PaywallScreen />)

    await screen.findByText('€4.99')
    // Renders both as the badge and as the (disabled) button label for that card
    expect(screen.getAllByText('current_plan_badge').length).toBeGreaterThan(0)
  })

  it('shows a load error banner when offerings fail to load', async () => {
    mockGetOfferings.mockRejectedValue(new Error('network down'))
    render(<PaywallScreen />)

    expect(await screen.findByText('load_error')).toBeTruthy()
  })

  it('purchases the selected package and dismisses the paywall', async () => {
    mockPurchasePackage.mockResolvedValue(undefined)
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByLabelText('plans.explorer.name'))
    fireEvent.press(screen.getByText('select_plan_cta'))

    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
    expect(mockBack).toHaveBeenCalled()
  })

  it('stays silent when the purchase is user-cancelled', async () => {
    mockPurchasePackage.mockRejectedValue({ code: 'PURCHASE_CANCELLED_ERROR' })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByLabelText('plans.explorer.name'))
    fireEvent.press(screen.getByText('select_plan_cta'))

    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
    expect(screen.queryByText('purchase_error')).toBeNull()
    expect(mockBack).not.toHaveBeenCalled()
  })

  it('shows an error banner when the purchase fails for another reason', async () => {
    mockPurchasePackage.mockRejectedValue({ code: 'STORE_PROBLEM_ERROR' })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByLabelText('plans.explorer.name'))
    fireEvent.press(screen.getByText('select_plan_cta'))

    expect(await screen.findByText('purchase_error')).toBeTruthy()
  })

  it('preselects the first plan so the CTA is enabled once offerings load', async () => {
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    expect(screen.getByText('select_plan_cta')).toBeTruthy()
    expect(screen.queryByText('select_a_plan')).toBeNull()
  })

  it('skips the current plan when preselecting, favoring an upgrade option', async () => {
    mockUseUser.mockReturnValue({ data: { plan: 'explorer' } })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByText('select_plan_cta'))
    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
    expect(mockPurchasePackage.mock.calls[0][0]).toMatchObject({ identifier: 'collector_monthly' })
  })

  // Upgrade CTAs tag the paywall with the feature that blocked the user. Explorer has
  // pdfExport: false, so pitching it to someone blocked on a keepsake sells the wrong
  // tier — these cover that the tag actually redirects the pre-selection.
  describe('when tagged with the feature that blocked the user', () => {
    it('pre-selects collector for a keepsake, not the cheaper explorer', async () => {
      setMockSearchParams({ reason: 'postcard' })
      render(<PaywallScreen />)
      await screen.findByText('€4.99')

      expect(screen.getByText('unlocks.postcard')).toBeTruthy()
      expect(screen.getByText('reason_subtitle.postcard')).toBeTruthy()

      fireEvent.press(screen.getByText('select_plan_cta'))
      await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
      expect(mockPurchasePackage.mock.calls[0][0]).toMatchObject({
        identifier: 'collector_monthly',
      })
    })

    it('pre-selects explorer for a limit explorer actually raises', async () => {
      setMockSearchParams({ reason: 'trips' })
      render(<PaywallScreen />)
      await screen.findByText('€4.99')

      expect(screen.getByText('unlocks.trips')).toBeTruthy()

      fireEvent.press(screen.getByText('select_plan_cta'))
      await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
      expect(mockPurchasePackage.mock.calls[0][0]).toMatchObject({
        identifier: 'explorer_monthly',
      })
    })

    it('ignores an unrecognised reason rather than trusting the param', async () => {
      setMockSearchParams({ reason: 'toString' })
      render(<PaywallScreen />)
      await screen.findByText('€4.99')

      expect(screen.getByText('hero_subtitle')).toBeTruthy()
      fireEvent.press(screen.getByText('select_plan_cta'))
      await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
      expect(mockPurchasePackage.mock.calls[0][0]).toMatchObject({
        identifier: 'explorer_monthly',
      })
    })

    it('highlights nothing for a collector, who already has every keepsake', async () => {
      mockUseUser.mockReturnValue({ data: { plan: 'collector' } })
      setMockSearchParams({ reason: 'postcard' })
      render(<PaywallScreen />)
      await screen.findByText('€4.99')

      expect(screen.queryByText('unlocks.postcard')).toBeNull()
      expect(screen.getByText('select_a_plan')).toBeTruthy()
    })
  })

  it('restores purchases and dismisses the paywall', async () => {
    mockRestorePurchases.mockResolvedValue({ entitlements: { active: { explorer: {} } } })
    // pollForPlanUpdate re-checks the query cache after each 1500ms tick until the plan
    // changes from its pre-restore value ('free') — resolving to 'explorer' lets it exit
    // after a single tick instead of exhausting all 5 retries.
    mockGetQueryData.mockReturnValue({ plan: 'explorer' })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByText('restore_purchases'))
    await waitFor(() => expect(mockRestorePurchases).toHaveBeenCalled())
    await act(async () => {
      await jest.advanceTimersByTimeAsync(1500)
    })

    await waitFor(() => expect(mockBack).toHaveBeenCalled())
  })

  it('shows a not-found error when restoring finds no active entitlement', async () => {
    mockRestorePurchases.mockResolvedValue({ entitlements: { active: {} } })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByText('restore_purchases'))

    expect(await screen.findByText('restore_not_found')).toBeTruthy()
    expect(mockBack).not.toHaveBeenCalled()
  })
})
