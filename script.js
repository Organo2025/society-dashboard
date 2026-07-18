// ======================================================
// ORGANO OFM DASHBOARD V7
// ======================================================

const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

const tbody = document.getElementById("dashboardData");

// ------------------------------------------------------
// Fetch Dashboard Data
// ------------------------------------------------------

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        renderDashboard(data);

    } catch (err) {

        console.error(err);

        tbody.innerHTML =
        `<tr>
            <td colspan="3">Unable to load dashboard data.</td>
        </tr>`;

    }

}

// ------------------------------------------------------
// Render Table
// ------------------------------------------------------

function renderDashboard(data){

    tbody.innerHTML = "";

    const icons = {

        "Grid Energy":"⚡",
        "Solar Generation":"☀",
        "Dug Well":"💧",
        "STP":"🚰",
        "Total DG Units":"⛽",
        "Total Diesel":"🛢",
        "Suit Room":"🏠",
        "Driver Room Bookings":"🚗",
        "PM 2.5":"🌫",
        "Air Pollution Level":"🌍"

    };

    data.forEach(item=>{

        const row=document.createElement("tr");

        row.innerHTML=`

        <td>${icons[item.metric] || "📌"} ${item.metric}</td>

        <td>${item.value}</td>

        <td>${item.unit}</td>

        `;

        tbody.appendChild(row);

    });

}
// ======================================================
// LIVE DATE & TIME
// ======================================================

function updateDateTime() {

    const now = new Date();

    document.getElementById("currentDate").innerHTML =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("currentTime").innerHTML =
        now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

}

setInterval(updateDateTime, 1000);
updateDateTime();


// ======================================================
// WEATHER
// ======================================================

// Replace these with your location
const LAT = 17.3850;
const LON = 78.4867;

async function loadWeather() {

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        const data = await response.json();

        document.getElementById("weather").innerHTML =

            `🌤 ${data.current.temperature_2m}°C |
             💧 ${data.current.relative_humidity_2m}% |
             🌬 ${data.current.wind_speed_10m} km/h`;

    }

    catch (e) {

        document.getElementById("weather").innerHTML =
            "Weather Unavailable";

    }

}

loadWeather();


// ======================================================
// AUTO REFRESH
// ======================================================

loadDashboard();

setInterval(loadDashboard,60000);

setInterval(loadWeather,600000);
