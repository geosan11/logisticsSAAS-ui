const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

// We can serve the dist folder using a lightweight static file server or connect to vite preview
function serveDist(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };

  const server = http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback to index.html for SPA router
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500);
          res.end('Server error');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
    });
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function run() {
  const PORT = 5005;
  const distDir = path.resolve(__dirname, '../dist');
  const screenshotsDir = path.resolve(__dirname, '../screenshots');

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log(`Starting static server on port ${PORT} serving ${distDir}...`);
  const server = await serveDist(distDir, PORT);

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (e) {
    console.log('Falling back to system google-chrome...');
    browser = await chromium.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Test targets (All 6 core screens + key review states)
  const targets = [
    { name: '01-login', query: 'screen=login', desc: '1. Login Screen (Terminal PIN & Email)' },
    { name: '02-tenant-gate', query: 'screen=tenant', desc: '2. Tenant Gate (Workspace Picker)' },
    { name: '03-dashboard', query: 'screen=dashboard', desc: '3. CommandCenter Dashboard (Linear KPI & Manifest Stream)' },
    { name: '04-fast-intake', query: 'screen=intake', desc: '4. Fast Counter Intake (IATA Volumetric Engine)' },
    { name: '05-eod-reconciliation', query: 'screen=eod', desc: '5. EOD Reconciliation View (Naira Denomination Counter)' },
    { name: '06-appshell-expanded', query: 'screen=dashboard', desc: '6. AppShell with Rail Expanded', action: async (p) => {
      // Toggle rail to expand
      const railToggle = await p.$('button[title*="Expand navigation rail"], button[aria-label="Expand rail"]');
      if (railToggle) await railToggle.click();
      await p.waitForTimeout(300);
    }},
    { name: '07-login-error', query: 'screen=login-error', desc: 'State: Login Authentication Failure Banner' },
    { name: '08-tenant-suspended', query: 'screen=tenant-suspended', desc: 'State: Suspended Tenant Audit Notice' },
    { name: '09-intake-validation-error', query: 'screen=intake-error', desc: 'State: Intake Form Validation Incomplete' },
    { name: '10-eod-confirm-modal', query: 'screen=eod-modal', desc: 'State: EOD Close Register Confirm Dialog Modal' },
  ];

  console.log('\n--- VERIFYING VIEWPORT 1024x768 & NO HORIZONTAL OVERFLOW ---');
  let hasFailure = false;
  const results = [];

  for (const t of targets) {
    const url = `http://localhost:${PORT}/?${t.query}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    if (t.action) {
      await t.action(page);
    }

    // Measure scroll width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    const maxScroll = Math.max(scrollWidth, bodyScrollWidth);

    const isPassing = maxScroll <= 1024;
    const shotPath = path.join(screenshotsDir, `${t.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });

    console.log(`[${isPassing ? 'PASS' : 'FAIL'}] ${t.desc}`);
    console.log(`       Target: ${t.name}.png | scrollWidth: ${maxScroll}px (<= 1024px: ${isPassing})`);

    results.push({
      target: t.name,
      desc: t.desc,
      scrollWidth: maxScroll,
      path: shotPath,
      pass: isPassing,
    });

    if (!isPassing) {
      hasFailure = true;
    }
  }

  await browser.close();
  server.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Total captured: ${results.length}`);
  console.log(`All scrollWidth <= 1024px: ${!hasFailure ? 'YES (PASSED)' : 'NO (FAILED)'}`);

  if (hasFailure) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Screenshot script failed:', err);
  process.exit(1);
});
