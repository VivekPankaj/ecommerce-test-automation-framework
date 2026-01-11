# 🔒 Login Module - LOCKED

## Status: VERIFIED & LOCKED ✅
**Last Verified:** 11 January 2026
**File Renamed:** `login-page-vaidation.feature` → `login.feature`

---

## Overview

This module contains all login and logout test scenarios for the Vulcan Shop application.

## Test Results Summary

| Metric | Value |
|--------|-------|
| **Total Scenarios** | 5 |
| **Total Steps** | 49 |
| **Pass Rate** | 100% |
| **Execution Time** | ~2 min 20 sec |

---

## Tag Definitions

| Tag | Purpose | Usage |
|-----|---------|-------|
| `@Regression` | Full regression suite | All 5 scenarios |
| `@Sanity` | Core functionality (build gate) | 1 scenario (Sign In) |
| `@P1` | Priority 1 - Critical flows | 2 scenarios |
| `@P2` | Priority 2 - Secondary flows | 3 scenarios |
| `@Login` | All login module tests | 5 scenarios |
| `@SignIn` | Sign in tests only | 1 scenario |
| `@SignOut` | Sign out tests only | 4 scenarios |

---

## Scenarios

### 1. Validate successful user login with all validations
**Tags:** `@Sanity` `@P1` `@SignIn`
**Steps:** 9

**Validations:**
- ✅ Sign In button changes to My Account
- ✅ My Account dropdown shows "Hi, [FirstName]" greeting
- ✅ Dropdown contains: Purchase History, My Profile, Payment, Sign Out
- ✅ First name matches profile page
- ✅ Email matches profile page

### 2. Validate successful user logout from Homepage
**Tags:** `@P1` `@SignOut` `@SignOutFromHomepage`
**Steps:** 10

### 3. Validate successful user logout from PLP page
**Tags:** `@P2` `@SignOut` `@SignOutFromPLP`
**Steps:** 10

### 4. Validate successful user logout from PDP page
**Tags:** `@P2` `@SignOut` `@SignOutFromPDP`
**Steps:** 10

### 5. Validate successful user logout from Cart page
**Tags:** `@P2` `@SignOut` `@SignOutFromCart`
**Steps:** 10

**Sign Out Validations (all scenarios):**
- ✅ My Account button changes to Sign In
- ✅ User is redirected to Homepage

---

## Files Included (LOCKED)

| File | Path | Purpose |
|------|------|---------|
| Feature File | `Ecomm/features/login.feature` | Test scenarios |
| Step Definitions | `Ecomm/features/step_definitions/loginSteps.js` | Step implementations |
| Page Object | `pageobjects/LoginPage.js` | Page methods & locators |
| Test Data | `utils/testData.json` | Login credentials (see `login` section) |

---

## How to Run

```bash
# Run all login tests (Regression)
npx cucumber-js --config .cucumber.json --tags "@Login"

# Run Sanity tests only
npx cucumber-js --config .cucumber.json --tags "@Sanity and @Login"

# Run Priority 1 tests
npx cucumber-js --config .cucumber.json --tags "@P1 and @Login"

# Run Priority 2 tests
npx cucumber-js --config .cucumber.json --tags "@P2 and @Login"

# Run only sign in test
npx cucumber-js --config .cucumber.json --tags "@SignIn"

# Run only sign out tests
npx cucumber-js --config .cucumber.json --tags "@SignOut"

# Run specific sign out scenario
npx cucumber-js --config .cucumber.json --tags "@SignOutFromPLP"
```

---

## Test Data

Located in `utils/testData.json` under the `login` section:

```json
{
  "login": {
    "validUser": {
      "email": "vivek.pankaj@publicissapient.com",
      "password": "********",
      "firstName": "Vivek",
      "lastName": "pankaj"
    }
  }
}
```

---

## ⚠️ Modification Guidelines

1. **DO NOT** modify any of the locked files without approval
2. **DO NOT** change locators in LoginPage.js
3. **DO NOT** modify step definitions in loginSteps.js
4. **DO NOT** alter the feature file scenarios

### If changes are required:

1. Create a backup of current files
2. Make necessary changes
3. Run all login tests: `npx cucumber-js --config .cucumber.json --tags "@Login"`
4. Verify all 49 steps pass
5. Update this README with new verification date
6. Get approval before merging

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Modal blocking clicks | The `closeBlockingModals()` method handles this |
| Sign In button not visible after logout | Wait time increased to 2 seconds |
| Profile page elements not found | Multiple locator strategies implemented |

---

## Dependencies

- `@cucumber/cucumber` - Test framework
- `@playwright/test` - Browser automation
- `LoginPage.js` - Page Object Model
- `testData.json` - Test data configuration

---

**🔒 This module is locked. All tests verified and passing.**
