function setup() {
    frameRate(2);
}
function draw(){
    fetch(data_url, {cache: "no-store"}).then(response => response.json()).then(data => {
        json_data = data;
    })
    .catch(error => console.error(error));

    for (let i = 2; i <= Object.keys(json_config).length + 1; i++) {
        if(i != 4){
            if(json_config['D' + i].mode == "0"){
                if(json_data.target['D' + i] == -1){
                    document.getElementById("duration_d" + i).innerHTML = "∞";
                }
                else if(json_data.target['D' + i] == 0){
                    document.getElementById("duration_d" + i).innerHTML = "-";
                    if (document.getElementById("button_duration_d" + i) == null) {
                        document.getElementById("table_cell_press_d" + i).innerHTML = "<form onsubmit=\"press('D" + i + "');return false\"><input type=\"range\" min=\"1\" max=\"10\" step=\"1\" value=\"1\" id=\"button_duration_d" + i +"\" oninput=\"this.nextElementSibling.innerHTML = this.value\"> <span>1</span> <input type=\"submit\" value=\"Einschalten\" label=\"duration\"></form>";
                        document.getElementById('button_duration_d' + i).value = json_config['D' + i].duration;
                        document.getElementById('button_duration_d' + i).nextElementSibling.innerHTML = document.getElementById('button_duration_d' + i).value;
                        
                        document.getElementById("table_cell_press_d" + i).style.fontStyle = "";
                        document.getElementById("table_cell_press_d" + i).style.color = "";
                    }
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
}