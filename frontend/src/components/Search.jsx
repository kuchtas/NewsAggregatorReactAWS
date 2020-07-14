import React from "react";

const Search = () => {
  return (
    <div className="justify-content-center mt-3">
      <form>
        <input
          className="form-control"
          type="text"
          placeholder="Na jaki temat chcesz poszukać wiadomości?"
        />
      </form>
    </div>
  );
};

export default Search;
