const app = require('../api/index');
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Host static files from the current folder (src)
app.use(express.static(__dirname));

// Send index.html for all non-API routes
app.get('*', (req, res) => {
    if (!req.url.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Weather App running locally at http://localhost:${PORT}`);
    });
}

module.exports = app;
