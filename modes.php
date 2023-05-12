<?php
# Config #############################
$modes_json_file_path = "modes.json";
######################################
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$json_modes = file_get_contents($modes_json_file_path);
echo($json_modes);
?>