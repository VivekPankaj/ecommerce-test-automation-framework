# Quick Priority Selection Feature

## Overview
Added comprehensive priority-based test execution at both **global** and **module** levels, allowing flexible test execution based on P1, P2, and P3 priorities.

---

## Features Implemented

### 1️⃣ **Global Priority Selection** (Top of Modules Tab)

#### Visual Design
- Large priority selector cards with color coding:
  - **All** - Gray (all scenarios)
  - **P1** - Red (critical priority)
  - **P2** - Orange (high priority)
  - **P3** - Blue (medium priority)
- Real-time scenario count for each priority
- Visual checkmark (✓) on selected priorities
- "Run Selected" button appears when priorities are chosen

#### Functionality
- **Multi-select**: Click multiple priorities to run combined tests
- **All Option**: Select "All" to run entire test suite
- **Smart Logic**: Selecting specific priorities deselects "All"
- **Execution**: Runs tests across ALL modules with selected priorities
- **Tags Support**: Converts to Cucumber tags (`@P1 or @P2`)

#### User Flow
1. User clicks P1, P2, or P3 cards
2. Selected cards highlight with border and checkmark
3. Scenario count updates dynamically
4. "Run Selected" button activates
5. Click to execute tests globally

---

### 2️⃣ **Module-Level Priority Selection**

#### Visual Design
- Clickable priority badges in each module card
- Color-coded: Red (P1), Orange (P2), Green (P3)
- Shows count for each priority in module
- Selection triggers blue ring highlight
- Priority selection panel slides in when badges clicked

#### Functionality
- **Click to Select**: Click any priority badge to toggle selection
- **Multi-select**: Select multiple priorities within a module
- **Priority Panel**: Shows selected priorities and actions
- **Module-Specific**: Only runs tests for that specific module
- **Cancel Option**: Dismiss panel without running

#### User Flow
1. User clicks priority badge (e.g., "P1: 5")
2. Badge highlights with blue ring and checkmark
3. Priority selection panel appears
4. User can select additional priorities
5. Click "Run Selected Priorities" to execute
6. Or click "Cancel" to dismiss

---

## Technical Implementation

### Frontend Changes

#### State Management
```javascript
// Global level
const [selectedPriorities, setSelectedPriorities] = useState(['All']);
const [runningPriorityTests, setRunningPriorityTests] = useState(false);

// Module level
const [showPrioritySelector, setShowPrioritySelector] = useState(false);
const [selectedModulePriorities, setSelectedModulePriorities] = useState([]);
```

#### Priority Toggle Logic
```javascript
const togglePriority = (priority) => {
    if (priority === 'All') {
        setSelectedPriorities(['All']);
    } else {
        let newPriorities = selectedPriorities.filter(p => p !== 'All');
        if (newPriorities.includes(priority)) {
            newPriorities = newPriorities.filter(p => p !== priority);
            if (newPriorities.length === 0) {
                newPriorities = ['All'];
            }
        } else {
            newPriorities.push(priority);
        }
        setSelectedPriorities(newPriorities);
    }
};
```

#### Test Execution
```javascript
// Global execution
const tags = selectedPriorities.map(p => `@${p}`).join(' or ');
fetch(`${API_BASE}/tests/run`, {
    method: 'POST',
    body: JSON.stringify({
        modules: modules.map(m => m.id), // All modules
        headless: true,
        tags: tags // "@P1 or @P2"
    })
});

// Module-specific execution
fetch(`${API_BASE}/tests/run`, {
    method: 'POST',
    body: JSON.stringify({
        modules: [module.id], // Single module
        headless: true,
        tags: tags // "@P1 or @P2"
    })
});
```

### Backend Support

#### Tag-Based Filtering
The backend already supports Cucumber tag filtering:
```javascript
// server.js handles tags parameter
POST /api/tests/run
{
    "modules": ["login", "checkout"],
    "headless": true,
    "tags": "@P1 or @P2" // Cucumber tag expression
}
```

#### Priority Count Calculation
```javascript
const getPriorityCount = (priority) => {
    if (priority === 'All') {
        return modules.reduce((sum, m) => sum + m.scenarios, 0);
    }
    return modules.reduce((sum, m) => 
        sum + (m.priorityBreakdown?.[priority.toLowerCase()] || 0), 0
    );
};
```

---

## UI/UX Design

### Color Scheme
| Priority | Color | Hex Code | Usage |
|----------|-------|----------|-------|
| All | Gray | #6B7280 | Default/All scenarios |
| P1 | Red | #DC2626 | Critical priority |
| P2 | Orange | #EA580C | High priority |
| P3 | Blue | #2563EB | Medium priority |

### Visual States
1. **Default**: White background, colored border
2. **Hover**: Shadow effect, slightly raised
3. **Selected**: Colored background, bold border, green checkmark
4. **Active Ring**: Blue ring around selected module priorities

### Responsive Design
- Cards stack vertically on mobile
- Priority badges wrap on smaller screens
- Panel adapts to card width
- Buttons remain accessible

---

## Use Cases

### Use Case 1: Run All P1 Tests Globally
**Scenario**: QA wants to run all critical P1 tests before deployment

**Steps**:
1. Navigate to Modules tab
2. Click **P1** card at the top
3. See "33 scenarios" selected
4. Click **"Run Selected"** button
5. All P1 tests across all modules execute

**Result**: Comprehensive P1 smoke test across platform

---

### Use Case 2: Run P1 + P2 for Login Module
**Scenario**: Developer fixed login bugs, wants to test P1 and P2 scenarios only

**Steps**:
1. Navigate to Modules tab
2. Find Login module card
3. Click **"P1: 5"** badge
4. Click **"P2: 3"** badge
5. Priority panel appears showing "P1, P2"
6. Click **"Run Selected Priorities"**

**Result**: Only P1 and P2 scenarios in Login module execute

---

### Use Case 3: Quick Sanity Check (P1 Only)
**Scenario**: After hotfix, run only P1 tests

**Steps**:
1. Click **P1** at top
2. Click **"Run Selected"**
3. Monitor in Execution tab

**Result**: Fast sanity check (33 P1 scenarios) completes in minutes

---

### Use Case 4: Regression Subset (P1 + P2)
**Scenario**: Run partial regression with P1 and P2

**Steps**:
1. Click **P1** card
2. Click **P2** card
3. See combined count
4. Click **"Run Selected"**

**Result**: Medium-coverage regression test

---

## Benefits

### For QA Team
✅ **Flexible Execution**: Choose exactly which priorities to run  
✅ **Time Savings**: Run only critical tests when time-constrained  
✅ **Targeted Testing**: Focus on specific priority levels  
✅ **Module Control**: Priority selection per module

### For Developers
✅ **Quick Verification**: Run P1 tests after bug fixes  
✅ **Focused Testing**: Test specific modules by priority  
✅ **Fast Feedback**: Shorter execution times for P1 only

### For Management
✅ **Risk-Based Testing**: Execute by priority/risk level  
✅ **Resource Optimization**: Run appropriate test depth  
✅ **Clear Metrics**: Understand pass rates by priority

---

## Examples

### Example 1: P1 Only (Sanity)
```
Selected: P1
Scenarios: 33
Execution Time: ~5-10 minutes
Use Case: Quick smoke test
```

### Example 2: P1 + P2 (Core Features)
```
Selected: P1, P2
Scenarios: 68
Execution Time: ~15-20 minutes
Use Case: Feature validation
```

### Example 3: All Priorities (Full Regression)
```
Selected: All
Scenarios: 135
Execution Time: ~45-60 minutes
Use Case: Complete regression
```

### Example 4: Module-Specific P1
```
Module: Login
Selected: P1
Scenarios: 5
Execution Time: ~2-3 minutes
Use Case: Login hotfix verification
```

---

## Technical Notes

### Tag Expression Support
Supports Cucumber tag expressions:
- Single: `@P1`
- Multiple: `@P1 or @P2`
- Combined: `@P1 or @P2 or @P3`

### Module Data Structure
```javascript
module = {
    id: 'login',
    name: 'Login Page',
    scenarios: 15,
    priorityCounts: {
        p1: 5,
        p2: 7,
        p3: 3
    },
    priorityBreakdown: {
        p1: 5,
        p2: 7,
        p3: 3
    }
}
```

### Priority Count Aggregation
```javascript
// Total P1 across all modules
const totalP1 = modules.reduce((sum, m) => 
    sum + (m.priorityBreakdown?.p1 || 0), 0
);
```

---

## Testing

### Manual Testing Checklist
- ✅ Click each priority card (All, P1, P2, P3)
- ✅ Multi-select priorities
- ✅ Verify scenario counts update
- ✅ Test "Run Selected" button
- ✅ Click module priority badges
- ✅ Multi-select module priorities
- ✅ Verify priority panel appears/dismisses
- ✅ Test "Run Selected Priorities" in module
- ✅ Verify tag expression passed to backend
- ✅ Confirm tests execute with correct filter

### Edge Cases Handled
- ✅ Selecting "All" deselects specific priorities
- ✅ Deselecting all priorities defaults to "All"
- ✅ Cancel button dismisses module priority panel
- ✅ Close (×) button clears selections
- ✅ Button disabled when no priorities selected

---

## Future Enhancements

### Phase 1 (Potential)
- [ ] Save priority selections as presets
- [ ] Remember last selected priorities
- [ ] Show execution history by priority
- [ ] Priority-based pass rate charts

### Phase 2 (Advanced)
- [ ] Custom priority combinations (e.g., "Smoke Suite")
- [ ] Schedule automatic P1 runs
- [ ] Priority-based notifications
- [ ] Compare pass rates across priorities

---

## Screenshots Reference

**Global Priority Selection**: `/Users/vivpanka/Documents/Screenshots/Screenshot 2026-01-14 at 3.17.06 PM.png`

Shows:
- All, P1, P2, P3 cards with scenario counts
- Clean, modern design
- Color-coded priorities
- Checkmarks on selection

---

## Files Modified

### Frontend
- `dashboard/public/index.html`
  - Added `ModulesTab` priority selection UI
  - Added `ModuleCard` priority badges interaction
  - Added state management for priority selection
  - Added execution handlers

### Lines Added
- ~200 lines of new React components
- Priority selection logic
- UI components for global and module level
- Event handlers and state management

---

## Summary

✅ **Two-Level Priority Selection**:
   - Global (across all modules)
   - Module-specific (single module)

✅ **Visual Design**:
   - Color-coded priority cards
   - Interactive badges
   - Real-time scenario counts
   - Clear visual feedback

✅ **Smart Execution**:
   - Multi-select support
   - Tag-based filtering
   - Flexible combinations
   - Fast targeted testing

✅ **User-Friendly**:
   - Intuitive click-to-select
   - Clear visual states
   - Cancel/dismiss options
   - Immediate feedback

**Ready for Production Use!** 🚀
