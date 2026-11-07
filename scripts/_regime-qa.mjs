import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
page.setDefaultTimeout(25000);
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

const html = await page.content();
const body0 = await page.locator("body").innerText();

const regime = page.locator("section").filter({ hasText: /Regime/i }).first();
await regime.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await regime.screenshot({ path: "/workspace/screenshots/desk-regime-tile.png" });

const pairs = page.locator("section").filter({ hasText: /Cleanest pair expressions/i }).first();
await pairs.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await pairs.screenshot({ path: "/workspace/screenshots/desk-pairs-regime.png" });
await page.screenshot({ path: "/workspace/screenshots/desk-fri4-top.png" });

await page.locator("button").filter({ hasText: "Federal Reserve" }).first().click();
await page.waitForTimeout(600);
await page.locator("#detail").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.locator("#detail").screenshot({ path: "/workspace/screenshots/desk-fri4-usd.png" });
const usdBody = await page.locator("#detail").innerText();

await page.locator("button").filter({ hasText: "Bank of Canada" }).first().click();
await page.waitForTimeout(500);
const cadBody = await page.locator("#detail").innerText();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await mobile.waitForTimeout(800);
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
await mobile.locator("section").filter({ hasText: /Regime/i }).first().screenshot({ path: "/workspace/screenshots/desk-regime-tile-mobile.png" });
await mobile.locator("section").filter({ hasText: /Cleanest pair expressions/i }).first().screenshot({ path: "/workspace/screenshots/desk-pairs-regime-mobile.png" });

const checks = {
  stamp: /Updated Friday 4 September 2026/i.test(body0),
  riskOff: /Risk off/i.test(body0),
  index35: /\b35\b/.test(body0),
  warBlocked: /WTI week up \(blocked — war\)/i.test(body0),
  wti9151: /91\.51/.test(body0),
  dxy9904: /99\.04/.test(body0),
  usdchf: /0\.8084/.test(body0),
  claims206: /206k/i.test(usdBody),
  nfpNotYet: /non-farm payrolls/i.test(usdBody) && /not yet/i.test(usdBody),
  cadLfsNotYet: /Labour Force Survey/i.test(cadBody) && /not yet/i.test(cadBody),
  noFuel: !/Fuel & Energy Conflict/i.test(body0),
  noBanner: !html.includes("header-banner"),
  noMobileOverflow: !overflow,
};

console.log(JSON.stringify(checks, null, 2));
const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
console.log(failed.length ? `FAIL ${failed.join(",")}` : "PASS");

await browser.close();
process.exit(failed.length ? 1 : 0);
