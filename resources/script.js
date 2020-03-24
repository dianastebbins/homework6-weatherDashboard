$(document).ready(function () {
    // IDs of html:
    // titleBar
    // city-input - used
    // submit-btn - used
    // clear-btn - used
    // city-list - used
    // db-current
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
    // get temp in F by using units=imperial
    var cityQueryURL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" + apiKey;
    var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey;
    var fiveDayQueryURL = "http://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey;

    var latitude = 0;
    var longitude = 0;

    function refreshCityList() {
        // console.log("refreshCityList");
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
            cityListEl.prepend(newCityEl);
        }
    }

    function makeAPICalls(cityName) {
        console.log("makeAPICalls with " + cityName);
        // First API call
        //     Use city as parameter to API search for most of basic info: &q=Hell
        $.ajax({
            url: cityQueryURL + "&q=" + cityName,
            method: "GET"
        }).then(function (conditionsResponse) {
            console.log(conditionsResponse);
            displayCurrentConditions(conditionsResponse);

            // Second API call
            //     Use long/lat of response to API search for uv index
            $.ajax({
                url: uvQueryURL + "&lat=" + latitude + "&lon=" + longitude,
                method: "GET"
            }).then(function (uvResponse) {
                console.log(uvResponse);
                displayUVIndex(uvResponse);
            })

            // Third API call
            //     Use city as parameter to API search for 5 day forecast: &q=Port Ludlow
            // fiveDayQueryURL += "&q=" + cityName;
            $.ajax({
                url: fiveDayQueryURL + "&q=" + cityName + "&lat=" + latitude + "&lon=" + longitude,
                method: "GET"
            }).then(function (fiveDayResponse) {
                console.log(fiveDayResponse);
                display5DayForecast();
            })
        });

        // update cityName so it is properly capitalized
        // cityName = cityNameFromResponse;
        saveSearchParameter(cityName);
    }

    function displayCurrentConditions(response) {
        // console.log("displayCurrentConditions");
        //     display date
        //     display city name, date, current condition and appropriate icon
        $("#db-current").text("Current: " + response.weather[0].main);
        var iconUrl = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        $("#db-icon").attr("src", iconUrl);
        $("#db-location").text(response.name);

        //     pull temp, humidity and wind speed for display
        $("#db-temp").text("Temperature: " + response.main.temp + " F");
        $("#db-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#db-wind").text("Wind: " + response.wind.speed + " knots");

        // pull lat and long for later
        latitude = response.coord.lat;
        longitude = response.coord.lon;
    }

    function displayUVIndex(response) {
        console.log("displayUVIndex " + response.value);
        //     pull uv index for display
        var uvIndexNumeric = parseFloat(response.value);
        $("#db-uv").text(uvIndexNumeric);

        // clear out class for visual uv indicator and reset based on new value
        $("#db-uv").removeClass("uv012 uv34 uv56 uv789 uv10plus");
        console.log(uvIndexNumeric);
        if(uvIndexNumeric >= 10.00){
            console.log("Here 10");
            $("#db-uv").addClass("uv10plus");
        } else if(uvIndexNumeric >= 7.00){
            console.log("Here 7");
            $("#db-uv").addClass("uv789");
        } else if (uvIndexNumeric >= 5.00 ){
            console.log("Here 5");
            $("#db-uv").addClass("uv56");
        } else if (uvIndexNumeric >= 3.00) {
            console.log("Here 3");
            $("#db-uv").addClass("uv34");
        } else {
            console.log("Here 0");
            $("#db-uv").addClass("uv012");
        }
    }

    function display5DayForecast() {
        // console.log("display5DayForecast");
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
        console.log("saveSearchParameter with " + cityName);
        // When display is built
        //     Add city to city list object and save to local Storage
        cityList.push(cityName);
        localStorage.setItem(lsKey, JSON.stringify(cityList));
        refreshCityList();
    }

    $("#submit-btn").on("click", function () {
        // console.log("submit-btn clicked");
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
    $(".city-list").on("click", function () {
        console.log("searched-city clicked");
        console.log($(this).text());
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
})