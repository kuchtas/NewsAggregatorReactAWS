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
    return loading ? "mt-5 d-inline-flex" : "d-none";
  };

  return (
    <div>
      {loading ? ( //display nothing if before first search and not loading, spinner when loading, sorting when not loading but past first search
        <Spinner color="primary" className={getSpinnerClass()} />
      ) : alreadySearched ? (
        <Sort onClick={handleClickSort} />
      ) : null}
      <AlertNoArticlesFound isVisible={alertVisible} />
    </div>
  );
};

export default NewsHeader;
