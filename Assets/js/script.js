var APIKey = "347aa0d395e0253f2d8715eedad684cc";
var city = document.querySelector(".city");
var temp;
var windspeed;
var humidity;
var icon;
var currentDate;
var cityURL = `https://api.openweathermap.org/geo/1.0/direct?q=cityName&limit=5&appid=${APIKey}`;
var weatherURL = `https://api.openweathermap.org/data/2.5/weather?locationData&units=imperial&appid=${APIKey}`;
var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?locationData&units=imperial&appid=${APIKey}`;
var searchDiv = document.querySelector(".search-container");
var searchCity = document.querySelector(".search-city-button");
var search = document.querySelector(".search-button");

/*TODO: GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions 
for that city and that city is added to the search */
//localstorage.get
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
    retrieveWeatherData(select); //localStorage
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
  var weatherDisplay = document.querySelector(".weather-display-main");
  weatherDisplay.style.display = "flex";
  document.querySelector(
    "#weather-city"
  ).innerHTML = `${weatherInfo.name} <br> <em>${weatherInfo.main.temp}°F<em>`;
  document
    .querySelector("#weather-icon-image")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`
    );

  document.querySelector(
    "#weather-humidity"
  ).innerText = `Humdity: ${weatherInfo.main.humidity}%`;
  document.querySelector(
    "#weather-wind-speed"
  ).innerText = `Wind Speed: ${weatherInfo.wind.speed} mph`;
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
  // "2023-03-31 18:00:00"
  var forecastArr = [];
  for (let i = 0; i < forecastInfo.list.length; i++) {
    var forecastTime = parseInt(
      forecastInfo.list[i].dt_txt.split(" ")[1].slice(0, 3)
    );
    if (forecastTime === 12) {
      forecastArr.push(forecastInfo.list[i]);
    }
  }
  var forecastDisplay = document.querySelector(".five-day-forecast");
  forecastDisplay.style.display = "flex";
  //loop through forecastArr and render
  forecastArr.forEach((forecastIndex) => {
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");
    var forecastData = document.createElement("p");
    forecastData.innerHTML = `${forecastIndex.dt_txt.slice(0, 10)}<br>
    ${forecastIndex.main.temp}
   <img src ="http://openweathermap.org/img/w/${
     forecastIndex.weather[0].icon
   }.png"><br>
    Humidity: ${forecastIndex.main.humidity}<br>
    Wind Speed: ${forecastIndex.wind.speed}`;
    forecastCard.appendChild(forecastData);
    console.log(forecastIndex);
    forecastDisplay.appendChild(forecastCard);
  });
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
