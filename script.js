// =====================================================
// ORGANO OFM DASHBOARD V3.1
// =====================================================

// -----------------------------
// Google Apps Script API
// -----------------------------
const API_URL =
"https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

// -----------------------------
// OpenWeather API
// -----------------------------
const WEATHER_API_KEY =
"c09b61b39ee9308f837366dcb8345d08";

// Antharam Location
const LAT = 17.3050;
const LON = 78.2180;

// -----------------------------
// Dashboard Containers
// -----------------------------
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

// -----------------------------
// Clear Dashboard
// -----------------------------
function clearDashboard(){

    Object.values(sections).forEach(section=>{

        if(section){

            section.innerHTML="";

        }

    });

}

// -----------------------------
// Status Color Engine
// -----------------------------
function getStatusColor(metric,value){

    metric = metric.toLowerCase();

    value = Number(value);

    // ENERGY

    if(metric.includes("grid energy")){

        if(value < 200) return "green";

        if(value < 350) return "orange";

        return "red";

    }

    if(metric.includes("solar")){

        if(value > 700) return "green";

        if(value > 400) return "orange";

        return "red";

    }

    // WATER

    if(metric.includes("well") || metric.includes("stp")){

        if(value >= 80) return "green";

        if(value >= 50) return "orange";

        return "red";

    }

    // CCTV

    if(metric.includes("working")){

        if(value >= 70) return "green";

        if(value >= 50) return "orange";

        return "red";

    }

    if(metric.includes("not")){

        if(value <= 5) return "green";

        if(value <= 15) return "orange";

        return "red";

    }

    // DG

    if(metric.includes("diesel")){

        if(value >= 20) return "green";

        if(value >= 10) return "orange";

        return "red";

    }

    return "blue";

}

// -----------------------------
// Create Card
// -----------------------------
function createCard(title,value,unit,color){

    let percent = Number(value);

    if(isNaN(percent)){

        percent = 0;

    }

    percent = Math.max(0,Math.min(percent,100));

    return `

<div class="card ${color}">

<h3>${title}</h3>

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

// -----------------------------
// Air Quality Card
// -----------------------------
function createAirCard(location){

    return `

<div class="card green">

<h3>🌍 AIR QUALITY</h3>

<h2>${location}</h2>

<p>

Live PM2.5 will be added later

</p>

</div>

`;

}
// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard(){

    try{

        clearDashboard();

        const response = await fetch(API_URL);

        const data = await response.json();

        let airLocation = "";

        // Update Date
        data.forEach(item=>{

            if(item.metric==="Date"){

                document.getElementById("currentDate").innerHTML =
                "📅 " + item.value;

            }

        });

        // Process Metrics
        data.forEach(item=>{

            const metric = item.metric.trim().toLowerCase();

            if(metric==="date") return;

            // ================= ENERGY =================

            if(metric.includes("grid energy") ||

               metric.includes("solar")){

                sections.energy.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    getStatusColor(item.metric,item.value)

                );

            }

            // ================= WATER =================

            else if(

                metric.includes("dug well") ||

                metric.includes("stp")

            ){

                sections.water.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    getStatusColor(item.metric,item.value)

                );

            }

            // ================= VISITORS =================

            else if(

                metric.includes("owners") ||

                metric.includes("others")

            ){

                sections.visitors.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "green"

                );

            }

            // ================= CCTV =================

            else if(

                metric.includes("cctv")

            ){

                sections.cctv.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    getStatusColor(item.metric,item.value)

                );

            }

            // ================= DG =================

            else if(

                metric.includes("dg") ||

                metric.includes("diesel")

            ){

                sections.dg.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    getStatusColor(item.metric,item.value)

                );

            }

            // ================= AMENITIES =================

            else if(

                metric.includes("suit room") ||

                metric.includes("driver room")

            ){

                sections.amenities.innerHTML +=

                createCard(

                    item.metric,

                    item.value,

                    item.unit,

                    "blue"

                );

            }

            // ================= AIR QUALITY =================

            else if(

                metric.includes("location")

            ){

                airLocation = item.value;

            }

        });

        // Create Air Quality Card

        if(airLocation !== ""){

            sections.air.innerHTML =

            createAirCard(

                airLocation

            );

        }

        // Last Updated

        document.getElementById("lastUpdated").innerHTML =

        "Last Updated : " +

        new Date().toLocaleTimeString();

    }

    catch(err){

        console.log(err);

    }

}
// =====================================================
// LIVE CLOCK
// =====================================================

function updateClock(){

    const now = new Date();

    document.getElementById("currentTime").innerHTML =
    "🕒 " +
    now.toLocaleTimeString("en-IN");

}

// =====================================================
// WEATHER
// =====================================================

async function loadWeather(){

    try{

        const response = await fetch(

`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_API_KEY}`

        );

        const weather = await response.json();

        const temp = Math.round(weather.main.temp);

        const humidity = weather.main.humidity;

        const wind = weather.wind.speed;

        const feels = Math.round(weather.main.feels_like);

        const icon = weather.weather[0].icon;

        const desc = weather.weather[0].main;

        document.getElementById("weather").innerHTML =

        `

<img src="https://openweathermap.org/img/wn/${icon}@2x.png"
style="width:40px">

<div>

<b>${temp}°C</b>

<br>

${desc}

</div>

`;

        sections.weather.innerHTML =

        createCard(

            "Temperature",

            temp,

            "°C",

            "orange"

        );

        sections.weather.innerHTML +=

        createCard(

            "Humidity",

            humidity,

            "%",

            "blue"

        );

        sections.weather.innerHTML +=

        createCard(

            "Wind",

            wind,

            "m/s",

            "green"

        );

        sections.weather.innerHTML +=

        createCard(

            "Feels Like",

            feels,

            "°C",

            "yellow"

        );

        // Automatic Background

        const hour = new Date().getHours();

        if(hour>=6 && hour<18){

            document.body.style.backgroundImage=
            "url('assets/background_day.jpg')";

        }

        else{

            document.body.style.backgroundImage=
            "url('assets/background_night.jpg')";

        }

    }

    catch(err){

        document.getElementById("weather").innerHTML="Weather Offline";

        console.log(err);

    }

}

// =====================================================
// CCTV HEALTH
// =====================================================

function updateCCTVHealth(){

    const cards=document.querySelectorAll("#cctvCards .card h1");

    if(cards.length<2) return;

    const working=Number(cards[0].innerText);

    const down=Number(cards[1].innerText);

    const total=working+down;

    if(total==0) return;

    const health=Math.round((working/total)*100);

    sections.cctv.innerHTML+=

    createCard(

        "Health",

        health,

        "%",

        health>90?"green":

        health>75?"orange":"red"

    );

}

// =====================================================
// INITIALIZATION
// =====================================================

async function initializeDashboard(){

    updateClock();

    await loadDashboard();

    await loadWeather();

    updateCCTVHealth();

}

initializeDashboard();

setInterval(updateClock,1000);

setInterval(async()=>{

    await loadDashboard();

    updateCCTVHealth();

},60000);

setInterval(loadWeather,600000);
