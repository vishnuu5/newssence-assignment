const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const preferencesRoutes = require('./routes/preferences');
const { fetchNewArticles } = require('./services/newsService');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://newssence-assignment.vercel.app'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/newssense')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/preferences', preferencesRoutes);

app.get("/", (req, res)=> {
  res.send({
    activestatus:true,
    error:false
  })
})

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Schedule news fetching (in a production app, you would use a proper scheduler)
setInterval(() => {
  console.log('Fetching new articles...');
  fetchNewArticles().catch(err => console.error('Error fetching articles:', err));
}, 60 * 60 * 1000); // Every hour

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initial news fetch on server start
  console.log('Performing initial news fetch...');
  fetchNewArticles().catch(err => console.error('Error fetching articles:', err));
});
