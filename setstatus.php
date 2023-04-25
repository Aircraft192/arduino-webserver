<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$json_data = file_get_contents('data.json');
$data_data = json_decode($json_data, true);
$json_config = file_get_contents('config.json');
$data_config = json_decode($json_config,true);

$targets = array();
$targets = array_keys($data_config);
//print_r($targets);

foreach ($targets as $var) {
    if (isset($_GET[$var]) && $_GET[$var] >= -1 && $_GET[$var] <= 10) {
        $$var = $_GET[$var]; // Dynamische Variable erstellen
    } else {
        if (isset($data_data['target'][$var])) {
            $$var = $data_data['target'][$var];
        }
        else{
            $$var = '0';
        }
    }
    $target[$var] = $$var;
}
$data_data = array(
    'status' => $data_data['status'],
    'target' => $target,
);
$json_encoded = json_encode($data_data);
file_put_contents('data.json', $json_encoded);

print_r($json_encoded);
?>