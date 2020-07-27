import React from "react";
import { Button } from "reactstrap";

const Sort = ({ onClick }) => {
  return (
    <div>
      <Button onClick={onClick} className="mt-1" color="primary">
        Pokaż najstarsze/najnowsze
      </Button>
    </div>
  );
};

export default Sort;
