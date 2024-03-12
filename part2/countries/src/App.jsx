import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const apiKey = import.meta.env.VITE_OPEN_WEATHER_KEY;
const KELVINS_TO_C = 273.15;

function Results({ filterResults, handleButton }) {
  if (filterResults.length > 10)
    return <p>Too many matches, specify another filter.</p>;
  else {
    const content = filterResults.map((result) => {
      return (
        <li key={result.cca2}>
          {result.name.common}
          <button data-cca2={result.cca2} onClick={handleButton}>
            show
          </button>
        </li>
      );
    });

    return <div>{content}</div>;
  }
}

function Country({ country, weather }) {
  if (!country) return null;

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages</h2>
      <ul>
        {Object.keys(country.languages).map((languageKey) => (
          <li key={languageKey}>{country.languages[languageKey]}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {weather && <Weather capital={country.capital} weather={weather} />}
    </>
  );
}

function Weather({ weather, capital }) {
  return (
    <>
      <h2>Weather in {capital}</h2>
      <p>
        temperature {(weather.main.temp - KELVINS_TO_C).toFixed(2)}° Celsius
      </p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </>
  );
}

function App() {
  const [filter, setFilter] = useState("");
  const [filterResults, setFilterResults] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  function fetchWeather(country) {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${country.capital},${country.cioc}&limit=1&appid=${apiKey}`,
      )
      .then((geoResponse) => {
        const geoData = geoResponse.data[0];
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${geoData.lat}&lon=${geoData.lon}&appid=${apiKey}`,
          )
          .then((weatherResponse) => {
            setWeather(weatherResponse.data);
          });
      });
  }

  function handleFilterChange(event) {
    const input = event.target.value;
    setFilter(input);

    const matches = input
      ? countries.filter((country) =>
          new RegExp(input, "i").test(country.name.common),
        )
      : [];

    if (matches.length === 1) {
      if (country === null || country !== matches[0]) {
        setCountry(matches[0]);
        fetchWeather(matches[0]);
      }
    } else {
      setFilterResults(matches);
      setCountry(null);
    }
  }

  function handleButtonClick(event) {
    const countryToDisplay = filterResults.filter(
      (country) => country.cca2 === event.target.dataset.cca2,
    )[0];

    setCountry(countryToDisplay);
    fetchWeather(countryToDisplay);
  }

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  return (
    <>
      find countries{" "}
      <input autoFocus value={filter} onChange={handleFilterChange} />
      {country ? (
        <Country country={country} weather={weather} />
      ) : (
        <Results
          filterResults={filterResults}
          handleButton={handleButtonClick}
        />
      )}
    </>
  );
}

export default App;
