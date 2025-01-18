const { Client } = require("pg");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
  user: "postgres",
  host: "127.0.0.1",
  database: "postgres",
  password: "password",
  port: "5432",
});

client
  .connect()
  .then(() => {
    console.log("Connected to PostGres Db!");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.get("/data/:productName", (req, res) => {
  const { productName } = req.params;
  client
    .query("SELECT * FROM products WHERE product_name = $1", [productName])
    .then((result) => {
      res.json(result.rows);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/insert", (req, res) => {
  console.log(req.body);
  const { product_name, quantity_available, cost } = req.body || {};

  if (!product_name || !quantity_available || !cost) {
    return res.status(400).json({ error: "Name and available is required" });
  }

  const query =
    "INSERT INTO products(product_name, quantity_available, cost) VALUES($1, $2, $3) RETURNING *";
  const values = [product_name, quantity_available, cost];

  client
    .query(query, values)
    .then((result) => {
      res.status(201).json({ message: "Data Returned", data: result[0] });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("SIGINT", () => {
  client
    .end()
    .then(() => {
      console.log("PostgreSQL connection closed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing PostgreSQL connection", err.stack);
      process.exit(1);
    });
});
