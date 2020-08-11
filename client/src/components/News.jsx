import React from "react";
import Article from "./Article";
import FlipMove from "react-flip-move";

const News = ({ articles, filterState, handleSaveButtonClick }) => {
  const isChosen = (site) => {
    return filterState[site];
  };

  return (
    <FlipMove
      enterAnimation="accordionVertical"
      leaveAnimation="accordionVertical"
      staggerDurationBy={10}
    >
      {articles.map((article) => (
        <Article
          key={article.link}
          id={article.id}
          site={article.site}
          title={article.title}
          link={article.link}
          thumbnail={article.thumbnail}
          date={article.date}
          saved={article.saved}
          isVisible={isChosen(article.site)}
          handleSaveButtonClick={handleSaveButtonClick}
        />
      ))}
    </FlipMove>
  );
};

export default News;
