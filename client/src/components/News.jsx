import React from "react";
import Article from "./Article";

const News = ({ articles }) => {
  return (
    <div>
      {articles.map((article, index) => (
        <Article
          key={index}
          site={article.site}
          title={article.titleAndLink.title}
          link={article.titleAndLink.link}
          thumbnail={article.thumbnail}
        />
      ))}
    </div>
  );
};

export default News;
