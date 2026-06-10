import { chromium } from 'playwright';
const careers = ['cyber-architect','copywriter','economist','data-analyst','data-engineer','sysadmin','investment-manager','crypto-laundry','cyber-activist','spy-manager'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(`[console] ${m.text().slice(0,200)}`); });
page.on('pageerror', e => errors.push(`[pageerror] ${String(e).slice(0,200)}`));

await page.goto('http://localhost:8080/');
await page.evaluate(() => localStorage.setItem('sim_user_auth','true'));

for (const c of careers) {
  errors.length = 0;
  await page.goto(`http://localhost:8080/sim/${c}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // click every tab in the tab bar
  const tabs = await page.locator('button:visible').filter({ hasText: /^[A-Za-z]/ }).all();
  const tabLabels = [];
  // get sidebar tab labels from the top tab bar specifically
  const topTabs = await page.locator('main button').all();
  // Just click each known tab by role within the center tab bar
  const tabButtons = page.locator('div.flex.items-center.justify-center button, [aria-current]');
  // simpler: iterate the tab bar buttons
  const navButtons = await page.locator('button').filter({ hasText: /Dashboard|Email|Terminal|Network|Drafts|Social|Excel|Bloomberg|SQL|Visual|Airflow|ServiceNow|Active Directory|Router|Stocks|Asset|Mixer|Routing|Onion|Root Shell|Dark Web|C2|Field Intel|Global Assets/ }).all();
  let clicked = 0;
  for (const b of navButtons) {
    try { await b.click({ timeout: 1500 }); await page.waitForTimeout(350); clicked++; } catch {}
  }
  console.log(`\n=== ${c} === (clicked ${clicked} tabs) errors: ${errors.length}`);
  errors.slice(0,6).forEach(e => console.log('   ' + e));
}
await ctx.close(); await browser.close();
