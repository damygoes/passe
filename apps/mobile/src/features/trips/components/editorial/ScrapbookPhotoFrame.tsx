import { colors as brandColors } from '@passe/theme'
import { polaroidTilt } from '@passe/utils'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Polygon } from 'react-native-svg'

import { useTheme } from '@/hooks/useTheme'
import type { ScrapbookPhotoFrameProps } from './ScrapbookPhotoFrame.types'

const warmWhite = brandColors.warmWhite.DEFAULT
const espresso = brandColors.darkEspresso.DEFAULT
const sandyBeige = brandColors.sandyBeige.DEFAULT
const sandyBeigeDark = brandColors.sandyBeige.dark

const CORNER_SIZE = 24

// Mirrors web's PhotoCornerAccent — two diagonal paper corners (top-left +
// bottom-right) holding the photo in place, drawn with react-native-svg
// since RN has no clip-path.
function PhotoCornerAccent() {
  return (
    <>
      <Svg
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        style={{ position: 'absolute', top: 0, left: 0 }}
        pointerEvents="none"
      >
        <Polygon points={`0,0 ${CORNER_SIZE},0 0,${CORNER_SIZE}`} fill={`${sandyBeigeDark}CC`} />
      </Svg>
      <Svg
        width={CORNER_SIZE}
        height={CORNER_SIZE}
        style={{ position: 'absolute', bottom: 0, right: 0 }}
        pointerEvents="none"
      >
        <Polygon
          points={`${CORNER_SIZE},0 ${CORNER_SIZE},${CORNER_SIZE} 0,${CORNER_SIZE}`}
          fill={`${sandyBeigeDark}CC`}
        />
      </Svg>
    </>
  )
}

// A short strip of "washi tape" pinning the top of the frame — mirrors web's TapeAccent.
function TapeAccent() {
  return <View style={styles.tape} pointerEvents="none" />
}

// Wraps an existing photo block in a paper-frame/shadow/tilt treatment under
// the scrapbook theme, and does nothing under editorial (children render
// unchanged). Applied to every photo-bearing editorial section so the
// theme's visual difference doesn't depend on which layout variant a memory
// happens to use — mirrors web's ScrapbookPhotoFrame.
export function ScrapbookPhotoFrame({ id, size, style, children }: ScrapbookPhotoFrameProps) {
  const { isScrapbook, spacing } = useTheme()
  const tilt = polaroidTilt(id)

  const frameStyle = useMemo(() => {
    const rotateDeg = size === 'lg' ? (tilt === 'left' ? -1 : 1) : tilt === 'left' ? -2 : 2
    return StyleSheet.create({
      style: {
        backgroundColor: warmWhite,
        padding: size === 'lg' ? spacing[3] : spacing[2] + 2,
        shadowColor: espresso,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 5,
        transform: [{ rotate: `${rotateDeg}deg` }],
      },
    }).style
  }, [size, spacing, tilt])

  if (!isScrapbook) {
    return <View style={style}>{children}</View>
  }

  return (
    <View style={[frameStyle, style]}>
      {tilt === 'left' ? <TapeAccent /> : <PhotoCornerAccent />}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  tape: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -40,
    height: 24,
    width: 80,
    backgroundColor: `${sandyBeige}99`,
    transform: [{ rotate: '-1deg' }],
  },
})
