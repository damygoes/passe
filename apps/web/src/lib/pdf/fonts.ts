import { join } from 'node:path'
import { Font } from '@react-pdf/renderer'

// The web app never loads real webfont files (see apps/web/CLAUDE.md — the
// browser silently falls back to system fonts), so there's nothing to reuse
// here. These .ttf files started as the @fontsource/* npm packages (SIL Open
// Font License), vendored locally rather than fetched from Google's CDN at
// request time so PDF generation has no external network dependency. They're
// TTF, not @fontsource's native .woff2: fontkit (the glyph subsetter
// @react-pdf/renderer embeds fonts with) silently produces corrupted/blank
// glyph outlines from these particular WOFF2 files — verified by rendering
// real output PDFs, not just checking they don't throw — while the
// fontTools-converted TTF equivalents render correctly. Regenerate via
// `TTFont(path); font.flavor = None; font.save(...)` if these ever need
// updating, not by re-copying .woff2 from @fontsource.
const FONTS_DIR = join(process.cwd(), 'src/lib/pdf/fonts')

export const pdfFontFamilies = {
  display: 'PDF Playfair Display',
  heading: 'PDF Lora',
  mono: 'PDF DM Mono',
} as const

let registered = false

// Font registration is process-global and idempotent by design (@react-pdf's
// FontStore keys off family name) — safe to call on every PDF generation.
export function registerPdfFonts(): void {
  if (registered) return
  registered = true

  Font.register({
    family: pdfFontFamilies.display,
    fonts: [
      { src: join(FONTS_DIR, 'PlayfairDisplay-Regular.ttf'), fontWeight: 400 },
      { src: join(FONTS_DIR, 'PlayfairDisplay-Bold.ttf'), fontWeight: 700 },
    ],
  })

  Font.register({
    family: pdfFontFamilies.heading,
    fonts: [
      { src: join(FONTS_DIR, 'Lora-Regular.ttf'), fontWeight: 400 },
      { src: join(FONTS_DIR, 'Lora-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
      { src: join(FONTS_DIR, 'Lora-SemiBold.ttf'), fontWeight: 600 },
    ],
  })

  Font.register({
    family: pdfFontFamilies.mono,
    fonts: [
      { src: join(FONTS_DIR, 'DMMono-Regular.ttf'), fontWeight: 400 },
      { src: join(FONTS_DIR, 'DMMono-Medium.ttf'), fontWeight: 500 },
    ],
  })

  // Editorial body copy (memory notes) mixes plain and italic runs within
  // the same block — disable hyphenation rather than let @react-pdf's
  // default English hyphenation dictionary mis-break travel/place names.
  Font.registerHyphenationCallback((word) => [word])
}
