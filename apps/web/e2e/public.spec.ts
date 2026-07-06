import { expect, test } from '@playwright/test'

test.describe('landing page', () => {
  test('renders hero, features, and pricing sections', async ({ page }) => {
    await page.goto('/en')

    await expect(page.getByRole('heading', { name: /The past,/ })).toBeVisible()
    // "Start for free" appears in the hero, the pricing card, and the final CTA — any one of
    // them proves the page rendered.
    await expect(page.getByRole('link', { name: 'Start for free' }).first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Everything you need to preserve your travels' }),
    ).toBeVisible()
  })

  test('switches locale and persists it in the URL', async ({ page }) => {
    await page.goto('/en')

    await page.getByRole('button', { name: 'Change language' }).click()
    await page.getByRole('menuitemradio', { name: /Deutsch/ }).click()

    await expect(page).toHaveURL(/\/de$/)
  })

  test('toggles between light and dark theme', async ({ page }) => {
    await page.goto('/en')
    const html = page.locator('html')

    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await page.getByRole('menuitem', { name: 'Dark' }).click()
    await expect(html).toHaveClass(/dark/)

    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await page.getByRole('menuitem', { name: 'Light' }).click()
    await expect(html).toHaveClass(/light/)
  })
})

test.describe('auth pages', () => {
  test('sign-in shows a validation error on an invalid email', async ({ page }) => {
    await page.goto('/en/sign-in')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Password', { exact: true }).fill('x')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByText('Enter a valid email address')).toBeVisible()
  })

  test('sign-up shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/en/sign-up')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect(page.getByText('Display name is required')).toBeVisible()
  })

  test('forgot-password shows a validation error on an invalid email', async ({ page }) => {
    await page.goto('/en/forgot-password')
    await page.getByLabel('Email address').fill('not-an-email')
    await page.getByRole('button', { name: 'Send reset code' }).click()

    await expect(page.getByText('Enter a valid email address')).toBeVisible()
  })
})

test.describe('public portfolio', () => {
  test('shows a not-found page for a nonexistent slug', async ({ page }) => {
    await page.goto('/u/this-user-does-not-exist')

    await expect(page.getByRole('heading', { name: 'Portfolio not found' })).toBeVisible()
  })
})
