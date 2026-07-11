const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        document.getElementById("temperature").innerHTML = data.temperature + "°C";

        document.getElementById("water").innerHTML = data.water + " KL";

        document.getElementById("electricity").innerHTML = data.electricity + " kWh";

        document.getElementById("diesel").innerHTML = data.diesel + " L";

        document.getElementById("tank").innerHTML = data.tank + "%";

        document.getElementById("stp").innerHTML = data.stp + " KL";

        document.getElementById("solar").innerHTML = data.solar + " kWh";

    } catch (error) {

        console.error(error);

    }

}

loadDashboard();

setInterval(loadDashboard,30000);
