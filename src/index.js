// Import of styles
import './css/styles.css';

// Import of a function that makes a query to the server for countries data
import {fetchCountries} from './js/fetchCountries';

// Import of lodash.debounce library
import {debounce} from 'lodash';

// Import of Notiflix library
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';

// Optimizing function (shortening the record) for searching for elements on the page
const qs = (selector) => document.querySelector(selector);

// Search for input and output elements
const searchBox = qs("#search-box");
const countryList = qs(".country-list");
const countryInfo = qs(".country-info");

const DEBOUNCE_DELAY = 300;

// Function call after entering a value into the field with an additional delay
searchBox.addEventListener("input", debounce(searchingBoxValue, DEBOUNCE_DELAY));

// Function that searches for the results of a query for a given country name
function searchingBoxValue() {
  fetchCountries(searchBox.value.trim())
    .then(countries => renderingResults(countries))
    .catch((error) => {
      if (searchBox.value !== "") {
        Notiflix.Notify.failure("Oops, there is no country with that name");
      }
      clearElements(countryList, countryInfo);
      console.log(`Error: ${error.message}`);
  });
};

// Function that renders the results of a query for countries
function renderingResults(countries) {
  if (countries.length > 10) {
    clearElements(countryList, countryInfo);
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");

  } else if (countries.length >= 2 && countries.length <= 10) {
    clearElements(countryList, countryInfo);
    const markups = countries
      .map(({name, flags}) => 
        `<li class="country-item">
          <img class="country-flag--mini" src="${flags.svg}" alt="The flag of ${name.common}">
          <p class="country-name">${name.common}</p>
        </li>`
      )
      .join("");
    countryList.innerHTML = markups;

  } else if (countries.length === 1) {
    clearElements(countryList, countryInfo);
    const markups = countries
      .map(({name, capital, population, flags, languages}) => 
        `<h2 class="country-info__name"><img class="country-flag--big" src="${flags.svg}" alt="The flag of ${name.common}">${name.common}</h2>
        <p class="country-info__item"><span class="country-info__label">Capital:</span> ${capital}</p>
        <p class="country-info__item"><span class="country-info__label">Population:</span> ${population}</p>
        <p class="country-info__item"><span class="country-info__label">Languages:</span> ${Object.values(languages).join(", ")}</p>`
      );
    countryInfo.innerHTML = markups;

  } else if (countries.length < 1) {
    clearElements(countryList, countryInfo);
  }
};

// A function that cleans up any output given as arguments
function clearElements(...outputs) {
  outputs.forEach(output => output.innerHTML = "");
};