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

  const [searchString, setSearchString] = useState("");
  const [articles, setArticles] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadySearched, setAlreadySearched] = useState(false);
  const [showingSaved, setShowingSaved] = useState(false);

  const handleFilterChange = (event) => {
    const newFilterState = { ...filterState };
    newFilterState[event.target.id] = !newFilterState[event.target.id];
    setFilterState(newFilterState);
  };

  useEffect(() => {
    if (loading === false && articles.length === 0 && alreadySearched === true)
      setAlertVisible(true);
    else setAlertVisible(false);
  }, [articles.length, loading, alreadySearched]);

  const changeArticlesOrder = () => {
    setArticles((prevArticles) => [...prevArticles].reverse());
  };

  useEffect(() => {
    let source = axios.CancelToken.source();

    const makeSearchStringValid = (searchString) => {
      return searchString
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\u0142/g, "l")
        .replace(/[^a-z0-9 ]+/gi, ""); // no diacritics and special symbols - leaving only letters, numbers and spaces
    };

    const compareWithSavedArticles = (data) => {
      // TODO refactor when possible
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < localStorage.length; j++) {
          if (data[i].link === localStorage.key(j)) data[i].saved = true;
        }
      }
      return data;
    };

    const sendSearchString = async (validSearchString) => {
      setShowingSaved(false);
      setAlertVisible(false);
      setLoading(true);
      setArticles([]);
      setAlreadySearched(true);
      axios
        .post(
          "https://07fj9bjzr9.execute-api.eu-central-1.amazonaws.com/default/acquireNews",
          {
            searchString: validSearchString,
          },
          {
            cancelToken: source.token,
            headers: {
              "X-Api-Key": process.env.REACT_APP_API_KEY,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          const data = compareWithSavedArticles(response.data);
          setArticles(data);
          setLoading(false);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            setArticles([]);
            return;
          }
          console.log(error);
        });
    };

    let timeoutID;
    if (searchString.length !== 0) {
      timeoutID = setTimeout(
        sendSearchString,
        400,
        makeSearchStringValid(searchString)
      );
    }

    return () => {
      source.cancel();
      clearTimeout(timeoutID);
      setArticles([]);
      setLoading(false);
      setAlreadySearched(false);
    };
  }, [searchString]);

  const handleSaveButtonClick = (id) => {
    const newArticles = [...articles];
    const article = newArticles.find((element) => element.id === id);
    if (article.saved) {
      article.saved = false;
      localStorage.removeItem(article.link);
    } else {
      article.saved = true;
      localStorage.setItem(article.link, JSON.stringify(article));
    }
    setArticles(newArticles);
  };

  useEffect(() => {
    const loadSavedArticlesFromLocalStorage = () => {
      const newSavedArticles = [];
      for (let i = 0; i < localStorage.length; i++) {
        newSavedArticles.push(
          JSON.parse(localStorage.getItem(localStorage.key(i)))
        );
      }
      return newSavedArticles;
    };

    if (showingSaved === true) {
      setLoading(false);
      setAlreadySearched(false);
      setArticles(loadSavedArticlesFromLocalStorage());
    }
  }, [showingSaved, localStorage.length]);

  return (
    <Container className="text-center">
      <Search
        onChange={(event) => setSearchString(event.target.value)}
        onSubmit={(event) => {
          event.preventDefault();
          setSearchString((prevSearchString) => prevSearchString + " ");
        }}
      />
      <Filter filterState={filterState} onChange={handleFilterChange} />
      <NewsHeader
        loading={loading}
        alreadySearched={alreadySearched}
        alertVisible={alertVisible}
        onClickSort={changeArticlesOrder}
        onClickShowSavedArticles={() =>
          setShowingSaved((prevShowingSaved) => !prevShowingSaved)
        }
        numberOfArticles={articles.length}
        showingSaved={showingSaved}
      />
      <News
        articles={articles}
        filterState={filterState}
        handleSaveButtonClick={handleSaveButtonClick}
      />
    </Container>
  );
};

export default Body;
