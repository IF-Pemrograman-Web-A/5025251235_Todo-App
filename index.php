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
    <title>Todo List</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <div>
        <h1>Todo List</h1>
        <p>E04 - The Iron Citadel</p>
    </div>

    <button type="button" id="theme-toggle">Dark Mode</button>
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
