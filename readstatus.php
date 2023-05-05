<?php

# CONFIG ##############################
$data_json_file_path = "data.json";
$config_json_file_path = "config.json";
#######################################

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$json_data = file_get_contents($data_json_file_path);
$data_data = json_decode($json_data, true);
$json_config = file_get_contents($config_json_file_path);
$data_config = json_decode($json_config,true);

$statuses = array();
$statuses = array_keys($data_config);

foreach ($statuses as $var) {
    if (isset($_GET[$var]) && $_GET[$var] >= 0) {
        $$var = $_GET[$var]; // Dynamische Variable erstellen
    } else {
        if (isset($data_data['status'][$var])) {
            $$var = $data_data['status'][$var]; // Eine Standard-Nummer als Wert setzen
        }
        else{
            $$var = '0';
        }
    }
    $status[$var] = $$var;
}
$data_data = array(
    'status' => $status,
    'target' => $data_data['target'],
);
$json_encoded = json_encode($data_data);
file_put_contents('data.json', $json_encoded);

print_r($json_encoded);
?>