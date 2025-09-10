# Framework Skeleton

Cucumber.js + Playwright E2E skeleton.

- npm run test: Run features
- npm run test:report: JSON + HTML report
- npm run clean: Clean artifacts
EOF
; mkdir -p features features/step-definitions src/steps src/support src/pages reports/json; cat > features/sample.feature <<\"EOF\"
@smoke
Feature: Sample login
  Scenario: Visit example site
    Given I open example site
    Then page title contains "Example"
EOF
; cat > src/support/world.js <<\"EOF\"
import { setWorldConstructor, World } from @cucumber/cucumber;
import { chromium } from playwright;
export class TestWorld extends World {
  async initBrowser() {
    if (this.browser && this.page) return;
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
}
setWorldConstructor(TestWorld);
EOF
; cat > src/support/hooks.js <<\"EOF\"
import { Before, After, setDefaultTimeout } from @cucumber/cucumber;
setDefaultTimeout(30 * 1000);
Before(async function(){ await this.initBrowser(); });
After(async function(){ try{ await this.page?.close(); await this.context?.close(); await this.browser?.close(); }catch{} });
EOF
; cat > src/steps/sample.steps.js <<\"EOF\"
import { Given, Then } from @cucumber/cucumber;
import { expect } from @playwright/test;
Given(I
