"use strict";
const express = require("express");
const { getWPROST } = require("./getWPROST");
const { getDZIENNIK } = require("./getDZIENNIK");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

app.use(express.json());
