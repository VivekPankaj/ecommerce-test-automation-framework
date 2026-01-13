const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    // Deny geolocation permission to avoid location popup
    permissions: []
  });
  
  const page = await context.newPage();
  
  // Deny geolocation permission
  await context.grantPermissions([], { origin: 'https://qa-shop.vulcanmaterials.com' });

  try {
    console.log('1. Going to home page...');
    await page.goto('https://qa-shop.vulcanmaterials.com');
    await page.waitForTimeout(2000);
    
    // Close any blocking dialogs (location popup, welcome modal, etc.)
    console.log('1a. Closing any blocking dialogs...');
    try {
      // Try to close dialog by pressing Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Try to click any close button
      const closeBtn = page.locator('[role="dialog"] button[aria-label*="close"], [role="dialog"] button[aria-label*="Close"], [data-testid="dialog"] button').first();
      if (await closeBtn.isVisible({ timeout: 2000 })) {
        await closeBtn.click();
        await page.waitForTimeout(500);
        console.log('✓ Closed dialog');
      }
    } catch (e) {
      console.log('No dialog to close or already closed');
    }

    console.log('2. Clicking on Sign In...');
    const signInButton = page.locator('text="Sign In"').first();
    if (await signInButton.isVisible({ timeout: 5000 })) {
      await signInButton.click({ force: true });
      await page.waitForTimeout(2000);
    }

    console.log('3. Entering credentials...');
    await page.fill('input[name="email"]', 'vivek.pankaj@publicissapient.com');
    await page.fill('input[name="password"]', 'S@p1ent2014');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(4000);

    console.log('4. Going directly to cart page...');
    await page.goto('https://qa-shop.vulcanmaterials.com/cart');
    await page.waitForTimeout(3000);
    
    // Check if cart has items
    const cartEmpty = await page.locator('text="Your cart is empty"').isVisible().catch(() => false);
    if (cartEmpty) {
      console.log('\n⚠️  Cart is empty. Please add items to cart first and retry.');
      await page.screenshot({ path: 'cart_empty.png' });
      await browser.close();
      return;
    }

    console.log('\n=== INSPECTING REMOVE LINK ===');
    
    // Method 1: Find all elements with "Remove" text
    const allRemoveElements = await page.evaluate(() => {
      const elements = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        null
      );
      
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent || '';
        if (text.includes('Remove') && node.offsetParent !== null) {
          const rect = node.getBoundingClientRect();
          elements.push({
            tagName: node.tagName,
            className: node.className,
            id: node.id,
            text: text.substring(0, 100),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            ariaLabel: node.getAttribute('aria-label'),
            role: node.getAttribute('role'),
            href: node.getAttribute('href')
          });
        }
      }
      return elements;
    });

    console.log('\nAll elements containing "Remove":');
    allRemoveElements.forEach((el, idx) => {
      console.log(`\n${idx + 1}. ${el.tagName} (${el.width}x${el.height})`);
      console.log(`   Position: (${el.x}, ${el.y})`);
      console.log(`   Class: ${el.className}`);
      console.log(`   Text: ${el.text}`);
      console.log(`   Href: ${el.href}`);
      console.log(`   ARIA: ${el.ariaLabel}`);
    });

    // Method 2: Find specifically clickable Remove elements (buttons, links, etc)
    const clickableRemove = await page.evaluate(() => {
      const selectors = [
        'button:contains("Remove")',
        'a:contains("Remove")',
        '[role="button"]:contains("Remove")',
        '[aria-label*="remove" i]',
        '[aria-label*="delete" i]'
      ];
      
      const results = [];
      
      // Find all <a> tags
      document.querySelectorAll('a').forEach(a => {
        const text = a.textContent || '';
        if (text.toLowerCase().includes('remove') && a.offsetParent !== null) {
          const rect = a.getBoundingClientRect();
          results.push({
            type: 'LINK',
            tagName: a.tagName,
            className: a.className,
            text: text.trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            href: a.getAttribute('href')
          });
        }
      });

      // Find all <button> tags
      document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent || '';
        if (text.toLowerCase().includes('remove') && btn.offsetParent !== null) {
          const rect = btn.getBoundingClientRect();
          results.push({
            type: 'BUTTON',
            tagName: btn.tagName,
            className: btn.className,
            text: text.trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            x: Math.round(rect.x),
            y: Math.round(rect.y)
          });
        }
      });

      return results;
    });

    console.log('\n\n=== CLICKABLE REMOVE ELEMENTS ===');
    clickableRemove.forEach((el, idx) => {
      console.log(`\n${idx + 1}. [${el.type}] ${el.tagName} (${el.width}x${el.height})`);
      console.log(`   Position: (${el.x}, ${el.y})`);
      console.log(`   Class: ${el.className}`);
      console.log(`   Text: "${el.text}"`);
      if (el.href) console.log(`   Href: ${el.href}`);
    });

    // Take a screenshot
    await page.screenshot({ path: 'cart_remove_inspection.png', fullPage: true });
    console.log('\n✓ Screenshot saved: cart_remove_inspection.png');

    console.log('\n\nPress Ctrl+C to close the browser...');
    await page.waitForTimeout(60000); // Keep browser open for 60 seconds to inspect manually

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
