import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Image, StyleSheet, View } from '@react-pdf/renderer'
import { pdfColors } from '../pdf-theme'

const STAMP_SIZE_PT = 44
const ICON_SIZE_PT = 36

const iconBuffer = readFileSync(join(process.cwd(), 'src/lib/pdf/postcard/assets/passe-icon.png'))

const styles = StyleSheet.create({
  frame: {
    width: STAMP_SIZE_PT,
    height: STAMP_SIZE_PT,
    borderWidth: 1,
    borderColor: pdfColors.darkEspresso,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: ICON_SIZE_PT,
    height: ICON_SIZE_PT,
    objectFit: 'cover',
  },
})

// A faux airmail-style Passé stamp for the postcard's back panel — the real
// app icon standing in for a real postage stamp, not a photo.
export function PostcardStamp() {
  return (
    <View style={styles.frame}>
      <Image src={{ data: iconBuffer, format: 'png' }} style={styles.icon} />
    </View>
  )
}
