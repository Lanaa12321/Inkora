import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    status: "Want to Read",
    rating: 5,
    review: ""
  });

  const getBooks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    getBooks();
  }, []);

  const addBook = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({
      title: "",
      author: "",
      status: "Want to Read",
      rating: 5,
      review: ""
    });

    getBooks();
  };

  return (
    <div className="app">
      <h1>Inkora</h1>
      <p className="subtitle">A cozy reading tracker for your personal library.</p>

      <form onSubmit={addBook} className="book-form">
        <input
          placeholder="Book title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Want to Read</option>
          <option>Currently Reading</option>
          <option>Finished</option>
        </select>

        <input
          type="number"
          min="1"
          max="5"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        />

        <textarea
          placeholder="Review"
          value={form.review}
          onChange={(e) => setForm({ ...form, review: e.target.value })}
        />

        <button type="submit">Add Book</button>
      </form>

      <div className="book-list">
        {books.map((book) => (
          <div className="book-card" key={book._id}>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Status:</strong> {book.status}</p>
            <p><strong>Rating:</strong> {book.rating}/5</p>
            <p>{book.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;