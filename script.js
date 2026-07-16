// =====================================================
// ORGANO OFM DASHBOARD V3
// =====================================================

// Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

// OpenWeather API
const WEATHER_API_KEY = "c09b61b39ee9308f837366dcb8345d08";

// Antharam Coordinates
const LAT = 17.3050;
const LON = 78.2180;

// Dashboard Containers
const sections = {

    energy: document.getElementById("energyCards"),

    water: document.getElementById("waterCards"),

    visitors: document.getElementById("visitorCards"),

    cctv: document.getElementById("cctvCards"),

    dg: document.getElementById("dgCards"),

    amenities: document.getElementById("amenityCards"),

    air: document.getElementById("airCards"),

    weather: document.getElementById("weatherCards")

};

// Clear Dashboard
function clearDashboard(){

    Object.values(sections).forEach(section=>{

        if(section){

            section.innerHTML="";

        }

    });

}

// Create Card
function createCard(title,value,unit,color="blue"){

    return `

<div class="card ${color}">

<h3>${title}</h3>

<h1>${value}</h1>

<p>${unit}</p>

</div>

`;

}
// =====================================================
// LOAD DASHBOARD DATA
// =====================================================

async function loadDashboard(){

    try{

        clearDashboard();

        const response = await fetch(API_URL);

        const data = await response.json();

        // Update Date
        const dateItem = data.find(x => x.metric === "Date");

        if(dateItem){

            document.getElementById("currentDate").innerHTML =
            "📅 " + dateItem.value;

        }

        // Process every metric
        data.forEach(item=>{

            if(item.metric==="Date") return;

            const metric = item.metric.trim().toLowerCase();

            // ---------------- ENERGY ----------------

            if(

                metric.includes("grid energy") ||

                metric.includes("solar")

            ){

                sections.energy.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }

            // ---------------- WATER ----------------

            else if(

                metric.includes("dug well") ||

                metric.includes("stp")

            ){

                sections.water.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }

            // ---------------- VISITORS ----------------

            else if(

                metric.includes("owners") ||

                metric.includes("others")

            ){

                sections.visitors.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }

            // ---------------- CCTV ----------------

            else if(

                metric.includes("cctv")

            ){

                sections.cctv.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }

            // ---------------- DG ----------------

            else if(

                metric.includes("dg") ||

                metric.includes("diesel")

            ){

                sections.dg.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }
                        // ---------------- AMENITIES ----------------

            else if(

                metric.includes("suit room") ||

                metric.includes("driver room")

            ){

                sections.amenities.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }

            // ---------------- AIR QUALITY ----------------

            else if(

                metric.includes("pm") ||

                metric.includes("air pollution") ||

                metric.includes("location")

            ){

                sections.air.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "getStatusColor(item.metric, item.value)"

                );

            }

        });

        // Update footer time
        const now = new Date();

        document.getElementById("lastUpdated").innerHTML =
        "Last Updated : " + now.toLocaleTimeString();

    }

    catch(err){

        console.error("Dashboard Error :", err);

    }

}
// =====================================================
// LIVE CLOCK
// =====================================================

function updateClock(){

    const now = new Date();

    document.getElementById("currentTime").innerHTML =
        "🕒 " +
        now.toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();
// =====================================================
// AUTO REFRESH
// =====================================================

loadDashboard();

setInterval(loadDashboard,60000);
// =====================================================
// WEATHER ENGINE
// =====================================================

async function loadWeather(){

    if(WEATHER_API_KEY==""){

        document.getElementById("weather").innerHTML =
        "🌤 Weather API Missing";

        return;

    }

    try{

        const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_API_KEY}`;

        const response = await fetch(url);

        const weather = await response.json();

        const temp = Math.round(weather.main.temp);

        const feels = Math.round(weather.main.feels_like);

        const humidity = weather.main.humidity;

        const wind = weather.wind.speed;

        const description = weather.weather[0].description;

        const icon = weather.weather[0].icon;

        const sunrise = weather.sys.sunrise * 1000;

        const sunset = weather.sys.sunset * 1000;

        const now = Date.now();

        // Automatic Day / Night Background

        if(now > sunrise && now < sunset){

            document.body.style.backgroundImage =
            "url('assets/background_day.jpg')";

        }

        else{

            document.body.style.backgroundImage =
            "url('assets/background_night.jpg')";

        }

        document.getElementById("weather").innerHTML =

        `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">

        <div>

        <b>${temp}°C</b>

        <br>

        ${description}

        <br>

        💧 ${humidity}%

        &nbsp;

        💨 ${wind} m/s

        <br>

        Feels Like ${feels}°C

        </div>

        `;

    }

    catch(err){

        console.log(err);

        document.getElementById("weather").innerHTML =
        "⚠ Weather Offline";

    }

}
loadDashboard();

setInterval(loadDashboard,60000);
loadWeather();

setInterval(loadWeather,600000);
// =====================================================
// STATUS COLOR ENGINE
// =====================================================

function getStatusColor(metric, value){

    const name = metric.toLowerCase();

    const val = Number(value);

    // ---------------- ENERGY ----------------

    if(name.includes("grid energy")){

        if(val < 200) return "green";
        if(val < 350) return "orange";
        return "red";

    }

    if(name.includes("solar")){

        if(val > 700) return "green";
        if(val > 400) return "orange";
        return "red";

    }

    // ---------------- WATER ----------------

    if(name.includes("dug well") || name.includes("stp")){

        if(val >= 80) return "green";
        if(val >= 50) return "orange";
        return "red";

    }

    // ---------------- DG ----------------

    if(name.includes("diesel")){

        if(val >= 20) return "green";
        if(val >= 10) return "orange";
        return "red";

    }

    // ---------------- CCTV ----------------

    if(name.includes("cctv working")){

        if(val >= 70) return "green";
        if(val >= 50) return "orange";
        return "red";

    }

    if(name.includes("cctv not")){

        if(val <= 5) return "green";
        if(val <= 15) return "orange";
        return "red";

    }

    return "blue";

}


