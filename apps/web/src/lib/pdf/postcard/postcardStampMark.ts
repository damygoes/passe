// Literal copy of the "mark" letterform + accent stroke from
// packages/ui/src/logo/Logo.tsx — not imported, since that component renders
// a DOM <svg>/<path> and @react-pdf/renderer needs its own Svg/Path
// primitives instead (same "mirror, don't import" reasoning as pdf-theme.ts
// for colors). Keep this in sync by hand if the brand mark ever changes.
export const POSTCARD_STAMP_MARK_VIEWBOX = '21.5 3.5 21 45'

export const POSTCARD_STAMP_MARK_PATH =
  'M28.8 46.7Q37.6 46.7 42.65 51.85 47.7 57 47.7 69.1L16.4 69.1 16.2 67.2 33.1 67.2Q33.2 62.3 32.7 58.15 32.2 54 31.1 51.5 30 49 28.1 49 25.4 49 23.7 53.25 22 57.5 21.5 67.8L21.9 68.6Q21.8 69.6 21.8 70.6 21.8 71.6 21.8 72.7 21.8 79.7 23.55 83.6 25.3 87.5 27.95 89 30.6 90.5 33.3 90.5 34.7 90.5 36.65 90.1 38.6 89.7 40.9 88.25 43.2 86.8 45.4 83.8L47.1 84.4Q45.9 88.4 43.25 92.35 40.6 96.3 36.4 98.85 32.2 101.4 26.2 101.4 19.8 101.4 14.55 98.8 9.3 96.2 6.2 90.2 3.1 84.2 3.1 74.1 3.1 64.5 6.5 58.45 9.9 52.4 15.75 49.55 21.6 46.7 28.8 46.7Z'

export const POSTCARD_STAMP_MARK_TRANSFORM = 'translate(21.33 5) scale(0.42)'

export const POSTCARD_STAMP_ACCENT_PATH = 'M27 15 L38 8'
