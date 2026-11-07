import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
page.setDefaultTimeout(30000);
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);

const body = await page.locator("body").innerText();
const html = await page.content();

const regime = page.locator("section").filter({ hasText: /Regime/i }).first();
await regime.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await regime.screenshot({ path: "/workspace/screenshots/flavor-recode-compact.png" });

const expand = page.getByRole("button", { name: /Expand/i }).first();
if (await expand.count()) {
  await expand.click();
  await page.waitForTimeout(600);
}

const overlay = page.locator('[role="dialog"]').first();
const overlayVisible = await overlay.count();
if (overlayVisible) {
  await overlay.screenshot({ path: "/workspace/screenshots/flavor-recode-overlay.png" });
  const book = overlay.locator("h3").filter({ hasText: /Risk-off book/i }).locator("..");
  if (await book.count()) {
    await book.screenshot({ path: "/workspace/screenshots/flavor-recode-book.png" });
  }
}

await page.keyboard.press("Escape");
await page.waitForTimeout(400);

const pairs = page.locator("section").filter({ hasText: /Cleanest pair expressions/i }).first();
await pairs.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await pairs.screenshot({ path: "/workspace/screenshots/flavor-recode-top3.png" });

const usdchfCard = page.locator("article").filter({ hasText: /USDCHF/ }).first();
if (await usdchfCard.count()) {
  await usdchfCard.screenshot({ path: "/workspace/screenshots/flavor-recode-usdchf.png" });
}

const checks = {
  riskOff: /Risk off/i.test(body),
  oilWar: /Oil \/ war/i.test(body),
  fuelChokepoint: /Fuel chokepoint/i.test(body),
  notUsdSqueeze: /Not a USD squeeze/i.test(body) && !/USDCHF is first-class/i.test(body),
  whoCanExport: /CAD long is vetoed/i.test(body),
  barometer: /World barometer/i.test(body),
  noCadLongBook: !/long CADJPY/i.test(body),
  noLeftoverHaven: !/leftover-Haven cannot say usd-bid/i.test(body),
  noShortGbpchfBook: !/short GBPCHF/i.test(body),
  noParkUsd: !/Park USD\. Long JPY/i.test(body),
  index25: /\b25\b/.test(body),
  warBlocksSqueeze: !/War no longer blocks this gate/i.test(body),
  noBanner: !html.includes("header-banner"),
  pageErrors: errors,
};

console.log(JSON.stringify(checks, null, 2));
console.log("---BODY SLICE---");
const idx = body.indexOf("Regime");
console.log(body.slice(Math.max(0, idx), idx + 2200));
await browser.close();
