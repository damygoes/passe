const { chromium } = require('playwright')
async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: '/tmp/shot-reduced-motion-hero.png' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(800)
  await page.screenshot({ path: '/tmp/shot-reduced-motion-cta.png' })
  console.log('errors:', JSON.stringify(errors))
  await browser.close()
}
run()
