const express = require("express");
const mongoose = require("mongoose");
const app = express();
const mysql = require("mysql2");

const pool = mysql.createConnection({
  host: "157.180.40.190",
  user: "root",
  password: "scORHWprCvp26Gz1zwPQgSsokHyPC2",
  database: "test",
});

pool.connect((error) => {
  error ? console.log("error") : console.log("ok");
});

app.get("/api/categories", (req, res) => {
  pool.query("SELECT * FROM categories", (error, result) => {
    error ? res.status(500).json({ error: error.message }) : res.json(result);
  });
});

mongoose
  .connect(
    "mongodb+srv://root:scORHWprCvp26Gz1zwPQgSsokHyPC2@mega-db.z1yp5vi.mongodb.net/?appName=mega-db",
  )
  .then(() => console.log("Connected!"))
  .catch(() => {
    console.log("error ");
  });

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
