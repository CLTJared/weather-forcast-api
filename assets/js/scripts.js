/*  API Key: 9b3845b57607784634ed605cf72e7f06
    5-Day Forcast: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9b3845b57607784634ed605cf72e7f06
    Ex: https://api.openweathermap.org/data/2.5/forecast?lat=35.1149&lon=-80.705&appid=9b3845b57607784634ed605cf72e7f06
    Ex2: https://pro.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&appid=9b3845b57607784634ed605cf72e7f06
        {
        "cod": "200",
        "message": 0,
        "cnt": 40,
        "list": [
            {
                "dt": 1704250800,
                "main": {
        ----- snipped output -----
    
    ZipCode: http://api.openweathermap.org/geo/1.0/zip?zip={zip},{countrycode}&appid=9b3845b57607784634ed605cf72e7f06
    Ex: http://api.openweathermap.org/geo/1.0/zip?zip=28105,US&appid=9b3845b57607784634ed605cf72e7f06
        {
            "zip": "28105",
            "name": "Mecklenburg County",
            "lat": 35.1149,
            "lon": -80.705,
            "country": "US"
        }

    City Name: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    Ex: http://api.openweathermap.org/geo/1.0/direct?q=Charlotte,NC,US&limit=1&appid=9b3845b57607784634ed605cf72e7f06
        {
            "name": "Charlotte",
            "local_names": {
                "ar": "شارلت",
                "ur": "شارلٹ",
                "ru": "Шарлотт",
                "uk": "Шарлотт",
                "en": "Charlotte",
                "fa": "شارلوت",
                "mk": "Шарлот"
            },
            "lat": 35.2272086,
            "lon": -80.8430827,
            "country": "US",
            "state": "North Carolina"
        }
*/

// Define defaults for latitude and longitude
let locLat = 35.1149;
let locLon = -80.705;
const apiKey = '&appid=9b3845b57607784634ed605cf72e7f06'
const apiWeather = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q='
const apiForecast = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&q='

// Define document elements
const areaForecast = document.getElementById('weather-forecast');
const submitLookup = document.getElementById('city-form');
const areaCurrent = document.getElementById('weather-current');
const areaHistory = document.getElementById('search-history');

// Set variable for project name for read/write functions
const projectName = 'weather-forecast';

// gets the forecast of a specific location
function getForecast(userSearch, history) {
    if (!userSearch) { console.log('getForecast:', 'No lat or long'); return; }

    fetch(apiForecast + userSearch + apiKey)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetch Data:', data);
      
        if(!data) { return 0; } //Data sanity check
        
        let weatherList = data.list;
        if(history != false) { historyCreate(userSearch); }

        let weatherInfo;
        areaForecast.innerHTML = '';
        weatherList.forEach(element => { //Loops through all of the elements in data.list
            let timeCheck = element.dt_txt;

            if(timeCheck.includes("12:00:00")) { //Gets the values that are at noon/12:00:00

                weatherIcon = 'https://openweathermap.org/img/wn/' + element.weather[0].icon + "@2x.png";

                // Creates object holding the weather information to loop through
                let weatherData = {
                    header: dayjs(element.dt_txt).format('MM-DD-YYYY'),
                    icon: weatherIcon,
                    temp: 'Temp: ' + element.main.temp + ' °F',
                    wind: 'Wind: ' + element.wind.speed + ' MPH',
                    humidity: 'Humidity: ' + element.main.humidity + '%'
                };
                    
                let divElement = document.createElement('div')
                // Loops through weatherData object
                for (const key in weatherData) {
                    let pElement = document.createElement('p');
                    let imgElement = document.createElement('img');
                    let currData = `${weatherData[key]}`;

                    // Checks if the data has https, indicating we need to make it an img, otherwise make it a p
                    if (currData.includes("https")) {
                        imgElement.setAttribute("src", currData);
                        divElement.appendChild(imgElement);
                    } else {
                        pElement.textContent = currData;
                        divElement.appendChild(pElement);
                    }
                    
                }
                areaForecast.appendChild(divElement);
            }
        })
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      return error;
    });

    return;
}

// gets the current weather information for searched location
function getCurrent(userSearch) {
    if (!userSearch) { console.log('getForecast:', 'No lat or long'); return; }

    fetch(apiWeather + userSearch + apiKey)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Current Weather:', data);
      
        if(!data) { return 0; }
        // Fun with Data
        let weatherIcon = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + "@2x.png";
       
        let weatherData = {
            header: data.name + " | " + dayjs().format('MM-DD-YYYY'),
            icon: weatherIcon,
            temp: 'Temp: ' + data.main.temp + ' °F',
            wind: 'Wind: ' + data.wind.speed + ' MPH',
            humidity: 'Humidity: ' + data.main.humidity + '%'
        };

        areaCurrent.innerHTML = '';
        for (const key in weatherData) {
            let pElement = document.createElement('p');
            let imgElement = document.createElement('img');
            let currData = `${weatherData[key]}`; // Current array value/data

            // Checks if the data has https, indicating we need to make it an img, otherwise make it a p
            if (currData.includes("https")) {
                imgElement.setAttribute("src", currData);
                areaCurrent.appendChild(imgElement);
                areaCurrent.setAttribute('class', 'current');
            } else {
                pElement.textContent = currData;
                areaCurrent.appendChild(pElement);
                areaCurrent.setAttribute('class', 'current');
            }
            
        }

    })
    .catch(error => {
      console.error('Fetch Error:', error);
      return error;
    });

    return;
}

// calls the getForcast & getCurrent after making sure form doesn't reset page & resets form elements
function getWeatherData(event) {
    // Prevent form from refreshing the page
    event.preventDefault();
    console.log('Testing:', event.value)
    let search = event.srcElement[0].value;

    getForecast(search);
    getCurrent(search);

    submitLookup.reset(); // resets form elements to blank/default
}

// Called when clicking a history button search so that it does not double log
function getHistoryData(search) {
    getForecast(search, false); // false flag tells it to not write to local storage
    getCurrent(search);
}

// Creates the history buttons after a search, called in getForecast
function historyCreate(search, write) {
    const historyButton = document.createElement('button');
    historyButton.innerHTML = search;
    historyButton.setAttribute('class', 'full');
    historyButton.setAttribute('datatype', 'past-search');
    historyButton.setAttribute('value', search);
    historyButton.setAttribute('name', 'past')
    historyButton.setAttribute('onClick', 'getHistoryData("'+search+'")');
    areaHistory.appendChild(historyButton);

    //create object to write to local storage key
    if(write != false) {
        searchWrite = { city: search };
        writeLocalStorage(projectName, searchWrite);
    }
}

// Function for reading local storage
function readLocalStorage(key) {
    //Function to read the local storage with passed object name
    let tempStorage = JSON.parse(localStorage.getItem(key));
    //Debug testing for if it's an object/array
    console.log("readLocalStorage | Not an Object: " + !tempStorage);

    if(!tempStorage) { tempStorage = []; localStorage.setItem(key, JSON.stringify(tempStorage)); } 
    console.log("readLocalStorage | " + JSON.stringify(tempStorage));
    //Function returns the local storage object
    return tempStorage;
}

// Function for writing to local storage
function writeLocalStorage(key, toStoreAsObject) {
    //Function to write to LocalStorage
    var currObject = readLocalStorage(key);

    if(typeof toStoreAsObject !== 'object') { console.log("writeLocalStorage: Invalid type submitted."); return }
    currObject.push(toStoreAsObject)

    console.log('writeLocalStorage | ' + toStoreAsObject);
    console.log('writeLocalStorage | ' + JSON.stringify(toStoreAsObject));

    localStorage.setItem(key, JSON.stringify(currObject))
}

// Function to load history objects on page load
function loadHistory() {
    const cityHistory = readLocalStorage(projectName);

    areaHistory.innerHTML = '';
    cityHistory.forEach(element => {
        historyCreate(element.city, false);
    });
}

// Event listener for submit button
submitLookup.addEventListener("submit", getWeatherData);

// Loads the history on page load from local storage
loadHistory();