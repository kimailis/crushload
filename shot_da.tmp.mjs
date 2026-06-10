import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/');
await page.evaluate(() => localStorage.setItem('sim_user_auth', 'true'));
await page.goto('http://localhost:3000/sim/data-analyst', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// SQL IDE tab
await page.getByRole('button', { name: 'SQL IDE' }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/da-sql.png' });
// Visual analysis tab
await page.getByRole('button', { name: 'Visual Analysis' }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: '/tmp/da-visual.png' });
// economist excel + terminal
await page.goto('http://localhost:3000/sim/economist', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Excel' }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/econ-excel.png' });
await page.getByRole('button', { name: 'Bloomberg Terminal' }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/econ-terminal.png' });
await ctx.close(); await browser.close(); console.log('done');
