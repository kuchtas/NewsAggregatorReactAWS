import React, { useState } from "react";

const Search = () => {
  const [searchString, setSearchString] = useState("");

  const sendSearchString = async () => {
    fetch(
      `https://07fj9bjzr9.execute-api.eu-central-1.amazonaws.com/default/acquireNews`,
      {
        method: "POST",
        withCredentials: true,
        headers: {
          "X-Api-Key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchString: searchString }),
      }
    )
      .then((resp) => resp.json())
      .then(function (data) {
        console.log(data);
      })
      .catch(function (error) {
        console.log(error);
      });
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
