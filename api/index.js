const express = require('express');
const cors = require('cors');
const weatherRoutes = require('../src/routes/weather');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);

// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: 'API route not found (Vercel)' });
});

module.exports = app;
