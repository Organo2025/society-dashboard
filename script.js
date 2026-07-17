//=====================================================
// ORGANO OFM DASHBOARD V5
//=====================================================

//==============================
// GOOGLE SHEET API
//==============================

const API_URL="https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

//==============================
// WEATHER
//==============================

const WEATHER_KEY="c09b61b39ee9308f837366dcb8345d08";

const LAT=17.3050;
const LON=78.2180;

//==============================
// DASHBOARD CONTAINERS
//==============================

const energyCards=document.getElementById("energyCards");
const waterCards=document.getElementById("waterCards");
const dgCards=document.getElementById("dgCards");
const amenityCards=document.getElementById("amenityCards");
const airCards=document.getElementById("airCards");

//==============================

function clearDashboard(){

energyCards.innerHTML="";
waterCards.innerHTML="";
dgCards.innerHTML="";
amenityCards.innerHTML="";
airCards.innerHTML="";

}

//==============================

function createCard(title,value,unit,color){

let percent=parseFloat(value);

if(isNaN(percent)) percent=50;

if(percent>100) percent=100;

if(percent<0) percent=0;

return `

<div class="card ${color}">

<h4>${title}</h4>

<h1>${value}</h1>

<p>${unit}</p>

<div class="progress">

<div class="progressFill"

style="width:${percent}%">

</div>

</div>

</div>

`;

}

//==============================

function getColor(metric){

metric=metric.toLowerCase();

if(metric.includes("energy")) return "green";

if(metric.includes("solar")) return "green";

if(metric.includes("water")) return "blue";

if(metric.includes("stp")) return "blue";

if(metric.includes("diesel")) return "red";

if(metric.includes("dg")) return "orange";

if(metric.includes("room")) return "blue";

return "green";

}
//=====================================================
// LOAD DASHBOARD
//=====================================================

async function loadDashboard(){

    try{

        clearDashboard();

        const response = await fetch(API_URL);

        const data = await response.json();

        let location = "";
        let pm25 = "";
        let pollution = "";

        data.forEach(item=>{

            const metric = item.metric.trim();
            const name = metric.toLowerCase();

            // DATE

            if(name==="date"){

                document.getElementById("currentDate").innerHTML =
                "📅 " + item.value;

                return;

            }

            //==========================
            // ENERGY
            //==========================

            if(name.includes("grid energy")){

                energyCards.innerHTML += createCard(
                    "Grid Energy",
                    item.value,
                    item.unit,
                    "green"
                );

            }

            else if(name.includes("solar")){

                energyCards.innerHTML += createCard(
                    "Solar Generation",
                    item.value,
                    item.unit,
                    "green"
                );

            }

            //==========================
            // WATER
            //==========================

            else if(name.includes("dug well")){

                waterCards.innerHTML += createCard(
                    "Dug Well",
                    item.value,
                    item.unit,
                    "blue"
                );

            }

            else if(name.includes("stp")){

                waterCards.innerHTML += createCard(
                    "STP",
                    item.value,
                    item.unit,
                    "blue"
                );

            }

            //==========================
            // DG
            //==========================

            else if(name.includes("dg units")){

                dgCards.innerHTML += createCard(
                    "DG Units",
                    item.value,
                    item.unit,
                    "orange"
                );

            }

            else if(name.includes("diesel")){

                dgCards.innerHTML += createCard(
                    "Diesel",
                    item.value,
                    item.unit,
                    "red"
                );

            }

            //==========================
            // AMENITIES
            //==========================

            else if(name.includes("suit room")){

                amenityCards.innerHTML += createCard(
                    "Suit Room",
                    item.value,
                    item.unit,
                    "blue"
                );

            }

            else if(name.includes("driver room")){

                amenityCards.innerHTML += createCard(
                    "Driver Room",
                    item.value,
                    item.unit,
                    "blue"
                );

            }

            //==========================
            // AIR QUALITY
            //==========================

            else if(name.includes("location")){

                location = item.value;

            }

            else if(name.includes("pm2.5")){

                pm25 = item.value;

            }

            else if(name.includes("air pollution")){

                pollution = item.value;

            }

        });

        //==========================
        // AIR QUALITY CARDS
        //==========================

        airCards.innerHTML = "";

        airCards.innerHTML += createCard(
            "Location",
            location,
            "",
            "green"
        );

        airCards.innerHTML += createCard(
            "PM2.5",
            pm25,
            "µg/m³",
            "blue"
        );

        airCards.innerHTML += createCard(
            "Pollution",
            pollution,
            "",
            "orange"
        );

    }

    catch(err){

        console.log(err);

    }

}
//=====================================================
// LIVE CLOCK
//=====================================================

function updateClock(){

    const now = new Date();

    document.getElementById("currentTime").innerHTML =
        "🕒 " +
        now.toLocaleTimeString("en-IN",{
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        });

}

//=====================================================
// WEATHER
//=====================================================

async function loadWeather(){

    try{

        const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_KEY}`;

        const response = await fetch(url);

        const weather = await response.json();

        if(weather.cod != 200){

            document.getElementById("weather").innerHTML =
            "⚠ Weather Offline";

            return;

        }

        const temp = Math.round(weather.main.temp);
        const humidity = weather.main.humidity;
        const wind = Math.round(weather.wind.speed * 3.6); // km/h
        const feels = Math.round(weather.main.feels_like);
        const icon = weather.weather[0].icon;
        const desc = weather.weather[0].main;

        document.getElementById("weather").innerHTML = `

<img src="https://openweathermap.org/img/wn/${icon}.png"
style="width:42px;vertical-align:middle">

<span>

<b>${temp}°C</b> (${feels}°C)

<br>

${desc}

<br>

💧 ${humidity}% &nbsp; 🌬 ${wind} km/h

</span>

`;

    }

    catch(e){

        document.getElementById("weather").innerHTML =
        "⚠ Weather Offline";

    }

}

//=====================================================
// START DASHBOARD
//=====================================================

async function startDashboard(){

    updateClock();

    await loadDashboard();

    await loadWeather();

}

//=====================================================

startDashboard();

// Live Clock
setInterval(updateClock,1000);

// Refresh Dashboard every minute
setInterval(loadDashboard,60000);

// Refresh Weather every 10 minutes
setInterval(loadWeather,600000);
