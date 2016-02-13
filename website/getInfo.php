<?php
error_reporting(E_ALL);
require 'dbConnect.php';
require_once('TwitterAPIExchange.php');
require_once 'alchemyapi.php';
$alchemyapi = new AlchemyAPI();
// buildProfile();
// echo $_GET['address'];
if (isset($_GET['twitter']) && !empty($_GET['address'])) {
    // global $conn;

    $sql = 'SELECT EXISTS(SELECT 1 FROM registered_users WHERE twitter_handle = "' . $_GET['twitter'] . '")';
    $result = $conn->query($sql);
    $row = $result->fetch_assoc();
    // case where they have not been registered yet
    // var_dump($row);
    if("0" == $row["EXISTS(SELECT 1 FROM registered_users WHERE twitter_handle = \"" . $_GET['twitter'] ."\")"])
    {
        $sql = 'INSERT INTO registered_users(twitter_handle) VALUES ("'  . $_GET['twitter'] . '")';
        $result = $conn->query($sql);
        buildProfile();
        // call python script to create a profile for them
        echo "Just now registered";
    }
    // case where they are already registered
    else
    {
        echo "  <br><br><br>Already registered";

    }
    return;
}
function buildProfile()
{
    global $alchemyapi;

    $tweets = "I seriously do love Chipotle! Also, I really like to listen to jazz music. I can't wait to see Lebron James! ";
    var_dump($tweets);
    $response = $alchemyapi->entities('text',$tweets, array('sentiment'=>1));
	if ($response['status'] == 'OK') {
		echo PHP_EOL;
		echo '## Entities ##', PHP_EOL;
        // var_dump($response['entities']);
        foreach ($response['entities'] as $entity) {
			echo 'entity: ', $entity['text'], PHP_EOL;
			echo 'type: ', $entity['type'], PHP_EOL;
			echo 'relevance: ', $entity['relevance'], PHP_EOL;
			echo 'sentiment: ', $entity['sentiment']['type'];
			if (array_key_exists('score', $entity['sentiment'])) {
				echo ' (' . $entity['sentiment']['score'] . ')', PHP_EOL;
			} else {
				echo PHP_EOL;
			}
			echo PHP_EOL;
		}
        $response = $alchemyapi->keywords('text',$tweets, array('sentiment'=>1));
        foreach ($response['keywords'] as $entity) {
			echo 'entity: ', $entity['text'], PHP_EOL;
			if (array_key_exists('score', $entity['sentiment'])) {
				echo ' (' . $entity['sentiment']['score'] . ')', PHP_EOL;
			} else {
				echo PHP_EOL;
			}
			echo PHP_EOL;
		}
	} else {
		echo 'Error in the entity extraction call: ', $response['statusInfo'];
	}

}

 ?>
