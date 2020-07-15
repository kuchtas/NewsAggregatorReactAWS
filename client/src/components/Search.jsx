import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [searchString, setSearchString] = useState("");

  const sendSearchString = async () => {
    axios
      .post("/search", {
        searchString: searchString,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchString.length !== 0) {
      sendSearchString();
    }
  };

  const handleChange = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <div className="justify-content-center mt-3">
      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Na jaki temat chcesz poszukać wiadomości?"
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default Search;
