import React, { forwardRef } from "react";
import { Container, Col, Row } from "reactstrap";
import wprostLogo from "../logos/wprost-favicon-512x512.png";
import dziennikLogo from "../logos/dziennik.jpg";
import okoLogo from "../logos/oko.jpg";
import niezaleznaLogo from "../logos/niezalezna.jpg";
import missingPicture from "../logos/icons8-unavailable-120.png";
import "../styles/articleStyles.css";

const Article = forwardRef(
  ({ site, title, link, thumbnail, date, display }, ref) => {
    const getClasses = () => {
      return display ? "article mt-3 border rounded" : "d-none";
    };
    const getLogo = (site) => {
      switch (site) {
        case "WPROST":
          return wprostLogo;
        case "DZIENNIK":
          return dziennikLogo;
        case "OKO":
          return okoLogo;
        case "NIEZALEZNA":
          return niezaleznaLogo;
        default:
          return missingPicture;
      }
    };

    return (
      <div ref={ref}>
        <Container className={getClasses()} style={{ position: "relative" }}>
          <Row className="align-items-center">
            <Col xs="0" className="text-left">
              <img
                className="thumbnail ml-3 mt-3 mb-3 rounded "
                src={thumbnail}
                onError={(e) => (e.target.src = missingPicture)}
                alt="News thubmnail"
              />
            </Col>

            <Col
              className="text-left text-wrap text-break lead"
              style={{
                fontSize: "calc(0.8em + 0.6vw)",
              }}
            >
              {title}
            </Col>

            <Col xs="0" className=" m-3">
              <img
                className="logo"
                src={getLogo(site)}
                alt="Logo of the news site"
              />
            </Col>

            <a
              href={link}
              className="stretched-link"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </Row>
        </Container>
      </div>
    );
  }
);

export default Article;
