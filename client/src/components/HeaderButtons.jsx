import React from "react";
import { Button } from "reactstrap";

const HeaderButtons = ({
  onClickSort,
  onClickShowSavedArticles,
  loading,
  alreadySearched,
  alertVisible,
  numberOfArticles,
  showingSaved,
}) => {
  const getSortButtonClass = () => {
    return !loading && alreadySearched && !alertVisible && !showingSaved
      ? "badge-pill mt-1"
      : "d-none";
  };

  const getSavedArticlesButtonClass = () => {
    return !loading && !alertVisible && localStorage.length > 0
      ? "badge-pill mt-1"
      : "d-none";
  };

  const getTextClass = () => {
    return !loading && alreadySearched && !alertVisible
      ? "text-center"
      : "d-none";
  };
  return (
    <div className="text-right">
      <div className={getTextClass()}>
        <span
          style={{
            fontSize: "calc(1em + 0.5vw)",
            color: "grey",
          }}
        >
          Znalezione: {numberOfArticles}
        </span>
      </div>
      <Button
        className={getSavedArticlesButtonClass()}
        color="primary"
        onClick={onClickShowSavedArticles}
        style={{
          fontSize: "calc(0.8em + 0.4vw)",
          float: "left",
        }}
      >
        Pokaż zapisane
      </Button>
      <Button
        className={getSortButtonClass()}
        color="primary"
        onClick={onClickSort}
        style={{
          fontSize: "calc(0.8em + 0.4vw)",
        }}
      >
        Sortuj wg daty
      </Button>
      <div style={{ clear: "both" }}></div>
    </div>
  );
};

export default HeaderButtons;
