const axios = require('axios');
const Article = require('../models/Article');
const { analyzeSentiment } = require('./sentimentService');

// Function to fetch news from external API
const fetchNewArticles = async () => {
  try {
    // In a real application, you would use a proper news API like NewsAPI.org, GNews, etc.
    // For this example, we'll simulate fetching from an API
    
    // Simulate API response
    const mockArticles = generateMockArticles();
    
    // Process and save articles
    for (const articleData of mockArticles) {
      // Check if article already exists (by URL)
      const existingArticle = await Article.findOne({ url: articleData.url });
      if (existingArticle) {
        continue; // Skip if article already exists
      }
      
      // Analyze sentiment
      const sentiment = await analyzeSentiment(articleData.title + ' ' + articleData.summary);
      
      // Create new article with sentiment
      const newArticle = new Article({
        ...articleData,
        sentiment
      });
      
      await newArticle.save();
      console.log(`Saved new article: ${newArticle.title}`);
    }
    
    console.log('News fetch completed');
    return true;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Helper function to generate mock articles (in a real app, this would be an API call)
const generateMockArticles = () => {
  const sources = ['CNN', 'BBC', 'Reuters', 'AP News', 'The New York Times'];
  const topics = ['Technology', 'Politics', 'Business', 'Health', 'Science', 'Sports', 'Entertainment'];
  
  const articles = [];
  
  // Generate 10 random articles
  for (let i = 0; i < 10; i++) {
    const source = sources[Math.floor(Math.random() * sources.length)];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const id = Math.random().toString(36).substring(2, 15);
    
    articles.push({
      title: `${topic} News: Important Development in ${topic} Sector`,
      summary: `This is a summary of the important development in the ${topic.toLowerCase()} sector. The impact will be significant.`,
      content: `This is a detailed content of the important development in the ${topic.toLowerCase()} sector. The impact will be significant.\n\nExperts say this is a game-changer for the industry. Many companies are responding positively to this development.\n\nAnalysts predict this will lead to substantial growth in the coming months.`,
      source,
      url: `https://example.com/news/${id}`,
      publishedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Random date within last week
      topics: [topic],
      keywords: [topic.toLowerCase(), 'news', 'development']
    });
  }
  
  return articles;
};

module.exports = {
  fetchNewArticles
};
