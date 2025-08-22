// backend/src/app.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/users', userRoutes);

// === TAMBAHKAN KODE INI ===
// Rute dasar untuk pengetesan
app.get('/', (req, res) => {
  res.status(200).send('Selamat datang di API backend saya! Server berjalan dengan baik.');
});
// ==========================

module.exports = app;