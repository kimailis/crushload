import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('sim_user_auth', 'true'));

// data-analyst visual analysis (the broken bar chart)
await page.goto('http://localhost:3000/sim/data-analyst', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Visual Analysis' }).click();
await page.waitForTimeout(1400);
await page.screenshot({ path: '/tmp/fix-visual.png' });

// economist excel - edit a cell
await page.goto('http://localhost:3000/sim/economist', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Excel' }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/fix-excel.png' });

// spy asset map - click an asset
await page.goto('http://localhost:3000/sim/spy-manager', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Global Assets' }).click();
await page.waitForTimeout(900);
await page.getByRole('button', { name: /Select asset Tango-4/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/fix-assetmap.png' });
await ctx.close(); await browser.close(); console.log('done');
