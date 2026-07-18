// =====================================================
// ORGANO OFM DASHBOARD V8
// =====================================================

// ===============================
// CONFIGURATION
// ===============================

const API_URL =
"https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

const LAT = 17.3850;
const LON = 78.4867;

const tbody = document.getElementById("dashboardData");

// Icons

const ICONS = {

    "Grid Energy":"⚡",
    "Solar Generation":"☀️",
    "Dug Well":"💧",
    "STP":"🚰",
    "Total DG Units":"⛽",
    "Total Diesel":"🛢️",
    "Suit Room":"🏠",
    "Driver Room Bookings":"🚗",
    "PM 2.5":"🌫️",
    "Air Pollution Level":"🌍"

};

// ===============================
// LOADING MESSAGE
// ===============================

function showLoading(){

    tbody.innerHTML =

    `<tr>

        <td colspan="3"

        style="text-align:center;padding:25px;">

        Loading Dashboard...

        </td>

    </tr>`;

}

// ===============================
// ERROR MESSAGE
// ===============================

function showError(){

    tbody.innerHTML =

    `<tr>

        <td colspan="3"

        style="text-align:center;color:#ff8080;padding:25px;">

        Unable to load dashboard.

        </td>

    </tr>`;

}

// ===============================
// FETCH DASHBOARD
// ===============================

async function loadDashboard(){

    showLoading();

    try{

        const response = await fetch(API_URL);

        if(!response.ok){

            throw new Error("Network Error");

        }

        const data = await response.json();

        renderDashboard(data);

    }

    catch(error){

        console.error(error);

        showError();

    }

}

// ===============================
// RENDER TABLE
// ===============================

function renderDashboard(data){

    tbody.innerHTML="";

    data.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=

        `

        <td>

        ${ICONS[item.metric] || "📌"}

        ${item.metric}

        </td>

        <td>

        ${item.value}

        </td>

        <td>

        ${item.unit}

        </td>

        `;

        tbody.appendChild(row);

    });

}

// ===============================
// DATE & TIME
// ===============================

function updateClock(){

    const now = new Date();

    document.getElementById("currentDate").textContent =

    now.toLocaleDateString(

        "en-IN",

        {

            weekday:"long",

            day:"numeric",

            month:"long",

            year:"numeric"

        }

    );

    document.getElementById("currentTime").textContent =

    now.toLocaleTimeString(

        "en-IN",

        {

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit"

        }

    );

}

// ===============================
// WEATHER
// ===============================

async function loadWeather(){

    try{

        const response = await fetch(

`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`

        );

        const weather = await response.json();

        document.getElementById("weather").innerHTML =

        `🌤 ${weather.current.temperature_2m}°C

        &nbsp;&nbsp;

        💧 ${weather.current.relative_humidity_2m}%

        &nbsp;&nbsp;

        🌬 ${weather.current.wind_speed_10m} km/h`;

    }

    catch{

        document.getElementById("weather").innerHTML =

        "Weather Unavailable";

    }

}

// ===============================
// INITIAL LOAD
// ===============================

loadDashboard();

loadWeather();

updateClock();

// ===============================
// AUTO REFRESH
// ===============================

setInterval(updateClock,1000);

setInterval(loadDashboard,60000);

setInterval(loadWeather,600000);
