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

  // Get all h2 elements in the modal
  const h2Elements = await page.locator('h2').all();
  console.log('Found h2 elements:');
  for (let i = 0; i < h2Elements.length; i++) {
    const text = await h2Elements[i].textContent();
    const className = await h2Elements[i].getAttribute('class');
    console.log(`h2[${i}]: text='${text}', class='${className}'`);
  }

  // Get all p elements that might be subtext
  const pElements = await page.locator('p').all();
  console.log('\nFound p elements:');
  for (let i = 0; i < Math.min(pElements.length, 20); i++) {
    const text = await pElements[i].textContent();
    const className = await pElements[i].getAttribute('class');
    console.log(`p[${i}]: text='${text}', class='${className}'`);
  }

  // Look for swatches
  const swatchElements = await page.locator('p').filter({ hasText: /tons/ }).all();
  console.log('\nFound swatch elements:');
  for (let i = 0; i < swatchElements.length; i++) {
    const text = await swatchElements[i].textContent();
    const className = await swatchElements[i].getAttribute('class');
    console.log(`swatch[${i}]: text='${text}', class='${className}'`);
  }

  // Look for input fields
  const inputElements = await page.locator('input').all();
  console.log('\nFound input elements:');
  for (let i = 0; i < inputElements.length; i++) {
    const placeholder = await inputElements[i].getAttribute('placeholder');
    const id = await inputElements[i].getAttribute('id');
    const className = await inputElements[i].getAttribute('class');
    console.log(`input[${i}]: placeholder='${placeholder}', id='${id}', class='${className}'`);
  }

  // Look for buttons
  const buttonElements = await page.locator('button').all();
  console.log('\nFound button elements:');
  for (let i = 0; i < Math.min(buttonElements.length, 10); i++) {
    const text = await buttonElements[i].textContent();
    const className = await buttonElements[i].getAttribute('class');
    const ariaLabel = await buttonElements[i].getAttribute('aria-label');
    console.log(`button[${i}]: text='${text}', aria-label='${ariaLabel}', class='${className}'`);
  }

  await browser.close();
})();
