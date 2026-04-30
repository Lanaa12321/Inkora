require('dotenv').config();

const authRoutes = require("./authcontroller");
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const bookRoutes = require('./bookcontroller');
const { notFound, errorHandler } = require('./errorhandler');


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Inkora API',
    endpoints: {
      books: '/api/books'
    }
  });
});

app.use('/api/books', bookRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 5001;


app.listen(PORT, () => {
  console.log(`Inkora API running on http://localhost:${PORT}`);
});