<?php
require_once '../config.php';

header('Content-Type: application/json; charset=utf-8');

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const ALLOWED_STATUS  = ['todo', 'progress', 'done'];
const ALLOWED_SCOPE   = ['personal', 'shared'];

/* ---------------------------------------------------------------
 * Helper response
 * ------------------------------------------------------------- */

// Mengirim response JSON (204 tidak boleh punya body)
function sendResponse($statusCode, $data = null) {
    http_response_code($statusCode);

    if ($data !== null && $statusCode !== 204) {
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    exit;
}

function sendError($statusCode, $message, $errors = []) {
    $body = [
        'success' => false,
        'message' => $message
    ];

    if (!empty($errors)) {
        $body['errors'] = $errors;
    }

    sendResponse($statusCode, $body);
}

/* ---------------------------------------------------------------
 * Autentikasi API Key (header: X-API-Key)
 * ------------------------------------------------------------- */

function authenticate() {
    $key = $_SERVER['HTTP_X_API_KEY'] ?? '';

    if ($key === '') {
        header('WWW-Authenticate: ApiKey realm="Todo API"');
        sendError(401, 'API key is required');
    }

    if (!defined('API_KEY') || !hash_equals(API_KEY, $key)) {
        sendError(403, 'Invalid API key');
    }
}

/* ---------------------------------------------------------------
 * Helper input
 * ------------------------------------------------------------- */

function isJsonRequest() {
    $type = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
    return strpos($type, 'application/json') !== false;
}

function isMultipartRequest() {
    $type = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
    return strpos($type, 'multipart/form-data') !== false;
}

function getJsonBody() {
    if (!isJsonRequest()) {
        sendError(415, 'Content-Type must be application/json');
    }

    $raw = file_get_contents('php://input');

    if (trim($raw) === '') {
        sendError(400, 'Request body is empty');
    }

    try {
        $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        sendError(400, 'Invalid JSON body');
    }

    if (!is_array($data)) {
        sendError(400, 'JSON body must be an object');
    }

    return $data;
}

// Mengambil ID dari query string (?id=...)
function getId($required) {
    if (!isset($_GET['id'])) {
        if ($required) {
            sendError(400, 'Todo ID is required');
        }
        return null;
    }

    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);

    if (!$id || $id < 1) {
        sendError(400, 'Invalid Todo ID');
    }

    return $id;
}

function validateScope($scope) {
    if (!in_array($scope, ALLOWED_SCOPE, true)) {
        sendError(400, 'Invalid scope');
    }

    return $scope;
}

function parseNotificationTime($value, &$errors) {
    if ($value === null || $value === '') {
        return null;
    }

    if (!is_string($value)) {
        $errors['notification_time'] = 'Must be a string';
        return null;
    }

    $value = trim($value);
    $formats = ['Y-m-d\TH:i', 'Y-m-d H:i', 'Y-m-d\TH:i:s', 'Y-m-d H:i:s'];

    foreach ($formats as $format) {
        $date = DateTime::createFromFormat($format, $value);
        $info = DateTime::getLastErrors();

        $valid = $date && (
            !$info ||
            ($info['warning_count'] === 0 && $info['error_count'] === 0)
        );

        if ($valid) {
            return $date->format('Y-m-d H:i:s');
        }
    }

    $errors['notification_time'] = 'Invalid format, use YYYY-MM-DDTHH:MM';
    return null;
}

// Validasi data Todo. $partial = true untuk PATCH (field boleh sebagian)
function validateTodoInput($input, $partial) {
    $fields = [];
    $errors = [];

    // title
    if (array_key_exists('title', $input)) {
        $title = is_string($input['title']) ? trim($input['title']) : '';

        if ($title === '') {
            $errors['title'] = 'Title is required';
        } elseif (mb_strlen($title) > 255) {
            $errors['title'] = 'Title must be at most 255 characters';
        } else {
            $fields['title'] = $title;
        }
    } elseif (!$partial) {
        $errors['title'] = 'Title is required';
    }

    // description
    if (array_key_exists('description', $input)) {
        if ($input['description'] !== null && !is_string($input['description'])) {
            $errors['description'] = 'Description must be a string';
        } else {
            $fields['description'] = trim((string) $input['description']);
        }
    } elseif (!$partial) {
        $fields['description'] = '';
    }

    // status
    if (array_key_exists('status', $input)) {
        if (!in_array($input['status'], ALLOWED_STATUS, true)) {
            $errors['status'] = 'Status must be one of: todo, progress, done';
        } else {
            $fields['status'] = $input['status'];
        }
    } elseif (!$partial) {
        $fields['status'] = 'todo';
    }

    // notification_time
    if (array_key_exists('notification_time', $input)) {
        $fields['notification_time'] =
            parseNotificationTime($input['notification_time'], $errors);
    } elseif (!$partial) {
        $fields['notification_time'] = null;
    }

    return [$fields, $errors];
}

/* ---------------------------------------------------------------
 * Helper upload gambar (hanya untuk POST multipart/form-data)
 * ------------------------------------------------------------- */

function uploadTodoImage($file, &$error) {
    $error = null;

    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        $error = [400, 'Failed to upload image'];
        return null;
    }

    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/gif'  => 'gif',
        'image/webp' => 'webp'
    ];

    if ($file['size'] > 2 * 1024 * 1024) {
        $error = [413, 'Image must be at most 2 MB'];
        return null;
    }

    $mime = mime_content_type($file['tmp_name']);

    if (!isset($allowedTypes[$mime])) {
        $error = [422, 'Image must be jpg, png, gif, or webp'];
        return null;
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $allowedTypes[$mime];
    $destination = __DIR__ . '/../uploads/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        $error = [500, 'Failed to save image'];
        return null;
    }

    return 'uploads/' . $filename;
}

/* ---------------------------------------------------------------
 * Helper database
 * ------------------------------------------------------------- */

function findTodo($pdo, $id, $scope, $owner) {
    if ($scope === 'personal') {
        $stmt = $pdo->prepare(
            'SELECT * FROM todos
             WHERE id = ? AND scope = ? AND owner_key = ?'
        );
        $stmt->execute([$id, $scope, $owner]);
    } else {
        $stmt = $pdo->prepare(
            'SELECT * FROM todos
             WHERE id = ? AND scope = ?'
        );
        $stmt->execute([$id, $scope]);
    }

    return $stmt->fetch();
}

/* ---------------------------------------------------------------
 * Routing
 * ------------------------------------------------------------- */

$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($method, ALLOWED_METHODS, true)) {
    header('Allow: ' . implode(', ', ALLOWED_METHODS));
    sendError(405, 'Method Not Allowed');
}

authenticate();

$owner = $_SESSION['owner_key'];

try {

    /* ---------- GET: list / detail ---------- */
    if ($method === 'GET') {
        $scope = validateScope($_GET['scope'] ?? 'personal');
        $id = getId(false);

        if ($id !== null) {
            $todo = findTodo($pdo, $id, $scope, $owner);

            if (!$todo) {
                sendError(404, 'Todo not found');
            }

            sendResponse(200, ['success' => true, 'data' => $todo]);
        }

        if ($scope === 'personal') {
            $stmt = $pdo->prepare(
                'SELECT * FROM todos
                 WHERE scope = ? AND owner_key = ?
                 ORDER BY id DESC'
            );
            $stmt->execute([$scope, $owner]);
        } else {
            $stmt = $pdo->prepare(
                'SELECT * FROM todos
                 WHERE scope = ?
                 ORDER BY id DESC'
            );
            $stmt->execute([$scope]);
        }

        sendResponse(200, ['success' => true, 'data' => $stmt->fetchAll()]);
    }

    /* ---------- POST: create ---------- */
    if ($method === 'POST') {
        if (isMultipartRequest() || isset($_POST['title'])) {
            $input = $_POST;
        } else {
            $input = getJsonBody();
        }

        $scope = validateScope($input['scope'] ?? $_GET['scope'] ?? 'personal');

        [$fields, $errors] = validateTodoInput($input, false);

        if (!empty($errors)) {
            sendError(422, 'Validation failed', $errors);
        }

        $uploadError = null;
        $imagePath = uploadTodoImage($_FILES['image'] ?? null, $uploadError);

        if ($uploadError !== null) {
            sendError($uploadError[0], $uploadError[1]);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO todos
             (title, description, status, scope, owner_key, notification_time, image_path)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        $stmt->execute([
            $fields['title'],
            $fields['description'],
            $fields['status'],
            $scope,
            $owner,
            $fields['notification_time'],
            $imagePath
        ]);

        $newId = (int) $pdo->lastInsertId();
        $todo = findTodo($pdo, $newId, $scope, $owner);

        header('Location: todos.php?id=' . $newId . '&scope=' . $scope);

        sendResponse(201, [
            'success' => true,
            'message' => 'Todo created',
            'data'    => $todo
        ]);
    }

    /* ---------- PUT / PATCH: update ---------- */
    if ($method === 'PUT' || $method === 'PATCH') {
        $scope = validateScope($_GET['scope'] ?? 'personal');
        $id = getId(true);

        $todo = findTodo($pdo, $id, $scope, $owner);

        if (!$todo) {
            sendError(404, 'Todo not found');
        }

        $input = getJsonBody();

        // PUT = ganti seluruh data, PATCH = ubah sebagian
        [$fields, $errors] = validateTodoInput($input, $method === 'PATCH');

        if (!empty($errors)) {
            sendError(422, 'Validation failed', $errors);
        }

        if (empty($fields)) {
            sendError(422, 'No valid fields to update');
        }

        $set = [];
        $values = [];

        foreach ($fields as $column => $value) {
            $set[] = $column . ' = ?';
            $values[] = $value;
        }

        $values[] = $id;

        $stmt = $pdo->prepare(
            'UPDATE todos SET ' . implode(', ', $set) . ' WHERE id = ?'
        );
        $stmt->execute($values);

        sendResponse(200, [
            'success' => true,
            'message' => 'Todo updated',
            'data'    => findTodo($pdo, $id, $scope, $owner)
        ]);
    }

    /* ---------- DELETE ---------- */
    if ($method === 'DELETE') {
        $scope = validateScope($_GET['scope'] ?? 'personal');
        $id = getId(true);

        $todo = findTodo($pdo, $id, $scope, $owner);

        if (!$todo) {
            sendError(404, 'Todo not found');
        }

        $stmt = $pdo->prepare('DELETE FROM todos WHERE id = ?');
        $stmt->execute([$id]);

        // Hapus file gambar kalau ada
        if (!empty($todo['image_path'])) {
            $file = __DIR__ . '/../uploads/' . basename($todo['image_path']);

            if (is_file($file)) {
                unlink($file);
            }
        }

        sendResponse(204);
    }

} catch (PDOException $e) {
    sendError(500, 'Internal Server Error');
}