const API_URL = "https://script.google.com/macros/s/AKfycbwe9iLSaqOtoW_7AC7UwZQ1NFrFWAox227cL1vPDttBgv_vU0tmjyFXbA6VURhc5Ws_jw/exec";

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        clearCards();

        document.getElementById("currentDate").innerHTML =
            "📅 " + data[0].value;

        document.getElementById("currentTime").innerHTML =
            "🕒 " + new Date().toLocaleTimeString();

        data.forEach(item => {

            if (item.metric === "Date") return;

            addCard(item);

        });

    }

    catch(error){

        console.log(error);

    }

}

function clearCards(){

document.getElementById("energyCards").innerHTML="";

document.getElementById("waterCards").innerHTML="";

document.getElementById("visitorCards").innerHTML="";

document.getElementById("securityCards").innerHTML="";

document.getElementById("cctvCards").innerHTML="";

document.getElementById("dgCards").innerHTML="";

document.getElementById("amenityCards").innerHTML="";

document.getElementById("remarkCards").innerHTML="";

}

function cardHTML(item,color="blue"){

return `

<div class="card ${color}">

<h3>${item.metric}</h3>

<h1>${item.value===""?"-":item.value}</h1>

<p>${item.unit}</p>

</div>

`;

}

function addCard(item){

const name=item.metric.toLowerCase();

if(name.includes("energy") || name.includes("solar")){

document.getElementById("energyCards").innerHTML+=cardHTML(item,"orange");

}

else if(

name.includes("water") ||

name.includes("tank") ||

name.includes("well") ||

name.includes("stp")

){

document.getElementById("waterCards").innerHTML+=cardHTML(item,"blue");

}

else if(

name.includes("owner") ||

name.includes("visitor") ||

name.includes("others")

){

document.getElementById("visitorCards").innerHTML+=cardHTML(item,"green");

}

else if(

name.includes("security") ||

name.includes("round")

){

document.getElementById("securityCards").innerHTML+=cardHTML(item,"orange");

}

else if(

name.includes("cctv") ||

name.includes("camera")

){

document.getElementById("cctvCards").innerHTML+=cardHTML(item,"green");

}

else if(

name.includes("dg")

||

name.includes("diesel")

){

document.getElementById("dgCards").innerHTML+=cardHTML(item,"red");

}

else if(

name.includes("room") ||

name.includes("parking") ||

name.includes("home")

){

document.getElementById("amenityCards").innerHTML+=cardHTML(item,"blue");

}

else if(

name.includes("remark")

){

document.getElementById("remarkCards").innerHTML+=cardHTML(item,"green");

}

}

loadDashboard();

setInterval(loadDashboard,60000);
