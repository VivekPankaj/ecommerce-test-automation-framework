const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://dev-shop.vulcanmaterials.com/category/C001');
  await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 10000 });

  const firstTile = page.locator('[data-component-type="s-search-result"]').first();
  const html = await firstTile.innerHTML();
  fs.writeFileSync('tile_html.txt', html);

  await browser.close();
})();
