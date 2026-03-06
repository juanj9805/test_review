// Imports
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

// Data base connections
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected! mongo"))
  .catch(() => {
    console.log("error with mongo");
  });

const pool = mysql.createConnection(process.env.MYSQL_URL);
pool.connect((error) => {
  error ? console.log("error mysql") : console.log("ok mysql");
});

// App running
const app = express();
app.use(express.json());
const upload = multer({ dest: "uploads/" });

// APIS
const apiGet = function (endpoint) {
  app.get(`/api/${endpoint}`, (req, res) => {
    pool.query(`SELECT * FROM ${endpoint}`, (error, result) => {
      error ? res.status(500).json({ error: error.message }) : res.json(result);
    });
  });
};

const apiPost = function (endpoint, columns) {
  app.post(
    `/api/upload/${endpoint}`,
    upload.single("file"),
    function (req, res) {
      const rows = [];
      fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
          try {
            if (rows.length) {
              console.log(rows);
              const values = rows
                .map(
                  (row) => `(${columns.map((c) => `'${row[c]}'`).join(",")})`,
                )
                .join(",");

              pool.query(
                `INSERT INTO ${endpoint} (${columns.join(",")}) VALUES ${values}`,
              );
            }
            res.json({ ok: true, total: rows.length });
          } catch (error) {
            res
              .status(500)
              .json({ error: "internal server error with post method" });
          }
        });
    },
  );
};

app.delete(`/api/delete/:endpoint/:id`, (req, res) => {
  const { endpoint, id } = req.params;
  pool.query(`DELETE FROM ${endpoint} WHERE id = ${id}`);
  res.json({ status: "deleted", entity: endpoint, id: id });
});

app.patch(`/api/patch/:endpoint/:id`, (req, res) => {
  const { endpoint, id } = req.params;
  const { column, value } = req.body;

  pool.query(
    `UPDATE ${endpoint} SET ${column} = '${value}' WHERE id_category = ${id}`,
    (error) => {
      error
        ? res.status(500).json({ error: error.message })
        : res.json({ status: "updated", id });
    },
  );
});

apiPost("categories", ["id_category", "product_category"]);
apiPost("suppliers", ["supplier_id", "supplier_name", "supplier_email"]);

apiGet("categories");
apiGet("suppliers");

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
  