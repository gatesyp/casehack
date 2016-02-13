<?php
error_reporting(E_ALL);
require 'dbConnect.php';
require_once 'TwitterAPIExchange.php';
require_once 'alchemyapi.php';

$alchemyapi = new AlchemyAPI();
$settings = array(
    'oauth_access_token' => "378220962-KJNvdtMLLKz4gEDEc9eAS7KdJUPFWsRQDDVYJH98",
    'oauth_access_token_secret' => "a78VF2709JZghNQWd11rskIfuTshKVanDbGz9W8f6egyI",
    'consumer_key' => "uEiVjyO98GwtHeV84vnxFb8YI",
    'consumer_secret' => "2HUukAwVgr3X4nworgMnvNDQT2vy4QNObmztx9Q3thvHPn2hJI"
);
$url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
$requestMethod = 'GET';
$twitteruser = "geczy";
$notweets = "10000";
$getfield = '?screen_name=' .$twitteruser. "&count=".$notweets;


$twitter = new TwitterAPIExchange($settings);

$api_response = $twitter ->setGetfield($getfield)
                     ->buildOauth($url, $requestMethod)
                     ->performRequest();


$response = json_decode($api_response);
$allTweets = ".";
// var_dump()
foreach($response as $tweet) {
 $allTweets = $allTweets . $tweet->screen_name;
}
echo $allTweets;
// buildProfile($allTweets);
// foreach($response->statuses as $tweet)
// {
  // echo "{$tweet->user->screen_name} {$tweet->text}\n";
// }
//
// $url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
// $getfield = '?screen_name=stvngts';
// $requestMethod = 'GET';
// // var_dump(get_loaded_extensions());
// try {
//     $twitter = new TwitterAPIExchange($settings);
//
// } catch (Exception $e) {
//     // echo $e;
// }
// $twitter = new TwitterAPIExchange($settings);
// $response = $twitter->setGetfield($getfield)
//     ->buildOauth($url, $requestMethod)
//     ->performRequest();
//
// // foreach ($response["text"] as $key) {
// //     foreach($response->statuses as $tweet)
// // {
// //   echo "{$tweet->user->screen_name} {$tweet->text}\n";
// // }
// $response = json_decode($response);
// var_dump($response->statuses);
// foreach($response->statuses as $tweet)
// {
//   echo "{$tweet->text}\n";
// }
    // var_dump($response->statuses);
    // echo $response[0][0];
// }

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
function buildProfile($tweets)
{
    global $alchemyapi;

    // $tweets = "I seriously do love Chipotle! Also, I really like to listen to jazz music. I can't wait to see Lebron James! ";
    var_dump($tweets);
    echo "<br>";
    echo "<br>";
    echo "<br>";
    // $response = $alchemyapi->entities('text',$tweets, array('sentiment'=>1));
    $response = $alchemyapi->keywords('text',$tweets, array('sentiment'=>1));
	if ($response['status'] == 'OK') {
	// 	echo PHP_EOL;
    //     echo '## Entities ##', PHP_EOL;
    //     echo '## Entities ##', PHP_EOL;
    //     echo '## Entities ##', PHP_EOL;
    //     echo '## Entities ##', PHP_EOL;
        // var_dump($response['entities']);
        // foreach ($response['entities'] as $entity) {
			// echo 'entity: ', $entity['text'], PHP_EOL;
			// echo 'type: ', $entity['type'], PHP_EOL;
			// echo 'relevance: ', $entity['relevance'], PHP_EOL;
			// echo 'sentiment: ', $entity['sentiment']['type'];
			// if (array_key_exists('score', $entity['sentiment'])) {
				// echo ' (' . $entity['sentiment']['score'] . ')', PHP_EOL;
			// } else {
				// echo PHP_EOL;
			// }
			// echo PHP_EOL;
		// }
        foreach ($response['keywords'] as $entity) {
			echo 'entity: ', $entity['text'], "<br>";
			if (array_key_exists('score', $entity['sentiment'])) {
				echo ' (' . $entity['sentiment']['score'] . ')', "<br>";
			} else {
				echo "<br>";
			}
			echo "<br>";
		}
	} else {
		echo 'Error in the entity extraction call: ', $response['statusInfo'];
	}

}

 ?>
