#include <Ethernet.h>
#include <ArduinoJson.h>

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
IPAddress serverIP(45, 93, 251, 21);

EthernetClient client;
int modeValues[13];

void setModes() {
  StaticJsonDocument<200> modes;

  // HTTP Request  
  if (client.connect(serverIP, 80)) {
    Serial.println("Verbindung hergestellt!");
    client.println("GET /modes.php HTTP/1.0");
    client.println("Host: 45.93.251.21");
    client.println();
    delay(1000);
    String json_modes = "";
    boolean httpBodyStarted = false;
    while (client.available()) {
      char c = client.read();
      if (c == '{' && !httpBodyStarted) {
        httpBodyStarted = true;
      }
      if (httpBodyStarted) {
        json_modes += c;
      }
    }
    Serial.println("Antwort erhalten:");
    Serial.println(json_modes); // DEBUG
    client.stop();
    
    // JSON handeling
    deserializeJson(modes, json_modes);
    for (int i = 0; i < modes.size() ; i++) {
      modeValues[i] = modes["D" + String(i+2)].as<int>();
      if(modeValues[i] == 0 && i+2 != 4) {
        pinMode(i+2, OUTPUT);
        Serial.println("Initilised D" + String(i+2) + " as OUTPUT"); // DEBUG
      } else if(modeValues[i] == 1 && i+2 != 4) {
        pinMode(i+2, INPUT);
        Serial.println("Initilised D" + String(i+2) + " as INPUT"); // DEBUG
      } else if(i+2 == 4) {
        Serial.println("Skipped D4."); // DEBUG
      } else {
        Serial.println("Initialisation Error at D" + i+2); // DEBUG
      }
    }
    // DEBUG
    for (int i = 0; i < sizeof(modeValues)/sizeof(modeValues[0]); i++) {
      Serial.print("modeValues[");
      Serial.print(i);
      Serial.print("] = ");
      Serial.println(modeValues[i]);
    }
    } else {
      Serial.println("Verbindung fehlgeschlagen! - Init - Stopping...");
      while(true){}
  }
}
// LOOP request

void request() {
  StaticJsonDocument<200> doc;
  if (client.connect(serverIP, 80)) {
    Serial.println("Verbindung hergestellt!");
    client.println("GET /readstatus.php/?D2=" + String(digitalRead(2)) + "&D3=" + String(digitalRead(3)) + "&D4=" + String(digitalRead(4)) + "&D5=" + String(digitalRead(5)) + "&D6=" + String(digitalRead(6)) + "&D7=" + String(digitalRead(7)) + "&D8=" + String(digitalRead(8)) + "&D9=" + String(digitalRead(9)) + " HTTP/1.0"); // Sende GET-Anfrage
    Serial.println("GET /readstatus.php/?D2=" + String(digitalRead(2)) + "&D3=" + String(digitalRead(3)) + "&D4=" + String(digitalRead(4)) + "&D5=" + String(digitalRead(5)) + "&D6=" + String(digitalRead(6)) + "&D7=" + String(digitalRead(7)) + "&D8=" + String(digitalRead(8)) + "&D9=" + String(digitalRead(9)) + " HTTP/1.0");
    client.println("Host: 45.93.251.21");
    client.println();
    delay(1000);
    String json_data = "";
    boolean httpBodyStarted = false;
    while (client.available()) {
      char c = client.read();
      if (c == '{' && !httpBodyStarted) {
        httpBodyStarted = true;
      }
      if (httpBodyStarted) {
        json_data += c;
      }
    }
    Serial.println("Antwort erhalten:");
    Serial.println(json_data);
    client.stop();

    // JSON handeling
    deserializeJson(doc, json_data);
    int targetValues[doc["target"].size()];

    int index = 0;
    for (JsonPair kv : doc["target"].as<JsonObject>()) {
      targetValues[index++] = kv.value().as<int>();
    }

    // DEBUG
    for (int i = 0; i < sizeof(targetValues)/sizeof(targetValues[0]); i++) {
      if(modeValues[i] == 0){
        Serial.print("targetValues[");
        Serial.print(i);
        Serial.print("] = ");
        Serial.println(targetValues[i]);

        if(targetValues[i] == -1){
          digitalWrite(i+2, HIGH);
        } else if (targetValues[i] > 0){
          digitalWrite(i+2, HIGH);
          delay(targetValues[i]*1000);
          digitalWrite(i+2, LOW);
        } else if (targetValues[i] == 0){
          digitalWrite(i+2, LOW);
        } else {
          Serial.print("Error reading targetValues at D");
          Serial.print(String(i+2));
          Serial.println(".");
        }          
      }
    }
  } else {
    Serial.println("Verbindung fehlgeschlagen!");
  }
}

void setup() {
  Serial.begin(9600);
  Ethernet.begin(mac);
  delay(1000);
  setModes();
}

void loop() {
  request();
  delay(5000);
}