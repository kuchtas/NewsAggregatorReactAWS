import React from "react";

const Search = ({ onSubmit, onChange }) => {
  return (
    <div className="justify-content-center mt-3">
      <form onSubmit={onSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Na jaki temat chcesz poszukać wiadomości?"
          onChange={onChange}
        />
      </form>
    </div>
  );
};

export default Search;
