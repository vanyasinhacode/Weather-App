import React, { useState, useEffect } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";

const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // Replace with your actual API key

const WeatherIcon = ({ condition }) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <WiDaySunny className="text-[#EEBF41] text-6xl" />; // Yellow
    case "clouds":
      return <WiCloudy className="text-[#B0C4DE] text-6xl" />; // LightSteelBlue
    case "rain":
      return <WiRain className="text-[#6FB2C6] text-6xl" />; // LightSkyBlue
    case "snow":
      return <WiSnow className="text-[#CFE2F3] text-6xl" />; // LightBlue
    case "thunderstorm":
      return <WiThunderstorm className="text-[#4D4D4D] text-6xl" />; // DimGray
    default:
      return <WiFog className="text-[#B0B0B0] text-6xl" />; // Gray
  }
};

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (searchCity, lat = null, lon = null) => {
    setLoading(true);
    setError(null);
    try {
      let url;
      if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=metric&appid=${API_KEY}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const currentWeather = data.list[0];
      const forecastMap = new Map();

      for (const item of data.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        });
        if (!forecastMap.has(date)) {
          forecastMap.set(date, {
            temp: Math.round(item.main.temp),
            icon: item.weather[0].main,
          });
        }
      }

      const forecast = Array.from(forecastMap.entries())
        .slice(1, 6)
        .map(([day, { temp, icon }]) => ({
          day,
          temp,
          icon,
        }));
      setWeather({
        current: {
          city: data.city.name,
          temperature: Math.round(currentWeather.main.temp),
          condition: currentWeather.weather[0].main,
          humidity: currentWeather.main.humidity,
          windSpeed: Math.round(currentWeather.wind.speed * 3.6),
          icon: currentWeather.weather[0].main,
        },
        forecast,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) fetchWeather(city);
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchWeather(null, lat, lon);
        },
        (error) => {
          setError("Error getting location. Please try entering a city name.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  useEffect(() => {
    fetchWeather("New York");
  }, []);

  const showAlert = () => {
    alert("Hey! this is Vanya Sinha.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#005986] to-[#f9f9f9]">
      <div className="bg-gradient-to-br from-([#00986] to-[#f9f9f9],gba(0,0,0,0.2) )rounded-lg shadow-xl p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#e5e7eb]">
          Weather App
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#9D50BB]"
          />
          <button
            type="submit"
            className=" bg-[#3B8AA7] font-bold text-white p-2  ) px-4 py-2 rounded-lg hover:bg-[#7683CE] transition duration-300"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleGeolocation}
            className="bg-[#0C4674] text-white px-4 py-2 rounded-lg hover:bg-[#303F9F] transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>

        {loading && <div className="text-center text-[#808080]">Loading...</div>}
        {error && <div className="text-center text-[#FF0000]">{error}</div>}
        {weather && !loading && !error && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-[#0C4674]">
                {weather.current.city}
              </h2>
              <div className="flex items-center justify-center mt-2">
                <WeatherIcon condition={weather.current.icon} />
                <span className="text-5xl ml-4 text-[#0C4674]">
                  {weather.current.temperature}°C
                </span>
              </div>
              <p className="text-xl mt-2 text-[]">
                {weather.current.condition}
              </p>
              <div className="flex justify-center gap-4 mt-2 text-[#0C4674]">
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Wind: {weather.current.windSpeed} km/h</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-[#294A53]">
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {weather.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="text-center bg-[#eeeee4] rounded-lg p-2"
                  >
                    <p className="font-semibold text-[#0C4674]">{day.day}</p>
                    <WeatherIcon condition={day.icon} />
                    <p className="text-[#4B0082]">{day.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <a href="https://vanyasinha.com/"><button
        
        className="mt-4 bg-[#3B8AA7] font-bold text-white p-2 rounded shadow-lg hover:bg-[#7683CE] transition duration-300"
      >
        My portfolio
      </button></a>
    </div>
  );
}
