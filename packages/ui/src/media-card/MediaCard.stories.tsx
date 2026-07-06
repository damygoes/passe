import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../badge/Badge'
import {
  MediaCard,
  MediaCardDescription,
  MediaCardMedia,
  MediaCardScrim,
  MediaCardTitle,
} from './MediaCard'

const COVER_URL =
  'https://images.unsplash.com/photo-1656066848895-30feffe87ed6?w=800&auto=format&fit=crop&q=60'

const meta: Meta<typeof MediaCard> = {
  title: 'Components/MediaCard',
  component: MediaCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MediaCard>

function ExampleCard({ tilt }: { tilt?: 'none' | 'left' | 'right' }) {
  return (
    <MediaCard tilt={tilt} className="w-80">
      <MediaCardMedia>
        <img src={COVER_URL} alt="Trip cover" />
      </MediaCardMedia>
      <MediaCardScrim>
        <MediaCardTitle>Bali Summer &rsquo;24</MediaCardTitle>
        <MediaCardDescription>Jun 12 &ndash; Jun 28, 2024</MediaCardDescription>
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          <Badge variant="stamp" className="text-aged-cream">
            Indonesia
          </Badge>
        </div>
      </MediaCardScrim>
    </MediaCard>
  )
}

export const Default: Story = {
  render: () => <ExampleCard />,
}

export const TiltLeft: Story = {
  render: () => <ExampleCard tilt="left" />,
}

export const TiltRight: Story = {
  render: () => <ExampleCard tilt="right" />,
}

export const Grid: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-6 p-4">
      <ExampleCard tilt="left" />
      <ExampleCard tilt="right" />
      <ExampleCard tilt="right" />
      <ExampleCard tilt="left" />
    </div>
  ),
}

export const NoImage: Story = {
  render: () => (
    <MediaCard className="w-80 bg-gradient-to-br from-sandy-beige via-sandy-beige-dark to-terracotta/40">
      <MediaCardScrim>
        <MediaCardTitle>Roadtrip Notes</MediaCardTitle>
        <MediaCardDescription>Mar 2 &ndash; Mar 9, 2025</MediaCardDescription>
      </MediaCardScrim>
    </MediaCard>
  ),
}
