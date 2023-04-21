<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$json_data = file_get_contents('data.json');
$data_data = json_decode($json_data, true);
$json_config = file_get_contents('config.json');
$data_config = json_decode($json_config,true);

$targets = array_keys($data_config);
$statuses = array_keys($data_config);

foreach ($targets as $var) {
    if (isset($data_data['target'][$var])) {
        $target[$var] = $data_data['target'][$var];
    }else{
        $target[$var] = '0';
    }
}
foreach($statuses as $var){
    if (isset($data_data['status'][$var])) {
        $status[$var] = $data_data['status'][$var];
    }else{
        $status[$var] = '0';
    }
}
$data_data = array(
    'status' => $status,
    'target' => $target,
);
$json_encoded = json_encode($data_data);
file_put_contents('data.json', $json_encoded);

print_r($json_encoded);
?>