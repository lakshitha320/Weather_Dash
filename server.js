const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Import weather routes
const weatherRoutes = require("./routes/weather");
app.use("/api/weather", weatherRoutes);

// Handle API 404s - return JSON instead of HTML
app.use("/api/*", (req, res) => {
    res.status(404).json({ error: "API Route not found" });
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// For all other routes, serve index.html (SPA support)
app.get("*", (req, res) => {
    res.sendFile(require('path').join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;

// Export for Vercel/Hosting
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Weather App is live!`);
        console.log(`Local: http://localhost:${PORT}`);
    });
}

module.exports = app;