const express = require('express');
const auth = require('../middleware/auth');
const Article = require('../models/Article');
const User = require('../models/User');
const router = express.Router();

// Get personalized news feed
router.get('/', auth, async (req, res) => {
  try {
    const user = req.user;
    const { topics = [], sources = [], keywords = [] } = user.preferences;
    
    let query = {};
     
    // Build query based on user preferences
    if (topics.length > 0 || sources.length > 0 || keywords.length > 0) {
      const conditions = [];
      
      if (topics.length > 0) {
        conditions.push({ topics: { $in: topics } });
      }
      
      if (sources.length > 0) {
        conditions.push({ source: { $in: sources } });
      }
      
      if (keywords.length > 0) {
        // Use text search for keywords
        const keywordSearch = keywords.join(' ');
        conditions.push({ $text: { $search: keywordSearch } });
      }
      
      if (conditions.length > 0) {
        query = { $or: conditions };
      }
    }
    
    // Get articles, sort by date (newest first)
    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .limit(30);
    
    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get article details
router.get('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save article
router.post('/:id/save', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    const user = req.user;
    
    // Check if article is already saved
    if (user.savedArticles.includes(article._id)) {
      return res.json({ message: 'Article already saved' });
    }
    
    // Add article to saved articles
    user.savedArticles.push(article._id);
    await user.save();
    
    res.json({ message: 'Article saved successfully' });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get saved articles
router.get('/saved/articles', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedArticles');
    
    res.json(user.savedArticles);
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
