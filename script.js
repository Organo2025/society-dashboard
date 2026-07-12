const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

async function loadDashboard(){

    const response = await fetch(API_URL);

    const data = await response.json();

    const dashboard = document.getElementById("dashboard");

    dashboard.innerHTML = "";

    data.forEach(item=>{

        dashboard.innerHTML += `
        <div class="card">
            <h3>${item.metric}</h3>
            <h1>${item.value || "-"}</h1>
            <p>${item.unit}</p>
        </div>
        `;

    });

}

loadDashboard();

setInterval(loadDashboard,60000);
