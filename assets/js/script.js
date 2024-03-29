(function () {
    /*
    * INITIAL VARIABLES
    * */
    //let cityName = prompt("Enter City");
    let cityName = "";
    const TODAY = new Date(), DAYS_IN_WEEK = 7, DAYS_IN_FORECAST = 5, LAST_WEEKDAY = 6;

    /*
    * MAIN
    * when user enters city get the forecast for that city
    * */
    document.getElementById("forecast").addEventListener("click", function () {
        document.getElementById("predictions").innerHTML = "";
        cityName = document.getElementById("city").value;
        getForecast(cityName);
    });

    /*
    * FUNCTIONS
    * Adjust so it shows current stats for today, rather than averages
    * */
    //Get Avg Temp
    function getAvgTemp(dayBeingProcessed){
        let tempsum = 0;
        dayBeingProcessed.forEach(function (timeslot){
            tempsum += timeslot.main.temp;
        });
        return Math.round(tempsum / dayBeingProcessed.length);
    }
    //Get Min Temp
    function getMinTemp(dayBeingProcessed){
        let minTemp = 100;
        dayBeingProcessed.forEach(function (timeslot){
            if (timeslot.main.temp_min < minTemp)
                minTemp = Math.round(timeslot.main.temp_min);
        });
        return minTemp;
    }
    //Get Max Temp
    function getMaxTemp(dayBeingProcessed){
        let maxTemp = -100;
        dayBeingProcessed.forEach(function (timeslot){
            if (timeslot.main.temp_max > maxTemp)
                maxTemp = Math.round(timeslot.main.temp_max);
        });
        return maxTemp;
    }
    //Find most occurring element in an array
    function findMostOccurring(array){
        let result,  // This is the value we will return
            best = -1,   // Initialize the comparison for greedy
            lookup = {}; // Hashmap for essentially constant lookup   // Loop to go through array and count elements
        for(let i = 0; i < array.length; i++){
            // could replace block with `x[a[i]] = (x[a[i]] + 1)|0`
            //but far less readable
            if (lookup[array[i]] === undefined){
                lookup[array[i]] = 0;
            }
            lookup[array[i]]++; // Increment count
            if(lookup[array[i]] > best){ // Greedy for best element
                best = lookup[array[i]];
                result = array[i]
            }
        }   //will return most frequent item in array
        return result;
    }
    //Get Weather condition + icon
    function getWeatherCondition(dayBeingProcessed){
        let descriptions = [], icons = [];
        let weatherCondition = {
            description: 'desctest',
            icon: 'icontest'
        };
        dayBeingProcessed.forEach(function (timeslot){
            descriptions.push(timeslot.weather[0].description);
            icons.push(timeslot.weather[0].icon.substr(0, 2));
        });
        weatherCondition.description = findMostOccurring(descriptions);
        weatherCondition.icon = findMostOccurring(icons) + "d";
        //console.log(descriptions);
        //console.log(icons);
        //console.log(weatherCondition);

        return weatherCondition;
    }
    //Get Wind
    function getAvgWind(dayBeingProcessed){
        let tempsum = 0;
        dayBeingProcessed.forEach(function (timeslot){
            //console.log(timeslot.wind.speed);
            tempsum += timeslot.wind.speed;
        });
        return Math.round(tempsum / dayBeingProcessed.length);
    }
    //Get Date
    function getDate(dayBeingProcessed) {
        let options = { weekday: 'long'};
        let date = new Date(dayBeingProcessed[0].dt*1000); //first value of the current dayBeingProcessed is sufficient
        return date.toLocaleDateString('en-UK', options);
    }

    //Console log all aggregated data
    function consoleLogData(dayBeingProcessed){
        console.log('NEW DAY');
        console.log(getDate(dayBeingProcessed));
        console.log('Day being processed:');
        console.log(dayBeingProcessed);
        console.log('Avg Temp: ' + getAvgTemp(dayBeingProcessed) + '°C');
        console.log('Min Temp: ' + getMinTemp(dayBeingProcessed) + '°C');
        console.log('Max Temp: ' + getMaxTemp(dayBeingProcessed) + '°C');
        console.log('Weather condition:');
        console.log(getWeatherCondition(dayBeingProcessed));
        console.log('Wind speed: ' + getAvgWind(dayBeingProcessed) + ' m/s');
    }

    //Fill the template and append it to the HTML DOM
    function fillTemplate(dayBeingProcessed, city) {
        //set variables to be used
        let avgTemp = getAvgTemp(dayBeingProcessed),
            minTemp = getMinTemp(dayBeingProcessed),
            maxTemp = getMaxTemp(dayBeingProcessed),
            weatherCondition = getWeatherCondition(dayBeingProcessed),
            windSpeed = getAvgWind(dayBeingProcessed),
            date = getDate(dayBeingProcessed);


        let template = document.querySelector('#weatherCard');
        let cardBody = document.querySelector("#predictions");

        let location = template.content.querySelector(".location");
        location.innerText = city;
        let weather_condition = template.content.querySelector(".weather-condition");
        weather_condition.innerText = weatherCondition.description;
        let temperature = template.content.querySelector(".temperature");
        temperature.innerText = avgTemp + "°C";
        let weather_info = template.content.querySelector(".weather-info");
        weather_info.innerText = "min: " + minTemp + "°C\n" + "max: " + maxTemp  + "°C\n" + "windspeed: " + windSpeed + "m/s";
        let html_date = template.content.querySelector(".date");
        html_date.innerText = date;
        let weather_icon = template.content.querySelector(".weather-icon");
        weather_icon.setAttribute("src", `http://openweathermap.org/img/wn/${weatherCondition.icon}@2x.png`);


        let clone = template.content.cloneNode(true);
        cardBody.appendChild(clone);

    }

    /*
    * FETCH AND PROCESS FUNCTION
    * There seems to be an error at around midnight, where it cannot find info on the current day in the Json file
    * This needs fixing somehow
    * */
    function getForecast(city){
        let fetchString = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=3ae19ea0d52400ef8dfbd919977321df`;
        fetch(fetchString)
            .then(function (response) {
                return response.json();
            })
            .then(function (weather) {
                let forecast = Array.from(weather.list);

                for(let i = 0; i < DAYS_IN_FORECAST; i++){
                    let checkingDay;
                    let date; //= new Date(forecast[5].dt_txt);
                    let dayBeingProcessed = [];

                    if (TODAY.getDay() + i > LAST_WEEKDAY){
                        checkingDay = TODAY.getDay() + i - DAYS_IN_WEEK;
                    } else {checkingDay = TODAY.getDay() + i;}

                    forecast.forEach(function (dataPoint){  //Error around midnight
                        date = new Date(dataPoint.dt_txt);
                        if (date.getDay() === checkingDay){
                            dayBeingProcessed.push(dataPoint);
                        }
                    });

                    //Show aggregated data in console
                    consoleLogData(dayBeingProcessed);
                    //fill template and append
                    fillTemplate(dayBeingProcessed, city);
                }
            })
    }
})();