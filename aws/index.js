const AWS = require("aws-sdk");
const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  let body;
  let wprostArticles;
  let dziennikArticles;
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
      body = [];
      wprostArticles = await getWPROST(data.searchString);
      dzienikArticles = await getDZIENNIK(data.searchString);
      Array.prototype.push.apply(body, wprostArticles);
      Array.prototype.push.apply(body, dzienikArticles);
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

  try {
    for (let i = 1; i < 10; i++) {
      const title = $(`#section-list-2 > li:nth-child(${i}) > a.title`).text();

      let link = $(`#section-list-2 > li:nth-child(${i}) > a.title`).attr(
        "href"
      );
      if (link.substr(0, 4) !== "http") {
        link = `https://www.wprost.pl` + link;
      }

      let thumbnail = "";
      if (
        $(`#section-list-2 > li:nth-child(${i}) > a.image`).hasClass("image-th")
      ) {
        thumbnail = $(`#section-list-2 > li:nth-child(${i}) > a.image.image-th`)
          .css("background-image")
          .replace(`url(`, `https://www.wprost.pl/`)
          .slice(0, -1);
      }

      if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
        articles.push({
          site: "WPROST",
          titleAndLink: { title, link },
          thumbnail,
        });
      }
    }

    for (let i = 1; i < 22; i++) {
      const title = $(`#section-list > li:nth-child(${i}) > a.title`).text();

      let link = $(`#section-list > li:nth-child(${i}) > a.title`).attr("href");
      if (link.substr(0, 4) !== "http") {
        link = `https://www.wprost.pl` + link;
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

      if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
        articles.push({
          site: "WPROST",
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

    articles.push({
      site: "DZIENNIK",
      titleAndLink: { title, link },
      thumbnail,
    });
  }
  return articles;
};
