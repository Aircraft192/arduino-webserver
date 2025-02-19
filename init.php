<html>
    <head>
        <title>Initialise - Arduino Smarthome</title>
        <style>
            pre{overflow-clip-margin: content-box;border-width: 2px;border-style: inset;border-color: initial;border-image: initial;overflow: clip !important;}
            error{color: red}
            good{color: green;}
        </style>
    </head>
    <body>
<pre>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

# CONFIG ##############################
$data_json_file_path = "data.json";
$config_json_file_path = "config.json";
$modes_json_file_path = "modes.json";
#######################################

echo "Initialising Files...";
$json_data = file_get_contents($data_json_file_path);
$data_data = json_decode($json_data, true);
$json_config = file_get_contents($config_json_file_path);
$data_config = json_decode($json_config,true);
$json_modes = file_get_contents($modes_json_file_path);
$data_modes = json_decode($json_modes,true);

$keys = array_keys($data_config);
$error_count = 0;

echo "ok\n";
echo "Creating modes.json...\n\n";
foreach ($keys as $var) {
    $mode[$var] = $data_config[$var]['mode'];
}
$modes_json_encoded = json_encode($mode);
file_put_contents($modes_json_file_path, $modes_json_encoded);
echo $modes_json_encoded;
echo "\n\nCreating modes.json... done!\n";
echo "Checking modes.json...\n";
if (count($data_config) == count($data_modes)) {
    echo "<good>Length of modes.json matches length of config.json</good>\n";
} else {
    echo "<error>Length of modes.json doesn't match length of config.json. Please check the files. (".count($data_config)." != ".count($data_modes).")</error>\n";
    $error_count++;
}
echo "Checking modes.json... done!\n";
echo "Checking modes...\n";
for ($i=2; $i < count($data_config) + 2; $i++) {
    if ($data_modes['D'.$i] == "0" || $data_modes['D'.$i] == "1") {
        echo "<good>Mode at D".$i." ok. (";
        echo $data_modes['D'.$i];
        echo ")</good>\n";
    }
    else {
        echo "<error>Error reading mode at D".$i.". Please check the config file. The value must be '0' (OUTPUT) or '1' (INPUT).</error>\n";
        $error_count++;
    }
}
echo "Checking modes... done!\n";
echo "Checking durations...\n";
for ($i=2; $i < count($data_config) + 2; $i++) {
    if ($data_config['D'.$i]['duration'] > 0 && $data_config['D'.$i]['duration'] <= 10) {
        echo "<good>Duration at D".$i." ok.</good>\n";
    }
    else {
        echo "<error>Error reading duration at D".$i.". Please check the config file. The value must be between 1 and 10.</error>\n";
        $error_count++;
    }
}
echo "Checking durations... done!\n";
echo "Initialising data.json...";
foreach ($keys as $var) {
    if (isset($data_data['target'][$var])) {
        $target[$var] = $data_data['target'][$var];
    }else{
        $target[$var] = '0';
    }
}
foreach($keys as $var){
    if (isset($data_data['status'][$var])) {
        $status[$var] = $data_data['status'][$var];
    }else{
        $status[$var] = '0';
    }
}
echo "ok\n";
echo "Filling data.json...";
$data_data = array(
    'status' => $status,
    'target' => $target,
);
$json_encoded = json_encode($data_data);
file_put_contents($data_json_file_path, $json_encoded);
echo "ok\n\n";
print_r($json_encoded);
echo "\n\nRunning self-test...\n";
$data_data = json_decode(file_get_contents($data_json_file_path),true);
if($data_data['status'] != null){
    echo "ok [1/2]\n";
} else {
    echo "<error>Status Array is empty. Is config.json correctly formatted?</error>\n";
    $error_count++;
}
if($data_data['target'] != null){
    echo "ok [2/2]\n";
} else {
    echo "<error>Target Array is empty. Is config.json correctly formatted?</error>\n";
    $error_count++;
}
echo "Running self-test... done!\n\n";
if($error_count > 0){
    echo "<error>Some tests failed. Error count: ".$error_count;
}
else {
    echo "<good>All tests passed! Please check the JSON-Output above for obvious mistakes. If everything looks okay, you are good to go :)</good>";
}
?>
</pre>
</body>
</html>