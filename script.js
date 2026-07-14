// ==============================
// ORGANO OFM DASHBOARD
// PART - 1
// ==============================

// ----------------------------
// Google Apps Script API
// ----------------------------

const API_URL =
"https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";


// ----------------------------
// Weather API
// ----------------------------
// We'll add your API key later.

const WEATHER_API_KEY = 8827779504663578c215e060dc823501 "";

const LATITUDE = 17.3050;
const LONGITUDE = 78.2180;


// ----------------------------
// Dashboard Containers
// ----------------------------

const containers = {

    energy: document.getElementById("energyCards"),

    water: document.getElementById("waterCards"),

    visitors: document.getElementById("visitorCards"),

    security: document.getElementById("securityCards"),

    cctv: document.getElementById("cctvCards"),

    dg: document.getElementById("dgCards"),

    amenities: document.getElementById("amenityCards"),

    remarks: document.getElementById("remarkCards")

};


// ----------------------------
// Clear Dashboard
// ----------------------------

function clearDashboard(){

    Object.values(containers).forEach(box=>{

        if(box) box.innerHTML="";

    });

}


// ----------------------------
// Live Clock
// ----------------------------

function updateClock(){

    const now = new Date();

    const dateString =
        now.toLocaleDateString("en-GB");

    const timeString =
        now.toLocaleTimeString("en-IN");

    const dateDiv =
        document.getElementById("currentDate");

    const timeDiv =
        document.getElementById("currentTime");

    if(dateDiv){

        dateDiv.innerHTML="📅 "+dateString;

    }

    if(timeDiv){

        timeDiv.innerHTML="🕒 "+timeString;

    }

}

setInterval(updateClock,1000);


// ----------------------------
// Weather
// ----------------------------

async function loadWeather(){

    if(WEATHER_API_KEY===""){

        document.getElementById("weather").innerHTML =
        "🌤 Antharam";

        return;

    }

    try{

        const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=metric`;

        const res = await fetch(url);

        const weather = await res.json();

        document.getElementById("weather").innerHTML =
        `🌤 ${Math.round(weather.main.temp)}°C`;

    }

    catch(err){

        console.log(err);

    }

}


// ----------------------------
// Create Card
// ----------------------------

function createCard(title,value,unit,color){

    return `

<div class="card ${color}">

<h3>${title}</h3>

<h1>${value===""?"-":value}</h1>

<p>${unit}</p>

</div>

`;

}
// ==============================
// PART - 2
// Category Detection
// ==============================

function addCard(container, metric, value, unit, color) {

    if (!container) return;

    container.innerHTML += createCard(metric, value, unit, color);

}

function processMetric(metric, value, unit) {

    const m = metric.toLowerCase();

    // ---------------- ENERGY ----------------

    if (
        m.includes("tf1") ||
        m.includes("tf2") ||
        m.includes("solar")
    ) {

        addCard(containers.energy, metric, value, unit, "orange");
        return;
    }

    // ---------------- DG ----------------

    if (
        m.includes("dg") ||
        m.includes("diesel")
    ) {

        addCard(containers.dg, metric, value, unit, "red");
        return;
    }

    // ---------------- WATER ----------------

    if (
        m.includes("water") ||
        m.includes("tank") ||
        m.includes("well") ||
        m.includes("stp")
    ) {

        addCard(containers.water, metric, value, unit, "blue");
        return;
    }

    // ---------------- VISITORS ----------------

    if (
        m.includes("owner") ||
        m.includes("others") ||
        m.includes("visitor")
    ) {

        addCard(containers.visitors, metric, value, unit, "green");
        return;
    }

    // ---------------- SECURITY ----------------

    if (
        m.includes("round") ||
        m.includes("rp") ||
        m.includes("mrp") ||
        m.includes("mdp") ||
        m.includes("cp") ||
        m.includes("vp") ||
        m.includes("gp")
    ) {

        addCard(containers.security, metric, value, unit, "orange");
        return;
    }

    // ---------------- CCTV ----------------

    if (
        m.includes("cctv") ||
        m.includes("camera") ||
        m.includes("working") ||
        m.includes("down")
    ) {

        addCard(containers.cctv, metric, value, unit, "green");
        return;
    }

    // ---------------- AMENITIES ----------------

    if (
        m.includes("suite") ||
        m.includes("parking") ||
        m.includes("home") ||
        m.includes("room")
    ) {

        addCard(containers.amenities, metric, value, unit, "blue");
        return;
    }

    // ---------------- REMARKS ----------------

    if (
        m.includes("remark")
    ) {

        containers.remarks.innerHTML = `
            <div class="card green">
                <h3>Remarks</h3>
                <h1>${value}</h1>
            </div>
        `;
        return;
    }

}
// ==============================
// PART - 3
// Load Dashboard Data
// ==============================

async function loadDashboard() {

    try {

        clearDashboard();

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to connect to Google Apps Script.");
        }

        const data = await response.json();

        // Expecting:
        // [{metric:"TF1 Energy",value:178,unit:"kWh"}, ...]

        data.forEach(item => {

            const metric = item.metric || "";
            const value = item.value ?? "";
            const unit = item.unit || "";

            // Show report date from Google Sheet
            if (metric.toLowerCase() === "date") {

                const dateDiv = document.getElementById("currentDate");

                if (dateDiv) {
                    dateDiv.innerHTML = "📅 " + value;
                }

                return;
            }

            processMetric(metric, value, unit);

        });

    }
    catch (error) {

        console.error(error);

        containers.energy.innerHTML =
            `<div class="card red">
                <h3>Connection Error</h3>
                <p>Unable to load dashboard data.</p>
             </div>`;

    }

}
// ==============================
// PART - 4
// Start Dashboard
// ==============================

// Initial load
updateClock();
loadWeather();
loadDashboard();

// Refresh clock every second
setInterval(updateClock, 1000);

// Refresh dashboard every minute
setInterval(loadDashboard, 60000);

// Refresh weather every 30 minutes
setInterval(loadWeather, 1800000);
