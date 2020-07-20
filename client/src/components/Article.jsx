import React from "react";

const Article = ({ site, title, link, thumbnail }) => {
  return (
    <div className="container">
      {site} , {title}, {link}, {thumbnail}
    </div>
  );
};

export default Article;
