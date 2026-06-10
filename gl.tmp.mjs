import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:8080/');
await page.evaluate(() => localStorage.setItem('sim_user_auth','true'));
const hdr = () => page.locator('header').first().innerText().then(t=>t.replace(/\s+/g,' ').trim()).catch(()=>'n/a');
for (const career of ['crypto-laundry','sysadmin','data-engineer']) {
  await page.goto(`http://localhost:8080/sim/${career}`, { waitUntil:'networkidle' });
  await page.waitForTimeout(700);
  const before = await hdr();
  await page.getByRole('button', { name: 'Email' }).first().click();
  await page.waitForTimeout(500);
  const accept = page.getByRole('button', { name: /Accept Mission Directive/ });
  if (await accept.count()) { await accept.first().click(); await page.waitForTimeout(300); }
  const complete = page.getByRole('button', { name: /Clear and Finish Mission/ });
  if (await complete.count()) { await complete.first().click(); await page.waitForTimeout(500); }
  const after = await hdr();
  console.log(`=== ${career} ===\n  before: ${before}\n  after : ${after}`);
}
await ctx.close(); await browser.close();
console.log('TEST_DONE');
