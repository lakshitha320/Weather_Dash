const app = require('./api/index');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Host static files locally
app.use(express.static(__dirname));

// Send index.html for all non-API routes
app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Weather App running at http://localhost:${PORT}`);
});
