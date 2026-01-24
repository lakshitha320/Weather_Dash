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
    });
  }

  return {
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
    },
    hourly,
    daily
  };
}

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
