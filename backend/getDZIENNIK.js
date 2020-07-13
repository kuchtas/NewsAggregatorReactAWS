const puppeteer = require("puppeteer");

const extractTitleAndLinkDZIENNIK = async (article) => {
  const linkToArticle = await article.getProperty("href");
  const rawLinkToArticle = await linkToArticle.jsonValue();

  const titleOfArticle = await article.getProperty("textContent");
  const rawTitleOfArticle = await titleOfArticle.jsonValue();

  return { rawTitleOfArticle, rawLinkToArticle };
};

const extractThumbnailDZIENNIK = async (thumbnail) => {
  const thumbnailOfArticle = await thumbnail.getProperty("src");
  const rawUrlOfThumbnail = await thumbnailOfArticle.jsonValue();

  return { rawUrlOfThumbnail };
};

const getDZIENNIK = async (word) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const articles = [];
  await page.goto(
    `https://www.dziennik.pl/szukaj?c=1&b=1&o=1&s=0&search_term=&q=${word}`
  );

  try {
    for (let i = 1; i < 28; i++) {
      if (i % 11 === 0) continue;
      const article = await page.waitForXPath(
        `//*[@id="doc"]/div[3]/section/div/section/div[1]/ul/li[${i}]/div/h4/a`
      );
      const thumbnail = await page.waitForXPath(
        `//*[@id="doc"]/div[3]/section/div/section/div[1]/ul/li[${i}]/a/img`
      );

      const titleAndLink = await extractTitleAndLinkDZIENNIK(article);
      const thumbnailURL = await extractThumbnailDZIENNIK(thumbnail);

      articles.push({ titleAndLink, thumbnailURL });
    }
  } catch {
    console.log("End of articles");
  }
  await page.close();
  await browser.close();
  return articles;
};

exports.getDZIENNIK = getDZIENNIK;
