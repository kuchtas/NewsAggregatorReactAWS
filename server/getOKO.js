const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

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
      if (typeof thumbnail === "undefined") thumbnail = "";
      articles.push({
        site: "OKO",
        titleAndLink: { title, link },
        thumbnail,
      });
    });
  } catch (error) {
    console.log(error);
  }
  console.log(articles);
  return articles;
};

getOKO("wybory prezydenckie");
exports.getOKO = getOKO;
