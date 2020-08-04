import React from "react";
import AlertNoArticlesFound from "./AlertNoArticlesFound";
import Sort from "./Sort";
import { Spinner } from "reactstrap";

const NewsHeader = ({
  loading,
  alreadySearched,
  alertVisible,
  handleClickSort,
}) => {
  const getSpinnerClass = () => {
    return loading && alreadySearched ? "mt-5 d-inline-flex" : "d-none";
  };

  return (
    <div>
      <Spinner color="primary" className={getSpinnerClass()} />
      <Sort
        onClick={handleClickSort}
        loading={loading}
        alreadySearched={alreadySearched}
      />
      <AlertNoArticlesFound alertVisible={alertVisible} />
    </div>
  );
};

export default NewsHeader;
