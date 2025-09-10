const report = require('multiple-cucumber-html-reporter');
const os = require('os');

report.generate({
  jsonDir: 'reports/json',
  reportPath: 'reports/html',
  reportName: 'Framework Skeleton Report',
  pageTitle: 'Framework Skeleton Report',
  metadata: {
    browser: { name: 'chromium', version: 'latest' },
    device: 'Local',
    platform: { name: os.platform(), version: os.release() }
  }
});

console.log('HTML report at reports/html/index.html');
