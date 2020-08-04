import React from "react";
import { Alert } from "reactstrap";

const AlertNoArticlesFound = ({ alertVisible }) => {
  return (
    <Alert color="danger" className="mt-3" isOpen={alertVisible}>
      Brak wyników
    </Alert>
  );
};

export default AlertNoArticlesFound;
