const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        clearCards();

        // Date
        const dateItem = data.find(x => x.metric === "Date");

        if(dateItem){

            document.getElementById("currentDate").innerHTML =
                "📅 " + dateItem.value;

        }

        document.getElementById("currentTime").innerHTML =
            "🕒 " + new Date().toLocaleTimeString();

        data.forEach(item=>{

            if(item.metric==="Date") return;

            addCard(item);

        });

    }

    catch(error){

        console.log(error);

    }

}

function clearCards(){

    energyCards.innerHTML="";
    waterCards.innerHTML="";
    visitorCards.innerHTML="";
    securityCards.innerHTML="";
    cctvCards.innerHTML="";
    dgCards.innerHTML="";
    amenityCards.innerHTML="";
    remarkCards.innerHTML="";

}

function createCard(item,color){

    return `

    <div class="card ${color}">

        <h3>${item.metric}</h3>

        <h1>${item.value==="" ? "-" : item.value}</h1>

        <p>${item.unit}</p>

    </div>

    `;

}

function addCard(item){

    let metric=item.metric.toLowerCase();

    //------------------------------------------------
    // ENERGY
    //------------------------------------------------

    if(

        metric.includes("tf1") ||

        metric.includes("tf2") ||

        metric.includes("solar")

    ){

        energyCards.innerHTML+=createCard(item,"orange");

    }

    //------------------------------------------------
    // WATER
    //------------------------------------------------

    else if(

        metric.includes("water") ||

        metric.includes("tank") ||

        metric.includes("well") ||

        metric.includes("stp")

    ){

        waterCards.innerHTML+=createCard(item,"blue");

    }

    //------------------------------------------------
    // VISITORS
    //------------------------------------------------

    else if(

        metric.includes("owner") ||

        metric.includes("others") ||

        metric.includes("visited")

    ){

        visitorCards.innerHTML+=createCard(item,"green");

    }

    //------------------------------------------------
    // SECURITY
    //------------------------------------------------

    else if(

        metric.includes("round")

    ){

        securityCards.innerHTML+=createCard(item,"orange");

    }

    //------------------------------------------------
    // CCTV
    //------------------------------------------------

    else if(

        metric.includes("camera") ||

        metric.includes("cctv")

    ){

        cctvCards.innerHTML+=createCard(item,"green");

    }

    //------------------------------------------------
    // DG
    //------------------------------------------------

    else if(

        metric.includes("dg") ||

        metric.includes("diesel")

    ){

        dgCards.innerHTML+=createCard(item,"red");

    }

    //------------------------------------------------
    // AMENITIES
    //------------------------------------------------

    else if(

        metric.includes("suite") ||

        metric.includes("parking") ||

        metric.includes("home")

    ){

        amenityCards.innerHTML+=createCard(item,"blue");

    }

    //------------------------------------------------
    // REMARKS
    //------------------------------------------------

    else if(

        metric.includes("remark")

    ){

        remarkCards.innerHTML+=createCard(item,"green");

    }

}

loadDashboard();

setInterval(loadDashboard,60000);
