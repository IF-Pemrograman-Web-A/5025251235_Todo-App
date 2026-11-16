<?php

$host = '127.0.0.1';
$dbname = 'todo_e04';
$username = 'root';
$password = '';

// API Key untuk REST API (dikirim lewat header X-API-Key)
define('API_KEY', 'e06-todo-9f3k2m7xq4v8w1ht');

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    exit('Database connection failed.');
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['owner_key'])) {
    $_SESSION['owner_key'] = bin2hex(random_bytes(16));
}

?>
