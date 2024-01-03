/*  API Key: 9b3845b57607784634ed605cf72e7f06
    5-Day Forcast: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=9b3845b57607784634ed605cf72e7f06
    Ex: https://api.openweathermap.org/data/2.5/forecast?lat=35.1149&lon=-80.705&appid=9b3845b57607784634ed605cf72e7f06
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

// Define document elements
const areaForecast = document.getElementById('weather-forecast');

// Make a GET request using fetch
function getForecast(lat, lon) {
    const apiForcast = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=9b3845b57607784634ed605cf72e7f06';

    fetch(apiForcast)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetch Data:', data);
      

      // Fun with Data
            let pElement = document.createElement('p');
            let weatherList = data.list;

            console.log(weatherList);

            weatherList.forEach(element => {
                pElement.textContent = element.main.feels_like;
                pElement.setAttribute('name','location')
                areaForecast.appendChild(pElement);
            })

    })
    .catch(error => {
      console.error('Fetch Error:', error);
      return error;
    });

    return;
}

getForecast(locLat, locLon);