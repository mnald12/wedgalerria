const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mysql = require("mysql");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("uploads"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookstore",
});

// Get all books
app.get("/getall", (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send(result);
  });
});

// Insert a new book
app.post("/insert", (req, res) => {
  const { title, genre, description } = req.body;

  if (!req.files || !req.files.cover) {
    return res.status(400).send("No file uploaded.");
  }

  const cover = req.files.cover;
  const coverUrl = `/uploads/${cover.name}`;
  const uploadPath = path.join(__dirname, "uploads", cover.name);

  cover.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    const sql =
      "INSERT INTO books (title, genre, description, cover_url) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, genre, description, coverUrl], (err, result) => {
      if (err) return res.status(500).send(err);

      res.send({ success: true, message: "Book added successfully!" });
    });
  });
});

// Start server
app.listen(5002, () => {
  console.log("Server running on port 5002");
});
