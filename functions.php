<?php
require_once 'config.php';

function uploadTodoImage($file) {
    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp'
    ];

    $mime = mime_content_type($file['tmp_name']);

    if (!isset($allowedTypes[$mime]) || $file['size'] > 2 * 1024 * 1024) {
        return null;
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $allowedTypes[$mime];
    $destination = __DIR__ . '/uploads/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return null;
    }

    return 'uploads/' . $filename;
}


function redirectToList($scope, $id = null) {
    $url = 'index.php?scope=' . urlencode($scope);

    if ($id !== null) {
        $url .= '&id=' . (int) $id;
    }

    header('Location: ' . $url);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirectToList('personal');
}

$action = $_POST['action'] ?? '';
$scope = ($_POST['scope'] ?? 'personal') === 'shared'
    ? 'shared'
    : 'personal';

$owner = $_SESSION['owner_key'];

if ($action === 'create') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $status = $_POST['status'] ?? 'todo';
    $notificationTime = trim($_POST['notification_time'] ?? '');
    $imagePath = uploadTodoImage($_FILES['image'] ?? null);

    if ($title === '' || !in_array($status, ['todo', 'progress', 'done'], true)) {
        redirectToList($scope);
    }

    $notificationTime = $notificationTime !== ''
        ? str_replace('T', ' ', $notificationTime) . ':00'
        : null;

    $stmt = $pdo->prepare(
        'INSERT INTO todos
         (title, description, status, scope, owner_key, notification_time, image_path)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    $stmt->execute([
        $title,
        $description,
        $status,
        $scope,
        $owner,
        $notificationTime,
        $imagePath
    ]);

    redirectToList($scope, $pdo->lastInsertId());
}

$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    redirectToList($scope);
}

if ($scope === 'personal') {
    $stmt = $pdo->prepare(
        'SELECT * FROM todos WHERE id = ? AND scope = ? AND owner_key = ?'
    );
    $stmt->execute([$id, $scope, $owner]);
} else {
    $stmt = $pdo->prepare(
        'SELECT * FROM todos WHERE id = ? AND scope = ?'
    );
    $stmt->execute([$id, $scope]);
}

$todo = $stmt->fetch();

if (!$todo) {
    redirectToList($scope);
}

if ($action === 'update') {
    $title = trim($_POST['title'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $status = $_POST['status'] ?? 'todo';
    $notificationTime = trim($_POST['notification_time'] ?? '');

    if ($title === '' || !in_array($status, ['todo', 'progress', 'done'], true)) {
        redirectToList($scope, $id);
    }

    $notificationTime = $notificationTime !== ''
        ? str_replace('T', ' ', $notificationTime) . ':00'
        : null;

    if ($scope === 'personal') {
        $stmt = $pdo->prepare(
            'UPDATE todos
             SET title = ?, description = ?, status = ?, notification_time = ?
             WHERE id = ? AND scope = ? AND owner_key = ?'
        );
        $stmt->execute([
            $title, $description, $status, $notificationTime,
            $id, $scope, $owner
        ]);
    } else {
        $stmt = $pdo->prepare(
            'UPDATE todos
             SET title = ?, description = ?, status = ?, notification_time = ?
             WHERE id = ? AND scope = ?'
        );
        $stmt->execute([
            $title, $description, $status, $notificationTime,
            $id, $scope
        ]);
    }

    redirectToList($scope, $id);
}

if ($action === 'delete') {
    if ($scope === 'personal') {
        $stmt = $pdo->prepare(
            'DELETE FROM todos WHERE id = ? AND scope = ? AND owner_key = ?'
        );
        $stmt->execute([$id, $scope, $owner]);
    } else {
        $stmt = $pdo->prepare(
            'DELETE FROM todos WHERE id = ? AND scope = ?'
        );
        $stmt->execute([$id, $scope]);
    }

    redirectToList($scope);
}

redirectToList($scope, $id);
