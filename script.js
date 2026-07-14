const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

const sections = {
    energy: document.getElementById("energyCards"),
    water: document.getElementById("waterCards"),
    visitors: document.getElementById("visitorCards"),
    security: document.getElementById("securityCards"),
    cctv: document.getElementById("cctvCards"),
    dg: document.getElementById("dgCards"),
    amenities: document.getElementById("amenityCards"),
    remarks: document.getElementById("remarkCards")
};

function clearPanels() {
    Object.values(sections).forEach(panel => panel.innerHTML = "");
}

function createItem(metric, value, unit) {

    return `
        <div class="item">
            <div>
                <div class="metric">${metric}</div>
            </div>

            <div>
                <span class="value">${value === "" ? "-" : value}</span>
                <span class="unit">${unit || ""}</span>
            </div>
        </div>
    `;
}

function addTo(panel, metric, value, unit) {

    panel.innerHTML += createItem(metric, value, unit);

}

function updateClock() {

    const now = new Date();

    document.getElementById("currentTime").innerHTML =
        "🕒 " + now.toLocaleTimeString();

}

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        clearPanels();

        data.forEach(row => {

            const metric = row.metric;
            const value = row.value;
            const unit = row.unit;

            if(metric === "Date"){

                document.getElementById("currentDate").innerHTML =
                    "📅 " + value;

                return;

            }

            const m = metric.toLowerCase();

            if(
                m.includes("tf1") ||
                m.includes("tf2") ||
                m.includes("solar")
            ){

                addTo(sections.energy, metric, value, unit);

            }

            else if(
                m.includes("water") ||
                m.includes("tank") ||
                m.includes("well") ||
                m.includes("stp")
            ){

                addTo(sections.water, metric, value, unit);

            }

            else if(
                m.includes("owner") ||
                m.includes("others") ||
                m.includes("visited")
            ){

                addTo(sections.visitors, metric, value, unit);

            }

            else if(
                m.includes("round")
            ){

                addTo(sections.security, metric, value, unit);

            }

            else if(
                m.includes("camera") ||
                m.includes("cctv")
            ){

                addTo(sections.cctv, metric, value, unit);

            }

            else if(
                m.includes("diesel") ||
                m.includes("dg")
            ){

                addTo(sections.dg, metric, value, unit);

            }

            else if(
                m.includes("room") ||
                m.includes("parking") ||
                m.includes("home")
            ){

                addTo(sections.amenities, metric, value, unit);

            }

            else if(
                m.includes("remark")
            ){

                addTo(sections.remarks, metric, value, unit);

            }

        });

    }

    catch(err){

        console.error(err);

    }

}

loadDashboard();

updateClock();

setInterval(loadDashboard,60000);

setInterval(updateClock,1000);
