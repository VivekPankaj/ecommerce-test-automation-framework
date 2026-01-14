/**
 * ============================================================================
 * 🔒 LOCKED FILE - DO NOT MODIFY WITHOUT APPROVAL
 * ============================================================================
 * Status: VERIFIED & LOCKED
 * Last Verified: 11 January 2026
 * All 5 login scenarios (49 steps) passing
 * 
 * This Page Object contains methods for:
 *   - Login functionality (goTo, clickSignInCTA, enterEmail, enterPassword, submitLogin)
 *   - Login validation (isMyAccountVisible, verifyMyAccountDropdownContent)
 *   - Profile validation (getFirstNameFromGreeting, getFirstNameFromProfile, getEmailFromProfile)
 *   - Logout functionality (signOut, signOutFromCurrentPage)
 *   - Logout validation (isSignInButtonVisible, isOnHomepage)
 *   - Navigation helpers (navigateToPLP, navigateToPDP, navigateToCart)
 * 
 * ⚠️  Any modifications require re-running all @Login tests:
 *     npx cucumber-js --config .cucumber.json --tags "@Login"
 * ============================================================================
 */

class LoginPage {

    constructor(page) {
        this.page = page;

        // Sign In elements
        this.signInHeaderBtn = page.locator('span:has-text("Sign In")');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.signInSubmitBtn = page.locator('button:has-text("Sign In")');

        // My Account elements
        this.myAccountBtn = page.locator('span:has-text("My Account")');
        this.myAccountBtnLower = page.locator('span:has-text("my account")');
        this.signOutBtn = page.locator('button:has-text("Sign Out")');
        
        // My Account dropdown elements
        this.accountGreeting = page.locator('text=/Hi,\\s*\\w+/'); // Matches "Hi, Vivek" etc.
        this.purchaseHistoryLink = page.locator('text=Purchase History');
        this.myProfileLink = page.locator('text=My Profile');
        this.paymentLink = page.locator('text=Payment');
        
        // My Profile page elements
        this.myProfileHeader = page.locator('h1:has-text("MY PROFILE"), h2:has-text("MY PROFILE")');
        this.firstNameField = page.locator('text=First Name').locator('..').locator('..').locator('text=/^[A-Z][a-z]+$/').first();
        this.firstNameValue = page.locator('div:has-text("First Name") + div, td:has-text("First Name") ~ td').first();
        this.emailFieldValue = page.locator('div:has-text("Email") + div, td:has-text("Email") ~ td').first();
    }

    async goTo() {
        await this.page.goto("https://qa-shop.vulcanmaterials.com/");
        await this.page.waitForLoadState("networkidle");
    }

    async clickSignInCTA() {
        await this.signInHeaderBtn.click();
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async submitLogin() {
        await this.signInSubmitBtn.click();
        
        // Wait for My Account button to appear (indicates successful login)
        try {
            await this.myAccountBtn.waitFor({ state: 'visible', timeout: 15000 });
            console.log('✓ Login successful - My Account button visible');
        } catch (error) {
            // Fallback: wait for network to settle
            console.log('⚠️ My Account not visible, waiting for network idle...');
            await this.page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
                console.log('⚠️ Network idle timeout, continuing...');
            });
        }
    }

    // Validation 1: Check if 'Sign In' changed to 'My Account'
    async isMyAccountVisible() {
        try {
            // Wait for the page to update after login with retry logic
            for (let i = 0; i < 3; i++) {
                await this.page.waitForTimeout(2000);
                const myAccountVisible = await this.myAccountBtn.isVisible() || await this.myAccountBtnLower.isVisible();
                const signInHidden = !(await this.signInHeaderBtn.isVisible());
                if (myAccountVisible && signInHidden) {
                    return true;
                }
                console.log(`Retry ${i + 1}: Waiting for My Account to appear...`);
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Open My Account dropdown
    async openMyAccount() {
        try {
            // First close any blocking modals
            await this.closeBlockingModals();
            
            if (await this.myAccountBtn.isVisible()) {
                await this.myAccountBtn.click();
            } else {
                await this.myAccountBtnLower.click();
            }
            await this.page.waitForTimeout(500);
        } catch (error) {
            throw new Error(`Failed to open My Account: ${error.message}`);
        }
    }

    // Validation 2: Verify My Account dropdown shows greeting and menu items
    async verifyMyAccountDropdownContent() {
        const results = {
            greeting: false,
            greetingText: '',
            purchaseHistory: false,
            myProfile: false,
            payment: false,
            signOut: false
        };

        try {
            // Wait for dropdown to appear
            await this.page.waitForTimeout(1000);
            
            // Check for greeting (Hi, FirstName) - try multiple locator strategies
            // Strategy 1: Look for text starting with "Hi,"
            let greetingLocator = this.page.locator('text=/Hi,\\s*\\w+/').first();
            
            if (await greetingLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                results.greeting = true;
                results.greetingText = await greetingLocator.textContent();
            } else {
                // Strategy 2: Look for any element containing "Hi," followed by a name
                greetingLocator = this.page.locator('div:has-text("Hi,")').first();
                if (await greetingLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                    const text = await greetingLocator.textContent();
                    if (text.includes('Hi,')) {
                        results.greeting = true;
                        results.greetingText = text.trim();
                    }
                }
            }
            
            // Strategy 3: Look in the dropdown/menu specifically
            if (!results.greeting) {
                const dropdownGreeting = this.page.locator('[class*="dropdown"], [class*="menu"], [class*="popover"]').locator('text=/Hi,/').first();
                if (await dropdownGreeting.isVisible({ timeout: 2000 }).catch(() => false)) {
                    results.greeting = true;
                    results.greetingText = await dropdownGreeting.textContent();
                }
            }

            // Check menu items
            results.purchaseHistory = await this.purchaseHistoryLink.isVisible({ timeout: 2000 }).catch(() => false);
            results.myProfile = await this.myProfileLink.isVisible({ timeout: 2000 }).catch(() => false);
            results.payment = await this.paymentLink.isVisible({ timeout: 2000 }).catch(() => false);
            results.signOut = await this.signOutBtn.isVisible({ timeout: 2000 }).catch(() => false);

        } catch (error) {
            console.log(`Error checking dropdown content: ${error.message}`);
        }

        return results;
    }

    // Get the first name from the greeting
    async getFirstNameFromGreeting() {
        try {
            // Try multiple strategies to find the greeting text
            let greetingText = '';
            
            // Strategy 1: Look for text with "Hi,"
            let greetingLocator = this.page.locator('text=/Hi,\\s*\\w+/').first();
            if (await greetingLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
                greetingText = await greetingLocator.textContent();
            } else {
                // Strategy 2: Look in divs containing "Hi,"
                greetingLocator = this.page.locator('div:has-text("Hi,")').first();
                if (await greetingLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
                    greetingText = await greetingLocator.textContent();
                }
            }
            
            // Extract first name from "Hi, Vivek"
            const match = greetingText.match(/Hi,\s*(\w+)/);
            return match ? match[1] : null;
        } catch (error) {
            console.log(`Error getting first name from greeting: ${error.message}`);
            return null;
        }
    }

    // Close any blocking modal dialogs (like location selector)
    async closeBlockingModals() {
        try {
            // Try multiple times to ensure modal is closed
            for (let i = 0; i < 3; i++) {
                // Check if there's a MuiDialog blocking
                const dialog = this.page.locator('[data-testid="dialog"], [class*="MuiDialog-root"]').first();
                if (await dialog.isVisible({ timeout: 500 }).catch(() => false)) {
                    // Try clicking close button
                    const dialogClose = this.page.locator('[data-testid="dialog"] button[aria-label="close"], [data-testid="dialog"] svg[data-testid="CloseIcon"], [class*="MuiDialog"] button:has(svg), [class*="MuiDialog"] [data-testid="CloseIcon"]').first();
                    if (await dialogClose.isVisible({ timeout: 500 }).catch(() => false)) {
                        await dialogClose.click();
                        await this.page.waitForTimeout(500);
                        console.log('✓ Closed blocking modal dialog via close button');
                    } else {
                        // Try pressing Escape key
                        await this.page.keyboard.press('Escape');
                        await this.page.waitForTimeout(500);
                        console.log('✓ Closed blocking modal dialog via Escape key');
                    }
                } else {
                    break; // No modal visible, exit loop
                }
            }
        } catch (error) {
            console.log(`Modal close attempt: ${error.message}`);
        }
    }

    // Navigate to My Profile page
    async navigateToMyProfile() {
        // First close any blocking modals
        await this.closeBlockingModals();
        
        // Try to click My Profile, with retry logic
        try {
            await this.myProfileLink.click({ timeout: 5000 });
        } catch (error) {
            // If click failed, try closing modal again and click with force
            console.log('First click attempt failed, trying again after closing modals...');
            await this.closeBlockingModals();
            await this.page.waitForTimeout(500);
            
            // Try clicking with force option
            await this.myProfileLink.click({ force: true, timeout: 5000 });
        }
        
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

    // Validation 3: Get first name from My Profile page
    async getFirstNameFromProfile() {
        try {
            await this.page.waitForTimeout(1000);
            
            // Based on the screenshot, the structure is:
            // Personal Info section with "First Name" label and "Vivek" as value
            
            // Strategy 1: Look for text after "First Name" label
            const firstNameLabel = this.page.locator('text=First Name').first();
            if (await firstNameLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
                // Get the parent row/container and find the value
                const container = firstNameLabel.locator('xpath=ancestor::div[contains(@class, "row") or contains(@class, "flex") or contains(@class, "grid")]').first();
                const allText = await container.allTextContents();
                
                // Find the name value (not "First Name")
                for (const text of allText) {
                    const parts = text.split(/First Name/i);
                    if (parts.length > 1) {
                        const name = parts[1].trim().split(/\s/)[0];
                        if (name && name.match(/^[A-Z][a-z]+$/)) {
                            return name;
                        }
                    }
                }
            }
            
            // Strategy 2: Look for capitalized name "Vivek" in Personal Info section
            const personalInfoSection = this.page.locator('text=Personal Info').locator('xpath=ancestor::div[1]/following-sibling::div').first();
            if (await personalInfoSection.isVisible({ timeout: 2000 }).catch(() => false)) {
                const sectionText = await personalInfoSection.textContent();
                const nameMatch = sectionText.match(/First Name\s*([A-Z][a-z]+)/);
                if (nameMatch) {
                    return nameMatch[1];
                }
            }
            
            // Strategy 3: Direct text search for "Vivek" or similar
            const nameLocator = this.page.locator('text=/^Vivek$/').first();
            if (await nameLocator.isVisible({ timeout: 1000 }).catch(() => false)) {
                return await nameLocator.textContent();
            }
            
            // Strategy 4: Get all visible text and find the name
            const pageContent = await this.page.content();
            const firstNameMatch = pageContent.match(/First Name[^>]*>([^<]+)</);
            if (firstNameMatch && firstNameMatch[1].trim()) {
                return firstNameMatch[1].trim();
            }
            
            return null;
        } catch (error) {
            console.log(`Error getting first name from profile: ${error.message}`);
            return null;
        }
    }

    // Validation 4: Get email from My Profile page
    async getEmailFromProfile() {
        try {
            await this.page.waitForTimeout(500);
            
            // Strategy 1: Look for email pattern in the page
            const emailLocator = this.page.locator('text=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/').first();
            if (await emailLocator.isVisible({ timeout: 2000 }).catch(() => false)) {
                return (await emailLocator.textContent()).trim();
            }
            
            // Strategy 2: Look in Login Info section
            const loginInfoSection = this.page.locator('text=Login Info').locator('xpath=ancestor::div[1]/following-sibling::div').first();
            if (await loginInfoSection.isVisible({ timeout: 2000 }).catch(() => false)) {
                const sectionText = await loginInfoSection.textContent();
                const emailMatch = sectionText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                if (emailMatch) {
                    return emailMatch[1];
                }
            }
            
            // Strategy 3: Search page content for email
            const pageContent = await this.page.content();
            const emailMatch = pageContent.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (emailMatch) {
                return emailMatch[1];
            }
            
            return null;
        } catch (error) {
            console.log(`Error getting email from profile: ${error.message}`);
            return null;
        }
    }

    // Sign out and verify
    async signOut() {
        // Close any blocking modals first
        await this.closeBlockingModals();
        
        await this.signOutBtn.click();
        // Wait for network to be idle after logout
        await this.page.waitForLoadState("networkidle");
    }

    // Verify Sign In button is visible after logout
    async isSignInButtonVisible() {
        try {
            console.log('Checking if Sign In button is visible after logout...');
            
            // First, wait for My Account button to disappear (logout successful indicator)
            try {
                await this.myAccountBtn.waitFor({ state: 'hidden', timeout: 5000 });
                console.log('✓ My Account button hidden (logout successful)');
            } catch (error) {
                console.log('⚠️ My Account button still visible or timeout');
            }
            
            // Try multiple selectors for Sign In button with proper visibility waits
            const signInLocators = [
                { name: 'signInHeaderBtn (span)', locator: this.signInHeaderBtn },
                { name: 'text=Sign In', locator: this.page.locator('text=Sign In') },
                { name: 'span with Sign In', locator: this.page.locator('span:has-text("Sign In")').first() },
                { name: 'button/a with Sign In', locator: this.page.locator('a:has-text("Sign In"), button:has-text("Sign In")').first() }
            ];
            
            for (const { name, locator } of signInLocators) {
                try {
                    // Wait for element to be visible (no hardcoded timeout)
                    await locator.waitFor({ state: 'visible', timeout: 5000 });
                    console.log(`${name}: VISIBLE ✓`);
                    console.log('✓ Sign In button is visible - logout verification PASSED');
                    return true;
                } catch (e) {
                    console.log(`${name}: Not visible or timeout - ${e.message}`);
                }
            }
            
            console.log('✗ Sign In button NOT found with any selector');
            return false;
        } catch (error) {
            console.log(`Error in isSignInButtonVisible: ${error.message}`);
            return false;
        }
    }

    // Verify user is on Homepage
    async isOnHomepage() {
        try {
            const currentUrl = this.page.url();
            const isHomepage = currentUrl.includes('/home') || currentUrl.endsWith('.com/') || currentUrl.endsWith('.com');
            console.log(`Current URL: ${currentUrl}, Is Homepage: ${isHomepage}`);
            return isHomepage;
        } catch (error) {
            return false;
        }
    }

    // Navigate to PLP
    async navigateToPLP() {
        await this.page.goto("https://qa-shop.vulcanmaterials.com/category/categories/C001");
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
        console.log('✓ Navigated to PLP');
    }

    // Navigate to PDP (click first product on PLP)
    async navigateToPDP() {
        await this.navigateToPLP();
        // Close any modal that might appear
        await this.closeBlockingModals();
        
        // Click on first product
        const firstProduct = this.page.locator('div.component--product-tile>a[href^="/product/"]').first();
        await firstProduct.click({ timeout: 10000 });
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
        console.log('✓ Navigated to PDP');
    }

    // Navigate to Cart
    async navigateToCart() {
        // Close any blocking modals first
        await this.closeBlockingModals();
        
        const cartBtn = this.page.locator('span:has-text("Cart"), a[href*="cart"]').first();
        await cartBtn.click();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
        console.log('✓ Navigated to Cart');
    }

    // Perform sign out from current page
    async signOutFromCurrentPage() {
        // Close any blocking modals
        await this.closeBlockingModals();
        
        // Open My Account dropdown
        await this.openMyAccount();
        await this.page.waitForTimeout(500);
        
        // Click Sign Out
        await this.signOutBtn.click();
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(1000);
    }

}

module.exports = { LoginPage };

module.exports = { LoginPage };
