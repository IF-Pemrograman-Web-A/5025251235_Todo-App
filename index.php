<?php
require_once 'config.php';

$scope = ($_GET['scope'] ?? 'personal') === 'shared'
    ? 'shared'
    : 'personal';

$selectedId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT) ?: null;

function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

// Data awal untuk script.js (daftar Todo diambil lewat REST API)
$appConfig = [
    'scope'      => $scope,
    'selectedId' => $selectedId,
    'apiKey'     => API_KEY
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#ffffff">

    <title>Todo List</title>

    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <div>
        <h1>To Do List</h1>
        <p>E06 - The Endpoint of Portals</p>
    </div>

    <div class="header-actions">
        <button type="button" id="theme-toggle">Dark Mode</button>
        <button type="button" id="install-button">Install App</button>
    </div>
</header>

<?php require 'menubar.php'; ?>

<main>
    <?php require 'content.php'; ?>
</main>

<footer>
    <p>&copy; Dhanishara Zaschya_5025251235</p>
</footer>

<script>
    window.TODO_APP = <?= json_encode(
        $appConfig,
        JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    ) ?>;
</script>
<script src="script.js"></script>
</body>
</html>