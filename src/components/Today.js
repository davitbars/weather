import React, { useRef, useEffect, useState } from 'react';
import '../styles/Today.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudShowersHeavy, faTemperatureThreeQuarters, faDroplet, faTemperatureHigh, faTemperatureLow, faChevronLeft, faChevronRight, faArrowsToCircle, faWind, faCloudSunRain, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Today = ({ weatherData, forecastData }) => {
    const weatherCondition = weatherData.weather[0].id;

    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleDetails = (index) => {
        setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const getBackgroundImage = () => {
        const conditionToImage = {
            800: 'clearsky.jpg',
            8: 'clouds.jpg',
            5: 'rain.jpg',
            2: 'thunderstorm.png',
            6: 'snowing.jpg',
            7: 'mist.jpg',
        };

        const specificImageName = conditionToImage[weatherCondition];
        const categoryImageName = conditionToImage[Math.floor(weatherCondition / 100)];
        const imageName = specificImageName || categoryImageName;

        return require(`../imgs/${imageName}`);
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();

    const groupByDay = forecastData.list.reduce((acc, data) => {
        const date = new Date(data.dt * 1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(data);
        return acc;
    }, {});

    const dailyForecast = Object.values(groupByDay).map(dayData => {
        const maxTemp = Math.max(...dayData.map(entry => entry.main.temp_max));
        const minTemp = Math.min(...dayData.map(entry => entry.main.temp_min));

        // Get the first weather icon for the day
        const firstWeatherIcon = dayData[0].weather[0].icon;

        return {
            dt: dayData[0].dt,
            main: {
                temp_max: maxTemp,
                temp_min: minTemp,
            },
            weather: [{
                icon: firstWeatherIcon,
            }],
        };
    });



    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft -= 100;
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += 100;
        }
    };

    useEffect(() => {
        // Get the current time in milliseconds
        const currentTimeMillis = new Date().getTime();

        // Convert milliseconds to seconds (Unix timestamp)
        const currentTimeUnix = Math.floor(currentTimeMillis / 1000);

        // Get the sunrise and sunset times
        const sunriseTimeInSeconds = weatherData.sys.sunrise;
        const sunsetTimeInSeconds = weatherData.sys.sunset;

        // Calculate the position of the marker
        const statusBar = document.getElementById('statusBar');
        const currentTimeMarker = document.getElementById('currentTimeMarker');

        if (statusBar) {
            const statusBarWidth = statusBar.offsetWidth;
            const totalDuration = sunsetTimeInSeconds - sunriseTimeInSeconds;
            const elapsedTime = currentTimeUnix - sunriseTimeInSeconds;

            // Ensure the marker position is within the bounds of the status bar
            const markerPosition = Math.max(0, Math.min(statusBarWidth, (elapsedTime / totalDuration) * statusBarWidth));

            // Set the left position of the marker
            currentTimeMarker.style.left = `${markerPosition}px`;
        }

    }, [weatherData]);

    const todayForecasts = forecastData.list.filter(item => {
        const today = new Date().toLocaleDateString();
        const forecastDate = new Date(item.dt * 1000).toLocaleDateString();
        return today === forecastDate;
    });


    console.log(todayForecasts)
    return (
        <div>
            <div
                className="weather-container"
                style={{
                    backgroundImage: `url(${getBackgroundImage()})`,
                }}
            >
                <div className="info-container">
                    <div className="location-info">
                        <h2>{`${weatherData.name}, ${weatherData.sys.country}`}</h2>

                        <p className='small-text'>{`As of: ${formattedDate} local time`}</p>

                    </div>

                    <div className="stats">
                        <div className="stat">
                            <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
                            <p>{`Temperature: ${Math.round(weatherData.main.temp)}°F`}</p>
                        </div>
                        <div className="stat">
                            <FontAwesomeIcon icon={faCloudShowersHeavy} />
                            <p>{`Precipitation: ${weatherData.rain ? weatherData.rain['1h'] || 0 : 0} mm`}</p>
                        </div>
                        <div className="stat">
                            <FontAwesomeIcon icon={faDroplet} />
                            <p>{`Humidity: ${weatherData.main.humidity}%`}</p>
                        </div>
                    </div>
                </div>

                <div className="today-data-container">
                    <h2 className='section-title'>Weather Data</h2>

                    <div className='slider'>
                        <p className='sun'>{`Sunrise: ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}</p>
                        <div className='status-bar' id='statusBar'>
                            <div className='current-time-marker' id='currentTimeMarker'></div>
                        </div>
                        <p className='sun'>{`Sunset: ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`}</p>
                    </div>

                    <div className='data-table'>
                        <div className="column">
                            <p><FontAwesomeIcon icon={faTemperatureThreeQuarters} />  {`Temperature: ${weatherData.main.temp}°F`}</p>
                            <p><FontAwesomeIcon icon={faTemperatureThreeQuarters} />  {`Feels Like: ${weatherData.main.feels_like}°F`}</p>
                            <p><FontAwesomeIcon icon={faDroplet} />  {`Humidity: ${weatherData.main.humidity}%`}</p>
                            <p><FontAwesomeIcon icon={faArrowsToCircle} />  {`Pressure: ${weatherData.main.pressure} hPa`}</p>
                        </div>
                        <div className="column">
                            <p><FontAwesomeIcon icon={faTemperatureHigh} />  {`Max Temperature: ${weatherData.main.temp_max}°F`}</p>
                            <p><FontAwesomeIcon icon={faTemperatureLow} />  {`Min Temperature: ${weatherData.main.temp_min}°F`}</p>
                            <p><FontAwesomeIcon icon={faCloudSunRain} />  {`Weather: ${weatherData.weather[0].description}`}</p>
                            <p><FontAwesomeIcon icon={faWind} />  {`Wind Speed: ${weatherData.wind.speed} mph, Wind Direction: ${weatherData.wind.deg}°`}</p>
                        </div>
                    </div>

                </div>
                <div className="hourly-forecast-container">
                    <h2 className='section-title'>3 Hour Forecasts</h2>
                    {forecastData && (
                        <div className="hourly-forecast-container-secondary">
                            {todayForecasts.length > 3 && (
                                <div className="scroll-button left" onClick={scrollLeft}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </div>
                            )}
                            <div className="hourly-forecast" ref={scrollContainerRef}>
                                {todayForecasts.map((item) => (
                                    <div className="forecast-item" key={item.dt}>
                                        <div className='weather-condition detail'>{item.weather[0].main}</div>
                                        <div className="icon">
                                            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather Icon" className='weather-icon' />
                                        </div>
                                        <div className="temperature detail">{`${Math.round(item.main.temp)}°F`}</div>
                                        <div className="time detail">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
                                    </div>
                                ))}
                            </div>
                            {todayForecasts.length > 3 && (
                                <div className="scroll-button right" onClick={scrollRight}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            )}
                        </div>
                    )}
                </div>


                <div className="dropdown-container">
                    <h2 className='section-title'>7-Day Forecast</h2>
                    {Object.entries(groupByDay).map(([date, dayData], index) => (
                        new Date(dayData[0].dt * 1000).toLocaleDateString() !== new Date().toLocaleDateString() && (
                            <div key={index} className="dropdown">
                                <div className="dropdown-header" onClick={() => toggleDetails(index)}>
                                    <div className="left-column">
                                        <p className='date'>{`${new Date(dayData[0].dt * 1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}`}</p>
                                        <p>{`${new Date(dayData[0].dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}`}</p>
                                    </div>
                                    <div className="right-column">
                                        <p className='high-low'>{`${Math.round(dailyForecast[index].main.temp_min)}°F - ${Math.round(dailyForecast[index].main.temp_max)}°F`}</p>
                                        <div className='toggle-button'>
                                            <FontAwesomeIcon icon={expandedIndex === index ? faChevronUp : faChevronDown} />
                                        </div>
                                    </div>
                                </div>
                                {expandedIndex === index && (
                                    <div className="dropdown-details">
                                        {dayData.length > 0 ? (
                                            <div className="hourly-forecast-container future-days">
                                                {dayData.length > 3 && (
                                                    <div className="scroll-button left" onClick={scrollLeft}>
                                                        <FontAwesomeIcon icon={faChevronLeft} />
                                                    </div>
                                                )}
                                                <div className="hourly-forecast" ref={scrollContainerRef}>
                                                    {dayData.map((item) => (
                                                        <div className="forecast-item" key={item.dt}>
                                                            <div className='weather-condition detail'>{item.weather[0].main}</div>
                                                            <div className="icon detail">
                                                                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="Weather Icon" />
                                                            </div>
                                                            <div className="temperature detail">{`${Math.round(item.main.temp)}°F`}</div>
                                                            <div className="time detail">{new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {dayData.length > 3 && (
                                                    <div className="scroll-button right" onClick={scrollRight}>
                                                        <FontAwesomeIcon icon={faChevronRight} />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p>No forecast data available for this day.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Today;
