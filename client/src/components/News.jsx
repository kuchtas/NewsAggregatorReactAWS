import React from "react";
import Article from "./Article";

const News = ({ articles, filterState }) => {
  const isChosen = (site) => {
    return filterState[site];
  };

  return (
    <div>
      {articles.map((article) => (
        <Article
          key={article.id}
          site={article.site}
          title={article.title}
          link={article.link}
          thumbnail={article.thumbnail}
          date={article.date}
          display={isChosen(article.site)}
        />
      ))}
    </div>
  );
};

export default News;
