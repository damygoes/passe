const { chromium } = require('playwright')

async function run() {
  const browser = await chromium.launch()
  const errors = []

  // Desktop
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[desktop] ${msg.text()}`)
  })
  desktopPage.on('pageerror', (err) => errors.push(`[desktop pageerror] ${err.message}`))
  await desktopPage.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
  await desktopPage.waitForTimeout(1500)
  await desktopPage.screenshot({ path: '/tmp/shot-desktop-hero.png' })
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.25))
  await desktopPage.waitForTimeout(800)
  await desktopPage.screenshot({ path: '/tmp/shot-desktop-stats-features.png' })
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6))
  await desktopPage.waitForTimeout(800)
  await desktopPage.screenshot({ path: '/tmp/shot-desktop-pricing.png' })
  await desktopPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await desktopPage.waitForTimeout(800)
  await desktopPage.screenshot({ path: '/tmp/shot-desktop-cta.png' })
  await desktopPage.close()

  // Mobile
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } })
  mobilePage.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[mobile] ${msg.text()}`)
  })
  mobilePage.on('pageerror', (err) => errors.push(`[mobile pageerror] ${err.message}`))
  await mobilePage.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
  await mobilePage.waitForTimeout(1500)
  await mobilePage.screenshot({ path: '/tmp/shot-mobile-hero.png' })
  const bodyWidth = await mobilePage.evaluate(() => document.body.scrollWidth)
  const viewportWidth = await mobilePage.evaluate(() => window.innerWidth)
  await mobilePage.close()

  await browser.close()

  console.log('Console/page errors:', JSON.stringify(errors, null, 2))
  console.log('Mobile body.scrollWidth:', bodyWidth, 'viewport width:', viewportWidth, bodyWidth > viewportWidth ? '(HORIZONTAL OVERFLOW)' : '(OK)')
}

run().catch((e) => { console.error(e); process.exit(1) })
