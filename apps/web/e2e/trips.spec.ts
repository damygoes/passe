import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// The date-picker trigger has id="startDate"/"endDate" (see TripForm.tsx). Clicking it opens a
// Base UI popover with a react-day-picker calendar; day cells are buttons whose visible text is
// just the day-of-month, but whose *accessible name* (what getByRole matches against) is the
// full date — e.g. "Friday, July 10th, 2026". Match the ordinal-day pattern instead of the bare
// number, with a `\b` before the day so day 1 doesn't also match inside "21st"/"31st". Picking
// days within the current month keeps this independent of today's date without needing month
// navigation.
async function pickDate(page: Page, triggerId: string, day: number) {
  await page.locator(`#${triggerId}`).click()
  await page.getByRole('button', { name: new RegExp(`\\b${day}(st|nd|rd|th),`) }).click()
  // Wait for this popover to actually close before the caller opens the next one — otherwise
  // a still-closing first popover and the newly-opened second one can both briefly show the
  // same day, and getByRole matches both (strict-mode violation).
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
}

test.describe('authenticated trip flows', () => {
  test('creates a trip, adds a memory, edits the trip, then cleans up', async ({
    signedInPage: page,
  }) => {
    // --- Create a trip ---
    await page.goto('/en/dashboard')
    await page.getByRole('link', { name: 'New trip' }).click()
    await expect(page).toHaveURL(/\/trips\/new$/)

    const tripTitle = `E2E Trip ${Date.now()}`
    await page.getByLabel('Title').fill(tripTitle)
    await page.getByPlaceholder('Type a country and press enter').fill('France')
    await page.keyboard.press('Enter')

    await pickDate(page, 'startDate', 10)
    await pickDate(page, 'endDate', 15)

    // Free-plan test user should see the gated hint, not an enabled public toggle.
    await expect(page.getByText('Upgrade to Explorer or Collector to share trips publicly.')).toBeVisible()

    await page.getByRole('button', { name: 'Create trip' }).click()
    await expect(page).toHaveURL(/\/trips\/[^/]+$/)
    // PageHeaderTitle renders a plain styled <div>, not a semantic heading element.
    await expect(page.getByText(tripTitle)).toBeVisible()

    const tripId = page.url().split('/trips/')[1]!.split(/[/?]/)[0]!

    // --- Add a memory ---
    await page.getByRole('link', { name: 'Add memory' }).click()
    await expect(page).toHaveURL(new RegExp(`/trips/${tripId}/memories/new$`))

    const noteText = `E2E memory ${Date.now()}`
    await page.getByLabel('Note').fill(noteText)
    await page.getByRole('button', { name: 'Add memory' }).click()

    await expect(page).toHaveURL(new RegExp(`/trips/${tripId}$`))
    await expect(page.getByText(noteText)).toBeVisible()

    // --- Edit the trip ---
    await page.goto(`/en/trips/${tripId}/edit`)
    const updatedTitle = `${tripTitle} (updated)`
    await page.getByLabel('Title').fill(updatedTitle)
    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page).toHaveURL(new RegExp(`/trips/${tripId}$`))
    await expect(page.getByText(updatedTitle)).toBeVisible()

    // --- Cleanup — no delete UI exists for trips (or a reliable one for memories) on web,
    // so remove what this test created directly via the authenticated API. ---
    await page.request.delete(`/api/trips/${tripId}`)
  })

  test('signs out via the navbar user menu', async ({ signedInPage: page }) => {
    await page.goto('/en/dashboard')
    // NavbarUserMenu — the desktop-only sign-out entry point (MobileMenu covers small
    // viewports); the trigger's accessible name includes the e2e user's display name.
    await page.getByRole('button', { name: /E2E Test/ }).click()
    await page.getByRole('menuitem', { name: 'Sign out' }).click()

    await expect(page).toHaveURL(/\/en\/sign-in$/)
  })
})
