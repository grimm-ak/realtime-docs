// routes/documents.js

const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// Create a new document
router.post('/', async (req, res) => {
  try {
    const doc = new Document({
      title: req.body.title || 'Untitled Document',
      content: req.body.content || { ops: [] }
    });

    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating document' });
  }
});

// Get a document by ID
router.get('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) return res.status(404).json({ message: 'Document not found' });

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching document' });
  }
});

// Update a document (save content)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        lastUpdated: Date.now()
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Document not found' });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating document' });
  }
});

module.exports = router;
