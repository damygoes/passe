const { chromium } = require('playwright')
async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const overflowing = await page.evaluate(() => {
    const vw = window.innerWidth
    const results = []
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.right > vw + 1 || rect.left < -1) {
        results.push({
          tag: el.tagName,
          cls: (el.className || '').toString().slice(0, 120),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        })
      }
    })
    return results.slice(0, 30)
  })
  console.log(JSON.stringify(overflowing, null, 2))
  await browser.close()
}
run()
