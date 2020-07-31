import React, { useState, useEffect } from "react";
import Search from "./Search";
import News from "./News";
import ErrorEmpty from "./ErrorEmpty";
import Filter from "./Filter";
import Sort from "./Sort";
import { Container, Spinner } from "reactstrap";

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

    fetch(
      `https://07fj9bjzr9.execute-api.eu-central-1.amazonaws.com/default/acquireNews`,
      {
        method: "POST",
        withCredentials: true,
        headers: {
          "X-Api-Key": process.env.REACT_APP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchString: searchString // getting rid of polish characters - they result in errors on sites and are ignored when searching anyway
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\u0142/g, "l"),
        }),
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

  const handleSearchChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleFilterChange = (event) => {
    const newFilterState = { ...filterState };
    newFilterState[event.target.id] = !newFilterState[event.target.id];
    setFilterState(newFilterState);
  };

  const getSpinnerClass = () => {
    return loading ? "mt-5 d-inline-flex" : "d-none";
  };

  useEffect(() => {
    if (loading === false && articles.length === 0 && alreadySearched === true)
      setAlertVisible(true);
  }, [articles.length, loading, alreadySearched]);

  const changeArticlesOrder = () => {
    const articlesRev = [...articles].reverse();
    setArticles(articlesRev);
  };
  return (
    <Container className="text-center">
      <Search onSubmit={handleSubmit} onChange={handleSearchChange} />
      <Filter filterState={filterState} onChange={handleFilterChange} />
      <Sort onClick={changeArticlesOrder} />
      <Spinner color="primary" className={getSpinnerClass()} />
      <ErrorEmpty isVisible={alertVisible} />
      <News
        articles={articles}
        filterState={filterState}
        onClick={changeArticlesOrder}
      />
    </Container>
  );
};

export default Body;
