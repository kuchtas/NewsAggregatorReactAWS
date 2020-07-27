const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const polishMonthsObject = {
  sty: "january",
  styczen: "january",
  stycznia: "january",
  lut: "february",
  luty: "february",
  lutego: "february",
  mar: "march",
  marzec: "march",
  marca: "march",
  kwi: "april",
  kwiecien: "april",
  kwietnia: "april",
  maj: "may",
  maj: "may",
  maja: "may",
  cze: "june",
  czerwiec: "june",
  czerwca: "june",
  lip: "july",
  lipiec: "july",
  lipca: "july",
  sie: "august",
  sierpien: "august",
  sierpnia: "august",
  wrz: "september",
  wrzesien: "september",
  wrzesnia: "september",
  paz: "october",
  pazdziernik: "october",
  pazdziernika: "october",
  lis: "november",
  listopad: "november",
  listopada: "november",
  gru: "december",
  grudzien: "december",
  grudnia: "december",
};

parseDate = (dateString) => {
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

    const dateString = $(
      `#doc > div.pageContent.pageWrapper > section > div > section > div.resultList > ul > li:nth-child(${i}) > div > div > span`
    ).text();

    const date = parseDate(dateString);

    if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
      articles.push({
        site: "DZIENNIK",
        titleAndLink: { title, link },
        thumbnail,
        date,
      });
    }
  }
  return articles;
};

exports.getDZIENNIK = getDZIENNIK;
