import React from "react";
import { Container } from "reactstrap";
import wprostLogo from "../logos/wprost-favicon-512x512.png";
import missingPicture from "../logos/icons8-unavailable-120.png";

const Article = ({ site, title, link, thumbnail }) => {
  const getLogo = (site) => {
    switch (site) {
      case "WPROST":
        return wprostLogo;
      default:
        return missingPicture;
    }
  };

  return (
    <Container
      className="mt-3 border text-left"
      style={{ position: "relative" }}
    >
      <img
        src={getLogo(site)}
        width="50"
        height="50"
        alt="Logo of the news site"
      />
      <img
        src={thumbnail}
        onError={(e) => (e.target.src = missingPicture)}
        width="100"
        height="100"
        alt="News thubmnail"
        className="m-3"
      />

      <a
        href={link}
        className="stretched-link"
        target="_blank"
        rel="noopener noreferrer"
      ></a>
      <span className="lead">{title}</span>
    </Container>
  );
};

export default Article;
