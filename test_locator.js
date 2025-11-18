const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://dev-shop.vulcanmaterials.com/category/C001');
  await page.waitForLoadState('domcontentloaded');

  // Wait for product tiles
  await page.waitForSelector('div.component--product-tile', { timeout: 10000 });

  // Click on qty selector arrow
  await page.locator('div.flex.items-center.gap-2 > svg.MuiSvgIcon-root >path').click();

  // Wait for modal to appear
  await page.waitForTimeout(2000);

  try {
    // Test the new header locator
    const header = page.locator('h2:has-text("Select Quantity")');
    const headerText = await header.textContent();
    console.log('Header found:', headerText);
  } catch (error) {
    console.log('Header locator failed:', error.message);
  }

  try {
    // Test the subtext locator
    const subtext = page.locator('p:has-text("Select an option or Custom amount")');
    const subtextContent = await subtext.textContent();
    console.log('Subtext found:', subtextContent);
  } catch (error) {
    console.log('Subtext locator failed:', error.message);
  }

  try {
    // Test swatches
    const swatches = page.locator('p.component--typography.global-text-reg-bold').filter({ hasText: /tons/ });
    const count = await swatches.count();
    console.log('Swatches found:', count);
    for (let i = 0; i < count; i++) {
      const text = await swatches.nth(i).textContent();
      console.log(`Swatch ${i}:`, text);
    }
  } catch (error) {
    console.log('Swatches locator failed:', error.message);
  }

  try {
    // Test custom quantity field
    const input = page.locator('input[placeholder*="Custom"]');
    const placeholder = await input.getAttribute('placeholder');
    console.log('Custom quantity input placeholder:', placeholder);
  } catch (error) {
    console.log('Custom quantity input locator failed:', error.message);
  }

  try {
    // Test save button
    const saveBtn = page.locator('button:has-text("Save")');
    const saveText = await saveBtn.textContent();
    console.log('Save button text:', saveText);
  } catch (error) {
    console.log('Save button locator failed:', error.message);
  }

  try {
    // Test close button
    const closeBtn = page.locator('button[aria-label="close"]');
    const ariaLabel = await closeBtn.getAttribute('aria-label');
    console.log('Close button aria-label:', ariaLabel);
  } catch (error) {
    console.log('Close button locator failed:', error.message);
  }

  await browser.close();
})();
