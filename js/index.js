// CONFIG /////////////////////////
const data_url = '/data.json';
const config_url = '/config.json';
///////////////////////////////////

let json_data = [];
let json_config = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let r = urlParams.get('r');

fetch(data_url, {cache: "no-store"}).then(response => response.json()).then(data => {
    json_data = data;
})
.catch(error => console.error(error));
fetch(config_url).then(response => response.json()).then(data => {
    json_config = data;
    setTimeout(load, 200);
})
.catch(error => console.error(error));

function load(){
    for (let i = 2; i <= Object.keys(json_config).length + 1; i++) {
        if(i != 4){
            if(json_config['D' + i].mode == "0" && i != 4){
                document.getElementById("output_table").innerHTML = document.getElementById("output_table").innerHTML + "<div>\
                <h3 id=\"pin_d" + i +"\">D" + i +"</h3>\
                <hr>\
                <span id=\"description_d" + i +"\"></span>\
                <hr>\
                <span id=\"target_d" + i +"\"></span>\
                <br>\
                <span id=\"duration_d" + i +"\"></span>\
                <hr>\
                <span id=\"table_cell_press_d" + i +"\">\
                    <form onsubmit=\"press(\'D" + i +"\');return false\">\
                        <input type=\"range\" min=\"1\" max=\"10\" step=\"1\" value=\"1\" id=\"button_duration_d" + i +"\" oninput=\"this.nextElementSibling.innerHTML = zeroBeforeSingleDigit(this.value)\">\
                        <span>01</span><br>\
                        <input type=\"submit\" value=\"Einschalten\" label=\"duration\" class=\"button\">\
                    </form>\
                </span>\
                <hr>\
                <span>\
                    <form>\
                        <input type=\"submit\" value=\"Einschalten\" onclick=\'schalter(\"D" + i +"\")\' id=\"switch_d" + i +"\" class=\"button\">\
                    </form>\
                </span>\
            </div>"
            }
            else if(json_config['D' + i].mode == "1" && i != 4){
                document.getElementById("input_table").innerHTML = document.getElementById("output_table").innerHTML + "<div>\
                <h3 id=\"pin_d" + i +"\">D" + i +"</h3>\
                <hr>\
                <span id=\"description_d" + i +"\"></span>\
                <hr>\
                <span id=\"target_d" + i +"\"></span>\
                </div>"
            }
            else{
                if(i != 4){
                    console.error("Error parsing mode at [D" + i + "]. Is the config file correct?");
                }
                else{
                    console.log("Skipped D4.");
                }
            }
            document.getElementById("description_d" + i).innerHTML = json_config['D' + i].description;
            if(json_config['D' + i].mode == "0"){
                if(json_data.target['D' + i] == -1){
                    document.getElementById("duration_d" + i).innerHTML = "∞";
                }
                else if(json_data.target['D' + i] == 0){
                    document.getElementById("duration_d" + i).innerHTML = "-"
                }
                else{
                    document.getElementById("duration_d" + i).innerHTML = plural(json_data.target['D' + i], "Sekunde", "n");
                }
                if(json_data.target['D' + i] != 0){
                    document.getElementById("target_d" + i).innerHTML = "Eingeschaltet";
                    document.getElementById("target_d" + i).style.color = "green";
                    document.getElementById("switch_d" + i).value = "Ausschalten";
                }
                else{
                    document.getElementById("target_d" + i).innerHTML = "Ausgeschaltet";
                    document.getElementById("target_d" + i).style.color = "red";
                    document.getElementById("switch_d" + i).value = "Einschalten";
                }
                if(json_data.target['D' + i] != 0){
                    document.getElementById("table_cell_press_d" + i).innerHTML = "nicht verfügbar.";
                    document.getElementById("table_cell_press_d" + i).style.fontStyle = "italic";
                    document.getElementById("table_cell_press_d" + i).style.color = "#4f4f4f";
                }
                if (document.getElementById("button_duration_d" + i) != null) {
                    setTimeout(() => {document.getElementById('button_duration_d' + i).value = json_config['D' + i].duration;document.getElementById('button_duration_d' + i).nextElementSibling.innerHTML = document.getElementById('button_duration_d' + i).value}, 30);
                }
                }
            else if(json_config['D' + i].mode == "1"){
                if(json_data.status['D' + i] == "0"){
                    document.getElementById("target_d" + i).innerHTML = "Ausgeschaltet";
                    document.getElementById("target_d" + i).style.color = "red";
                } else {
                    document.getElementById("target_d" + i).innerHTML = "Eingeschaltet";
                    document.getElementById("target_d" + i).style.color = "green";
                }
            }
        }
    }
    for (let i = 0; i < document.getElementsByTagName("form").length; i++) {
        document.getElementsByTagName("form")[i].addEventListener('submit', handleForm);
        
    }
    if(r > 0){
        setTimeout(() => {window.location.href = '/';}, 5500);
    }
}
function handleForm(event) { 
    event.preventDefault(); 
}

function press(pin){
    let newStatus;
    if (json_data.target[pin] == 0) {
        newStatus = document.getElementById("button_duration_" + pin.toLowerCase()).value;
    }
    console.log('/setstatus.php/?' + pin + "=" + newStatus);
    fetch('/setstatus.php/?' + pin + "=" + newStatus)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Request failed', error));
}

function schalter(pin){
    let newStatus;
    if(json_data.target[pin] == 0){
        newStatus = -1;
    }
    else{
        newStatus = 0;
    }
    console.log('/setstatus.php/?' + pin + "=" + newStatus);
    fetch('/setstatus.php/?' + pin + "=" + newStatus)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Request failed', error));
}