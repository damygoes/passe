import { renderHook } from '@testing-library/react-native'
import { useTranslations } from './useTranslations'
import { useI18nContext } from './I18nProvider'

// jest.setup.js mocks '@/i18n/useTranslations' globally for screen tests — this file tests
// the real implementation, so undo that mock before importing it. jest.mock/unmock calls are
// hoisted above imports regardless of where they appear in the file.
jest.unmock('./useTranslations')
jest.mock('./I18nProvider', () => ({ useI18nContext: jest.fn() }))

describe('useTranslations', () => {
  it('resolves a nested key within the namespace', () => {
    jest.mocked(useI18nContext).mockReturnValue({
      locale: 'en',
      messages: { auth: { form: { email_label: 'Email' } } },
    } as never)

    const { result } = renderHook(() => useTranslations('auth.form'))
    expect(result.current('email_label')).toBe('Email')
  })

  it('interpolates ICU values', () => {
    jest.mocked(useI18nContext).mockReturnValue({
      locale: 'en',
      messages: { auth: { form: { check_email_body: 'We sent a code to {email}' } } },
    } as never)

    const { result } = renderHook(() => useTranslations('auth.form'))
    expect(result.current('check_email_body', { email: 'a@b.com' })).toBe(
      'We sent a code to a@b.com',
    )
  })

  it('falls back to the dotted key when no template is found', () => {
    jest.mocked(useI18nContext).mockReturnValue({ locale: 'en', messages: {} } as never)

    const { result } = renderHook(() => useTranslations('auth.form'))
    expect(result.current('missing_key')).toBe('auth.form.missing_key')
  })
})
