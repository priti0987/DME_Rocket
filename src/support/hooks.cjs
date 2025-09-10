const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const path = require('path');
const fs = require('fs');

setDefaultTimeout(30 * 1000);

Before(async function () {
  await this.initBrowser();
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
