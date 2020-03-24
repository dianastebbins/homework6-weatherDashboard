
$(document).ready(function () {
    var lsKey = "city-list"

    var apiKey = "aac6f7e9b00a366d117a449f1b8be6f8";
    var uvQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey;
    var cityQueryURL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" + apiKey;     // get temp in F by using units=imperial
    var fiveDayQueryURL = "http://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=" + apiKey; // get temp in F by using units=imperial

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
        // console.log("refreshCityList");
        //     retrieve city list from local storage
        var cityList = JSON.parse(localStorage.getItem(lsKey)) || [];

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

    function makeAPICalls(cityName) {
        // console.log("makeAPICalls with " + cityName);
        // First API call...Use city as parameter to API search for most of basic info:
        $.ajax({
            url: cityQueryURL + "&q=" + cityName,
            method: "GET"
        }).then(function (conditionsResponse) {
            console.log(conditionsResponse);
            displayCurrentConditions(conditionsResponse);

            // Second API call...Use long/lat of response to above API search for uv index
            $.ajax({
                url: uvQueryURL + "&lat=" + conditionsResponse.coord.lat + "&lon=" + conditionsResponse.coord.lon,
                method: "GET"
            }).then(function (uvResponse) {
                console.log(uvResponse);
                displayUVIndex(uvResponse);

                // Third API call...Use city as parameter to API search for 5 day forecast:
                $.ajax({
                    url: fiveDayQueryURL + "&q=" + cityName,
                    method: "GET"
                }).then(function (fiveDayResponse) {
                    console.log(fiveDayResponse);
                    display5DayForecast(fiveDayResponse);
                })
            })

            // save city name from response so it is properly capitalized
            saveSearchParameter(conditionsResponse.name);
        });

    }

    function displayCurrentConditions(response) {
        // console.log("displayCurrentConditions");
        //     display date
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
        // console.log("displayUVIndex " + response.value);
        $("#db-uv-header").removeAttr("hidden");

        //     pull uv index for display
        var uvIndexNumeric = parseFloat(response.value);
        $("#db-uv").text(" " + uvIndexNumeric);

        // clear out class for visual uv indicator and reset based on new value
        $("#db-uv").removeClass("uv012 uv34 uv56 uv789 uv10plus");
        console.log(uvIndexNumeric);
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
        // console.log("display5DayForecast");
        $("#five-day-header").removeAttr("hidden");
        $(".card-group").removeAttr("hidden");
        
    //     <!-- <div class="list-group">
    //     <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
    //         <div class="d-flex w-100 justify-content-between">
    //             <h5 class="mb-1">Date</h5>
    //         </div>
    //          <small>Clear</small>
    //         <p class="mb-1">badge</p>
    //         <small>Temp: 0 *F</small>
    //         <small>Humidity: 50%</small>
    //     </a>
    // </div> -->

        // find index of noon 2020-mm-dd 12:00:00

        // id = 5day-1
        // loop through every 8th response and create an element of 5 Day Forecast
        // var newDiv1El = $("<div>").addClass("list-group");
        // var newAEl = $("<a>").addClass("list-group-item list-group-item-action flex-column align-items-start").attr("href", "#");
        // // var newDiv2El = $("<div>").addClass("d-flex w-100 justify-content-between");
        // var newH5El = $("<h5>").addClass("mb-1").text(response.list[0].dt_txt);
        // var newConditionEl = $("<small>").text(response.list[0].weather[0].main);
        
        // var iconUrl = "http://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png"
        // var newImgEl = $("<img>").attr("src", iconUrl);
        // var newTempEl = $("<small>").text("Temp: " + response.list[0].main.temp + " F");
        // var newHumidityEl = $("<small>").text("Humidity: " + response.list[0].main.humidity + "%");

        // // newDiv2El.append(newH5El);
        // newAEl.append(newH5El);
        // // newAEl.append(newDiv2El);
        // newAEl.append(newConditionEl);
        // newAEl.append(newImgEl);
        // newAEl.append(newTempEl);
        // newAEl.append(newHumidityEl);
        // newDiv1El.append(newAEl);
        // // $("#5day-1").append(newDiv1El);
        // // $("#5day-2").append(newDiv1El);
        // // $("#5day-3").append(newDiv1El);
        // // $("#5day-4").append(newDiv1El);
        // // $("#5day-5").append(newDiv1El);
    }

    function saveSearchParameter(cityName) {
        console.log("saveSearchParameter with " + cityName);
        //     Add city to city list object and save to local Storage
        var cityList = JSON.parse(localStorage.getItem(lsKey)) || [];
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
    $("#city-list").on("click", "a.searched-city", function () {
        console.log("searched-city clicked");
        console.log($(this).text());
        // When city of city list is clicked
        var cityName = $(this).text();
        makeAPICalls(cityName);
    })

    $("#clear-btn").on("click", function () {
        // if (confirm("Are you sure you want to remove the city list?")) {
        // clear city-list from local Storage
        localStorage.removeItem(lsKey);
        refreshCityList();
        // }
    })

    setTime();
    refreshCityList();
})