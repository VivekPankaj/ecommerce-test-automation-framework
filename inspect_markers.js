const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to the site
    await page.goto('https://qa-shop.vulcanmaterials.com/category/categories/C001');
    await page.waitForTimeout(3000);
    
    // Click Pickup Instead
    await page.click('button:has-text("Pickup Instead")');
    await page.waitForTimeout(1000);
    
    // Enter zip code
    await page.fill('#location-autocomplete', '37303');
    await page.waitForTimeout(1500);
    
    // Select first suggestion
    await page.click('li[role="option"]');
    await page.waitForTimeout(2000);
    
    // Now inspect the map structure
    console.log('\n=== INSPECTING MAP MARKER STRUCTURE ===\n');
    
    // Find gm-style container
    const gmStyleExists = await page.locator('.gm-style').count();
    console.log(`gm-style containers: ${gmStyleExists}`);
    
    // Check for various marker-like elements
    const selectors = [
        '.gm-style [role="button"]',
        '.gm-style button',
        '.gm-style img',
        '.gm-style svg',
        '[class*="marker"]',
        '[aria-label*="marker"]',
        '[aria-label*="location"]',
        '[aria-label*="facility"]',
        '[data-marker-id]',
        '.gm-style [tabindex]'
    ];
    
    for (const sel of selectors) {
        const count = await page.locator(sel).count();
        if (count > 0 && count < 50) {
            console.log(`\n${sel}: ${count} elements`);
            // Get sample attributes
            for (let i = 0; i < Math.min(count, 3); i++) {
                const el = page.locator(sel).nth(i);
                const ariaLabel = await el.getAttribute('aria-label').catch(() => null);
                const title = await el.getAttribute('title').catch(() => null);
                const className = await el.getAttribute('class').catch(() => null);
                const role = await el.getAttribute('role').catch(() => null);
                console.log(`  [${i}] aria-label: "${ariaLabel}", title: "${title}", class: "${className?.substring(0,50)}...", role: "${role}"`);
            }
        }
    }
    
    // Check outer HTML of potential markers
    console.log('\n=== DETAILED MARKER HTML ===\n');
    const buttons = await page.locator('.gm-style button[aria-label]').all();
    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const html = await buttons[i].evaluate(el => el.outerHTML.substring(0, 300));
        console.log(`Button ${i}: ${html}...`);
    }
    
    await page.waitForTimeout(5000);
    await browser.close();
})();
