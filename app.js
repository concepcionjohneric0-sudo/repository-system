require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Repository = require('./models/Repository');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS bilang view engine
app.set('view engine', 'ejs');

// Middleware para mabasa ang JSON at form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksyon sa MongoDB Atlas (palitan ang ANG_TOTOONG_PASSWORD_MO kung hindi pa naka-set sa .env)
const mongoURI =
  process.env.MONGODB_URI ||
  'mongodb+srv://concepcionjohneric_db_user:concepcion12@cluster.fnxgwdi.mongodb.net/repository_db?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.error('Connection error:', err);
  });

// --- WEB UI & CRUD ROUTES ---

// READ (UI): Ipakita ang form at lahat ng saved repositories
app.get('/', async (req, res) => {
  try {
    const repos = await Repository.find().sort({ createdAt: -1 });
    res.render('index', { repos });
  } catch (err) {
    res.status(500).send('Error loading page: ' + err.message);
  }
});

// CREATE: Magdagdag ng bagong repository item mula sa form
app.post('/repositories', async (req, res) => {
  try {
    const { title, description, fileUrl } = req.body;
    const newRepo = new Repository({ title, description, fileUrl });
    await newRepo.save();
    res.redirect('/');
  } catch (err) {
    res.status(400).send('Error saving repository: ' + err.message);
  }
});

// DELETE: Burahin ang repository item ayon sa ID
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
    const repos = await Repository.find();
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});