const express = require("express");
const axios = require("axios");
const router = express.Router();

// 1. Search City (Geocoding)
router.get("/search", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City name is required" });

    try {
        const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`);
        res.json(response.data);
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        res.status(500).json({ error: "Failed to fetch city data" });
    }
});

// 2. Get Weather + Air Quality
router.get("/forecast", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Latitude and Longitude are required" });

    try {
        // Fetch Weather
        const weatherPromise = axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`
        );

        // Fetch Air Quality
        const aqiPromise = axios.get(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5&timezone=auto`
        );

        const [weatherRes, aqiRes] = await Promise.all([weatherPromise, aqiPromise]);

        // Combine Data
        res.json({
            weather: weatherRes.data,
            air_quality: aqiRes.data
        });

    } catch (error) {
        console.error("Weather Error:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

module.exports = router;
