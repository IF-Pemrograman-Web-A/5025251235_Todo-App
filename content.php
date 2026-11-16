<section class="todo-panel" aria-labelledby="todo-list-title">
    <div class="panel-header">
        <h2 id="todo-list-title">
            <?= $scope === 'personal' ? 'My Todos' : 'Shared Todos' ?>
        </h2>
    </div>

    <div id="message" class="message" role="status" aria-live="polite" hidden></div>

    <ul class="todo-list" id="todo-list"></ul>

    <p id="todo-empty" hidden>Belum ada Todo di bagian ini.</p>
    <p id="todo-loading">Memuat Todo...</p>

    <hr>

    <h3>Create New Todo</h3>

    <form id="create-form" enctype="multipart/form-data">
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

    <p id="detail-empty">Pilih Todo untuk melihat detailnya.</p>

    <div id="detail-content" hidden>
        <form id="edit-form" class="todo-editor">
            <div class="form-group">
                <label for="title">Title</label>
                <input id="title" name="title" type="text" required>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="5"></textarea>
            </div>

            <div class="form-group" id="detail-image-group" hidden>
                <label>Image</label>
                <img
                    id="detail-image"
                    src=""
                    alt="Todo image"
                    style="max-width: 150px"
                >
            </div>

            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="todo">To Do</option>
                    <option value="progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div class="form-group">
                <label for="notification-time">Notification Time</label>
                <input id="notification-time" name="notification_time" type="datetime-local">
            </div>

            <button type="submit">Save Changes</button>
        </form>

        <button type="button" id="delete-button">Delete</button>
    </div>
</aside>