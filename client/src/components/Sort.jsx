import React from "react";
import { Button } from "reactstrap";

const Sort = ({ onClick, loading, alreadySearched }) => {
  const getSortClass = () => {
    return !loading &&
      {
        /*alreadySearched*/
      }
      ? "fa fa-sort"
      : "d-none";
  };
  return (
    <div className="text-right">
      <Button
        className={getSortClass()}
        color="primary"
        onClick={onClick}
      ></Button>
    </div>
  );
};

export default Sort;
