(function () {
    /*
    * INITIAL VARIABLES
    * */
    //let cityName = prompt("Enter City");
    let cityName = "Antwerp";
    let fetchString = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=3ae19ea0d52400ef8dfbd919977321df`;
    const TODAY = new Date(), DAYS_IN_WEEK = 7, DAYS_IN_FORECAST = 5, LAST_WEEKDAY = 6;

    /*
    * FUNCTIONS
    * */
    //Get Avg Temp
    function getAvgTemp(dayBeingProcessed){
        let tempsum = 0;
        dayBeingProcessed.forEach(function (timeslot){
            //console.log(timeslot.main.temp);
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
    //Get Weather condition + icon
    function getWeatherCondition(dayBeingProcessed){
        let description, icon;
        let condition = {
            description: 'desctest',
            icon: 'icontest'
        };
        /*dayBeingProcessed.forEach(function (timeslot){
            if (timeslot.main.temp_max > maxTemp)
                maxTemp = Math.round(timeslot.main.temp_max);
        });*/
        return condition;
    }
    //Get Wind
    //Get ...

    /*
    * MAIN
    * */
    fetch(fetchString)
        .then(function (response) {
            return response.json();
        })
        .then(function (weather) {
            let forecast = Array.from(weather.list);

            console.log(TODAY.toLocaleDateString('en-UK', {weekday: 'long'}));
            //console.log(date.getDay());

            for(let i = 0; i < DAYS_IN_FORECAST; i++){
                console.log('New Day');
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
                console.log(dayBeingProcessed);

                console.log('Avg Temp: ' + getAvgTemp(dayBeingProcessed) + '°C');
                console.log('Min Temp: ' + getMinTemp(dayBeingProcessed) + '°C');
                console.log('Max Temp: ' + getMaxTemp(dayBeingProcessed) + '°C');
                console.log(getWeatherCondition(dayBeingProcessed).description + ' ' + getWeatherCondition(dayBeingProcessed).icon);


            }



        })
})();