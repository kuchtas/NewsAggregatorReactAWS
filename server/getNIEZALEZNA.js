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
      if (typeof thumbnail === "undefined") thumbnail = "";

      if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
        articles.push({
          site: "NIEZALEZNA",
          titleAndLink: { title, link },
          thumbnail,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
  return articles;
};

exports.getNIEZALEZNA = getNIEZALEZNA;
