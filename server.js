require("dotenv").config();

const authRoutes = require("./authcontroller");
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const bookRoutes = require("./bookcontroller");
const { notFound, errorHandler } = require("./errorhandler");
const Book = require("./book");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Inkora API",
    endpoints: {
      books: "/api/books"
    }
  });
});

app.post("/api/books", async (req, res) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      dateAdded: req.body.dateAdded || new Date(),
      status: req.body.status,
      rating: req.body.rating,
      review: req.body.review
    });

    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (err) {
    res.status(500).json({ message: "Error saving book" });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.review || book.rating) {
      book.reviewHistory.push({
        rating: book.rating,
        review: book.review,
        status: book.status,
        updatedAt: new Date()
      });
    }

    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.dateAdded = req.body.dateAdded || book.dateAdded;
    book.status = req.body.status;
    book.rating = req.body.rating;
    book.review = req.body.review;

    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book review" });
  }
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Inkora API running on http://localhost:${PORT}`);
});