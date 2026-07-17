import amalfiCoastImg from '@passe/ui/assets/amalfi-coast.jpg'
import paellaDishImg from '@passe/ui/assets/paella-dish.jpg'
import tripsImg from '@passe/ui/assets/passe-trips.jpg'
import memoriesImg from '@passe/ui/assets/passe-memories.jpg'
import createTripImg from '@passe/ui/assets/passe-create-trip.jpg'
import addMemoriesImg from '@passe/ui/assets/passe-add-memories.jpg'
import sharePortfolioImg from '@passe/ui/assets/passe-share-portfolio.jpg'

// Placeholder trip photography — swap for real user/trip photos once supplied.
// One distinct image per slot (no cycling) so nothing repeats down the page.
export const HERO_PHOTO = amalfiCoastImg

export const FEATURES_PHOTOS = [tripsImg, memoriesImg, paellaDishImg] as const
export const HOW_PHOTOS = [createTripImg, addMemoriesImg, sharePortfolioImg] as const

// Mobile mockup screenshots — front (primary) and back (secondary) phone.
export const MOBILE_SCREENSHOT_PRIMARY = '/mobile-app-preview.png'
export const MOBILE_SCREENSHOT_SECONDARY = '/mobile-app-preview-2.png'
