import React, { useState } from "react";
import Search from "./Search";
import News from "./News";
import { Container, Spinner } from "reactstrap";

const Body = () => {
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [articles, setArticles] = useState([]);

  const sendSearchString = async () => {
    setLoading(true);
    setArticles([]);

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
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => {
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
  const getSpinnerClass = () => {
    return loading ? "mt-5 d-inline-flex" : "d-none";
  };

  return (
    <Container className="text-center">
      <Search onSubmit={handleSubmit} onChange={handleChange} />
      <Spinner color="primary" className={getSpinnerClass()} />
      <News articles={articles} />
    </Container>
  );
};

export default Body;
