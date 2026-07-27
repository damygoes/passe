const { chromium } = require('playwright')
async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const el = await page.locator('text=Choose your plan').first().elementHandle().catch(() => null)
  if (el) {
    await el.scrollIntoViewIfNeeded()
  } else {
    // fallback: find heading near pricing by scanning h2 text
    await page.evaluate(() => {
      const heading = [...document.querySelectorAll('h2')].find(h => /plan/i.test(h.textContent || ''))
      heading?.scrollIntoView({ block: 'center' })
    })
  }
  await page.waitForTimeout(1200)
  await page.screenshot({ path: '/tmp/shot-pricing-actual.png' })
  await browser.close()
}
run()
