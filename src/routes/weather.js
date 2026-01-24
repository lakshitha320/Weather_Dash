const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:city", async (req, res) => {
    const city = req.params.city;

    try {
        const response = await axios.get("https://api.weatherapi.com/v1/forecast.json", {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: city,
                days: 5,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

module.exports = router;
