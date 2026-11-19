const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Capstone/Thesis', 'Research Paper', 'Module/Handout', 'Administrative Form']
  },
  yearPublished: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fileLink: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);