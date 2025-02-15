const { Client } = require("pg");
const express = require("express");
const multer = require('multer');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('front_end'));

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

app.post("/update", (req, res) => {
  const { product_name, quantity_available, cost } = req.body;

  // Validation: Ensure at least one field to update
  if (!product_name && !quantity_available && !cost) {
    return res.status(400).json({ error: "Need at least one column to update." });
  }

  // Validation: Ensure product_name is provided
  if (!product_name) {
    return res.status(400).json({ error: "Need to know what product to update." });
  }

  // Prepare query with placeholders for values to prevent SQL Injection
  const query = `
    UPDATE products
    SET quantity_available = $1, cost = $2
    WHERE product_name = $3
    RETURNING *;
  `;

  // Run the query with the parameterized values
  client
    .query(query, [quantity_available, cost, product_name])
    .then((result) => {
      // Respond with the updated data
      if (result.rows.length > 0) {
        res.status(200).json({ message: "Data updated successfully", data: result.rows[0] });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch((err) => {
      // Handle specific database errors
      if (err.code === '23505') {
        res.status(400).json({
          success: false,
          message: 'Product already exists!',
          error: err.detail || err.message,
        });
      } else {
        // Handle general errors
        res.status(500).json({
          success: false,
          message: 'Internal server error.',
          error: err.message,
        });
      }
    });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      // Specify the directory where the file should be uploaded
      cb(null, '../imgs');
  },
  filename: (req, file, cb) => {
      // Set the filename of the uploaded file (using the original name)
      cb(null, file.originalname);
  }
});

// Initialize the upload variable with the storage configuration
const upload = multer({ storage: storage });

// Create an upload route that only allows one file upload (you can change the limit if necessary)
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  res.send({
      message: 'File uploaded successfully!',
      file: req.file
  });
  console.log({
    message: 'File uploaded successfully!',
    file: req.file
  });
});


app.post("/insert", (req, res) => {
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

      if (err.code === '23505') {
        res.status(400).json({
          success: false,
          message: 'Product alread exist!',
          error: err.detail || err.mesage,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error.',
          error: error.message,
        });
      }
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
