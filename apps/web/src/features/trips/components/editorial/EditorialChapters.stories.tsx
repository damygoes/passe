import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EditorialChapters } from './EditorialChapters'
import type { EditorialMemoryData } from './editorial-types'

const meta: Meta<typeof EditorialChapters> = {
  title: 'Trips/Editorial/EditorialChapters',
  component: EditorialChapters,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto w-[42rem] max-w-full">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EditorialChapters>

function memory(overrides: Partial<EditorialMemoryData> & Pick<EditorialMemoryData, 'id'>) {
  return {
    note: null,
    city: null,
    country: null,
    capturedAt: '2024-03-05',
    media: [],
    ...overrides,
  }
}

export const Default: Story = {
  args: {
    photoAlt: 'Memory photo',
    scrollLeftLabel: 'Scroll left',
    scrollRightLabel: 'Scroll right',
    chapters: [
      {
        key: 'marrakech-0',
        title: 'Marrakech',
        subtitle: 'March 2024',
        sections: [
          {
            variant: 'hero',
            memory: memory({
              id: 'mem_1',
              note: 'Rooftop views over the Jemaa el-Fnaa at dusk.',
              city: 'Marrakech',
              country: 'Morocco',
              media: [
                {
                  id: 'media_1',
                  url: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1200&q=80',
                },
              ],
            }),
          },
          {
            variant: 'text',
            memory: memory({
              id: 'mem_2',
              note: 'Some places don’t need a photo to be remembered.',
              city: 'Marrakech',
              country: 'Morocco',
              capturedAt: '2024-03-06',
            }),
          },
        ],
      },
      {
        key: 'merzouga-1',
        title: 'Merzouga',
        subtitle: undefined,
        sections: [
          {
            variant: 'imageLeft',
            memory: memory({
              id: 'mem_3',
              note: 'Camel trek into the dunes as the sun went down.',
              city: 'Merzouga',
              country: 'Morocco',
              capturedAt: '2024-03-09',
              media: [
                {
                  id: 'media_2',
                  url: 'https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1200&q=80',
                },
              ],
            }),
          },
          {
            variant: 'polaroid',
            memory: memory({
              id: 'mem_4',
              note: 'One last look before we left the dunes.',
              city: 'Merzouga',
              country: 'Morocco',
              capturedAt: '2024-03-10',
              media: [
                {
                  id: 'media_3',
                  url: 'https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=1200&q=80',
                },
              ],
            }),
          },
        ],
      },
    ],
  },
}

export const Scrapbook: Story = {
  args: Default.args,
  decorators: [
    (Story) => (
      <div data-theme="scrapbook" className="mx-auto w-[42rem] max-w-full bg-background p-4">
        <Story />
      </div>
    ),
  ],
}
