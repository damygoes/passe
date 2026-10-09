import coastImg from '@passe/ui/assets/coast.jpg'
import paellaDishImg from '@passe/ui/assets/paella-dish.jpg'
import addMemoriesImg from '@passe/ui/assets/passe-add-memories.jpg'

// Placeholder trip photography — swap for real user/trip photos once supplied.
// One distinct image per slot (no cycling) so nothing repeats down the page.
export const HERO_PHOTO = coastImg
export const KEEP_PHOTO = paellaDishImg
export const HOW_PHOTO = addMemoriesImg

// Real App Store listing — update this one line if the listing URL ever changes.
export const APP_STORE_URL = 'https://apps.apple.com/us/app/passè/id6787004123'

// Shared by the desktop nav row and the mobile menu — one list so the two can't drift.
// `key` indexes `landing.nav`; `href` is a same-page anchor, not a route.
export const ANCHOR_LINKS = [
  { key: 'how', href: '#how' },
  { key: 'what_you_keep', href: '#keep' },
  { key: 'plans', href: '#plans' },
] as const
