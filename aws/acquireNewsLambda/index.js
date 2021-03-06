const axios = require("axios");
const cheerio = require("cheerio");

exports.handler = async (event) => {
  let body = [];
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
      const { searchString } = data;
      console.log(searchString);
      const wprostArticles = await getWPROST(searchString);
      const dzienikArticles = await getDZIENNIK(searchString);
      const okoArticles = await getOKO(searchString);
      const niezaleznaArticles = await getNIEZALEZNA(searchString);
      body = [
        ...wprostArticles,
        ...dzienikArticles,
        ...okoArticles,
        ...niezaleznaArticles,
      ];
      body.forEach((article, i) => (article.id = i + 1));
      shuffle(body);
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

const polishMonthsObject = {
  styczen: "january",
  stycznia: "january",
  luty: "february",
  lutego: "february",
  marzec: "march",
  marca: "march",
  kwiecien: "april",
  kwietnia: "april",
  maj: "may",
  maja: "may",
  czerwiec: "june",
  czerwca: "june",
  lipiec: "july",
  lipca: "july",
  sierpien: "august",
  sierpnia: "august",
  wrzesien: "september",
  wrzesnia: "september",
  pazdziernik: "october",
  pazdziernika: "october",
  listopad: "november",
  listopada: "november",
  grudzien: "december",
  grudnia: "december",
};

const parseDate = (dateString) => {
  const zeroTime = (dateWithWrongTime) => {
    dateWithWrongTime.setHours(0);
    dateWithWrongTime.setMinutes(0);
    dateWithWrongTime.setSeconds(0);
    dateWithWrongTime.setMilliseconds(0);
  };
  switch (dateString) {
    case "dzisiaj":
      const today = new Date();
      zeroTime(today);
      return today;

    case "wczoraj":
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      zeroTime(yesterday);
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
      date.setDate(date.getDate());
      return date;
  }
};

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  array.sort(function (a, b) {
    return b.date - a.date;
  });
  return array;
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
            title,
            link,
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

const getNIEZALEZNA = async (word) => {
  const articles = [];
  try {
    const $ = await fetchHTML(`https://niezalezna.pl/wyszukiwarka?s=${word}`);

    $.prototype.exists = function (selector) {
      return this.find(selector).length > 0;
    };

    try {
      for (let i = 1; i < 21; i++) {
        const link = `https://niezalezna.pl/${$(
          `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a`
        ).attr("href")}`;
        const title = $(
          `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a > div > div.articleHorizontalTitleMiddle`
        ).text();
        let thumbnail = $(
          `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a > img`
        ).attr("src");
        if (typeof thumbnail === "undefined") thumbnail = "";

        const dateString = $(
          `#content > div.columnRightLarge > div > div > div:nth-child(${i}) > a > div > div.articleHorizontalDate`
        ).text();

        const year = parseInt(dateString.slice(-4));
        const month = parseInt(dateString.slice(-7, -5)) - 1;
        const day = parseInt(dateString.slice(-10, -8));
        const date = new Date(year, month, day);

        if (title !== "" && thumbnail !== "" && typeof link !== "undefined") {
          articles.push({
            site: "NIEZALEZNA",
            title,
            link,
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
    console.log(`Error connecting with niezalezna.pl: ${error}`);
  }
};
