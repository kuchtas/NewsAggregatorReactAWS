import React from "react";
import Article from "./Article";

const News = ({ articles, filterState }) => {
  const isChosen = (site) => {
    return filterState[site];
  };

  return (
    <div>
      {articles.map((article, index) => (
        <Article
          key={index}
          site={article.site}
          title={article.titleAndLink.title}
          link={article.titleAndLink.link}
          thumbnail={article.thumbnail}
          display={isChosen(article.site)}
        />
      ))}
    </div>
  );
};

export default News;
