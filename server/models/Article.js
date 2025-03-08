const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  topics: [String],
  keywords: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search
articleSchema.index({ 
  title: 'text', 
  summary: 'text', 
  content: 'text'
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
