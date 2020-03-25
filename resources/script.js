$(document).ready(function () {
    var cityListKey = "city-list";
    var lastSearchKey = "last-search";
    
    var apiKey = "aac6f7e9b00a366d117a449f1b8be6f8";
    var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey;
    var cityQueryURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" + apiKey;     // get temp in F by using units=imperial
    var fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=" + apiKey; // get temp in F by using units=imperial

    function setTime() {
        // initial setting of time when page loads up
        var rightNow = moment();
        $("#time-stamp").text(rightNow.format("ddd, h:mmA"));

        // repeated updates for time
        var timerInterval = setInterval(function () {
            rightNow = moment();
            $("#time-stamp").text(rightNow.format("ddd, h:mmA"));
        }, 60000);
    }

    function refreshCityList() {
        //     retrieve city list from local storage
        var cityList = JSON.parse(localStorage.getItem(cityListKey)) || [];

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

            // and add the new element to the page
            cityListEl.prepend(newCityEl);
        }
    }

    function initializeLastSearched() {
        var lastSearch = localStorage.getItem(lastSearchKey);
        makeAPICalls(lastSearch);
    }

    function makeAPICalls(cityName) {
        // First API call...Use city as parameter to API search for most of basic info:
        $.ajax({
            url: cityQueryURL + "&q=" + cityName,
            method: "GET"
        }).then(function (conditionsResponse) {
            displayCurrentConditions(conditionsResponse);

            // Second API call...Use long/lat of response to above API search for uv index
            $.ajax({
                url: uvQueryURL + "&lat=" + conditionsResponse.coord.lat + "&lon=" + conditionsResponse.coord.lon,
                method: "GET"
            }).then(function (uvResponse) {
                displayUVIndex(uvResponse);

                // Third API call...Use city as parameter to API search for 5 day forecast:
                $.ajax({
                    url: fiveDayQueryURL + "&q=" + cityName,
                    method: "GET"
                }).then(function (fiveDayResponse) {
                    display5DayForecast(fiveDayResponse);
                })
            })

            // save city name from response so it is properly capitalized
            saveSearchParameter(conditionsResponse.name);
        });

    }

    function displayCurrentConditions(response) {
        //     show date
        $("#time-stamp").removeAttr("hidden");

        //     display city name, current condition and appropriate icon
        var iconUrl = "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"
        $("#db-icon").attr("src", iconUrl);
        $("#db-current").text("Current: " + response.weather[0].main);
        $("#db-location").text(response.name);

        //     pull temp, humidity and wind speed for display
        $("#db-temp").text("Temp: " + response.main.temp + " F");
        $("#db-humidity").text("Humidity: " + response.main.humidity + "%");
        $("#db-wind").text("Wind: " + response.wind.speed + " knots");
    }

    function displayUVIndex(response) {
        // show UV header info and pull uv index for display
        $("#db-uv-header").removeAttr("hidden");
        var uvIndexNumeric = parseFloat(response.value);
        $("#db-uv").text(" " + uvIndexNumeric);

        // clear out class for visual uv indicator and reset based on new value
        $("#db-uv").removeClass("uv012 uv34 uv56 uv789 uv10plus");
        if (uvIndexNumeric >= 10.00) {
            $("#db-uv").addClass("uv10plus");
        } else if (uvIndexNumeric >= 7.00) {
            $("#db-uv").addClass("uv789");
        } else if (uvIndexNumeric >= 5.00) {
            $("#db-uv").addClass("uv56");
        } else if (uvIndexNumeric >= 3.00) {
            $("#db-uv").addClass("uv34");
        } else {
            $("#db-uv").addClass("uv012");
        }
    }

    function display5DayForecast(response) {
        // show headers and card group
        $("#five-day-header").removeAttr("hidden");
        $(".card-group").removeAttr("hidden");

        // For reference, this method should build cards that look like this and then append them to <div class="card" id="5day-1"></div>
        // <div class="card-header">
        //     Date
        // </div>
        // <div class="card-body">
        //     <h5 class="card-title">Temp</h5>
        //     <p class="card-text">Humidity</p>
        // </div>
        // <img class="card-img-top" src="" alt="Card image cap">
        // <div class="card-footer">
        //     <large class="text-muted">Condition</large>
        // </div>

        // start with 4th element (noon of "tomorrow") and loop through every 8th response 
        var cardCounter = 1;
        var responseArray = response.list;
        for (let i = 3; i < responseArray.length; i += 8) {
            
            // create an element of 5 Day Forecast
            var dateString = responseArray[i].dt_txt;
            var dateObj = new Date(dateString);
            var momentObj = moment(dateObj);
            var momentString = momentObj.format("ddd, h:mmA");
            var newDivHeaderEl = $("<div>").addClass("card-header").text(momentString);
            
            var newDivBodyEl = $("<div>").addClass("card-body");
            var newH5TitleEl = $("<h5>").addClass("card-title").text("Temp: " + responseArray[i].main.temp + " F");
            var newPTextEl = $("<p>").addClass("card-text").text("Humidity: " + responseArray[i].main.humidity + "%");
            newDivBodyEl.append(newH5TitleEl);
            newDivBodyEl.append(newPTextEl);
            
            var iconUrl = "http://openweathermap.org/img/wn/" + responseArray[i].weather[0].icon + "@2x.png"
            var newImgEl = $("<img>").attr("src", iconUrl);
            
            var newDivFooterEl = $("<div>").addClass("card-header");
            var newConditionEl = $("<large>").text(responseArray[i].weather[0].main);
            newDivFooterEl.append(newConditionEl);
            
            var id = "#5day-" + cardCounter; // i.e. 5day-1, 5day-2, etc
            $(id).empty();
            $(id).append(newDivHeaderEl);
            $(id).append(newDivBodyEl);
            $(id).append(newImgEl);
            $(id).append(newDivFooterEl);
            $(id).removeAttr("hidden");
            cardCounter++;
        }
    }

    function saveSearchParameter(cityName) {
        // save this cityName as the last known search
        localStorage.removeItem(lastSearchKey);
        localStorage.setItem(lastSearchKey, cityName);

        //     Add cityName to existing city list object and update to local Storage
        var cityList = JSON.parse(localStorage.getItem(cityListKey)) || [];
        cityList.push(cityName);
        localStorage.setItem(cityListKey, JSON.stringify(cityList));
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
    $("#city-list").on("click", "a.searched-city", function () {
        // When city of city list is clicked
        var cityName = $(this).text();
        makeAPICalls(cityName);
    })

    $("#clear-btn").on("click", function () {
        // if (confirm("Are you sure you want to remove the city list?")) {
        // clear city-list from local Storage
        localStorage.removeItem(cityListKey);
        refreshCityList();
        // }
    })

    setTime();
    refreshCityList();
    initializeLastSearched();
})