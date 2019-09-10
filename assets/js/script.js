(function () {
    //let cityName = prompt("Enter City");
    let cityName = "Antwerp";
    let fetchString = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&APPID=3ae19ea0d52400ef8dfbd919977321df`;
    const TODAY = new Date(), DAYS_IN_WEEK = 7, DAYS_IN_FORECAST = 5, LAST_WEEKDAY = 6;

    fetch(fetchString)
        .then(function (response) {
            return response.json();
        })
        .then(function (weather) {
            let forecast = Array.from(weather.list);
            let date; //= new Date(forecast[5].dt_txt);

            console.log(TODAY.getDay());
            //console.log(date.getDay());

            for(let i = 0; i < DAYS_IN_FORECAST; i++){
                let checkingDay;
                if (TODAY.getDay() + i > LAST_WEEKDAY){
                    checkingDay = TODAY.getDay() + i - DAYS_IN_WEEK;
                } else {checkingDay = TODAY.getDay() + i;}
                let dayBeingProcessed = [];

                forecast.forEach(function (dataPoint){
                    date = new Date(dataPoint.dt_txt);
                    if (date.getDay() === checkingDay){
                        dayBeingProcessed.push(dataPoint);
                    }
                });
                console.log(dayBeingProcessed);
                console.log(dayBeingProcessed[0].main.temp);
                /*dayBeingProcessed.forEach(function (dataPoint){

                });*/

            }



        })
})();