import React, { forwardRef } from "react";
import { Container, Col, Row, Button } from "reactstrap";
import wprostLogo from "../logos/wprost-favicon-512x512.png";
import dziennikLogo from "../logos/dziennik.jpg";
import okoLogo from "../logos/oko.jpg";
import niezaleznaLogo from "../logos/niezalezna.jpg";
import missingPicture from "../logos/icons8-unavailable-120.png";
import "../styles/articleStyles.css";

const Article = forwardRef(
  (
    {
      id,
      site,
      title,
      link,
      thumbnail,
      date,
      isVisible,
      saved,
      handleSaveButtonClick,
    },
    ref
  ) => {
    const getClasses = () => {
      return isVisible ? "mt-3" : "d-none";
    };

    const getSaveButtonColor = () => {
      return saved ? "dark" : "primary";
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
        <Container className={getClasses()}>
          <Row className="align-items-center ">
            <Col>
              <Container
                style={{ position: "relative" }}
                className="article border border-info rounded"
              >
                <Row className="align-items-center ">
                  <Col xs="0" className="text-left ">
                    <figure
                      className="m-3 text-center"
                      style={{
                        fontSize: "calc(0.5em + 0.4vw)",
                      }}
                    >
                      <img
                        className="thumbnail rounded"
                        src={thumbnail}
                        onError={(e) => (e.target.src = missingPicture)}
                        alt="News thubmnail"
                      />
                      <figcaption className="mt-1 badge-pill badge-dark">
                        {date.substring(0, 10)}
                      </figcaption>
                    </figure>
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
                  >
                    {" "}
                  </a>
                </Row>
              </Container>
            </Col>

            <Col xs="0">
              <Button
                style={{
                  fontSize: "calc(0.6em + 0.4vw)",
                }}
                className="fa fa-bookmark"
                color={getSaveButtonColor()}
                onClick={() => handleSaveButtonClick(id)}
              ></Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
);

export default Article;
