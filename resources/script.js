// IDs of html:
// titleBar
// city-input
// submit-btn
// clear-btn
// city-list
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
    //     Use city as parameter to API search for most of basic info
    displayCurrentConditions();
    // Second API call
    //     Use long/lat of response to API search for uv index
    //     pull long/lat to use in third API call
    displayUVIndex();
    // Third API call
    //     Use city as parameter to API search for 5 day forecast
    display5DayForecast();

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
    //     change class(?) on display item according to index color schema (1&2, 3&4, 5&6, 7&8, 9&10 ???)
}

function display5DayForecast() {
    // Third API call
    //     response has data for every 3 hours, using noon times for each day of extended forecast, filter out 5 pertinent records from response
    //     pull temp and humidity for display
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