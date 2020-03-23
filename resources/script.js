// IDs of html:
// titleBar
// city-input - used
// submit-btn - used
// clear-btn - used
// city-list - used
// db-location
// db-temp
// db-humidity
// db-wind
// db-uv
// 5day-1
// 5day-2
// 5day-3
// 5day-4
// 5day-5

// classes of html:
// searched-city

var lsKey = "city-list"
var cityList = [];

var apiKey = "aac6f7e9b00a366d117a449f1b8be6f8";
var cityQueryURL = "http://api.openweathermap.org/data/2.5/weather?appid=" + apiKey;
var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey;
var fiveDayQueryURL = "http://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;

function refreshCityList() {
    //     retrieve city list from local storage
    cityList = JSON.parse(localStorage.getItem(lsKey)) || [];

    //     dynamically create city list on screen
    var cityListEl = $("#city-list");
    cityListEl.empty();

    for (let i = 0; i < cityList.length; i++) {
        // for each city in the list...
        const city = cityList[i];

        // create a new city element with placeholder link
        var newCityEl = $("<a>");
        newCityEl.attr("href", "#");
        newCityEl.addClass("list-group-item list-group-item-action searched-city");
        newCityEl.text(city);

        // and add new city element to the list div
        cityListEl.append(newCityEl);
    }
}

function makeAPICalls(cityName) {
    // First API call
    //     Use city as parameter to API search for most of basic info: &q=Hell
    cityQueryURL += "&q=" + cityName;
    $.ajax({
        url: cityQueryURL,
        method: "GET"
    }).then(function(conditionsResponse){
        console.log(conditionsResponse);
        displayCurrentConditions();

        // Second API call
        //     pull long/lat to use in next API call
        //     Use long/lat of response to API search for uv index: &lat=47.93&lon=-122.68
        var latitude = 47.93;
        var longitude = -122.68;
        uvQueryURL += "&lat=" + latitude + "&lon=" + longitude;
        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function(uvResponse){
            console.log(uvResponse);
            displayUVIndex();
        })

        // Third API call
        //     Use city as parameter to API search for 5 day forecast: &q=Port Ludlow
        fiveDayQueryURL += "&q=" + cityName;
        $.ajax({
            url: fiveDayQueryURL,
            method: "GET"
        }).then(function(fiveDayResponse){
            console.log(fiveDayResponse);
            display5DayForecast();
        })
    });

    // update cityName so it is properly capitalized
    // cityName = cityNameFromResponse;
    saveSearchParameter(cityName);
}

function displayCurrentConditions() {
    // First API call
    //     display date
    //     display city name
    //     display appropriate icon for current conditions
    //         cloudy rainy snow sunshine partly-cloudy
    //     pull temp, humidity and wind speed for display
}

function displayUVIndex() {
    // Second API call
    //     pull uv index for display
    // {
    //     "lat": 47.93,
    //     "lon": -122.68,
    //     "date_iso": "2020-03-20T12:00:00Z",
    //     "date": 1584705600,
    //     "value": 3.79
    // }
    //     change class(?) on display item according to index color schema (1&2, 3&4, 5&6, 7&8, 9&10 ???)
}

function display5DayForecast() {
    // Third API call
    //     response has data for every 3 hours, using noon times for each day of extended forecast, filter out 5 pertinent records from response
    //     pull temp and humidity for display
    // {
    //     "cod": "200",
    //     "message": 0,
    //     "cnt": 40,
    //     "list": [
    //         {
    //             "dt": 1584748800,
    //             "main": {
    //                 "temp": 287.52,
    //                 "feels_like": 285.05,
    //                 "temp_min": 283.82,
    //                 "temp_max": 287.52,
    //                 "pressure": 1023,
    //                 "sea_level": 1023,
    //                 "grnd_level": 1020,
    //                 "humidity": 68,
    //                 "temp_kf": 3.7
    //             },
    //             "weather": [
    //                 {
    //                     "id": 800,
    //                     "main": "Clear",
    //                     "description": "clear sky",
    //                     "icon": "01d"
    //                 }
    //             ],
    //             "clouds": {
    //                 "all": 0
    //             },
    //             "wind": {
    //                 "speed": 3.05,
    //                 "deg": 333
    //             },
    //             "sys": {
    //                 "pod": "d"
    //             },
    //             "dt_txt": "2020-03-21 00:00:00"
    //         },
    //     ],
    //     "city": {
    //         "id": 5807228,
    //         "name": "Port Ludlow",
    //         "coord": {
    //             "lat": 47.9254,
    //             "lon": -122.6835
    //         },
    //         "country": "US",
    //         "population": 2603,
    //         "timezone": -25200,
    //         "sunrise": 1584713540,
    //         "sunset": 1584757418
    //     }    
    //     dynamically build list-group item and populate with above data, plus condition appropriate icon
}

function saveSearchParameter(cityName) {
    // When display is built
    //     Add city to city list object and save to local Storage
    cityList.push(cityName);
    localStorage.setItem(lsKey, JSON.stringify(cityList));
    refreshCityList();
}

$("#submit-btn").on("click", function () {
    // When city entered and Go! clicked
    var cityName = $("#city-input").val();
    if (cityName === "") {
        // validate text was entered, exit if nothing
        return;
    }
    $("#city-input").val("");
    makeAPICalls(cityName);
})
// OR
$(".searched-city").on("click", function () {
    // When city of city list is clicked
    var cityName = $(this).text();
    makeAPICalls(cityName);
})

$("#clear-btn").on("click", function () {
    if (confirm("Are you sure you want to remove the city list?")) {
        // clear city-list, including from local Storage
        cityList = [];
        localStorage.setItem(lsKey, JSON.stringify(cityList));
        refreshCityList();
    }
})

refreshCityList();