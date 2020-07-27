const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getNIEZALEZNA = async (word) => {
  const articles = [];

  const $ = await fetchHTML(`https://niezalezna.pl/wyszukiwarka?s=${word}`);

  $.prototype.exists = function (selector) {
    return this.find(selector).length > 0;
  };

  try {
    for (let i = 1; i < 21; i++) {
      const link =
        `https://niezalezna.pl/` +
        $(
          `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a`
        ).attr("href");
      const title = $(
        `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a > div > div.articleHorizontalTitleMiddle`
      ).text();
      let thumbnail = $(
        `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a > img`
      ).attr("src");

      const dateString = $(
        `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a > div > div.articleHorizontalDate`
      ).text();

      const year = parseInt(dateString.slice(-4));
      const month = parseInt(dateString.slice(-7, -5)) - 1;
      const day = parseInt(dateString.slice(-10, -8)) + 1;
      const date = new Date(year, month, day);

      if (typeof thumbnail === "undefined") thumbnail = "";

      if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
        articles.push({
          site: "NIEZALEZNA",
          titleAndLink: { title, link },
          thumbnail,
          date,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
  return articles;
};
exports.getNIEZALEZNA = getNIEZALEZNA;
