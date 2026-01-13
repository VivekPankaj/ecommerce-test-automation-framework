const { chromium } = require('@playwright/test');

async function inspectCart() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        console.log('=== INSPECTING CART PAGE STRUCTURE ===\n');
        
        // Step 1: Navigate to cart (assuming user is already logged in or cart has session)
        console.log('Navigating to cart page...');
        await page.goto('https://qa-shop.vulcanmaterials.com/cart', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);
        
        // Take a screenshot
        await page.screenshot({ path: 'cart_structure.png', fullPage: true });
        console.log('Screenshot saved: cart_structure.png\n');
        
        // Step 2: Find all elements that contain "Remove" text
        console.log('=== ANALYZING ALL ELEMENTS WITH "Remove" TEXT ===\n');
        
        const removeElements = await page.evaluate(() => {
            const elements = [];
            
            // Find all elements that contain "Remove" text
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node) => {
                        const text = node.textContent || '';
                        return text.includes('Remove') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                    }
                }
            );
            
            let node;
            while (node = walker.nextNode()) {
                const element = node;
                const rect = element.getBoundingClientRect();
                
                // Only include visible elements
                if (rect.width > 0 && rect.height > 0 && element.offsetParent !== null) {
                    elements.push({
                        tagName: element.tagName,
                        className: element.className,
                        id: element.id,
                        textContent: element.textContent.substring(0, 100), // First 100 chars
                        innerHTML: element.innerHTML.substring(0, 200), // First 200 chars of HTML
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        x: Math.round(rect.x),
                        y: Math.round(rect.y),
                        hasTrashIcon: element.innerHTML.includes('delete') || element.innerHTML.includes('trash') || element.innerHTML.includes('DeleteIcon'),
                        ariaLabel: element.getAttribute('aria-label'),
                        dataTestId: element.getAttribute('data-testid'),
                        role: element.getAttribute('role')
                    });
                }
            }
            
            return elements;
        });
        
        console.log(`Found ${removeElements.length} elements containing "Remove" text:\n`);
        
        removeElements.forEach((el, index) => {
            console.log(`Element ${index + 1}:`);
            console.log(`  Tag: ${el.tagName}`);
            console.log(`  Class: ${el.className}`);
            console.log(`  Size: ${el.width}x${el.height}`);
            console.log(`  Position: (${el.x}, ${el.y})`);
            console.log(`  Text: "${el.textContent}"`);
            console.log(`  Has Trash Icon: ${el.hasTrashIcon}`);
            console.log(`  ARIA Label: ${el.ariaLabel || 'none'}`);
            console.log(`  Data TestId: ${el.dataTestId || 'none'}`);
            console.log(`  HTML Preview: ${el.innerHTML}`);
            console.log('---\n');
        });
        
        // Step 3: Specifically look for small clickable "Remove" links (likely the actual remove button)
        console.log('\n=== FINDING SMALL "Remove" LINKS (likely the actual remove button) ===\n');
        
        const smallRemoveLinks = removeElements.filter(el => {
            return el.width < 200 && el.height < 50 && el.textContent.trim().length < 20;
        });
        
        console.log(`Found ${smallRemoveLinks.length} small Remove links:\n`);
        smallRemoveLinks.forEach((el, index) => {
            console.log(`Small Link ${index + 1}:`);
            console.log(`  Tag: ${el.tagName}`);
            console.log(`  Class: ${el.className}`);
            console.log(`  Size: ${el.width}x${el.height}`);
            console.log(`  Text: "${el.textContent.trim()}"`);
            console.log(`  Has Trash Icon: ${el.hasTrashIcon}`);
            console.log('---\n');
        });
        
        // Step 4: Try to find the actual clickable Remove link with more specific selectors
        console.log('\n=== TESTING SPECIFIC SELECTORS ===\n');
        
        const selectors = [
            'a[aria-label*="remove" i]',
            'a[aria-label*="delete" i]',
            'button:has-text("Remove")',
            'a:text-is("Remove")',
            'a:has-text("Remove")',
            '[data-testid*="remove"]',
            'a.MuiButtonBase-root:has-text("Remove")',
            'a[class*="remove"]',
        ];
        
        for (const selector of selectors) {
            try {
                const count = await page.locator(selector).count();
                if (count > 0) {
                    const first = page.locator(selector).first();
                    const box = await first.boundingBox().catch(() => null);
                    const text = await first.textContent().catch(() => '');
                    
                    console.log(`Selector: ${selector}`);
                    console.log(`  Count: ${count}`);
                    console.log(`  First element text: "${text.trim()}"`);
                    if (box) {
                        console.log(`  First element size: ${Math.round(box.width)}x${Math.round(box.height)}`);
                    }
                    console.log('');
                }
            } catch (e) {
                // Selector not valid or not found
            }
        }
        
        console.log('\n=== INSPECTION COMPLETE ===');
        
        // Keep browser open for manual inspection
        console.log('\nBrowser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('Error during inspection:', error);
        await page.screenshot({ path: 'cart_error.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

inspectCart();
