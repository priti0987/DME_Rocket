const { setWorldConstructor, World } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { config } = require('./config.cjs');

class TestWorld extends World {
  async initBrowser() {
    if (this.browser && this.page) return;
    const artifactsRoot = path.resolve('test-results');
    fs.mkdirSync(artifactsRoot, { recursive: true });

    this.browser = await chromium.launch({ headless: !!config.HEADLESS });
    this.context = await this.browser.newContext({
      recordVideo: { dir: path.join(artifactsRoot, 'videos') },
      ignoreHTTPSErrors: !!config.IGNORE_HTTPS_ERRORS,
    });
    await this.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    this.page = await this.context.newPage();
    this.baseUrl = config.BASE_URL;
  }
}

setWorldConstructor(TestWorld);
