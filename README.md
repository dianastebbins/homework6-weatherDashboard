# homework6-weatherDashboard

## Project Description
A weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

## General Notes
### UI
```
Same look and feel as example provided.
```
### 
```
```
### 5-Day Forecast
```
Data returned is for every three hours so needed to display accordingly
```
### Problems
```
```

## Table of Contents
* [Project Requirements](#project-requirements)
* [Page Design Notes](#page-design-notes)
* [Pseudocode](#pseudocode)
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)
* [Badges](#badges)
* [Contributing](#contributing)
* [Tests](#tests)

## Project Requirements 
    (copied from Homework instructional README.md, for reference)

### Directions
```
Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.
```

## User Story
```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria
```
GIVEN a weather dashboard with form inputs
-WHEN I search for a city
-THEN I am presented with current and future conditions for that city and that city is added to the search history
-WHEN I view current weather conditions for that city
-THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
-WHEN I view the UV index
-THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
-WHEN I view future weather conditions for that city
-THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
-WHEN I click on a city in the search history
-THEN I am again presented with current and future conditions for that city
-WHEN I open the weather dashboard
-THEN I am presented with the last searched city forecast
```

## Page Design Notes
```

```

## Pseudocode
```
When web app begins
    retrieve city list from local storage
    dynamically create city list on screen
When city entered and Go! clicked
OR
When city of city list is clicked
    Use city as parameter to API search for most of basic info
    Use long/lat of response to API search for uv index
    Use city as parameter to API search for 5 day forecast
First API call
    display date
    display city name
    display appropriate icon for current conditions
        cloudy rainy snow sunshine partly-cloudy
    pull temp, humidity and wind speed for display
    pull long/lat to use in third API call
Second API call
    pull uv index for display
    change class(?) on display item according to index color schema (1&2, 3&4, 5&6, 7&8, 9&10 ???)
Third API call
    response has data for every 3 hours, using noon times for each day of extended forecast, filter out 5 pertinent records from response
    pull temp and humidity for display
    dynamically build list-group item and populate with above data, plus condition appropriate icon
When display is built
    Add city to city list on screen
    Add city to city list object and save to localStorage  
```

## Installation
url to deployed app:

## Usage

## Credits
Requirements copied from provided Homework files of Full Stack Coding Bootcamp.

## License

## Badges

## Contributing

## Tests
LOL
