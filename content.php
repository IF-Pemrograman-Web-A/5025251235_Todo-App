<section class="todo-panel" aria-labelledby="todo-list-title">
    <div class="panel-header">
        <h2 id="todo-list-title">
            <?= $scope === 'personal' ? 'My Todos' : 'Shared Todos' ?>
        </h2>
    </div>

    <ul class="todo-list" id="todo-list">
        <?php foreach ($todos as $todo): ?>
            <li class="todo-item <?= (int) $todo['id'] === (int) ($selectedTodo['id'] ?? 0) ? 'active' : '' ?>">
                <a href="index.php?scope=<?= e($scope) ?>&id=<?= (int) $todo['id'] ?>">
                    <strong><?= e($todo['title']) ?></strong>
                    <span><?= e($todo['description']) ?></span>
                </a>
                <span><?= e($todo['status']) ?></span>
            </li>
        <?php endforeach; ?>
    </ul>

    <?php if (!$todos): ?>
        <p>Belum ada Todo di bagian ini.</p>
    <?php endif; ?>

    <hr>

    <h3>Create New Todo</h3>

    <form action="functions.php" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="action" value="create">
        <input type="hidden" name="scope" value="<?= e($scope) ?>">

        <div class="form-group">
            <label for="new-title">Title</label>
            <input id="new-title" name="title" type="text" required>
        </div>

        <div class="form-group">
            <label for="new-description">Description</label>
            <textarea id="new-description" name="description" rows="3"></textarea>
        </div>

        <div class="form-group">
            <label for="new-status">Status</label>
            <select id="new-status" name="status">
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
            </select>
        </div>

        <div class="form-group">
            <label for="new-notification-time">Notification Time</label>
            <input id="new-notification-time" name="notification_time" type="datetime-local">
        </div>

        <div class="form-group">
            <label for="new-image">Image</label>
            <input
                id="new-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
            >
        </div>

        <button type="submit">Create Todo</button>
    </form>
</section>

<aside class="detail-panel">
    <div class="panel-header">
        <h2>Todo Detail</h2>
    </div>

    <?php if ($selectedTodo): ?>
        <form class="todo-editor" action="functions.php" method="POST">
            <input type="hidden" name="action" value="update">
            <input type="hidden" name="scope" value="<?= e($scope) ?>">
            <input type="hidden" name="id" value="<?= (int) $selectedTodo['id'] ?>">

            <div class="form-group">
                <label for="title">Title</label>
                <input id="title" name="title" type="text"
                    value="<?= e($selectedTodo['title']) ?>" required>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="5"><?= e($selectedTodo['description']) ?></textarea>
            </div>

            <div class="form-group">
                <label>Image</label>
                <img
                    src="<?= e($selectedTodo['image_path']) ?>"
                    alt="Todo image"
                    style="max-width: 150px"
                >
            </div>

            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="todo" <?= $selectedTodo['status'] === 'todo' ? 'selected' : '' ?>>To Do</option>
                    <option value="progress" <?= $selectedTodo['status'] === 'progress' ? 'selected' : '' ?>>In Progress</option>
                    <option value="done" <?= $selectedTodo['status'] === 'done' ? 'selected' : '' ?>>Done</option>
                </select>
            </div>

            <div class="form-group">
                <label for="notification-time">Notification Time</label>
                <input id="notification-time" name="notification_time" type="datetime-local"
                    value="<?= $selectedTodo['notification_time'] ? e(date('Y-m-d\TH:i', strtotime($selectedTodo['notification_time']))) : '' ?>">
            </div>

            <button type="submit">Save Changes</button>
        </form>

        <form action="functions.php" method="POST"
            onsubmit="return confirm('Delete this Todo?')">
            <input type="hidden" name="action" value="delete">
            <input type="hidden" name="scope" value="<?= e($scope) ?>">
            <input type="hidden" name="id" value="<?= (int) $selectedTodo['id'] ?>">
            <button type="submit">Delete</button>
        </form>
    <?php else: ?>
        <p>Pilih Todo untuk melihat detailnya.</p>
    <?php endif; ?>
</aside>
