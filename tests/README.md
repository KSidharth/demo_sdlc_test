
# Test Suite — Two-Number Addition Calculator

Complete test coverage for the Two-Number Addition Calculator, including unit tests for JavaScript logic and E2E tests for full user flows.

## Test Structure

```
test/tests/
├── unit/                    # Unit tests (Vitest + @testing-library/dom)
│   └── calculator.spec.ts   # Tests for all JavaScript functions
├── e2e/                     # E2E tests (Playwright)
│   └── calculator.spec.ts   # Browser-based user flow tests
├── package.json             # Test dependencies
├── playwright.config.ts     # Playwright configuration
├── vitest.config.ts         # Vitest configuration
└── README.md                # This file
```

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## Installation

Install all test dependencies:

```bash
cd test/tests
npm install
```

This will install:
- Vitest (unit test runner)
- @testing-library/dom (DOM testing utilities)
- JSDOM (headless browser environment for unit tests)
- Playwright (E2E test runner with real browsers)

## Running Tests

### Unit Tests

Run all unit tests once:
```bash
npm run test:unit
```

Run unit tests in watch mode (re-run on file changes):
```bash
npm run test:unit:watch
```

Run unit tests with coverage report:
```bash
npm run test:unit:coverage
```

### E2E Tests

Run all E2E tests (Chromium, Firefox, WebKit):
```bash
npm run test:e2e
```

Run E2E tests with UI mode (interactive debugging):
```bash
npm run test:e2e:ui
```

Run E2E tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

Run E2E tests in specific browser:
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### Run All Tests

Run both unit and E2E tests sequentially:
```bash
npm run test:all
```

## Test Coverage

### Unit Tests (`unit/calculator.spec.ts`)

Covers all JavaScript functions and logic:

- **DOM Initialization** (6 tests)
  - Two numeric input fields render correctly
  - Enter button renders with correct label
  - Result container hidden by default
  - Error containers hidden by default
  - ARIA attributes for accessibility

- **Input Validation** (19 tests)
  - Empty string rejection
  - Whitespace-only rejection
  - Null/undefined rejection
  - Non-numeric text rejection
  - Special character rejection
  - Infinity/-Infinity rejection
  - Valid integer acceptance (positive, negative, zero)
  - Valid decimal acceptance
  - Scientific notation acceptance
  - Very large/small number handling

- **Addition Logic** (10 tests)
  - Positive integer addition
  - Negative integer addition
  - Mixed sign addition
  - Decimal addition
  - Zero handling
  - Very large number handling
  - Very small decimal handling
  - Scientific notation handling

- **Result Formatting** (9 tests)
  - Integer formatting
  - Decimal precision (10 places)
  - Thousand separator formatting
  - Scientific notation formatting
  - Zero formatting
  - Negative number formatting
  - Floating point precision edge cases

- **Event Handling** (6 tests)
  - Click event on Enter button
  - Enter key press in both inputs
  - Error clearing on input
  - Focus management

- **Error Display** (8 tests)
  - Empty input errors
  - Non-numeric input errors
  - Error styling application
  - Focus on error fields

- **Result Display** (4 tests)
  - Result container visibility
  - Correct sum display
  - Result updates on recalculation
  - No result on validation failure

- **Edge Cases** (8 tests)
  - Very large number addition
  - Very small decimal addition
  - Floating point precision (0.1 + 0.2)
  - Negative zero
  - Whitespace handling
  - Multiple rapid clicks
  - Error clearing before revalidation

- **Performance** (2 tests)
  - Calculation completes < 100ms
  - Addition logic < 1ms

**Total Unit Tests: 72**

### E2E Tests (`e2e/calculator.spec.ts`)

Covers complete user flows in real browsers:

- **Page Load & Initial State** (8 tests)
  - Page loads with correct title
  - Heading and subtitle display
  - Two input fields visible
  - Enter button visible
  - Result container hidden initially
  - No error messages initially
  - ARIA attributes present

- **Happy Path Flows** (10 tests)
  - Addition of positive integers
  - Addition of negative integers
  - Mixed sign addition
  - Decimal addition
  - Zero handling
  - Floating point precision
  - Large number formatting
  - Small decimal handling
  - Scientific notation input

- **Error Handling** (8 tests)
  - Empty first input error
  - Empty second input error
  - Both inputs empty error
  - Non-numeric text errors
  - No result on validation failure
  - Focus on error fields

- **Error Recovery** (3 tests)
  - Error message clearing on typing
  - Error styling removal
  - Full error clearing before revalidation

- **Result Display** (4 tests)
  - Result container visibility
  - Result updates on recalculation
  - Result container stays visible
  - Result label display

- **Keyboard Accessibility** (5 tests)
  - Enter key in first input
  - Enter key in second input
  - Tab navigation between inputs
  - Tab to Enter button
  - Space key activates button

- **Edge Cases** (6 tests)
  - Rapid successive clicks
  - Whitespace-only input
  - Negative decimals
  - Large number formatting
  - Very large number scientific notation
  - Input clearing after calculation

- **Performance** (2 tests)
  - Result displays < 100ms
  - Multiple calculations stay < 100ms

- **Visual Feedback** (3 tests)
  - Focus styles on input
  - Hover styles on button
  - Error styling on validation failure

- **Responsive Design** (2 tests)
  - Mobile viewport (375x667)
  - Full-width button on mobile

- **Cross-Browser Compatibility** (3 tests)
  - Chromium (Chrome/Edge)
  - Firefox
  - WebKit (Safari)

- **Complete User Journeys** (3 tests)
  - Full happy path: load → calculate → recalculate
  - Error recovery: invalid → fix → success
  - Keyboard-only journey

**Total E2E Tests: 57**

**Grand Total: 129 Tests**

## Coverage Targets

- **Unit Test Coverage**: ≥80% lines, ≥80% functions, ≥75% branches
- **E2E Test Coverage**: All critical user flows and acceptance criteria

## Test Reports

After running tests, view detailed reports:

### Unit Test Coverage Report
```bash
npm run test:unit:coverage
# Opens: ../test-results/coverage/index.html
```

### E2E Test Report
```bash
npm run test:report
# Opens: ../test-results/playwright-report/index.html
```

### JSON Results
- Unit: `../test-results/vitest-results.json`
- E2E: `../test-results/test-results.json`

## CI/CD Integration

Tests can be run in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Install dependencies
  run: cd test/tests && npm ci

- name: Install Playwright browsers
  run: cd test/tests && npx playwright install --with-deps

- name: Run unit tests
  run: cd test/tests && npm run test:unit

- name: Run E2E tests
  run: cd test/tests && npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: test-results
    path: test/test-results/
```

## Debugging Tests

### Unit Tests

Use Vitest UI for interactive debugging:
```bash
npm run test:unit:watch
```

### E2E Tests

Use Playwright UI mode:
```bash
npm run test:e2e:ui
```

Run in headed mode to see the browser:
```bash
npm run test:e2e:headed
```

Debug a specific test file:
```bash
npx playwright test e2e/calculator.spec.ts --debug
```

## Environment Variables

- `BASE_URL`: Base URL for E2E tests (default: `http://localhost:8000`)
- `CI`: Set to `true` in CI environments (enables retries, disables parallelism)

Example:
```bash
BASE_URL=http://localhost:3000 npm run test:e2e
```

## Requirements Coverage

All functional, non-functional, and business requirements are tested:

### Functional Requirements
- ✅ **FR-001**: Two numeric input fields (Unit + E2E)
- ✅ **FR-002**: Enter button triggers addition (Unit + E2E)
- ✅ **FR-003**: Dynamic result field display (Unit + E2E)
- ✅ **FR-004**: Client-side only logic (Unit tests verify no server calls)

### Non-Functional Requirements
- ✅ **NFR-001**: < 100ms response time (Unit + E2E performance tests)
- ✅ **NFR-002**: Cross-browser compatibility (E2E tests in Chrome/Firefox/Safari)
- ✅ **NFR-003**: Simple, usable UI (E2E accessibility and UX tests)

### Business Requirements
- ✅ **BR-001**: Lightweight, no-backend solution (Verified by static file testing)
- ✅ **BR-002**: Minimal scope, single-purpose (All tests verify only addition functionality)

## Troubleshooting

### Unit tests fail with JSDOM errors
Ensure JSDOM is properly installed:
```bash
npm install --save-dev jsdom
```

### E2E tests fail with browser errors
Install Playwright browsers:
```bash
npx playwright install --with-deps
```

### Tests can't find the HTML file
Verify the path in `calculator.spec.ts` matches your project structure:
```typescript
const html = fs.readFileSync(
  path.resolve(__dirname, '../../../frontend/index.html'),
  'utf8'
);
```

### Web server won't start
Ensure port 8000 is available, or change the port in `playwright.config.ts`:
```bash
# Kill process on port 8000 (macOS/Linux)
lsof -ti:8000 | xargs kill -9

# Or use a different port
BASE_URL=http://localhost:3000 npm run test:e2e
```

## Maintenance

To update test dependencies:
```bash
npm update
```

To check for outdated packages:
```bash
npm outdated
```

## License

Tests are provided as-is for demonstration purposes.

---

**Test Framework Stack:**
- Vitest 1.1.0 (unit test runner)
- @testing-library/dom 9.3.4 (DOM testing utilities)
- JSDOM 23.0.1 (headless browser environment)
- Playwright 1.40.1 (E2E test runner)
- TypeScript 5.3.3 (type safety)
