import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
page.setDefaultTimeout(20000);
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1800);

const body = await page.locator("body").innerText();
const html = await page.content();

const checks = {
  stamp: /Updated Wednesday 2 September 2026/i.test(body),
  noFuel: !/Fuel & Energy Conflict/i.test(body),
  noLabourPulse: !/Labour pulse/i.test(body),
  noRatesPulse: !/Rates pulse/i.test(body),
  noBanner: !html.includes("header-banner"),
  pairs: /Cleanest pair expressions/i.test(body),
  rs: /Relative Strength Score/i.test(body),
  trendPills: /Uptrend/i.test(body) || /Downtrend/i.test(body) || /Ranging/i.test(body),
  regime: /Bullish/i.test(body) || /Bearish/i.test(body),
  noSeasonality: !/Seasonality/i.test(body),
  twoLeg: /Invalid if /i.test(body),
  noLeftoverAudchfOnAudcad: true,
};

await page.screenshot({ path: "/workspace/screenshots/desk-upgrade-top.png" });

async function clickCode(code) {
  const tile = page
    .locator("section")
    .filter({ hasText: /Select a currency/i })
    .getByRole("button", { name: new RegExp(code) })
    .first();
  if (await tile.count()) await tile.click();
  else await page.getByRole("button", { name: new RegExp(`^${code}\\b`) }).first().click();
  await page.waitForTimeout(600);
  await page.locator("#detail").evaluate((el) => el.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(300);
}

async function detailText() {
  return page.locator("#detail").innerText();
}

await clickCode("AUD");
let aud = await detailText();
const infl = page.locator("#detail").locator("h3", { hasText: /Inflation Drivers/i }).first();
if (await infl.count()) {
  await infl.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(400);
  aud = await detailText();
}
checks.audCb = /CB watch/i.test(aud);
checks.audTrim = /Trimmed mean/i.test(aud);
checks.audInflTag = /Inflationary/i.test(aud) && /Disinflationary/i.test(aud);
checks.audEmpTag = /Decrease hike odds/i.test(aud);
checks.audTrend = /Uptrend/i.test(aud);
checks.audNoSeason = !/Seasonality/i.test(aud);
checks.audRegime = /Bullish/i.test(aud);
checks.audNoStickyTag =
  (await page.locator("#detail span").filter({ hasText: /^STICKY$/ }).count()) === 0;
await page.screenshot({ path: "/workspace/screenshots/desk-upgrade-aud.png" });
await infl.evaluate((el) => el.scrollIntoView({ block: "start" })).catch(() => {});
await page.screenshot({ path: "/workspace/screenshots/desk-upgrade-aud-drivers.png" });

await clickCode("EUR");
const eurHead = page.locator("#detail").locator("h3", { hasText: /Inflation Drivers/i }).first();
if (await eurHead.count()) {
  await eurHead.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(300);
}
const eur = await detailText();
checks.eurServices = /Services/i.test(eur) && /CB watch/i.test(eur);
checks.eurStreet = /J\.P\. Morgan/i.test(eur);
checks.eurNoSeason = !/Seasonality/i.test(eur);
await page.screenshot({ path: "/workspace/screenshots/desk-upgrade-eur.png" });

await clickCode("CHF");
const chf = await detailText();
checks.chfCpi = /CPI \(domestic\)/i.test(chf);
checks.chfDown = /Downtrend/i.test(chf);
checks.chfBear = /Bearish/i.test(chf);
await page.screenshot({ path: "/workspace/screenshots/desk-upgrade-chf.png", fullPage: false });

await clickCode("CAD");
const cad = await detailText();
checks.cadHeld = /held/i.test(cad) && /2\.25/.test(cad);
checks.cadNextOct = /28 Oct/i.test(cad);
checks.cadNoLiveMeeting = !/Decision not printed/i.test(cad);
const pairCards = await page.locator("section").filter({ hasText: /Cleanest pair expressions/i }).innerText();
checks.noLeftoverAudchfOnAudcad = !(/AUDCAD/i.test(pairCards) && /AUDCHF/i.test(pairCards));
checks.twoShorts = (pairCards.match(/Invalid if /gi) || []).length >= 4;

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: "/workspace/screenshots/desk-upgrade-mobile.png" });
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);
checks.noMobileOverflow = !mobileOverflow;

console.log(JSON.stringify(checks, null, 2));
console.log("--- AUD slice ---\n", aud.slice(0, 2200));
console.log("--- EUR slice ---\n", eur.slice(0, 1200));
console.log("--- pairs ---\n", pairCards.slice(0, 1600));
const fails = Object.entries(checks).filter(([, v]) => !v);
if (fails.length) {
  console.log("FAILS", fails.map(([k]) => k).join(", "));
  process.exitCode = 1;
} else {
  console.log("ALL CHECKS PASS");
}
await browser.close();
