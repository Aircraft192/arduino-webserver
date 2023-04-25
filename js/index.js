const data_url = '/data.json';
const config_url = '/config.json';
let json_data = [];
let json_config = [];
fetch(data_url).then(response => response.json()).then(data => {
    json_data = data;
})
.catch(error => console.error(error));
fetch(config_url).then(response => response.json()).then(data => {
    json_config = data;
    setTimeout(load, 50);
})
.catch(error => console.error(error));

function load(){
    for (let i = 2; i <= Object.keys(json_config).length + 1; i++) {
        document.getElementById("table").innerHTML = document.getElementById("table").innerHTML + "<tr><td>D" + i +"</td><td id=\"description_d" + i +"\"></td><td id=\"mode_d" + i +"\"></td><td id=\"target_d" + i +"\"></td><td id=\"duration_d" + i +"\"></td><td id=\"table_cell_press_d" + i + "\"><form onsubmit=\"press('D" + i + "')\"><input type=\"range\" min=\"1\" max=\"10\" step=\"1\" value=\"1\" id=\"button_duration_d" + i +"\" oninput=\"this.nextElementSibling.innerHTML = this.value\"> <span>1</span> <input type=\"submit\" value=\"Einschalten\" label=\"duration\"></form></td><td><input type=\"button\" onclick='schalter(\"D" + i + "\")' id=\"switch_d" + i +"\"></td></tr>";
    }
    for (let i = 2; i <= Object.keys(json_config).length + 1; i++) {
        document.getElementById("description_d" + i).innerHTML = json_config['D' + i].description;
        document.getElementById("mode_d" + i).innerHTML = json_config['D' + i].mode;
        document.getElementById("button_duration_d" + i).value = json_config['D' + i].duration;
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
    }
    for (let i = 0; i < document.getElementsByTagName("form").length; i++) {
        document.getElementsByTagName("form")[i].addEventListener('submit', handleForm);
        
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
    document.getElementsByTagName("body")[0].innerHTML = "<h1>Bitte warten...</h1>";
    fetch('/setstatus.php/?' + pin + "=" + newStatus)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Request failed', error));
    setTimeout(() => {location.reload(true);}, 500);
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
    document.getElementsByTagName("body")[0].innerHTML = "<h1>Bitte warten...</h1>";
    fetch('/setstatus.php/?' + pin + "=" + newStatus)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Request failed', error));
    setTimeout(() => {location.reload(true);}, 500);
}