const puppeteer = require("puppeteer");

const extractTitleAndLinkWPROST = async (article) => {
  const linkToArticle = await article.getProperty("href");
  const rawLinkToArticle = await linkToArticle.jsonValue();

  const titleOfArticle = await article.getProperty("textContent");
  const rawTitleOfArticle = await titleOfArticle.jsonValue();

  return { rawTitleOfArticle, rawLinkToArticle };
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

  return { rawUrlOfThumbnail };
};

const getWPROST = async (word) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const articles = [];
  await page.goto(`https://www.wprost.pl/wyszukaj/${word}`);

  const accept = await page.$x(`/html/body/div[8]/div[1]/div/div/div[2]/a[2]`); // find the button for accepting the RODO to access the site
  await accept[0].click();

  try {
    for (let i = 1; i < 10; i++) {
      const [article] = await page.$x(
        `//*[@id="section-list-2"]/li[${i}]/a[1]`
      );
      const [thumbnail] = await page.$x(
        `//*[@id="section-list-2"]/li[${i}]/a[2]`
      );

      const titleAndLink = await extractTitleAndLinkWPROST(article);
      const thumbnailURL = await extractThumbnailWPROST(thumbnail);

      articles.push({ titleAndLink, thumbnailURL });
    }

    for (let i = 1; i < 22; i++) {
      const [article] = await page.$x(`//*[@id="section-list"]/li[${i}]/a[1]`);
      const [thumbnail] = await page.$x(
        `//*[@id="section-list"]/li[${i}]/a[2]`
      );

      const titleAndLink = await extractTitleAndLinkWPROST(article);
      const thumbnailURL = await extractThumbnailWPROST(thumbnail);

      articles.push({ titleAndLink, thumbnailURL });
    }
  } catch {
    console.log("End of articles");
  }
  await page.close();
  await browser.close();
  return articles;
};

exports.getWPROST = getWPROST;
