import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import Today from './Today';
import Footer from './Footer';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchWeatherByCity = async (city) => {
    try {
      // Fetch current weather
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
      );
      setWeatherData(response.data);

      // Fetch forecast data
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
      // Fetch current weather using coordinates
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
      );
      setWeatherData(response.data);

      // Fetch forecast data using coordinates
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Extract latitude and longitude from the position object
          const { latitude, longitude } = position.coords;
          // Fetch weather data based on coordinates
          fetchWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
    }
    // eslint-disable-next-line
  }, []);

  const handleSearchSubmit = (city) => {
    // Fetch weather data based on the searched city
    fetchWeatherByCity(city);
  };

  return (
    <div>
      <Search onSearch={handleSearchSubmit} />

      {weatherData && forecastData && (
        <Today weatherData={weatherData} forecastData={forecastData} />
      )}
      <Footer />

    </div>
  );
};

export default Weather;
