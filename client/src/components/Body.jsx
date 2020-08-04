import React, { useState, useEffect } from "react";
import Search from "./Search";
import News from "./News";
import Filter from "./Filter";
import { Container } from "reactstrap";
import NewsHeader from "./NewsHeader";
import axios from "axios";

const Body = () => {
  const [filterState, setFilterState] = useState({
    WPROST: true,
    DZIENNIK: true,
    OKO: true,
    NIEZALEZNA: true,
  });
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [articles, setArticles] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alreadySearched, setAlreadySearched] = useState(false);

  const sendSearchString = async () => {
    setAlertVisible(false);
    setLoading(true);
    setArticles([]);
    setAlreadySearched(true);

    axios({
      method: "post",
      url:
        "https://07fj9bjzr9.execute-api.eu-central-1.amazonaws.com/default/acquireNews",
      data: {
        searchString: searchString,
      },
      headers: {
        "X-Api-Key": process.env.REACT_APP_API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setArticles(response.data);
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
    } else {
      setAlertVisible(true);
      setArticles([]);
    }
  };

  const makeSearchStringValid = (validSearchString) => {
    return validSearchString
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u0142/g, "l")
      .replace(/[^a-z0-9 ]+/gi, ""); // no diacritics and special symbols - leaving only letters, numbers and spaces
  };

  const handleSearchChange = (event) => {
    const searchString = makeSearchStringValid(event.target.value); // no diacritics and special symbols - leaving only letters, numbers and spaces
    setSearchString(searchString);
  };

  const handleFilterChange = (event) => {
    const newFilterState = { ...filterState };
    newFilterState[event.target.id] = !newFilterState[event.target.id];
    setFilterState(newFilterState);
  };

  useEffect(() => {
    if (
      loading === false &&
      articles.length === 0 &&
      alreadySearched === true
    ) {
      setAlertVisible(true);
      setAlreadySearched(false);
    }
  }, [articles.length, loading, alreadySearched]);

  const changeArticlesOrder = () => {
    const articlesRev = [...articles].reverse();
    setArticles(articlesRev);
  };

  return (
    <Container className="text-center">
      <Search onSubmit={handleSubmit} onChange={handleSearchChange} />
      <Filter filterState={filterState} onChange={handleFilterChange} />
      <NewsHeader
        loading={loading}
        alreadySearched={alreadySearched}
        alertVisible={alertVisible}
        handleClickSort={changeArticlesOrder}
      />
      <News
        articles={articles}
        filterState={filterState}
        onClick={changeArticlesOrder}
      />
    </Container>
  );
};

export default Body;
