<<<<<<< HEAD
// ===== Get DOM elements =====
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const unitToggle = document.getElementById("unit-toggle");
const cityButtons = document.querySelectorAll(".city-btn");

const welcomeState = document.getElementById("welcome-state");
const loadingState = document.getElementById("loading-state");
const weatherContent = document.getElementById("weather-content");
const errorState = document.getElementById("error-state");
const retryBtn = document.getElementById("retry-btn");

// Weather display elements
const locationName = document.getElementById("location-name");
const locationRegion = document.getElementById("location-region");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");

// Forecast elements
const hourlyForecast = document.getElementById("hourly-forecast");
const dailyForecast = document.getElementById("daily-forecast");

// ===== Global state =====
let currentWeatherData = null;
let isCelsius = true;

// ===== Temperature conversion =====
function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9/5) + 32);
}

function convertTemp(temp) {
  return isCelsius ? temp : celsiusToFahrenheit(temp);
}

function getTempUnit() {
  return isCelsius ? "°C" : "°F";
}

// ===== Event listeners =====
searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") {
    loadWeather(city);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = searchInput.value.trim();
    if (city !== "") {
      loadWeather(city);
    }
  }
});

cityButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.dataset.city;
    loadWeather(city);
  });
});

retryBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") {
    loadWeather(city);
  } else {
    // If no city in search, load default
    loadWeather("London");
  }
});

unitToggle.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggle.textContent = isCelsius ? "°C" : "°F";
  unitToggle.classList.toggle("active", !isCelsius);
  
  if (currentWeatherData) {
    displayWeather(currentWeatherData);
  }
});

// ===== Weather API Configuration =====
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key from https://openweathermap.org/api
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// ===== Demo Data for Testing =====
const DEMO_DATA = {
  'london': {
    location: { name: 'London', region: 'England, GB' },
    current: {
      temp: 15, feelsLike: 13, condition: 'Partly cloudy', icon: '⛅',
      humidity: 72, wind: 12, visibility: 10, pressure: 1013
    },
    hourly: [
      { time: '14:00', temp: 15, icon: '⛅', condition: 'Partly cloudy' },
      { time: '15:00', temp: 16, icon: '☀️', condition: 'Sunny' },
      { time: '16:00', temp: 17, icon: '☀️', condition: 'Sunny' },
      { time: '17:00', temp: 16, icon: '⛅', condition: 'Partly cloudy' },
      { time: '18:00', temp: 14, icon: '☁️', condition: 'Cloudy' },
      { time: '19:00', temp: 13, icon: '🌧️', condition: 'Light rain' },
      { time: '20:00', temp: 12, icon: '🌧️', condition: 'Light rain' },
      { time: '21:00', temp: 11, icon: '☁️', condition: 'Cloudy' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 16, minTemp: 11, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Tue', maxTemp: 18, minTemp: 12, icon: '☀️', condition: 'Sunny' },
      { day: 'Wed', maxTemp: 15, minTemp: 10, icon: '🌧️', condition: 'Light rain' },
      { day: 'Thu', maxTemp: 14, minTemp: 9, icon: '☁️', condition: 'Cloudy' },
      { day: 'Fri', maxTemp: 17, minTemp: 11, icon: '⛅', condition: 'Partly cloudy' }
    ]
  },
  'new york': {
    location: { name: 'New York', region: 'NY, US' },
    current: {
      temp: 22, feelsLike: 25, condition: 'Clear sky', icon: '☀️',
      humidity: 65, wind: 8, visibility: 16, pressure: 1015
    },
    hourly: [
      { time: '14:00', temp: 22, icon: '☀️', condition: 'Sunny' },
      { time: '15:00', temp: 23, icon: '☀️', condition: 'Sunny' },
      { time: '16:00', temp: 24, icon: '☀️', condition: 'Sunny' },
      { time: '17:00', temp: 23, icon: '⛅', condition: 'Partly cloudy' },
      { time: '18:00', temp: 21, icon: '⛅', condition: 'Partly cloudy' },
      { time: '19:00', temp: 20, icon: '🌙', condition: 'Clear' },
      { time: '20:00', temp: 19, icon: '🌙', condition: 'Clear' },
      { time: '21:00', temp: 18, icon: '🌙', condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 24, minTemp: 18, icon: '☀️', condition: 'Sunny' },
      { day: 'Tue', maxTemp: 26, minTemp: 19, icon: '☀️', condition: 'Sunny' },
      { day: 'Wed', maxTemp: 23, minTemp: 17, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Thu', maxTemp: 21, minTemp: 16, icon: '🌧️', condition: 'Light rain' },
      { day: 'Fri', maxTemp: 25, minTemp: 18, icon: '☀️', condition: 'Sunny' }
    ]
  },
  'tokyo': {
    location: { name: 'Tokyo', region: 'Tokyo, JP' },
    current: {
      temp: 18, feelsLike: 20, condition: 'Cloudy', icon: '☁️',
      humidity: 78, wind: 15, visibility: 8, pressure: 1008
    },
    hourly: [
      { time: '14:00', temp: 18, icon: '☁️', condition: 'Cloudy' },
      { time: '15:00', temp: 19, icon: '⛅', condition: 'Partly cloudy' },
      { time: '16:00', temp: 20, icon: '⛅', condition: 'Partly cloudy' },
      { time: '17:00', temp: 18, icon: '🌧️', condition: 'Light rain' },
      { time: '18:00', temp: 17, icon: '🌧️', condition: 'Light rain' },
      { time: '19:00', temp: 16, icon: '☁️', condition: 'Cloudy' },
      { time: '20:00', temp: 15, icon: '☁️', condition: 'Cloudy' },
      { time: '21:00', temp: 14, icon: '🌫️', condition: 'Mist' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 20, minTemp: 14, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Tue', maxTemp: 22, minTemp: 15, icon: '🌧️', condition: 'Light rain' },
      { day: 'Wed', maxTemp: 19, minTemp: 13, icon: '☁️', condition: 'Cloudy' },
      { day: 'Thu', maxTemp: 21, minTemp: 16, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Fri', maxTemp: 23, minTemp: 17, icon: '☀️', condition: 'Sunny' }
    ]
  },
  'paris': {
    location: { name: 'Paris', region: 'Île-de-France, FR' },
    current: {
      temp: 12, feelsLike: 10, condition: 'Light rain', icon: '🌧️',
      humidity: 85, wind: 18, visibility: 6, pressure: 1005
    },
    hourly: [
      { time: '14:00', temp: 12, icon: '🌧️', condition: 'Light rain' },
      { time: '15:00', temp: 13, icon: '⛅', condition: 'Partly cloudy' },
      { time: '16:00', temp: 14, icon: '⛅', condition: 'Partly cloudy' },
      { time: '17:00', temp: 13, icon: '☁️', condition: 'Cloudy' },
      { time: '18:00', temp: 11, icon: '🌧️', condition: 'Light rain' },
      { time: '19:00', temp: 10, icon: '🌧️', condition: 'Light rain' },
      { time: '20:00', temp: 9, icon: '☁️', condition: 'Cloudy' },
      { time: '21:00', temp: 8, icon: '☁️', condition: 'Cloudy' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 14, minTemp: 8, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Tue', maxTemp: 16, minTemp: 9, icon: '🌧️', condition: 'Light rain' },
      { day: 'Wed', maxTemp: 13, minTemp: 7, icon: '☁️', condition: 'Cloudy' },
      { day: 'Thu', maxTemp: 15, minTemp: 10, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Fri', maxTemp: 17, minTemp: 11, icon: '☀️', condition: 'Sunny' }
    ]
  },
  'sydney': {
    location: { name: 'Sydney', region: 'NSW, AU' },
    current: {
      temp: 26, feelsLike: 28, condition: 'Sunny', icon: '☀️',
      humidity: 55, wind: 20, visibility: 16, pressure: 1018
    },
    hourly: [
      { time: '14:00', temp: 26, icon: '☀️', condition: 'Sunny' },
      { time: '15:00', temp: 27, icon: '☀️', condition: 'Sunny' },
      { time: '16:00', temp: 28, icon: '☀️', condition: 'Sunny' },
      { time: '17:00', temp: 27, icon: '⛅', condition: 'Partly cloudy' },
      { time: '18:00', temp: 25, icon: '⛅', condition: 'Partly cloudy' },
      { time: '19:00', temp: 24, icon: '🌙', condition: 'Clear' },
      { time: '20:00', temp: 23, icon: '🌙', condition: 'Clear' },
      { time: '21:00', temp: 22, icon: '🌙', condition: 'Clear' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 28, minTemp: 22, icon: '☀️', condition: 'Sunny' },
      { day: 'Tue', maxTemp: 29, minTemp: 23, icon: '☀️', condition: 'Sunny' },
      { day: 'Wed', maxTemp: 26, minTemp: 21, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Thu', maxTemp: 24, minTemp: 20, icon: '🌧️', condition: 'Light rain' },
      { day: 'Fri', maxTemp: 27, minTemp: 22, icon: '☀️', condition: 'Sunny' }
    ]
  },
  'mumbai': {
    location: { name: 'Mumbai', region: 'Maharashtra, IN' },
    current: {
      temp: 32, feelsLike: 38, condition: 'Haze', icon: '🌫️',
      humidity: 85, wind: 12, visibility: 4, pressure: 1007
    },
    hourly: [
      { time: '14:00', temp: 32, icon: '🌫️', condition: 'Haze' },
      { time: '15:00', temp: 33, icon: '⛅', condition: 'Partly cloudy' },
      { time: '16:00', temp: 34, icon: '☀️', condition: 'Sunny' },
      { time: '17:00', temp: 33, icon: '🌧️', condition: 'Light rain' },
      { time: '18:00', temp: 31, icon: '🌧️', condition: 'Light rain' },
      { time: '19:00', temp: 30, icon: '🌫️', condition: 'Haze' },
      { time: '20:00', temp: 29, icon: '🌫️', condition: 'Haze' },
      { time: '21:00', temp: 28, icon: '🌫️', condition: 'Haze' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 34, minTemp: 28, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Tue', maxTemp: 35, minTemp: 29, icon: '🌧️', condition: 'Light rain' },
      { day: 'Wed', maxTemp: 32, minTemp: 27, icon: '🌫️', condition: 'Haze' },
      { day: 'Thu', maxTemp: 33, minTemp: 28, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Fri', maxTemp: 36, minTemp: 30, icon: '☀️', condition: 'Sunny' }
    ]
  },
  'berlin': {
    location: { name: 'Berlin', region: 'Berlin, DE' },
    current: {
      temp: 8, feelsLike: 5, condition: 'Snow', icon: '❄️',
      humidity: 90, wind: 25, visibility: 3, pressure: 995
    },
    hourly: [
      { time: '14:00', temp: 8, icon: '❄️', condition: 'Snow' },
      { time: '15:00', temp: 7, icon: '❄️', condition: 'Light snow' },
      { time: '16:00', temp: 6, icon: '☁️', condition: 'Cloudy' },
      { time: '17:00', temp: 5, icon: '❄️', condition: 'Light snow' },
      { time: '18:00', temp: 4, icon: '❄️', condition: 'Snow' },
      { time: '19:00', temp: 3, icon: '☁️', condition: 'Cloudy' },
      { time: '20:00', temp: 2, icon: '☁️', condition: 'Cloudy' },
      { time: '21:00', temp: 1, icon: '❄️', condition: 'Light snow' }
    ],
    daily: [
      { day: 'Mon', maxTemp: 8, minTemp: 1, icon: '❄️', condition: 'Snow' },
      { day: 'Tue', maxTemp: 6, minTemp: 0, icon: '☁️', condition: 'Cloudy' },
      { day: 'Wed', maxTemp: 9, minTemp: 2, icon: '⛅', condition: 'Partly cloudy' },
      { day: 'Thu', maxTemp: 7, minTemp: -1, icon: '❄️', condition: 'Light snow' },
      { day: 'Fri', maxTemp: 10, minTemp: 3, icon: '☀️', condition: 'Sunny' }
    ]
  }
};

// ===== Generate Random Demo Data =====
function generateRandomWeather(city) {
  const conditions = [
    { name: 'Clear sky', icon: '☀️', temp: 22 },
    { name: 'Partly cloudy', icon: '⛅', temp: 18 },
    { name: 'Cloudy', icon: '☁️', temp: 16 },
    { name: 'Light rain', icon: '🌧️', temp: 14 },
    { name: 'Sunny', icon: '☀️', temp: 25 },
    { name: 'Overcast', icon: '☁️', temp: 12 },
    { name: 'Mist', icon: '🌫️', temp: 10 }
  ];

  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const baseTemp = randomCondition.temp;
  const tempVariation = Math.floor(Math.random() * 6) - 3; // -3 to +3
  const actualTemp = baseTemp + tempVariation;

  // Generate hourly forecast
  const hourly = [];
  for (let i = 0; i < 8; i++) {
    const hourTemp = actualTemp + Math.floor(Math.random() * 4) - 2;
    const hourCondition = conditions[Math.floor(Math.random() * conditions.length)];
    hourly.push({
      time: `${14 + i}:00`,
      temp: hourTemp,
      icon: hourCondition.icon,
      condition: hourCondition.name
    });
  }

  // Generate daily forecast
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const daily = [];
  for (let i = 0; i < 5; i++) {
    const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const dayTemp = actualTemp + Math.floor(Math.random() * 8) - 4;
    daily.push({
      day: days[i],
      maxTemp: dayTemp + Math.floor(Math.random() * 3) + 2,
      minTemp: dayTemp - Math.floor(Math.random() * 3) - 1,
      icon: dayCondition.icon,
      condition: dayCondition.name
=======
/**
 * Weather Dashboard Logic
 * Handles API integration, UI updates, and user interactions.
 */

// ===== Configuration =====
const CONFIG = {
  GEO_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  WEATHER_URL: 'https://api.open-meteo.com/v1/forecast',
  GRADIENTS: {
    clear: 'linear-gradient(135deg, #00C9FF, #92FE9D)',
    cloud: 'linear-gradient(135deg, #304352, #d7d2cc)',
    rain: 'linear-gradient(135deg, #4b6cb7, #182848)',
    snow: 'linear-gradient(135deg, #83a4d4, #b6fbff)',
    thunder: 'linear-gradient(135deg, #141E30, #243B55)',
    mist: 'linear-gradient(135deg, #3E5151, #DECBA4)',
    default: 'linear-gradient(135deg, #1e293b, #020617)'
  }
};

// ===== DOM Elements =====
const UI = {
  search: {
    input: document.getElementById("search-input"),
    btn: document.getElementById("search-btn"),
    unitToggle: document.getElementById("unit-toggle"),
    cityBtns: document.querySelectorAll(".city-btn")
  },
  states: {
    welcome: document.getElementById("welcome-state"),
    loading: document.getElementById("loading-state"),
    content: document.getElementById("weather-content"),
    error: document.getElementById("error-state"),
    retryBtn: document.getElementById("retry-btn")
  },
  weather: {
    locationName: document.getElementById("location-name"),
    locationRegion: document.getElementById("location-region"),
    icon: document.getElementById("weather-icon"),
    temp: document.getElementById("temperature"),
    condition: document.getElementById("condition"),
    feelsLike: document.getElementById("feels-like"),
    details: {
      humidity: document.getElementById("humidity"),
      wind: document.getElementById("wind"),
      visibility: document.getElementById("visibility"),
      pressure: document.getElementById("pressure")
    }
  },
  forecast: {
    hourly: document.getElementById("hourly-forecast"),
    daily: document.getElementById("daily-forecast")
  },
  background: document.querySelector('.background-container')
};

// ===== State =====
let appState = {
  currentData: null,
  isCelsius: true
};

// ===== Event Listeners =====
function initEventListeners() {
  UI.search.btn.addEventListener("click", handleSearch);

  UI.search.input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  UI.search.cityBtns.forEach(btn => {
    btn.addEventListener("click", () => loadWeather(btn.dataset.city));
  });

  UI.states.retryBtn.addEventListener("click", () => {
    const city = UI.search.input.value.trim() || "London";
    loadWeather(city);
  });

  UI.search.unitToggle.addEventListener("click", toggleUnit);
}

// ===== Handlers =====
function handleSearch() {
  const city = UI.search.input.value.trim();
  if (city) loadWeather(city);
}

function toggleUnit() {
  appState.isCelsius = !appState.isCelsius;
  UI.search.unitToggle.textContent = appState.isCelsius ? "°C" : "°F";
  UI.search.unitToggle.classList.toggle("active", !appState.isCelsius);

  if (appState.currentData) {
    displayWeather(appState.currentData);
  }
}

// ===== Helpers =====
const formatTemp = (temp) => {
  const t = appState.isCelsius ? temp : Math.round((temp * 9 / 5) + 32);
  return `${t}${appState.isCelsius ? "°C" : "°F"}`;
};

// ===== API Integration =====
async function loadWeather(city) {
  setLoadingState(true);

  try {
    // 1. Geocoding
    const geoRes = await fetch(`${CONFIG.GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results?.length) throw new Error('City not found');

    const { latitude, longitude, name, country, admin1 } = geoData.results[0];

    // 2. Weather Data
    const weatherRes = await fetch(
      `${CONFIG.WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&hourly=temperature_2m,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    const processedData = processWeatherData(weatherData, name, country, admin1);
    displayWeather(processedData);

  } catch (error) {
    console.error(error);
    showError(error.message || 'Failed to fetch weather data.');
  } finally {
    setLoadingState(false);
  }
}

// ===== Data Processing =====
function processWeatherData(data, cityName, country, state) {
  const current = data.current;
  const currentInfo = getWeatherFromCode(current.weather_code);

  // Hourly (Next 8 hours)
  const hourly = [];
  const now = new Date();
  let startIndex = 0;

  // Find start index based on current time
  for (let i = 0; i < data.hourly.time.length; i++) {
    if (new Date(data.hourly.time[i]) >= now) {
      startIndex = i;
      break;
    }
  }

  for (let i = 0; i < 8; i++) {
    const idx = startIndex + i;
    if (idx >= data.hourly.time.length) break;

    const info = getWeatherFromCode(data.hourly.weather_code[idx]);
    hourly.push({
      time: new Date(data.hourly.time[idx]).getHours() + ':00',
      temp: Math.round(data.hourly.temperature_2m[idx]),
      icon: info.icon,
      condition: info.condition
    });
  }

  // Daily (Next 5 days)
  const daily = [];
  for (let i = 0; i < 5; i++) {
    if (!data.daily.time[i]) break;
    const info = getWeatherFromCode(data.daily.weather_code[i]);
    daily.push({
      day: new Date(data.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(data.daily.temperature_2m_max[i]),
      minTemp: Math.round(data.daily.temperature_2m_min[i]),
      icon: info.icon,
      condition: info.condition
>>>>>>> 105f0b87663334710cec03a94f678c2eb3c162bf
    });
  }

  return {
<<<<<<< HEAD
    location: { name: city, region: 'Demo Location' },
    current: {
      temp: actualTemp,
      feelsLike: actualTemp + Math.floor(Math.random() * 4) - 2,
      condition: randomCondition.name,
      icon: randomCondition.icon,
      humidity: 40 + Math.floor(Math.random() * 40),
      wind: 5 + Math.floor(Math.random() * 15),
      visibility: 5 + Math.floor(Math.random() * 10),
      pressure: 1000 + Math.floor(Math.random() * 20)
=======
    location: { name: cityName, region: state ? `${state}, ${country}` : country },
    current: {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: currentInfo.condition,
      icon: currentInfo.icon,
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      visibility: "N/A", // API specific handling omitted for brevity
      pressure: Math.round(current.surface_pressure)
>>>>>>> 105f0b87663334710cec03a94f678c2eb3c162bf
    },
    hourly,
    daily
  };
}

<<<<<<< HEAD
// Check if API key is configured
if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
  console.log('Demo mode: Using sample data. Add your OpenWeatherMap API key for real data.');
}

// ===== This function connects to Weather API =====
async function loadWeather(city) {
  // UI changes with animations
  welcomeState.classList.add("hidden");
  weatherContent.classList.add("hidden");
  errorState.classList.add("hidden");
  loadingState.classList.remove("hidden");
  loadingState.classList.add("fade-in");

  // Add loading animation
  setTimeout(() => {
    if (loadingState.classList.contains("fade-in")) {
      loadingState.style.animation = "pulse 1.5s infinite";
    }
  }, 300);

  const cityKey = city.toLowerCase().replace(/\s+/g, ' ');

  try {
    // Check if we have demo data for this city
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
      let demoData;
      if (DEMO_DATA[cityKey]) {
        demoData = DEMO_DATA[cityKey];
      } else {
        // Generate random weather for unknown cities
        demoData = generateRandomWeather(city);
      }
      // Use demo data
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      displayWeather(demoData);
      return;
    }

    // Real API call
    if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
      throw new Error('Please configure your OpenWeatherMap API key in script.js for real weather data');
    }

    // First, get coordinates for the city
    const geoResponse = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`);
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      throw new Error('City not found');
    }

    const { lat, lon, name, country, state } = geoData[0];

    // Get current weather
    const weatherResponse = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const weatherData = await weatherResponse.json();

    // Get 5-day forecast
    const forecastResponse = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const forecastData = await forecastResponse.json();

    // Process and display data
    const processedData = processWeatherData(weatherData, forecastData, name, country, state);
    displayWeather(processedData);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    showError(error.message || 'Failed to fetch weather data. Please try again.');
  } finally {
    loadingState.classList.add("hidden");
    loadingState.style.animation = "";
  }
}

// ===== Process API data =====
function processWeatherData(current, forecast, cityName, country, state) {
  const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };

  return {
    location: {
      name: cityName,
      region: state ? `${state}, ${country}` : country
    },
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      condition: current.weather[0].description,
      icon: weatherIcons[current.weather[0].icon] || '☀️',
      humidity: current.main.humidity,
      wind: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
      visibility: (current.visibility / 1000).toFixed(1), // Convert m to km
      pressure: current.main.pressure
    },
    hourly: forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).getHours() + ':00',
      temp: Math.round(item.main.temp),
      icon: weatherIcons[item.weather[0].icon] || '☀️',
      condition: item.weather[0].description
    })),
    daily: processDailyForecast(forecast.list)
  };
}

function processDailyForecast(list) {
  const dailyData = {};
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        icons: [],
        conditions: []
      };
    }
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].icons.push(item.weather[0].icon);
    dailyData[date].conditions.push(item.weather[0].description);
  });

  const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };

  return Object.keys(dailyData).slice(0, 5).map(date => {
    const dayData = dailyData[date];
    const maxTemp = Math.max(...dayData.temps);
    const minTemp = Math.min(...dayData.temps);
    
    // Use the most common icon (first one for simplicity)
    const icon = weatherIcons[dayData.icons[0]] || '☀️';
    const condition = dayData.conditions[0];
    
    return {
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
      icon,
      condition
    };
  });
}

// ===== Display data on UI =====
function displayWeather(data) {
  // Store current data for unit conversion
  currentWeatherData = data;

  weatherContent.classList.remove("hidden");
  weatherContent.classList.add("fade-in");

  // Add glow effect to main area
  document.querySelector('.main-area').classList.add('weather-content-visible');

  // Show demo indicator if using demo data
  const demoIndicator = document.getElementById('demo-indicator');
  const isDemoData = API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY';
  demoIndicator.style.display = isDemoData ? 'flex' : 'none';

  // Update background based on weather
  updateBackground(data.current.condition);

  // Animate elements with staggered timing
  setTimeout(() => {
    // Current weather
    locationName.innerText = data.location.name;
    locationRegion.innerText = data.location.region;
    weatherIcon.innerText = data.current.icon;
    temperature.innerText = convertTemp(data.current.temp) + getTempUnit();
    condition.innerText = data.current.condition;
    feelsLike.innerText = `Feels like ${convertTemp(data.current.feelsLike)}${getTempUnit()}`;
    humidity.innerText = data.current.humidity + "%";
    wind.innerText = data.current.wind + " km/h";
    visibility.innerText = data.current.visibility + " km";
    pressure.innerText = data.current.pressure + " hPa";

    // Add floating animation to weather icon
    weatherIcon.style.animation = "weatherIconFloat 3s ease-in-out infinite";

    // Animate temperature with bounce effect
    temperature.style.animation = "bounce 0.8s ease";

    // Stagger forecast animations
    setTimeout(() => displayHourlyForecast(data.hourly), 200);
    setTimeout(() => displayDailyForecast(data.daily), 400);

  }, 100);
}

// ===== Update background based on weather =====
function updateBackground(condition) {
  const backgroundContainer = document.querySelector('.background-container');
  const conditionLower = condition.toLowerCase();

  let gradient = 'linear-gradient(135deg, #1e293b, #020617)'; // Default

  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    gradient = 'linear-gradient(135deg, #ff6b35, #f7931e, #ffb627)';
  } else if (conditionLower.includes('cloud')) {
    gradient = 'linear-gradient(135deg, #4a5568, #718096, #a0aec0)';
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    gradient = 'linear-gradient(135deg, #2d3748, #4a5568, #1a202c)';
  } else if (conditionLower.includes('snow')) {
    gradient = 'linear-gradient(135deg, #e2e8f0, #cbd5e0, #a0aec0)';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    gradient = 'linear-gradient(135deg, #2d1b69, #11998e, #38a169)';
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    gradient = 'linear-gradient(135deg, #4a5568, #2d3748, #1a202c)';
  }

  backgroundContainer.style.background = gradient;
  backgroundContainer.style.transition = 'background 1s ease';
}

function displayHourlyForecast(hourlyData) {
  hourlyForecast.innerHTML = '';

  hourlyData.forEach((hour, index) => {
    const hourCard = document.createElement('div');
    hourCard.className = 'forecast-card';
    hourCard.style.animationDelay = `${index * 0.1}s`;
    hourCard.innerHTML = `
      <div class="forecast-time">${hour.time}</div>
      <div class="forecast-icon">${hour.icon}</div>
      <div class="forecast-temp">${convertTemp(hour.temp)}${getTempUnit()}</div>
      <div class="forecast-condition">${hour.condition}</div>
    `;
    hourlyForecast.appendChild(hourCard);
  });
}

function displayDailyForecast(dailyData) {
  dailyForecast.innerHTML = '';

  dailyData.forEach((day, index) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'forecast-card';
    dayCard.style.animationDelay = `${index * 0.1}s`;
    dayCard.innerHTML = `
      <div class="forecast-day">${day.day}</div>
      <div class="forecast-icon">${day.icon}</div>
      <div class="forecast-temps">
        <span class="max-temp">${convertTemp(day.maxTemp)}${getTempUnit()}</span>
        <span class="min-temp">${convertTemp(day.minTemp)}${getTempUnit()}</span>
      </div>
      <div class="forecast-condition">${day.condition}</div>
    `;
    dailyForecast.appendChild(dayCard);
  });
}

// ===== Error display =====
function showError(message) {
  weatherContent.classList.add("hidden");
  errorState.classList.remove("hidden");
  errorState.classList.add("fade-in");

  // Add shake animation to error state
  setTimeout(() => {
    errorState.style.animation = "shake 0.5s ease-in-out";
  }, 300);
}
=======
// ===== UI Updates =====
function displayWeather(data) {
  appState.currentData = data;

  UI.states.content.classList.remove("hidden");
  UI.states.error.classList.add("hidden");
  UI.states.welcome.classList.add("hidden");

  // Background
  updateBackground(data.current.condition);

  // Current Weather
  UI.weather.locationName.innerText = data.location.name;
  UI.weather.locationRegion.innerText = data.location.region;
  UI.weather.icon.innerText = data.current.icon;
  UI.weather.temp.innerText = formatTemp(data.current.temp);
  UI.weather.condition.innerText = data.current.condition;
  UI.weather.feelsLike.innerText = `Feels like ${formatTemp(data.current.feelsLike)}`;

  UI.weather.details.humidity.innerText = `${data.current.humidity}%`;
  UI.weather.details.wind.innerText = `${data.current.wind} km/h`;
  UI.weather.details.pressure.innerText = `${data.current.pressure} hPa`;
  UI.weather.details.visibility.innerText = `${data.current.visibility} km`;

  // Animations
  UI.weather.icon.style.animation = "weatherIconFloat 3s ease-in-out infinite";
  UI.weather.temp.style.animation = "bounce 0.8s ease";

  // Forecasts
  renderForecast(UI.forecast.hourly, data.hourly, createHourlyCard);
  renderForecast(UI.forecast.daily, data.daily, createDailyCard);

  // Glow effect
  document.querySelector('.main-area').classList.add('weather-content-visible');
}

function updateBackground(condition) {
  const cond = condition.toLowerCase();
  let gradient = CONFIG.GRADIENTS.default;

  if (cond.includes('clear') || cond.includes('sunny')) gradient = CONFIG.GRADIENTS.clear;
  else if (cond.includes('cloud')) gradient = CONFIG.GRADIENTS.cloud;
  else if (cond.includes('rain') || cond.includes('drizzle')) gradient = CONFIG.GRADIENTS.rain;
  else if (cond.includes('snow')) gradient = CONFIG.GRADIENTS.snow;
  else if (cond.includes('thunder') || cond.includes('storm')) gradient = CONFIG.GRADIENTS.thunder;
  else if (cond.includes('mist') || cond.includes('fog')) gradient = CONFIG.GRADIENTS.mist;

  UI.background.style.background = gradient;
}

function renderForecast(container, data, cardCreator) {
  container.innerHTML = '';
  data.forEach((item, index) => {
    const card = cardCreator(item);
    card.style.animationDelay = `${index * 0.1}s`;
    container.appendChild(card);
  });
}

function createHourlyCard(item) {
  const div = document.createElement('div');
  div.className = 'forecast-card';
  div.innerHTML = `
    <div class="forecast-time">${item.time}</div>
    <div class="forecast-icon">${item.icon}</div>
    <div class="forecast-temp">${formatTemp(item.temp)}</div>
    <div class="forecast-condition">${item.condition}</div>
  `;
  return div;
}

function createDailyCard(item) {
  const div = document.createElement('div');
  div.className = 'forecast-card';
  div.innerHTML = `
    <div class="forecast-day">${item.day}</div>
    <div class="forecast-icon">${item.icon}</div>
    <div class="forecast-temps">
      <span class="max-temp">${formatTemp(item.maxTemp)}</span>
      <span class="min-temp">${formatTemp(item.minTemp)}</span>
    </div>
    <div class="forecast-condition">${item.condition}</div>
  `;
  return div;
}

function setLoadingState(isLoading) {
  if (isLoading) {
    UI.states.welcome.classList.add("hidden");
    UI.states.content.classList.add("hidden");
    UI.states.error.classList.add("hidden");
    UI.states.loading.classList.remove("hidden");
  } else {
    UI.states.loading.classList.add("hidden");
  }
}

function showError(msg) {
  UI.states.content.classList.add("hidden");
  UI.states.error.classList.remove("hidden");
  UI.states.error.querySelector("p").innerText = `⚠️ ${msg}`;
}

// WMO Code Map
function getWeatherFromCode(code) {
  const codes = {
    0: { condition: 'Clear sky', icon: '☀️' },
    1: { condition: 'Mainly clear', icon: '☀️' },
    2: { condition: 'Partly cloudy', icon: '⛅' },
    3: { condition: 'Overcast', icon: '☁️' },
    45: { condition: 'Fog', icon: '🌫️' },
    48: { condition: 'Depositing rime fog', icon: '🌫️' },
    51: { condition: 'Light drizzle', icon: '🌧️' },
    53: { condition: 'Moderate drizzle', icon: '🌧️' },
    55: { condition: 'Dense drizzle', icon: '🌧️' },
    56: { condition: 'Light freezing drizzle', icon: '🌧️' },
    57: { condition: 'Dense freezing drizzle', icon: '🌧️' },
    61: { condition: 'Slight rain', icon: '🌧️' },
    63: { condition: 'Moderate rain', icon: '🌧️' },
    65: { condition: 'Heavy rain', icon: '🌧️' },
    66: { condition: 'Light freezing rain', icon: '🌧️' },
    67: { condition: 'Heavy freezing rain', icon: '🌧️' },
    71: { condition: 'Slight snow fall', icon: '❄️' },
    73: { condition: 'Moderate snow fall', icon: '❄️' },
    75: { condition: 'Heavy snow fall', icon: '❄️' },
    77: { condition: 'Snow grains', icon: '❄️' },
    80: { condition: 'Slight rain showers', icon: '🌦️' },
    81: { condition: 'Moderate rain showers', icon: '🌦️' },
    82: { condition: 'Violent rain showers', icon: '⛈️' },
    85: { condition: 'Slight snow showers', icon: '❄️' },
    86: { condition: 'Heavy snow showers', icon: '❄️' },
    95: { condition: 'Thunderstorm', icon: '⛈️' },
    96: { condition: 'Thunderstorm with hail', icon: '⛈️' },
    99: { condition: 'Thunderstorm with heavy hail', icon: '⛈️' }
  };
  return codes[code] || { condition: 'Unknown', icon: '❓' };
}

// Initial Launch
initEventListeners();
>>>>>>> 105f0b87663334710cec03a94f678c2eb3c162bf
