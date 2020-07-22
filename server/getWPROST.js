const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getWPROST = async (word) => {
  const articles = [];

  const $ = await fetchHTML(`https://www.wprost.pl/wyszukaj/${word}`);

  $.prototype.exists = function (selector) {
    return this.find(selector).length > 0;
  };

  for (let i = 1; i < 10; i++) {
    const title = $(`#section-list-2 > li:nth-child(${i}) > a.title`).text();

    const link = $(`#section-list-2 > li:nth-child(${i}) > a.title`).attr(
      "href"
    );

    let thumbnail = "";
    if (
      $(`#section-list > li:nth-child(${i}) > a.image`).hasClass("image-th")
    ) {
      thumbnail = $(`#section-list-2 > li:nth-child(${i}) > a.image.image-th`)
        .css("background-image")
        .replace(`url(`, `https://www.wprost.pl/`)
        .slice(0, -1);
    }

    articles.push({
      site: "WPROST",
      titleAndLink: { title, link },
      thumbnail,
    });
  }

  for (let i = 1; i < 22; i++) {
    const title = $(`#section-list > li:nth-child(${i}) > a.title`).text();

    const link = $(`#section-list > li:nth-child(${i}) > a.title`).attr("href");

    let thumbnail = "";
    if (
      $(`#section-list > li:nth-child(${i}) > a.image`).hasClass("image-th")
    ) {
      thumbnail = $(`#section-list > li:nth-child(${i}) > a.image.image-th`)
        .css("background-image")
        .replace(`url(`, `https://www.wprost.pl/`)
        .slice(0, -1);
    }

    articles.push({
      site: "WPROST",
      titleAndLink: { title, link },
      thumbnail,
    });
  }
  return articles;
};

exports.getWPROST = getWPROST;
