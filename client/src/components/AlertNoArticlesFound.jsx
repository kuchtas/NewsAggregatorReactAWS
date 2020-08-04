import React from "react";
import { Alert } from "reactstrap";

const AlertNoArticlesFound = ({ isVisible }) => {
  return (
    <Alert color="danger" className="mt-3" isOpen={isVisible}>
      Brak wyników
    </Alert>
  );
};

export default AlertNoArticlesFound;
