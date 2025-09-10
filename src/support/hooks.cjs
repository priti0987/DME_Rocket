const { Before, After, AfterStep, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const path = require('path');
const fs = require('fs');
const os = require('os');

setDefaultTimeout(30 * 1000);

// Collect test run metadata
let runMeta = {
  startTime: null,
  endTime: null,
  durationMs: null,
  machine: os.hostname(),
  os: { name: os.type(), platform: os.platform(), version: os.release() },
};

BeforeAll(async function () {
  runMeta.startTime = new Date();
});

Before(async function () {
  await this.initBrowser();
  try {
    const version = await this.browser.version(); // e.g. HeadlessChromium/119.0...
    const parts = String(version).split('/');
    let browserName = parts[0].replace(/^Headless/i, '');
    let browserVersion = parts[1] || 'unknown';
    
    // Handle case where version string is just the version number
    if (parts.length === 1 && version.match(/^\d+\./)) {
      browserName = 'Chromium';
      browserVersion = version;
    }
    
    // Enhanced device detection
    const isMobile = this.context?._options?.isMobile || false;
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    
    // Get the actual baseUrl being used (from credentials config)
    const credentials = require('../../config/credentials.js');
    const baseUrl = credentials.baseUrl;

    global.__TEST_ENV__ = global.__TEST_ENV__ || {};
    global.__TEST_ENV__.browser = { 
      name: browserName, 
      version: browserVersion,
      fullName: `${browserName} ${browserVersion}`
    };
    global.__TEST_ENV__.deviceType = deviceType;
    global.__TEST_ENV__.deviceDetails = `Local - ${deviceType}`;
    global.__TEST_ENV__.baseUrl = baseUrl;
  } catch {}
});

After(async function ({ pickle }) {
  try {
    const scenarioName = pickle?.name || 'scenario';
    const tracesDir = path.resolve('test-results', 'traces');
    fs.mkdirSync(tracesDir, { recursive: true });
    const tracePath = path.join(tracesDir, `${scenarioName.replace(/[^\w]+/g, '_').toLowerCase()}.zip`);
    try { await this.context?.tracing?.stop({ path: tracePath }); } catch {}
    if (tracePath && fs.existsSync(tracePath) && this.attach) {
      const rel = path.relative('reports/html', tracePath).split(path.sep).join('/');
      await this.attach(`<a href="../${rel}" download>Download trace.zip</a>`, 'text/html');
    }
    let videoPath = null;
    try { videoPath = await this.page?.video?.().path(); } catch {}
    if (videoPath && this.attach) {
      const reportVideoDir = path.resolve('reports', 'assets', 'videos');
      fs.mkdirSync(reportVideoDir, { recursive: true });
      const dest = path.join(reportVideoDir, path.basename(videoPath));
      try { fs.copyFileSync(videoPath, dest); } catch {}
    }
  } catch {}
  try { await this.page?.close(); } catch {}
  try { await this.context?.close(); } catch {}
  try { await this.browser?.close(); } catch {}
});

// Attach a screenshot after every step for evidence in the HTML report
AfterStep(async function () {
  try {
    if (!this.page || !this.attach) return;
    const image = await this.page.screenshot();
    await this.attach(image, 'image/png');
  } catch {}
});

AfterAll(async function () {
  try {
    runMeta.endTime = new Date();
    runMeta.durationMs = runMeta.startTime && runMeta.endTime ? (runMeta.endTime - runMeta.startTime) : null;
    
    const browser = (global.__TEST_ENV__ && global.__TEST_ENV__.browser) || { name: 'chromium', version: 'latest' };
    const deviceType = (global.__TEST_ENV__ && global.__TEST_ENV__.deviceType) || 'Desktop';
    const deviceDetails = (global.__TEST_ENV__ && global.__TEST_ENV__.deviceDetails) || 'Local - Desktop';
    const baseUrl = (global.__TEST_ENV__ && global.__TEST_ENV__.baseUrl) || null;

    const envPayload = {
      browser,
      deviceType,
      deviceDetails,
      machine: runMeta.machine,
      os: runMeta.os,
      baseUrl,
      run: {
        start: runMeta.startTime ? runMeta.startTime.toISOString() : null,
        end: runMeta.endTime ? runMeta.endTime.toISOString() : null,
        durationMs: runMeta.durationMs,
      },
    };

    const metaDir = path.resolve('reports', 'meta');
    fs.mkdirSync(metaDir, { recursive: true });
    fs.writeFileSync(path.join(metaDir, 'env.json'), JSON.stringify(envPayload, null, 2));
  } catch {}
});
