import React, { useState } from "react";
import Search from "./Search";
import News from "./News";

const Body = () => {
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
    <div className="container">
      <Search onSubmit={handleSubmit} onChange={handleChange} />
      <News />
    </div>
  );
};

export default Body;
