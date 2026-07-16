//=====================================================
// ORGANO OFM DASHBOARD V4
//=====================================================

//============================
// GOOGLE SHEET API
//============================

const API_URL="https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

//============================
// WEATHER API
//============================

const WEATHER_KEY="c09b61b39ee9308f837366dcb8345d08";

//============================

const LAT=17.3050;
const LON=78.2180;

//============================

const energyCards=document.getElementById("energyCards");
const waterCards=document.getElementById("waterCards");
const visitorCards=document.getElementById("visitorCards");
const cctvCards=document.getElementById("cctvCards");
const dgCards=document.getElementById("dgCards");
const amenityCards=document.getElementById("amenityCards");
const airCards=document.getElementById("airCards");

//=====================================================

function clearDashboard(){

energyCards.innerHTML="";
waterCards.innerHTML="";
visitorCards.innerHTML="";
cctvCards.innerHTML="";
dgCards.innerHTML="";
amenityCards.innerHTML="";
airCards.innerHTML="";

}

//=====================================================

function getColor(metric,value){

metric=metric.toLowerCase();

value=Number(value);

if(metric.includes("solar")){

if(value>500) return "green";
return "orange";

}

if(metric.includes("grid")){

if(value<250) return "green";
return "orange";

}

if(metric.includes("diesel")){

if(value>20) return "green";
return "red";

}

if(metric.includes("working")){

if(value>70) return "green";
return "orange";

}

if(metric.includes("not")){

if(value<5) return "green";
return "red";

}

return "blue";

}

//=====================================================

function createCard(title,value,unit,color){

let percent=Number(value);

if(isNaN(percent)) percent=0;

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
//=====================================================
// LOAD DASHBOARD
//=====================================================

async function loadDashboard(){

    try{

        clearDashboard();

        const response = await fetch(API_URL);

        const data = await response.json();

        let location="";

        let cctvWorking=0;

        let cctvNotWorking=0;

        data.forEach(item=>{

            const metric=item.metric.trim();

            const name=metric.toLowerCase();

            // ---------------- DATE ----------------

            if(name==="date"){

                document.getElementById("currentDate").innerHTML=
                "📅 "+item.value;

                return;

            }

            // ---------------- ENERGY ----------------

            if(name.includes("grid energy")){

                energyCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    getColor(metric,item.value)

                );

            }

            else if(name.includes("solar")){

                energyCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    getColor(metric,item.value)

                );

            }

            // ---------------- WATER ----------------

            else if(

                name.includes("dug well") ||

                name.includes("stp")

            ){

                waterCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    "blue"

                );

            }

            // ---------------- VISITORS ----------------

            else if(

                name.includes("owners") ||

                name.includes("others")

            ){

                visitorCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    "green"

                );

            }

            // ---------------- CCTV ----------------

            else if(name.includes("cctv working")){

                cctvWorking=Number(item.value);

                cctvCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    "green"

                );

            }

            else if(name.includes("cctv not")){

                cctvNotWorking=Number(item.value);

                cctvCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    "red"

                );

            }

            // ---------------- DG ----------------

            else if(

                name.includes("dg") ||

                name.includes("diesel")

            ){

                dgCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    getColor(metric,item.value)

                );

            }

            // ---------------- AMENITIES ----------------

            else if(

                name.includes("suit room") ||

                name.includes("driver")

            ){

                amenityCards.innerHTML+=createCard(

                    metric,

                    item.value,

                    item.unit,

                    "blue"

                );

            }

            // ---------------- AIR ----------------

            else if(

                name.includes("location")

            ){

                location=item.value;

            }

        });

        // CCTV HEALTH

        const total=cctvWorking+cctvNotWorking;

        if(total>0){

            const health=Math.round((cctvWorking/total)*100);

            cctvCards.innerHTML+=createCard(

                "Health",

                health,

                "%",

                health>90?"green":

                health>70?"orange":"red"

            );

        }

        // AIR QUALITY

        airCards.innerHTML=createCard(

            "Location",

            location,

            "",

            "green"

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

    const now=new Date();

    document.getElementById("currentTime").innerHTML=
    "🕒 "+
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

        const url=
`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_KEY}`;

        const response=await fetch(url);

        const weather=await response.json();

        if(weather.cod!=200){

            document.getElementById("weather").innerHTML=
            "⚠ Weather Offline";

            return;

        }

        const temp=Math.round(weather.main.temp);

        const hum=weather.main.humidity;

        const icon=weather.weather[0].icon;

        const desc=weather.weather[0].main;

        document.getElementById("weather").innerHTML=`

        <img src="https://openweathermap.org/img/wn/${icon}.png"
        style="width:38px;vertical-align:middle">

        <span>

        ${temp}°C

        ${desc}

        <br>

        💧 ${hum}%

        </span>

        `;

    }

    catch(e){

        document.getElementById("weather").innerHTML=
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

setInterval(updateClock,1000);

setInterval(loadDashboard,60000);

setInterval(loadWeather,600000);
