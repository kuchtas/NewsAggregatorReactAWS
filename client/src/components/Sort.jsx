import React from "react";
import { Button } from "reactstrap";

const Sort = ({ onClick }) => {
  return (
    <div className="text-right">
      <Button className="fa fa-sort" color="primary" onClick={onClick}></Button>
    </div>
  );
};

export default Sort;
