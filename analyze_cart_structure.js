const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Opening cart page (assuming items already in cart from previous test)...');
    await page.goto('https://qa-shop.vulcanmaterials.com/cart');
    await page.waitForTimeout(5000);

    console.log('\n=== ANALYZING REMOVE LINK STRUCTURE ===\n');
    
    // Get detailed information about all Remove elements
    const removeAnalysis = await page.evaluate(() => {
      const results = {
        allLinks: [],
        allButtons: [],
        smallElements: [],
        largeElements: []
      };
      
      // Analyze all <a> tags
      document.querySelectorAll('a').forEach((el, idx) => {
        const text = (el.textContent || '').trim();
        if (text.toLowerCase().includes('remove') && el.offsetParent !== null) {
          const rect = el.getBoundingClientRect();
          const info = {
            index: idx,
            tagName: el.tagName,
            className: el.className,
            text: text.substring(0, 150),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            href: el.getAttribute('href'),
            children: el.children.length,
            innerHTML: el.innerHTML.substring(0, 200)
          };
          
          results.allLinks.push(info);
          
          // Categorize by size
          if (rect.width < 100 && rect.height < 50) {
            results.smallElements.push({ ...info, type: 'LINK' });
          } else {
            results.largeElements.push({ ...info, type: 'LINK' });
          }
        }
      });
      
      // Analyze all <button> tags
      document.querySelectorAll('button').forEach((el, idx) => {
        const text = (el.textContent || '').trim();
        if (text.toLowerCase().includes('remove') && el.offsetParent !== null) {
          const rect = el.getBoundingClientRect();
          const info = {
            index: idx,
            tagName: el.tagName,
            className: el.className,
            text: text.substring(0, 150),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            ariaLabel: el.getAttribute('aria-label'),
            innerHTML: el.innerHTML.substring(0, 200)
          };
          
          results.allButtons.push(info);
          
          if (rect.width < 100 && rect.height < 50) {
            results.smallElements.push({ ...info, type: 'BUTTON' });
          } else {
            results.largeElements.push({ ...info, type: 'BUTTON' });
          }
        }
      });
      
      return results;
    });

    console.log('==================== ALL LINKS WITH "REMOVE" ====================');
    removeAnalysis.allLinks.forEach((el, idx) => {
      console.log(`\n${idx + 1}. <a> ${el.width}x${el.height}px at (${el.x}, ${el.y})`);
      console.log(`   Class: ${el.className}`);
      console.log(`   Text: "${el.text}"`);
      console.log(`   Href: ${el.href}`);
      console.log(`   Children: ${el.children}`);
      console.log(`   HTML: ${el.innerHTML}`);
    });

    console.log('\n\n==================== ALL BUTTONS WITH "REMOVE" ====================');
    removeAnalysis.allButtons.forEach((el, idx) => {
      console.log(`\n${idx + 1}. <button> ${el.width}x${el.height}px at (${el.x}, ${el.y})`);
      console.log(`   Class: ${el.className}`);
      console.log(`   Text: "${el.text}"`);
      console.log(`   ARIA: ${el.ariaLabel}`);
      console.log(`   HTML: ${el.innerHTML}`);
    });

    console.log('\n\n==================== SMALL REMOVE ELEMENTS (<100x50) ====================');
    console.log('These are likely the actual Remove link/button to click:\n');
    removeAnalysis.smallElements.forEach((el, idx) => {
      console.log(`${idx + 1}. [${el.type}] <${el.tagName.toLowerCase()}> ${el.width}x${el.height}px`);
      console.log(`   Position: (${el.x}, ${el.y})`);
      console.log(`   Text: "${el.text}"`);
      console.log(`   Class: ${el.className}`);
      if (el.href) console.log(`   Href: ${el.href}`);
      if (el.ariaLabel) console.log(`   ARIA: ${el.ariaLabel}`);
      console.log('');
    });

    console.log('\n==================== LARGE REMOVE ELEMENTS (>100x50) ====================');
    console.log('These are likely product cards wrapping the Remove link:\n');
    removeAnalysis.largeElements.forEach((el, idx) => {
      console.log(`${idx + 1}. [${el.type}] <${el.tagName.toLowerCase()}> ${el.width}x${el.height}px`);
      console.log(`   Text preview: "${el.text.substring(0, 80)}..."`);
      console.log('');
    });

    // Take screenshot
    await page.screenshot({ path: 'cart_structure_analysis.png', fullPage: true });
    console.log('\n✓ Screenshot saved: cart_structure_analysis.png');

    console.log('\n\nKeeping browser open for manual inspection...');
    console.log('Press Ctrl+C to close.');
    await page.waitForTimeout(120000);

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
})();
