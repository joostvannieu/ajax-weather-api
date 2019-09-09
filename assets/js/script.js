(function () {
    let fetchString1 = "https://api.openweathermap.org/data/2.5/forecast?q=";
    let fetchString2 = "&units=metric&APPID=3ae19ea0d52400ef8dfbd919977321df";
    let cityName = "";

    cityName = prompt("Enter City");
    fetch(fetchString1 + cityName + fetchString2)
        .then(function (response) {

            return response.json();
        })
        .then(function (weather) {
            console.log(weather.list);
        })
})();