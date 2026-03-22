require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

const optiRoutes = require('./src/routes/optiRoutes');

app.use('/api/v1/opticode', optiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'OptiCode Engine is live.' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`⚡ OptiCode Node.js Wrapper Initialized.`);
});