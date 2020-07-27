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

const getOKO = async (word) => {
  const articles = [];

  const $ = await fetchHTML(`https://oko.press/?s=${word}`);

  $.prototype.exists = function (selector) {
    return this.find(selector).length > 0;
  };

  try {
    $(".post").each(function () {
      const postID = $(this).attr("id");
      const link = $(`#${postID} > div > div > a.img`).attr("href");
      const title = $(`#${postID} > div > div > h2 > a`).text();
      let thumbnail = $(`#${postID} > div > div > a.img > img`).attr(
        "data-src"
      );

      const dateString = $(`#${postID} > div > div > time`).text();

      const date = parseDate(dateString);

      if (typeof thumbnail === "undefined") thumbnail = "";

      if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
        articles.push({
          site: "OKO",
          titleAndLink: { title, link },
          thumbnail,
          date,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
  console.log(articles);
  return articles;
};

getOKO("halo");
exports.getOKO = getOKO;
