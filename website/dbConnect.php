
<?php

$servername = "geohunt.c8tiwzwpchl4.us-east-1.rds.amazonaws.com";
$username = "root";
$password = "rGn3MDgfCqExqUF3";
$dbname = "geohunt";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
