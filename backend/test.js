const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // tarayıcıyı aç, bot gibi görünmesin
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Instagram login sayfasına git
  await page.goto("https://www.instagram.com/accounts/login/", {
    waitUntil: "networkidle2",
  });

  // inputlar gelene kadar bekle
  await page.waitForSelector('input[name="username"]', { timeout: 15000 });
  await page.waitForSelector('input[name="password"]', { timeout: 15000 });

  // Kendi hesabını yaz
  const USERNAME = "YOUR_USERNAME";
  const PASSWORD = "YOUR_PASSWORD";

  await page.type('input[name="username"]', USERNAME, { delay: 50 });
  await page.type('input[name="password"]', PASSWORD, { delay: 50 });

  // Login butonuna tıkla
  await page.click('button[type="submit"]');

  // Ana sayfanın yüklenmesini bekle
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 20000 });

  // Cookie’leri al
  const cookies = await page.cookies();
  console.log("=== Your Instagram Cookies ===");
  console.log(cookies);

  await browser.close();
})();
