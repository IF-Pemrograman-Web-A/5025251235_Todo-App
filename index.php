<?php
require_once 'config.php';

$scope = ($_GET['scope'] ?? 'personal') === 'shared'
    ? 'shared'
    : 'personal';

if ($scope === 'personal') {
    $stmt = $pdo->prepare(
        'SELECT * FROM todos
         WHERE scope = ? AND owner_key = ?
         ORDER BY id DESC'
    );
    $stmt->execute(['personal', $_SESSION['owner_key']]);
} else {
    $stmt = $pdo->prepare(
        'SELECT * FROM todos
         WHERE scope = ?
         ORDER BY id DESC'
    );
    $stmt->execute(['shared']);
}

$todos = $stmt->fetchAll();

$selectedId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$selectedTodo = null;

foreach ($todos as $todo) {
    if ((int) $todo['id'] === $selectedId) {
        $selectedTodo = $todo;
        break;
    }
}

if (!$selectedTodo && $todos) {
    $selectedTodo = $todos[0];
}

function e($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
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
        <p>E05 - The Offline Abyss</p>
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

<script src="script.js"></script>
</body>
</html>
