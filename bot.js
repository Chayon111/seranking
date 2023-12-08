const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(require("puppeteer-extra-plugin-anonymize-ua")());
const Recaptcha = require("puppeteer-extra-plugin-recaptcha");
const { filter } = require("./helper");
puppeteer.use(StealthPlugin());
puppeteer.use(
  Recaptcha({
    provider: {
      id: "2captcha",
      token: "Your 2captcha API Here",
    },
    visualFeedback: true,
  })
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let browser;
const username = "wagnereusebio6336@gmail.com";
const password = "(6B^ET1r";
const logIn = async (email, password) => {
  try {
    const [page] = await browser.pages();
    await page.goto(`https://online.seranking.com/login.html`);

    await page.waitForSelector('[name="aItem[login]"]', { visible: true });
    await page.type('[name="aItem[login]"]', email, { delay: 50 });

    await page.type('[type="password"]', password, { delay: 50 });

    await page.click("body");

    await page.click('[type="submit"]');
    let { captchas, filtered, error } = await page.findRecaptchas();
    if (captchas) {
      console.log("solving captcha");
      await page.solveRecaptchas();
    } else {
      console.log("no Recaptcha");
    }
    await sleep(2000);
  } catch (err) {
    console.log(err);
  }
};

exports.getOverview = async ({ keyword, country }) => {
  const page = await browser.newPage();
  await page.goto(
    `https://online.seranking.com/research.keywords.html/?keyword=${keyword}&source=${country}`
  );
  const responses = await Promise.all(
    [
      `/research.api.keyword.html?do=cpc&limit=9&currency=USD&keyword=${keyword}&source=${country}`,
      `/research.api.keyword.html?keyword=${keyword}&source=${country}&currency=USD`,
      `/research.api.keyword.html?do=globalVolume&keyword=${keyword}&source=${country}`,
    ].map((url) => page.waitForResponse((r) => r.request().url().includes(url)))
  );

  const jsons = await Promise.all(responses.map((response) => response.json()));
  page.close();
  // console.log(filter(jsons));
  return filter(jsons);
};

exports.run = async () => {
  browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: "new",
  });
  await logIn(username, password);
};
