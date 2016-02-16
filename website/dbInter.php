<?php
ini_set('display_errors', 1);
echo "hello";

//$google_places = new joshtronic/GooglePlaces('AIzaSyAe-_fUznUY7EH9JMJ-SAsstofiMcb0qRE');
// 
// $google_places->location = array(-33.86820, 151.1945860);
// $google_places->rankby   = 'distance';
// $google_places->types    = 'restaurant'; // Requires keyword, name or types
// $results                 = $google_places->nearbySearch();
// var_dump($results);

require 'dbConnect.php';
// handle an ajax request
// if (is_ajax()) {
  if (isset($_POST["google_id"]) && !empty($_POST["google_id"])) { //Checks if action value exists
    // $action = $_GET["google_id"];
     main();
    }
  // }
// }

//Function to check if the request is an AJAX request
// function is_ajax() {
//   return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
// }

// handles inserting repsonse and returning a response
function main(){
    echo(getResponses($_POST["google_id"]));

}

function getResponses($goog)
{
    global $conn;
    $id;
    $sql = 'SELECT id FROM geohunt.registered_users WHERE identity= "'. $goog . '"';
    // var_dump($sql);
    if($result = $conn -> query($sql)){
      while($row = $result -> fetch_object()){
        $id = $row -> id;
      }
    }
    // echo($id);
    $sql = 'SELECT category, frequency FROM geohunt.user_profiles WHERE profile_id =' . $id . ' ORDER BY frequency DESC ';
    // var_dump($sql);
    $emparray = array();
    if($result = $conn -> query($sql)){
        while($row =mysqli_fetch_assoc($result))
        {
            $emparray[] = $row;
        }
    }
    $string = 'result:';
    return json_encode(['results' => $emparray]);
    // $myArr =  json_encode($string => $emparray);
    // var_dump($myArr);



}

//close the connection
mysqli_close($conn);
