const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  let body;
  try {
    body = await getWPROST(event.searchString);
  } catch (err) {
    body = err.message;
  }
  return JSON.stringify({ body });
};

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getWPROST = async (word) => {
  const articles = [];

  try {
    const $ = await fetchHTML(`https://www.wprost.pl/wyszukaj/${word}`);

    $.prototype.exists = function (selector) {
      return this.find(selector).length > 0;
    };

    try {
      for (let i = 1; i < 10; i++) {
        const title = $(
          `#section-list-2 > li:nth-child(${i}) > a.title`
        ).text();

        let link = $(`#section-list-2 > li:nth-child(${i}) > a.title`).attr(
          "href"
        );
        if (link.substr(0, 4) !== "http") {
          link = `https://www.wprost.pl${link}`;
        }

        let thumbnail = "";
        if (
          $(`#section-list-2 > li:nth-child(${i}) > a.image`).hasClass(
            "image-th"
          )
        ) {
          thumbnail = $(
            `#section-list-2 > li:nth-child(${i}) > a.image.image-th`
          )
            .css("background-image")
            .replace(`url(`, `https://www.wprost.pl/`)
            .slice(0, -1);
        }
        const dateString = $(
          `#section-list-2 > li:nth-child(${i}) > span.lead > span`
        ).attr("title");

        const date = new Date(dateString);

        if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
          articles.push({
            site: "WPROST",
            title,
            link,
            thumbnail,
            date,
          });
        }
      }

      for (let i = 1; i < 22; i++) {
        const title = $(`#section-list > li:nth-child(${i}) > a.title`).text();

        let link = $(`#section-list > li:nth-child(${i}) > a.title`).attr(
          "href"
        );
        if (link.substr(0, 4) !== "http") {
          link = `https://www.wprost.pl${link}`;
        }

        let thumbnail = "";
        if (
          $(`#section-list > li:nth-child(${i}) > a.image`).hasClass("image-th")
        ) {
          thumbnail = $(`#section-list > li:nth-child(${i}) > a.image.image-th`)
            .css("background-image")
            .replace(`url(`, `https://www.wprost.pl/`)
            .slice(0, -1);
        }

        const dateString = $(
          `#section-list > li:nth-child(${i}) > span.lead > span`
        ).attr("title");

        const date = new Date(dateString);

        if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
          articles.push({
            site: "WPROST",
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
  } catch (error) {
    console.log(`Error connecting with wprost.pl: ${error}`);
  }
};
