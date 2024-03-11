import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function Content({ results }) {
  let content;
  if (results.length > 10)
    content = "Too many matches, specify another filter.";
  else if (results.length === 1) content = <Country country={results[0]} />;
  else
    content = results.map((result) => (
      <li key={result.cca2}>{result.name.common}</li>
    ));

  return <div>{content}</div>;
}

function Country({ country }) {
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
    </>
  );
}

function App() {
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState([]);
  const [countries, setCountries] = useState([]);

  function handleFilterChange(event) {
    const input = event.target.value;
    setFilter(input);

    const matches = input
      ? countries.filter((country) =>
          new RegExp(input, "i").test(country.name.common),
        )
      : [];

    setResults(matches);
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
      find countries <input value={filter} onChange={handleFilterChange} />
      <Content results={results} />
    </>
  );
}

export default App;
