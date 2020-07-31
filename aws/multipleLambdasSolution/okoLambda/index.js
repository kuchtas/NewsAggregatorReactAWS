const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  let body;
  try {
    body = await getOKO(event.searchString);
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
};

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getOKO = async (word) => {
  const articles = [];
  try {
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
        if (typeof thumbnail === "undefined") thumbnail = "";
        const dateString = $(`#${postID} > div > div > time`).text();
        const date = parseDate(dateString);

        if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
          articles.push({
            site: "OKO",
            title,
            link,
            thumbnail,
            date,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
    return articles;
  } catch (error) {
    console.log(`Error connecting with oko.press: ${error}`);
  }
};
