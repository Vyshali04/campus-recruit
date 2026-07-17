const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Status check endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({ success: true, message: 'Campus Recruitment Server is running' });
});

// Error handling for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
