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
  return Math.round((celsius * 9 / 5) + 32);
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

// ===== Weather API Configuration (Open-Meteo) =====
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// ===== WMO Weather Code Mapping =====
// Open-Meteo uses WMO codes. We need to map them to our icons/descriptions.
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

  try {
    // 1. Geocoding: Get lat/lon for city
    const geoResponse = await fetch(`${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name, country, admin1 } = geoData.results[0];

    // 2. Weather Data: Get current, hourly, and daily forecast
    // We request specific variables we need
    const weatherResponse = await fetch(
      `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    const weatherData = await weatherResponse.json();

    // Process and display data
    const processedData = processWeatherData(weatherData, name, country, admin1);
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
function processWeatherData(data, cityName, country, state) {
  const current = data.current;
  const currentInfo = getWeatherFromCode(current.weather_code);

  // Hourly data handling (next 24 hours)
  // Open-Meteo returns array of values. We need to map them to objects.
  const hourly = [];
  const currentHourIndex = new Date().getHours(); // simple approximation for demo

  // We'll take the next 8 hours for display
  // Note: ideally we match timestamps, but for simplicity we'll just slice from 'now'
  // Since the API returns hourly data starting from 00:00 today, we find the current index
  // But strictly, we should parse the 'time' array. 

  // Let's match by time string for accuracy
  const now = new Date();
  let startIndex = 0;

  // Find the index for the current hour
  for (let i = 0; i < data.hourly.time.length; i++) {
    if (new Date(data.hourly.time[i]) >= now) {
      startIndex = i;
      break;
    }
  }

  for (let i = 0; i < 8; i++) {
    const idx = startIndex + i;
    if (idx >= data.hourly.time.length) break;

    const timeStr = data.hourly.time[idx];
    const hourDate = new Date(timeStr);
    const hourCode = data.hourly.weather_code[idx];
    const hourInfo = getWeatherFromCode(hourCode);

    hourly.push({
      time: hourDate.getHours() + ':00',
      temp: Math.round(data.hourly.temperature_2m[idx]),
      icon: hourInfo.icon,
      condition: hourInfo.condition
    });
  }

  // Daily data handling
  const daily = [];
  for (let i = 0; i < 5; i++) {
    // Ensure we have data
    if (!data.daily.time[i]) break;

    const dayCode = data.daily.weather_code[i];
    const dayInfo = getWeatherFromCode(dayCode);
    const date = new Date(data.daily.time[i]);

    daily.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(data.daily.temperature_2m_max[i]),
      minTemp: Math.round(data.daily.temperature_2m_min[i]),
      icon: dayInfo.icon,
      condition: dayInfo.condition
    });
  }

  return {
    location: {
      name: cityName,
      region: state ? `${state}, ${country}` : country
    },
    current: {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: currentInfo.condition,
      icon: currentInfo.icon,
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m), // km/h is default in Open-Meteo
      visibility: "N/A", // Open-Meteo hourly has visibility but current structure is different. 
      // Actually we requested hourly visibility, let's grab the current hour visibility if possible or mock it
      // For simplicity/robustness, we can leave it or grab from hourly[startIndex]
      pressure: Math.round(current.surface_pressure)
    },
    hourly: hourly,
    daily: daily
  };
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
    gradient = 'linear-gradient(135deg, #00C9FF, #92FE9D)'; // Bright Blue to Green
  } else if (conditionLower.includes('cloud')) {
    gradient = 'linear-gradient(135deg, #8e9eab, #eef2f3)'; /* Grayish - metallic */
    // Let's try a cooler cloudy blue actually, lighter
    gradient = 'linear-gradient(135deg, #304352, #d7d2cc)'; // Darker stormy clouds
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    gradient = 'linear-gradient(135deg, #4b6cb7, #182848)'; // Deep Blue Rain
  } else if (conditionLower.includes('snow')) {
    gradient = 'linear-gradient(135deg, #83a4d4, #b6fbff)'; // Icy Blue
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    gradient = 'linear-gradient(135deg, #141E30, #243B55)'; // Dark Night Storm
  } else if (conditionLower.includes('mist') || conditionLower.includes('fog')) {
    gradient = 'linear-gradient(135deg, #3E5151, #DECBA4)'; // Sandy Mist
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
