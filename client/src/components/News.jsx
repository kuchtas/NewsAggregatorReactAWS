import React from "react";
import Article from "./Article";
import FlipMove from "react-flip-move";

const News = ({ articles, filterState }) => {
  const isChosen = (site) => {
    return filterState[site];
  };

  return (
    <FlipMove
      enterAnimation="accordionVertical"
      appearAnimation="accordionVertical"
    >
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
    </FlipMove>
  );
};

export default News;
