import * as Localization from 'expo-localization'
import { DEFAULT_LOCALE } from '@passe/i18n'
import { detectDeviceLocale } from './locale'

jest.mock('expo-localization', () => ({ getLocales: jest.fn() }))

describe('detectDeviceLocale', () => {
  it('returns the device locale when it is supported', () => {
    jest.mocked(Localization.getLocales).mockReturnValue([{ languageCode: 'de' }] as never)
    expect(detectDeviceLocale()).toBe('de')
  })

  it('falls back to the default locale when unsupported', () => {
    jest.mocked(Localization.getLocales).mockReturnValue([{ languageCode: 'xx' }] as never)
    expect(detectDeviceLocale()).toBe(DEFAULT_LOCALE)
  })

  it('falls back to the default locale when there are no device locales', () => {
    jest.mocked(Localization.getLocales).mockReturnValue([] as never)
    expect(detectDeviceLocale()).toBe(DEFAULT_LOCALE)
  })
})
