const express = require("express");
const router = express.Router();
const Book = require("./book");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      dateAdded: req.body.dateAdded || new Date(),
      status: req.body.status,
      rating: req.body.rating,
      review: req.body.review
    });

    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: "Error creating book" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
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

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;