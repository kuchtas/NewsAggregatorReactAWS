import React from "react";
import AlertNoArticlesFound from "./AlertNoArticlesFound";
import HeaderButtons from "./HeaderButtons";
import { Spinner } from "reactstrap";

const NewsHeader = ({
  loading,
  alreadySearched,
  alertVisible,
  onClickSort,
  numberOfArticles,
  onClickShowSavedArticles,
  showingSaved,
}) => {
  const getSpinnerClass = () => {
    return loading && alreadySearched ? "mt-5 d-inline-flex" : "d-none";
  };

  return (
    <div>
      <Spinner color="primary" className={getSpinnerClass()} />
      <HeaderButtons
        onClickSort={onClickSort}
        onClickShowSavedArticles={onClickShowSavedArticles}
        loading={loading}
        alreadySearched={alreadySearched}
        alertVisible={alertVisible}
        numberOfArticles={numberOfArticles}
        showingSaved={showingSaved}
      />
      <AlertNoArticlesFound alertVisible={alertVisible} />
    </div>
  );
};

export default NewsHeader;
