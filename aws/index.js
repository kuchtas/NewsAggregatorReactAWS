const AWS = require("aws-sdk");
const chromium = require("chrome-aws-lambda");

exports.handler = async (event, context) => {
  let body;
  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  };
  try {
    if (event.httpMethod === "POST") {
      const data = JSON.parse(event.body);
      body = await getWPROST(data.searchString);
    } else {
      throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = "400";
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    headers,
    body,
  };
};

const extractTitleAndLinkWPROST = async (article) => {
  const linkToArticle = await article.getProperty("href");
  const rawLinkToArticle = await linkToArticle.jsonValue();

  const titleOfArticle = await article.getProperty("textContent");
  const rawTitleOfArticle = await titleOfArticle.jsonValue();

  return { title: rawTitleOfArticle, link: rawLinkToArticle };
};

const extractThumbnailWPROST = async (thumbnail) => {
  const thumbnailOfArticle = await thumbnail.getProperty("style");
  const urlOfThumbnail = await thumbnailOfArticle.getProperty(
    "background-image"
  );
  const correctUrlOfThumbnail = await urlOfThumbnail.jsonValue();
  const rawUrlOfThumbnail = correctUrlOfThumbnail
    .replace(`url("`, `https://www.wprost.pl/`)
    .slice(0, -2);

  return rawUrlOfThumbnail;
};

const getWPROST = async (word) => {
  const articles = [];
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log(err);
  }

  const page = await browser.newPage();
  await page.goto(`https://www.wprost.pl/wyszukaj/${word}`);

  await page.waitForXPath(`/html/body/div[8]/div[1]/div/div/div[2]/a[2]`);
  const accept = await page.$x(`/html/body/div[8]/div[1]/div/div/div[2]/a[2]`); // find the button for accepting the RODO to access the site
  await accept[0].click();

  try {
    for (let i = 1; i < 10; i++) {
      const [articleXPath] = await page.$x(
        `//*[@id="section-list-2"]/li[${i}]/a[1]`
      );
      const [thumbnailXPath] = await page.$x(
        `//*[@id="section-list-2"]/li[${i}]/a[2]`
      );

      const titleAndLink = await extractTitleAndLinkWPROST(articleXPath);
      const thumbnail = await extractThumbnailWPROST(thumbnailXPath);

      articles.push({ site: "WPROST", titleAndLink, thumbnail });
    }

    for (let i = 1; i < 22; i++) {
      const [articleXPath] = await page.$x(
        `//*[@id="section-list"]/li[${i}]/a[1]`
      );
      const [thumbnailXPath] = await page.$x(
        `//*[@id="section-list"]/li[${i}]/a[2]`
      );

      const titleAndLink = await extractTitleAndLinkWPROST(articleXPath);
      const thumbnail = await extractThumbnailWPROST(thumbnailXPath);

      articles.push({ site: "WPROST", titleAndLink, thumbnail });
    }
  } catch (err) {
    console.log("End of articles");
  }

  await page.close();
  await browser.close();
  return articles;
};
