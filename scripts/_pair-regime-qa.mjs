import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
page.setDefaultTimeout(25000);
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);

const body = await page.locator("body").innerText();
const html = await page.content();
const section = page.locator("section").filter({ hasText: /Cleanest pair expressions/i }).first();
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await section.screenshot({ path: "/workspace/screenshots/desk-pair-regime.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 900 } });
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await mobile.waitForTimeout(800);
const mSec = mobile.locator("section").filter({ hasText: /Cleanest pair expressions/i }).first();
await mSec.scrollIntoViewIfNeeded();
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
await mSec.screenshot({ path: "/workspace/screenshots/desk-pair-regime-mobile.png" });

const checks = {
  riskOff: /Risk off/i.test(body),
  vsRegime: /vs regime/i.test(body),
  usdchfFights: /Haven bid can squeeze the short CHF leg on USDCHF/i.test(body),
  pullback: /Pullback is not an automatic add/i.test(body),
  eurchfFights: /short CHF leg on EURCHF/i.test(body),
  audcadNeutral: /Both cyclicals/i.test(body),
  oilCad: /Oil spike can bid the CAD short/i.test(body),
  noFuel: !/Fuel & Energy Conflict/i.test(body),
  noBanner: !html.includes("header-banner"),
  noMobileOverflow: !overflow,
};

console.log(JSON.stringify(checks, null, 2));
const failed = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
console.log(failed.length ? `FAIL ${failed.join(",")}` : "PASS");
await browser.close();
process.exit(failed.length ? 1 : 0);
