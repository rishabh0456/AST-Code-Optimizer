// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from a frontend
app.use(express.json()); // Parse incoming JSON payloads

// Import Routes (we'll build these next)
const optiRoutes = require('./src/routes/optiRoutes');

// Mount Routes
app.use('/api/v1/opticode', optiRoutes);

// Basic Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'OptiCode Engine is live.' 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⚡ OptiCode Node.js Wrapper Initialized.`);
});