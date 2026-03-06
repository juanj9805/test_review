require("dotenv").config();
// api
const express = require("express");
// databases
const mongoose = require("mongoose");
const mysql = require("mysql2");
// services
const fs = require("fs");
const multer = require("multer");
const { parse } = require("csv-parse");

const app = express();

const pool = mysql.createConnection(process.env.MYSQL_URL);

pool.connect((error) => {
  error ? console.log("error mysql") : console.log("ok mysql");
});

app.get("/api/categories", (req, res) => {
  pool.query("SELECT * FROM categories", (error, result) => {
    error ? res.status(500).json({ error: error.message }) : res.json(result);
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected! mongo"))
  .catch(() => {
    console.log("error with mongo");
  });

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
