<?php
$host = "sql207.infinityfree.com"; // el host que te dieron
$user = "if0_41730610";            // tu usuario
$pass = "Q5BTYOurqV8";           // tu contraseña
$db   = "epiz_xxxxxxx_amara";      // nombre de tu BD

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>