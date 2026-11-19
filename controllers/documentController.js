const Document = require("../models/Document");

// GET all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single document by ID
const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// CREATE new document
const createDocument = async (req, res) => {
  try {
    const newDoc = await Document.create(req.body);
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE document by ID
const updateDocument = async (req, res) => {
  try {
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE document by ID
const deleteDocument = async (req, res) => {
  try {
    const deletedDoc = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
};