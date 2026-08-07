import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { PaywallScreen } from './PaywallScreen'

const mockUseUser = jest.fn()
const mockInvalidateQueries = jest.fn()
jest.mock('@passe/hooks', () => ({
  useUser: () => mockUseUser(),
  queryKeys: { user: () => ['user'] },
}))
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
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

  it('purchases a package and shows a success message', async () => {
    mockPurchasePackage.mockResolvedValue(undefined)
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getAllByText('upgrade_to')[0]!)

    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
    expect(await screen.findByText('purchase_success')).toBeTruthy()
  })

  it('stays silent when the purchase is user-cancelled', async () => {
    mockPurchasePackage.mockRejectedValue({ code: 'PURCHASE_CANCELLED_ERROR' })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getAllByText('upgrade_to')[0]!)

    await waitFor(() => expect(mockPurchasePackage).toHaveBeenCalled())
    expect(screen.queryByText('purchase_error')).toBeNull()
    expect(screen.queryByText('purchase_success')).toBeNull()
  })

  it('shows an error banner when the purchase fails for another reason', async () => {
    mockPurchasePackage.mockRejectedValue({ code: 'STORE_PROBLEM_ERROR' })
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getAllByText('upgrade_to')[0]!)

    expect(await screen.findByText('purchase_error')).toBeTruthy()
  })

  it('restores purchases and shows a success message', async () => {
    mockRestorePurchases.mockResolvedValue(undefined)
    render(<PaywallScreen />)
    await screen.findByText('€4.99')

    fireEvent.press(screen.getByText('restore_purchases'))

    await waitFor(() => expect(mockRestorePurchases).toHaveBeenCalled())
    expect(await screen.findByText('restore_success')).toBeTruthy()
  })
})
