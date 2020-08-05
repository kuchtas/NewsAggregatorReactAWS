import React from "react";
import { Button } from "reactstrap";

const Sort = ({
  onClick,
  loading,
  alreadySearched,
  alertVisible,
  numberOfArticles,
}) => {
  const getSortClass = () => {
    return !loading && alreadySearched && !alertVisible
      ? "fa fa-sort"
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
        className={getSortClass()}
        color="primary"
        onClick={onClick}
      ></Button>
    </div>
  );
};

export default Sort;
