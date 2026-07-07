import { expect, test } from '@playwright/test'

// All info pages are public — no auth fixture needed, and no data is created,
// so these tests are unaffected by the global-setup trip sweep.
const PAGES = [
  { path: '/en/privacy-policy', heading: 'Privacy Policy' },
  { path: '/en/terms-of-service', heading: 'Terms of Service' },
  { path: '/en/support', heading: 'Support' },
  { path: '/en/impressum', heading: 'Impressum' },
] as const

test.describe('info pages', () => {
  for (const { path, heading } of PAGES) {
    test(`renders ${path} without requiring auth`, async ({ page }) => {
      await page.goto(path)

      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    })
  }

  test('renders the German privacy policy', async ({ page }) => {
    await page.goto('/de/privacy-policy')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Datenschutzerklärung' }),
    ).toBeVisible()
  })

  test('landing footer links to the privacy policy', async ({ page }) => {
    await page.goto('/en')

    await page.getByRole('link', { name: 'Privacy Policy' }).click()

    await expect(page).toHaveURL(/\/en\/privacy-policy$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()
  })
})
