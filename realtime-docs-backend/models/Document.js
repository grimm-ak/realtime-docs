// models/Document.js

const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  _id: String,                         
  title: { type: String, default: "Untitled Document" },
  content: { type: Object, default: { ops: [] } },
  lastUpdated: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Document', DocumentSchema);
