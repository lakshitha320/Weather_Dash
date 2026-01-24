<<<<<<< HEAD
# Weather Dashboard

A modern, responsive weather dashboard with stunning animations and transitions using the OpenWeatherMap API.

## ✨ Features

- 🌤️ **Real-time weather data** with current conditions, humidity, wind speed, visibility, and pressure
- 📅 **Hourly forecast** for the next 8 hours with animated cards
- 📆 **5-day weather forecast** with min/max temperatures
- 🔍 **Smart search** with autocomplete and keyboard support
- 📱 **Fully responsive** design that works on all devices
- 🎨 **Dynamic backgrounds** that change based on weather conditions
- ✨ **Smooth animations** and transitions throughout the interface
- 🌟 **Interactive elements** with hover effects and micro-animations
- 🎭 **Loading animations** with custom spinner
- ⚡ **Fast performance** with optimized animations
- 🎪 **Particle effects** and floating elements for visual appeal
- 🌡️ **Temperature unit toggle** (°C/°F) with instant conversion
- 🎯 **Demo mode** - works without API key using sample data
- 🎨 **7 demo cities** with realistic weather data
- 🔄 **Random weather generation** for any searched city in demo mode

## 🚀 Quick Start

### Option 1: Demo Mode (No API Key Required)
Simply open `src/index.html` in your browser! The app will automatically use demo data for popular cities and generate random weather for others.

### Option 2: Real Weather Data

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section and create a new API key
4. Copy your API key

### 3. Configure the API Key

1. Open `src/script.js`
2. Find the line: `const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';`
3. Replace `'YOUR_OPENWEATHERMAP_API_KEY'` with your actual API key

## 🎨 Animations & Effects

- **Fade-in animations** for all content sections
- **Staggered card animations** for forecast displays
- **Hover effects** on buttons and cards with elevation
- **Dynamic background gradients** based on weather
- **Floating particles** for ambient atmosphere
- **Smooth transitions** between all states
- **Loading spinner** with custom animation
- **Weather icon animations** with floating effect
- **Temperature bounce animation** on load
- **Shimmer effects** on interactive elements
- **Unit conversion animations** when toggling °C/°F

## 🌡️ Temperature Units

- Click the **°C/°F toggle** in the search bar to switch units
- All temperatures update instantly with smooth animations
- Unit preference is remembered during the session

## 🎯 Demo Cities

Try these cities to see realistic demo data:
- **London** - Cool, cloudy European weather
- **New York** - Warm, humid American weather
- **Tokyo** - Mild, variable Asian weather
- **Paris** - Temperate European weather
- **Sydney** - Hot, sunny Australian weather
- **Mumbai** - Hot, humid tropical weather
- **Berlin** - Cold, snowy European weather

Search for any other city to see randomly generated weather data!

## 📊 API Limits (Real Mode)

The free OpenWeatherMap plan includes:
- 1,000 API calls per day
- Current weather and 5-day forecast data
- Geocoding API for city search

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with animations and transitions
- **Vanilla JavaScript** - ES6+ features for dynamic functionality
- **OpenWeatherMap API** - Weather data provider
- **Google Fonts** - Inter font family for typography

## 🎯 Browser Support

Works in all modern browsers that support:
- Fetch API
- ES6 features (const, let, arrow functions)
- CSS Grid and Flexbox
- CSS Animations and Transitions
- Backdrop-filter for glassmorphism effects

## 📱 Responsive Design

- **Mobile-first approach** with breakpoints
- **Touch-friendly** interface elements
- **Optimized layouts** for different screen sizes
- **Smooth scrolling** forecast containers

## 🎨 Customization

### Weather Backgrounds
Modify the `updateBackground()` function in `script.js` to add more weather conditions and gradients.

### Animations
Adjust animation timings and effects in `style.css` by modifying the `@keyframes` and `animation` properties.

### Demo Data
Add more cities to the `DEMO_DATA` object or modify existing weather data.

### Colors
Update the CSS custom properties or color values to match your preferred theme.

## 🎮 Usage

1. **Search**: Type a city name and press Enter or click Search
2. **Quick Cities**: Click any of the city buttons for instant weather
3. **Unit Toggle**: Click °C/°F to switch temperature units
4. **Scroll Forecasts**: Use horizontal scroll on forecast sections
5. **Demo Mode**: Works without API key - indicated by "DEMO MODE" badge

## 📄 License

This project is open source and available under the MIT License.
=======

>>>>>>> 105f0b87663334710cec03a94f678c2eb3c162bf
