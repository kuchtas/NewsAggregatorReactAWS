const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  let body;
  try {
    body = await getDZIENNIK(event.searchString);
  } catch (err) {
    body = err.message;
  }
  return JSON.stringify({ body });
};

const polishMonthsObject = {
  stycznia: "january",
  lutego: "february",
  marca: "march",
  kwietnia: "april",
  maja: "may",
  czerwca: "june",
  lipca: "july",
  sierpnia: "august",
  wrzesnia: "september",
  pazdziernika: "october",
  listopada: "november",
  grudnia: "december",
};

const parseDate = (dateString) => {
  switch (dateString) {
    case "dzisiaj":
      const today = new Date();
      return today;

    case "wczoraj":
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.toDateString();
      return yesterday;

    default:
      const dateWithoutDiacritics = dateString
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\u0142/g, "l");

      const regex = /[a-zA-Z]+/g;
      const month = dateWithoutDiacritics.match(regex);
      const dateEnglish = dateWithoutDiacritics.replace(
        month,
        polishMonthsObject[month]
      );
      const date = new Date(dateEnglish);
      date.setDate(date.getDate() + 1); // days are counted starting from 0 to 30 in Date() so we need to add one day
      date.toDateString();
      return date;
  }
};

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getDZIENNIK = async (word) => {
  const articles = [];
  try {
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

      const dateString = $(
        `#doc > div.pageContent.pageWrapper > section > div > section > div.resultList > ul > li:nth-child(${i}) > div > div > span`
      ).text();

      const date = parseDate(dateString);

      if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
        articles.push({
          site: "DZIENNIK",
          title,
          link,
          thumbnail,
          date,
        });
      }
    }
    return articles;
  } catch (error) {
    console.log(`Error connecting with dziennik.pl: ${error}`);
  }
};
