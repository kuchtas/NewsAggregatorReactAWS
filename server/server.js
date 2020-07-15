"use strict";
const express = require("express");
const axios = require("axios");
const getWPROST = require("./getWPROST");
const getDZIENNIK = require("./getDZIENNIK");
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

app.use(express.json());

app.post("/search", (req, res) => {
  if (!req.body.searchString) {
    return res.status(500).send({ error: "No string to search" });
  }
  console.log(req.body.searchString); //TODO - use the searchString for scraping data
  return res.status(200).send();
});
