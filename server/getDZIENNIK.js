const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getDZIENNIK = async (word) => {
  const articles = [];

  const $ = await fetchHTML(
    `https://www.dziennik.pl/szukaj?c=1&b=1&o=1&s=0&search_term=&q=${word}`
  );

  for (let i = 1; i < 28; i++) {
    if (i % 11 === 0) continue;

    const title = $(
      `#doc > div.pageContent.pageWrapper > section > div > section > div.resultList > ul > li:nth-child(${i}) > div > h4 > a`
    ).text();

    const link = $(
      `#doc > div.pageContent.pageWrapper > section > div > section > div.resultList > ul > li:nth-child(${i}) > div > h4 > a`
    ).attr("href");

    const thumbnail = $(
      `#doc > div.pageContent.pageWrapper > section > div > section > div.resultList > ul > li:nth-child(${i}) > a > img`
    ).attr("src");

    if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
      articles.push({
        site: "DZIENNIK",
        titleAndLink: { title, link },
        thumbnail,
      });
    }
  }
  return articles;
};

exports.getDZIENNIK = getDZIENNIK;
