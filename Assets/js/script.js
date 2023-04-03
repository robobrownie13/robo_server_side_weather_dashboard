var APIKey = "347aa0d395e0253f2d8715eedad684cc";
var city = document.querySelector(".city");
var cityURL = `https://api.openweathermap.org/geo/1.0/direct?q=cityName&limit=5&appid=${APIKey}`;
var weatherURL = `https://api.openweathermap.org/data/2.5/weather?locationData&units=imperial&appid=${APIKey}`;
var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?locationData&units=imperial&appid=${APIKey}`;
var searchDiv = document.querySelector(".search-container");
var quickDisplay = document.querySelector(".quick-display");
var searchCity = document.querySelector(".search-city-button");
var search = document.querySelector(".search-button");
var forecastDisplay = document.querySelector(".five-day-forecast");
var searchHistory;
/*TODO: GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions 
for that city and that city is added to the search */
forecastDisplay.innerHTML = "";
if (localStorage.getItem("searchHistory")) {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
} else {
  searchHistory = [];
}

searchHistory.forEach((historyIndex) => {
  var quickSearch = document.createElement("button");
  quickSearch.innerText = historyIndex.name;
  quickSearch.addEventListener("click", (e) => {
    e.preventDefault();
    forecastDisplay.innerHTML = "";
    retrieveWeatherData(historyIndex);
    retrieveForecastData(historyIndex);
  });
  quickDisplay.appendChild(quickSearch);
});
searchCity.addEventListener("click", retrieveData);
function retrieveData() {
  if (!city.value) {
    return;
  }
  fetch(cityURL.replace("cityName", city.value))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
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
    var cityButton = e.target.children[1].children[0].textContent.split(",")[0];
    e.preventDefault();
    forecastDisplay.innerHTML = "";
    searchHistory.push({
      name: cityButton,
      value: select.value,
    });
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    retrieveWeatherData(select);
    retrieveForecastData(select);
  });
}

function retrieveWeatherData(select) {
  console.log(select.value);
  fetch(weatherURL.replace("locationData", select.value))
    .then((response) => response.json())
    .then((data) => {
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

  forecastDisplay.style.display = "flex";
  //loop through forecastArr and render
  forecastArr.forEach((forecastIndex) => {
    var forecastCard = document.createElement("div");
    forecastCard.classList.add("forecast-card");
    var dateTitle = document.createElement("h4");
    dateTitle.innerText = `${forecastIndex.dt_txt.slice(0, 10)}`;
    var forecastData = document.createElement("p");
    forecastData.innerHTML = `${forecastIndex.main.temp}°F
   <img src ="http://openweathermap.org/img/w/${forecastIndex.weather[0].icon}.png"><br>
    Humidity: ${forecastIndex.main.humidity}%<br>
    Wind Speed: ${forecastIndex.wind.speed} mph`;
    forecastCard.appendChild(dateTitle);
    forecastCard.appendChild(forecastData);
    console.log(forecastIndex);
    forecastDisplay.appendChild(forecastCard);
  });
}
