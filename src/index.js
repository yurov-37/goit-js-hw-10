import './css/styles.css';
import { fetchCountries } from './js-components/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const oneCountryContainer = document.querySelector('.country-info');
const countriesList = document.querySelector('.country-list');

searchBox.addEventListener(
  'input',
  debounce(() => {
    onFormInput();
  }, DEBOUNCE_DELAY)
);

function onFormInput() {
  console.log(searchBox.value);
  const inputData = searchBox.value.trim();
  if (inputData === '') {
    clearMarkup();
    return;
  }

  fetchCountries(inputData)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearMarkup();
        return;
      }
      if (data.length <= 10) {
        console.log(data);
        countriesList.innerHTML = createCountriesListMarkup(data);
        oneCountryContainer.innerHTML = '';
      }
      if (data.length === 1) {
        console.log(data);
        oneCountryContainer.innerHTML = renderOneCountry(data);
        countriesList.innerHTML = '';
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearMarkup();
      return err;
    });
}

function renderOneCountry(country) {
  return country
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="country-info__head">
  <img class="country-info__img" src="${flags.svg}" alt="${
        name.official
      }" width="80"  />
  <h1 class="country-info__title">${name.official}</h1>
</div>

<ul class="country-info__list">
  <li class="country-info__list-item"><p class="country-info__list-text">Capital:</p>${capital}</li>
  <li class="country-info__list-item"><p class="country-info__list-text">Population:</p>${population}</li>
  <li class="country-info__list-item"><p class="country-info__list-text">Languages:</p>${Object.values(
    languages
  )}</li>
</ul>`;
    })
    .join('');
}

function createCountriesListMarkup(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
  <img class="country-list__img" src="${flags.svg}" alt="${name.official}" width="50"  />
  <p class="country-list__title">${name.official}</p>
</li>`;
    })
    .join('');
}

function clearMarkup() {
  countriesList.innerHTML = '';
  oneCountryContainer.innerHTML = '';
}
