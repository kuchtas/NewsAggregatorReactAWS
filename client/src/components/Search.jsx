import React from "react";
import { Form, Input } from "reactstrap";

const Search = ({ onSubmit, onChange }) => {
  return (
    <div className="mt-3">
      <Form onSubmit={onSubmit}>
        <Input
          type="search"
          placeholder="Na jaki temat chcesz poszukać wiadomości?"
          onChange={onChange}
        />
      </Form>
    </div>
  );
};

export default Search;
