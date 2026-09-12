import { Document, Image, Page, StyleSheet } from '@react-pdf/renderer'
import {
  PostcardBackPanel,
  POSTCARD_PAGE_HEIGHT_PT,
  POSTCARD_PAGE_WIDTH_PT,
} from './PostcardBackPanel'

const styles = StyleSheet.create({
  frontPage: {
    width: POSTCARD_PAGE_WIDTH_PT,
    height: POSTCARD_PAGE_HEIGHT_PT,
  },
  frontImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
})

interface PostcardDocumentProps {
  image: { data: Buffer; format: 'jpg' }
  message?: string
  copyrightYear: number
}

export function PostcardDocument({ image, message, copyrightYear }: PostcardDocumentProps) {
  return (
    <Document title="Postcard" author="Passe">
      <Page
        size={{ width: POSTCARD_PAGE_WIDTH_PT, height: POSTCARD_PAGE_HEIGHT_PT }}
        style={styles.frontPage}
      >
        <Image src={image} style={styles.frontImage} />
      </Page>
      <Page size={{ width: POSTCARD_PAGE_WIDTH_PT, height: POSTCARD_PAGE_HEIGHT_PT }}>
        <PostcardBackPanel message={message} copyrightYear={copyrightYear} />
      </Page>
    </Document>
  )
}
