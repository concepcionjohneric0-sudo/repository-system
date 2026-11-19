const express = require('express');
const router = express.Router();
const Repository = require('../models/Repository');

// Kunin lahat ng documents
router.get('/', async (req, res) => {
  try {
    const records = await Repository.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    console.error('Error fetching repository records:', err);
    res.status(500).json({ message: 'Failed to load repository records.' });
  }
});

// I-save ang bagong document
router.post('/', async (req, res) => {
  try {
    const title = (req.body.title || '').trim();
    const author = (req.body.author || req.body.authors || req.body.researcher || '').trim();
    const category = (req.body.category || '').trim();
    const yearRaw = req.body.yearPublished ?? req.body.year ?? req.body.year_published;
    const description = (req.body.description || req.body.abstract || '').trim();
    const fileUrl = (req.body.fileUrl || req.body.documentUrl || req.body.url || '').trim();

    const yearPublished = Number(yearRaw);

    if (!title || !author || !category || !yearPublished || Number.isNaN(yearPublished) || !description || !fileUrl) {
      return res.status(400).json({ message: 'Please complete all required fields properly.' });
    }

    const newDoc = new Repository({
      title,
      author,
      category,
      yearPublished,
      description,
      fileUrl
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).json({ message: 'Server error while saving document.' });
  }
});

module.exports = router;