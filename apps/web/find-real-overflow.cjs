const { chromium } = require('playwright')
async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  const result = await page.evaluate(() => {
    function isClipped(el) {
      let node = el.parentElement
      while (node) {
        const style = getComputedStyle(node)
        if (style.overflowX === 'hidden' || style.overflowX === 'clip' || style.overflow === 'hidden') {
          return true
        }
        node = node.parentElement
      }
      return false
    }
    const vw = window.innerWidth
    const results = []
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if ((rect.right > vw + 1 || rect.left < -1) && rect.width > 0) {
        if (!isClipped(el)) {
          results.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 150),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          })
        }
      }
    })
    return { bodyScrollWidth: document.body.scrollWidth, unclipped: results.slice(0, 20) }
  })
  console.log(JSON.stringify(result, null, 2))
  await browser.close()
}
run()
