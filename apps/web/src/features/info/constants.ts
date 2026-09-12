// Temporary support mailbox — swap for an @passe.cc address once the mailbox exists.
export const SUPPORT_EMAIL = 'thepasseapp@gmail.com'

// Legal identity shown in the privacy policy, terms of service, and Impressum.
// Fill these in before launch — § 5 DDG requires a real postal address (no P.O. box).
// The values are language-neutral: both the EN and DE pages interpolate them.
export const LEGAL_NAME = 'Passe'
export const LEGAL_STREET = 'Franz-Philipp-Straße'
export const LEGAL_CITY = '77656 Offenburg'

// Interpolation values available to every info-page message ({email}, {legalName}, …)
export const INFO_MESSAGE_VALUES = {
  email: SUPPORT_EMAIL,
  legalName: LEGAL_NAME,
  legalStreet: LEGAL_STREET,
  legalCity: LEGAL_CITY,
} as const
