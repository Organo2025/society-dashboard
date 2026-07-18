from pathlib import Path

js = r'''// =====================================================
// ORGANO OFM DASHBOARD V9
// =====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

const LAT = 17.3850;
const LON = 78.4867;

const tbody = document.getElementById("dashboardData");

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

function showLoading(){
    tbody.innerHTML=`<tr><td colspan="3" style="text-align:center;padding:25px;">Loading Dashboard...</td></tr>`;
}

function showError(){
    tbody.innerHTML=`<tr><td colspan="3" style="text-align:center;color:#ff8080;padding:25px;">Unable to load dashboard.</td></tr>`;
}

function setValue(id,value){
    const el=document.getElementById(id);
    if(el) el.textContent=(value ?? "--");
}

async function loadDashboard(){
    showLoading();
    try{
        const response=await fetch(API_URL);
        if(!response.ok) throw new Error("Network Error");
        const data=await response.json();
        renderDashboard(data);
    }catch(err){
        console.error(err);
        showError();
    }
}

function renderDashboard(data){
    tbody.innerHTML="";
    const metrics={};

    data.forEach(item=>{
        metrics[item.metric]=item.value;

        const row=document.createElement("tr");
        row.innerHTML=`
            <td>${ICONS[item.metric]||"📌"} ${item.metric}</td>
            <td>${item.value}</td>
            <td>${item.unit||""}</td>`;
        tbody.appendChild(row);
    });

    setValue("gridEnergy",metrics["Grid Energy"]);
    setValue("solarGeneration",metrics["Solar Generation"]);
    setValue("dgUnits",metrics["Total DG Units"]);
    setValue("diesel",metrics["Total Diesel"]);
    setValue("water",metrics["Dug Well"]);
    setValue("aqi",metrics["PM 2.5"]);
    setValue("hive",metrics["Suit Room"]);
    setValue("stp",metrics["STP"]);

    // Optional cards
    setValue("driverRoom",metrics["Driver Room Bookings"]);
    setValue("airPollution",metrics["Air Pollution Level"]);
}

function updateClock(){
    const now=new Date();
    document.getElementById("currentDate").textContent=
        now.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
    document.getElementById("currentTime").textContent=
        now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
}

async function loadWeather(){
    try{
        const response=await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );
        const weather=await response.json();
        document.getElementById("weather").innerHTML=
            `🌤 ${weather.current.temperature_2m}°C &nbsp;&nbsp; 💧 ${weather.current.relative_humidity_2m}% &nbsp;&nbsp; 🌬 ${weather.current.wind_speed_10m} km/h`;
    }catch{
        document.getElementById("weather").textContent="Weather Unavailable";
    }
}

loadDashboard();
loadWeather();
updateClock();

setInterval(updateClock,1000);
setInterval(loadDashboard,60000);
setInterval(loadWeather,600000);
'''

out="/mnt/data/script.js"
Path(out).write_text(js,encoding="utf-8")
print(out)
