function createPage() {
  const cityEl = document.getElementById("search-city");
  const searchEl = document.getElementById("button");
  const clearEl = document.getElementById("clear");
  const nameEl = document.getElementById("city-name");
  const currentWeatherPicEl = document.getElementById("current-pic");
  const currentTempEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  const currentWindEl = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  var fivedayEl = document.getElementById("fiveday-header");
  var currentweatherEl = document.getElementById("today-weather");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  const key = '5820b2c82e04ea91898eaa23467e38c3';
  

  function getCurrentWeather (city) {
    let searchURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key;

    fetch(searchURL).then(function (response) {
        const currentDate = new Date(response.data.dt * 1000);
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();
        nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
        let weatherPic = response.data.weather[0].icon;
        currentWeatherPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
        currentTempEl.innerHTML = "Temp: " + kToF(response.data.main.temp) + "F";
        currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
        currentWindEl.innerHTML = "Wind :" + response.data.wind.speed + " mph";

        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        let uvSearchURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + key + "&cnt=1";
        fetch(uvSearchURL).then(function (response) {
            let uvIndex = document.createElement("span");

            if (response.data[0].value < 4) {
              uvIndex.setAttribute('class', 'badge badge-success');
            } else if (response.data[0].value < 8) {
              uvIndex.setAttribute('class', 'badge badge-warning');
            } else {
              uvIndex.setAttribute('class', 'badge badge-danger');
            }

            uvIndex.innerHTML = response.data[0].value;
            currentUVEl.innerHTML = "UV Index: ";
            currentUVEl.append(uvIndex);
        });
        
        let cityID = response.data.id;
        let forecastSearchURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + key;
          fetch(forecastSearchURL).then(function (response) {
              fivedayEl.classList.remove("d-none");
              
              const forecastEls = document.querySelectorAll(".forecast");
              for (i = 0; i < forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                const forecastIndex = i * 8 + 4;
                const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "m-3 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);

                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + kToF(response.data.list[forecastIndex].main.temp) + " F";
                forecastEls[i].append(forecastTempEl);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);
              }
          });
    });
  }



  searchEl.addEventListener("click", function() {
    const searchCity = cityEl.value;
    getCurrentWeather(searchCity);
    searchHistory.push(searchCity);
    localStorage.setItem('search', JSON.stringify(searchHistory));
    showHistory();
  })

  clearEl.addEventListener('click', function() {
    localStorage.clear();
    searchHistory = [];
    showHistory();
  })

  function kToF(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
  }

    function showHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
      const historyCity = document.createElement('input');
      historyCity.setAttribute('type', 'text');
      historyCity.setAttribute('readonly', true);
      historyCity.setAttribute('class', 'form-style');
      historyCity.addEventListener('click', function() {
        getCurrentWeather(historyCity.value);
      })
      historyEl.append(historyCity);
    }
  }

  showHistory();
  if (searchHistory.length > 0) {
    getCurrentWeather(searchHistory[searchHistory.length - 1]);
  }

}

createPage();