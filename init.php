<pre>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
echo "Initialising Files...";
$json_data = file_get_contents('data.json');
$data_data = json_decode($json_data, true);
$json_config = file_get_contents('config.json');
$data_config = json_decode($json_config,true);

$targets = array_keys($data_config);
$statuses = array_keys($data_config);
echo "ok\n";
for ($i=2; $i < count($data_config) + 1; $i++) {
    if ($data_config['D'.$i]['mode'] == "OUTPUT" || $data_config['D'.$i]['mode'] == "INPUT") {
        echo "Mode at D".$i." checked.\n";
    }
    else {
        echo "Error reading mode at D".$i.". Please check the config file.\n";
    }
}
echo "Initialising data.json...";
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
echo "ok\n";
echo "Filling data.json...";
$data_data = array(
    'status' => $status,
    'target' => $target,
);
$json_encoded = json_encode($data_data);
file_put_contents('data.json', $json_encoded);
echo "ok\n\n";
print_r($json_encoded);
?>
</pre>