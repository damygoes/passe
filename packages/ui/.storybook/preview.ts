import type { Preview } from '@storybook/react'
import './preview.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#faf8f5' },
        { name: 'dark', value: '#1a0f0a' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
}

export default preview
