const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Import weather routes
const weatherRoutes = require("./routes/weather");
app.use("/api/weather", weatherRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Weather App running at http://localhost:${PORT}`);
});