const express = require('express');
const cors = require('cors');
const path = require('path');
const weatherRoutes = require('./src/routes/weather');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/weather', weatherRoutes);

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Handle all other routes by returning the 'index.html' file (frontend routing)
app.use((req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'src', 'index.html'));
    } else {
        res.status(404).json({ error: 'API route not found' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Weather App running at http://localhost:${PORT}`);
});
