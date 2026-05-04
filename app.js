import React, { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://inkora.onrender.com";

const BOOKS_API = `${BASE_URL}/api/books`;
const AUTH_API = `${BASE_URL}/api/auth`;

function App() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    dateAdded: "",
    status: "Want to Read",
    rating: "",
    review: ""
  });

  const getBooks = async () => {
    try {
      const res = await fetch(BOOKS_API);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch {
      setBooks([]);
    }
  };

  useEffect(() => {
    if (user) getBooks();
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    const endpoint = authMode === "login" ? "login" : "signup";

    try {
      const res = await fetch(`${AUTH_API}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        return;
      }

      if (authMode === "signup") {
        setMessage("Account created! Now log in.");
        setAuthMode("login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setUser(data.username);
      setPage("home");
    } catch {
      setMessage("Could not connect to server");
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser("");
    setBooks([]);
    setPage("home");
  };

  const resetForm = () => {
    setForm({
      title: "",
      author: "",
      genre: "",
      dateAdded: "",
      status: "Want to Read",
      rating: "",
      review: ""
    });
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      dateAdded: book.dateAdded ? book.dateAdded.split("T")[0] : "",
      status: book.status,
      rating: book.status === "Want to Read" ? "" : book.rating || "",
      review: book.review || ""
    });
    setPage("add");
  };

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book review?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BOOKS_API}/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete book review");
      }

      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Error deleting book review:", err);
      alert("Could not delete book review");
    }
  };

  const saveBook = async (e) => {
    e.preventDefault();

    const bookToSave = {
      ...form,
      rating: form.status === "Want to Read" ? null : Number(form.rating)
    };

    if (editingBook) {
      await fetch(`${BOOKS_API}/${editingBook._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookToSave)
      });
    } else {
      await fetch(BOOKS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookToSave)
      });
    }

    resetForm();
    setEditingBook(null);
    setPage("books");
    getBooks();
  };

  const cancelEdit = () => {
    setEditingBook(null);
    resetForm();
    setPage("books");
  };

  const total = books.length;
  const wantToRead = books.filter((b) => b.status === "Want to Read").length;
  const finished = books.filter((b) => b.status === "Finished").length;
  const reading = books.filter((b) => b.status === "Currently Reading").length;

  if (!user) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Inkora</h1>
          <p>Your cozy reading tracker</p>

          <form onSubmit={handleAuth} className="form">
            <input
              placeholder="Username"
              value={authForm.username}
              onChange={(e) =>
                setAuthForm({ ...authForm, username: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              required
            />

            <button type="submit">
              {authMode === "login" ? "Log In" : "Sign Up"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <button
            className="switch-btn"
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
          >
            {authMode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="navbar">
        <h2 className="logo">Inkora</h2>

        <div>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("books")}>My Books</button>
          <button
            onClick={() => {
              setEditingBook(null);
              resetForm();
              setPage("add");
            }}
          >
            + Add Book
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container">
        {page === "home" && (
          <>
            <h1>Welcome, {user}</h1>
            <p className="subtitle">Track your reading life</p>

            <div className="stats">
              <div className="card">
                <h2>{total}</h2>
                <p>Total Books</p>
              </div>

              <div className="card">
                <h2>{wantToRead}</h2>
                <p>Want to Read</p>
              </div>

              <div className="card">
                <h2>{reading}</h2>
                <p>Currently Reading</p>
              </div>

              <div className="card">
                <h2>{finished}</h2>
                <p>Finished</p>
              </div>
            </div>
          </>
        )}

        {page === "books" && (
          <>
            <h1>My Bookshelf</h1>

            {books.length === 0 ? (
              <p>No books yet</p>
            ) : (
              <div className="book-grid">
                {books.map((book) => (
                  <div className="book-card" key={book._id}>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>Genre: {book.genre || "N/A"}</p>
                    <p>
                      Date Added:{" "}
                      {book.dateAdded
                        ? new Date(book.dateAdded).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>{book.status}</p>
                    <p>
                      Rating:{" "}
                      {book.status === "Want to Read"
                        ? "-"
                        : `${book.rating}/5 ⭐`}
                    </p>
                    <p>{book.review}</p>

                    {book.reviewHistory && book.reviewHistory.length > 0 && (
                      <div className="review-history">
                        <h4>Previous Reviews</h4>

                        {book.reviewHistory.map((old, i) => (
                          <div key={i} className="old-review">
                            <p>{old.rating}/5 ⭐</p>
                            <p>{old.status}</p>
                            <p>{old.review}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <button onClick={() => handleEdit(book)}>Edit</button>

                    <button onClick={() => deleteBook(book._id)}>
                      Delete Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {page === "add" && (
          <>
            <h1>{editingBook ? "Edit Book" : "Add a Book"}</h1>

            <form onSubmit={saveBook} className="form">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <input
                placeholder="Author"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                required
              />

              <input
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
              />

              <input
                type="date"
                value={form.dateAdded}
                onChange={(e) =>
                  setForm({ ...form, dateAdded: e.target.value })
                }
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                    rating: e.target.value === "Want to Read" ? "" : form.rating
                  })
                }
              >
                <option>Want to Read</option>
                <option>Currently Reading</option>
                <option>Finished</option>
              </select>

              {form.status !== "Want to Read" && (
                <input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating 1-5"
                  value={form.rating}
                  onChange={(e) =>
                    setForm({ ...form, rating: e.target.value })
                  }
                  required
                />
              )}

              <textarea
                placeholder="Review"
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
              />

              <button type="submit">
                {editingBook ? "Update Book" : "Add Book"}
              </button>

              {editingBook && (
                <button type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;