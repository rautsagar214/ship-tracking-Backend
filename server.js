const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const shipmentRoutes = require('./routes/shipmentRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    // Add your frontend deployment URL here when you deploy it
    'https://your-frontend-url.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('\nMongoDB Connection Error:', error);
    return false;
  }
};

// Routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ShipTrack API is running',
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to MongoDB. Server will not start.');
      process.exit(1);
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`\nServer is running on http://localhost:${PORT}`);
      console.log('Environment:', process.env.NODE_ENV);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Closing server and database connections...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

startServer(); 