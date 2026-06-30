import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../button/Button'
import { PageHeader, PageHeaderAction, PageHeaderDescription, PageHeaderTitle } from './PageHeader'

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle>My Trips</PageHeaderTitle>
    </PageHeader>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle>My Trips</PageHeaderTitle>
      <PageHeaderDescription>12 trips across 8 countries</PageHeaderDescription>
    </PageHeader>
  ),
}

export const WithAction: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle>My Trips</PageHeaderTitle>
      <PageHeaderAction>
        <Button size="sm">New trip</Button>
      </PageHeaderAction>
    </PageHeader>
  ),
}

export const Full: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderTitle>My Trips</PageHeaderTitle>
      <PageHeaderDescription>12 trips across 8 countries</PageHeaderDescription>
      <PageHeaderAction>
        <Button size="sm">New trip</Button>
      </PageHeaderAction>
    </PageHeader>
  ),
}
