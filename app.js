require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Repository = require('./models/Repository');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

// READ (UI): Ipakita ang form at lahat ng saved repositories
app.get('/', async (req, res) => {
  try {
    const repos = await Repository.find().sort({ createdAt: -1 });
    res.render('index', { repos });
  } catch (err) {
    res.status(500).send('Error loading page: ' + err.message);
  }
});

// CREATE (UI): Magdagdag ng bagong repository item mula sa form
app.post('/repositories', async (req, res) => {
  try {
    const { title, author, category, yearPublished, description, fileUrl } = req.body;
    const newRepo = new Repository({
      title,
      author: author || 'Johneric',
      category: category || 'Capstone',
      yearPublished: Number(yearPublished) || 2026,
      description,
      fileUrl,
    });
    await newRepo.save();
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error saving repository: ' + err.message);
  }
});

// EDIT FORM (UI)
app.get('/repositories/:id/edit', async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) {
      return res.status(404).send('Repository not found');
    }
    res.render('edit', { repo });
  } catch (err) {
    res.status(400).send('Error loading edit page: ' + err.message);
  }
});

// UPDATE (UI)
app.post('/repositories/:id/edit', async (req, res) => {
  try {
    const { title, author, category, yearPublished, description, fileUrl } = req.body;
    const updatedRepo = await Repository.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author: author || 'Johneric',
        category: category || 'Capstone',
        yearPublished: Number(yearPublished) || 2026,
        description,
        fileUrl,
      },
      { new: true, runValidators: true }
    );
    if (!updatedRepo) {
      return res.status(404).send('Repository not found');
    }
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error updating repository: ' + err.message);
  }
});

// DELETE (UI): Burahin ang repository item ayon sa ID
app.post('/repositories/:id/delete', async (req, res) => {
  try {
    await Repository.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error deleting repository: ' + err.message);
  }
});

// READ (JSON): Kunin lahat ng repositories sa JSON format
app.get('/repositories', async (req, res) => {
  try {
    const repos = await Repository.find().sort({ createdAt: -1 });
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
