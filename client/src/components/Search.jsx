import React from "react";
import { Form, Input } from "reactstrap";

const Search = ({ onSubmit, onChange }) => {
  return (
    <div className="mt-3">
      <Form onSubmit={onSubmit}>
        <Input
          type="search"
          placeholder="Podaj temat wiadomości..."
          onChange={onChange}
          autofocus="true"
        />
      </Form>
    </div>
  );
};

export default Search;
