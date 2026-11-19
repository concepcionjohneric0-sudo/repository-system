const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const repositoryRoutes = require('./routes/repositoryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Para ma-serve ang HTML/CSS/JS files mo kung nasa "public" folder
app.use(express.static('public'));

// Ito ang magkokonekta sa routes mo para sa pag-load at pag-save ng documents
app.use('/api/documents', repositoryRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });