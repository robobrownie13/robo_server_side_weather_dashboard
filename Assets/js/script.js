var APIKey = "347aa0d395e0253f2d8715eedad684cc";
var city = document.querySelector(".city");
var temp;
var windspeed;
var humidity;
var icon;
var currentDate;
var cityURL = `http://api.openweathermap.org/geo/1.0/direct?q=cityName&limit=5&appid=${APIKey}`;
var weatherURL = `https://api.openweathermap.org/data/2.5/weather?locationData&appid=${APIKey}`;
var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?locationData&appid=${APIKey}`;
var searchDiv = document.querySelector(".search-container");
var searchCity = document.querySelector(".search-city-button");
var search = document.querySelector(".search-button");

/*TODO: GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions 
for that city and that city is added to the search */

searchCity.addEventListener("click", retrieveData);
function retrieveData() {
  if (!city.value) {
    return;
  }
  fetch(cityURL.replace("cityName", city.value))
    .then((response) => response.json())
    .then((data) => {
      displayCityList(data);
    });
}
function displayCityList(cityOptions) {
  var newForm = document.createElement("form");
  searchDiv.appendChild(newForm);

  var label = document.createElement("label");
  label.setAttribute("for", "cityOptions");
  label.innerText = "Choose Correct City:  ";
  newForm.appendChild(label);

  var select = document.createElement("select");
  Object.assign(select, {
    id: "cityDropdown",
    name: "cityDropdown",
    class: "cityDropdown",
  });
  newForm.appendChild(select);

  for (var i = 0; i < 5; i++) {
    var option = document.createElement("option");
    option.innerText = `${cityOptions[i].name}, ${cityOptions[i].state}, ${cityOptions[i].country}`;
    option.setAttribute(
      "value",
      `lat=${cityOptions[i].lat}&lon=${cityOptions[i].lon}`
    );
    select.appendChild(option);
  }
  newForm.appendChild(search);
  search.style.display = "block";
  newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    retrieveWeatherData(select);
    retrieveForecastData(select);
  });
}

function retrieveWeatherData(select) {
  fetch(weatherURL.replace("locationData", select.value))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeather(data);
    });
}

function displayWeather(weatherInfo) {
  console.log(
    weatherInfo.name,
    weatherInfo.main.temp,
    weatherInfo.main.humidity,
    weatherInfo.wind.speed,
    weatherInfo.weather[0].icon
  );
}

function retrieveForecastData(select) {
  fetch(forecastURL.replace("locationData", select.value))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayForecast(data);
    });
}

function displayForecast(forecastInfo) {
  console.log(
    forecastInfo.city.name,
    forecastInfo.list[3].main.temp,
    forecastInfo.list[3].main.humidity,
    forecastInfo.list[3].wind.speed,
    forecastInfo.list[3].weather[0].icon
  );
}

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date,
// an icon representation of weather conditions, the temperature, the humidity, and the the wind speed

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays
// the date, an icon representation of weather conditions,
// the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions
// for that city
