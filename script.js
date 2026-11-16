document.addEventListener('DOMContentLoaded', () => {

    // DARK MODE
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';

        document.body.classList.toggle('dark-mode', savedTheme === 'dark');

        updateButton(savedTheme);

        function updateButton(theme) {
            themeToggle.textContent =
                theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }

        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const theme = isDark ? 'dark' : 'light';

            localStorage.setItem('theme', theme);
            updateButton(theme);
        });
    }

    // SERVICE WORKER REGISTRATION
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log(
                    'Service Worker registered:',
                    registration.scope
                );
            })
            .catch(error => {
                console.error(
                    'Service Worker registration failed:',
                    error
                );
            });
    }

    // INSTALL BUTTON
    let deferredPrompt;

    const installButton = document.getElementById('install-button');

    if (installButton) {
        installButton.style.display = 'none';

        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();

            deferredPrompt = event;
            installButton.style.display = 'block';
        });

        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) {
                return;
            }

            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;

            console.log('Install outcome:', outcome);

            deferredPrompt = null;
            installButton.style.display = 'none';
        });

        window.addEventListener('appinstalled', () => {
            installButton.style.display = 'none';
            console.log('Todo App successfully installed!');
        });
    }

    // TODO APP (REST API)
    initTodoApp();
});


function initTodoApp() {
    const app = window.TODO_APP;
    const listEl = document.getElementById('todo-list');

    if (!app || !listEl) {
        return;
    }

    const API_URL = 'api/todos.php';

    const messageEl = document.getElementById('message');
    const emptyEl = document.getElementById('todo-empty');
    const loadingEl = document.getElementById('todo-loading');
    const createForm = document.getElementById('create-form');
    const editForm = document.getElementById('edit-form');
    const deleteButton = document.getElementById('delete-button');
    const detailEmpty = document.getElementById('detail-empty');
    const detailContent = document.getElementById('detail-content');
    const detailImageGroup = document.getElementById('detail-image-group');
    const detailImage = document.getElementById('detail-image');

    let todos = [];
    let selectedId = app.selectedId ? Number(app.selectedId) : null;
    let messageTimer = null;

    // ---------- API helper ----------

    class ApiError extends Error {
        constructor(status, message, errors = {}) {
            super(message);
            this.status = status;
            this.errors = errors;
        }
    }

    async function apiRequest(method, query = {}, body = null) {
        const params = new URLSearchParams({ scope: app.scope, ...query });

        const options = {
            method,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-API-Key': app.apiKey
            }
        };

        if (body instanceof FormData) {
            // Content-Type multipart diatur otomatis oleh browser
            options.body = body;
        } else if (body !== null) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        let response;

        try {
            response = await fetch(`${API_URL}?${params}`, options);
        } catch (error) {
            throw new ApiError(
                0,
                'Tidak dapat terhubung ke server. Periksa koneksi internet kamu.'
            );
        }

        // 204 No Content (DELETE berhasil)
        if (response.status === 204) {
            return null;
        }

        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            // Response bukan JSON
        }

        if (!response.ok) {
            throw new ApiError(
                response.status,
                (data && data.message) || `Terjadi kesalahan (${response.status})`,
                (data && data.errors) || {}
            );
        }

        return data;
    }

    function errorText(error) {
        const details = error.errors ? Object.values(error.errors) : [];

        return details.length > 0
            ? `${error.message}: ${details.join('. ')}`
            : error.message;
    }

    // ---------- UI helper ----------

    function showMessage(text, type = 'success') {
        clearTimeout(messageTimer);

        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.hidden = false;

        if (type === 'success') {
            messageTimer = setTimeout(() => {
                messageEl.hidden = true;
            }, 4000);
        }
    }

    function setBusy(form, busy) {
        form.querySelectorAll('button').forEach(button => {
            button.disabled = busy;
        });
    }

    function normalize(todo) {
        return { ...todo, id: Number(todo.id) };
    }

    function toInputDateTime(value) {
        return value ? value.replace(' ', 'T').slice(0, 16) : '';
    }

    // ---------- Render ----------

    function renderList() {
        listEl.innerHTML = '';

        todos.forEach(todo => {
            const item = document.createElement('li');
            item.className =
                'todo-item' + (todo.id === selectedId ? ' active' : '');

            const link = document.createElement('a');
            link.href =
                `index.php?scope=${encodeURIComponent(app.scope)}&id=${todo.id}`;
            link.dataset.id = todo.id;

            const title = document.createElement('strong');
            title.textContent = todo.title;

            const description = document.createElement('span');
            description.textContent = todo.description || '';

            link.append(title, description);

            const status = document.createElement('span');
            status.textContent = todo.status;

            item.append(link, status);
            listEl.appendChild(item);
        });

        loadingEl.hidden = true;
        emptyEl.hidden = todos.length > 0;
    }

    function renderDetail() {
        const todo = todos.find(item => item.id === selectedId);

        detailEmpty.hidden = Boolean(todo);
        detailContent.hidden = !todo;

        if (!todo) {
            return;
        }

        editForm.elements.title.value = todo.title;
        editForm.elements.description.value = todo.description || '';
        editForm.elements.status.value = todo.status;
        editForm.elements.notification_time.value =
            toInputDateTime(todo.notification_time);

        if (todo.image_path) {
            detailImage.src = todo.image_path;
            detailImageGroup.hidden = false;
        } else {
            detailImage.removeAttribute('src');
            detailImageGroup.hidden = true;
        }
    }

    function render() {
        renderList();
        renderDetail();
    }

    function selectTodo(id) {
        selectedId = id;

        const url = id
            ? `index.php?scope=${encodeURIComponent(app.scope)}&id=${id}`
            : `index.php?scope=${encodeURIComponent(app.scope)}`;

        history.replaceState(null, '', url);
        render();
    }

    // ---------- Actions ----------

    async function loadTodos() {
        try {
            const result = await apiRequest('GET');

            todos = result.data.map(normalize);

            if (!todos.some(todo => todo.id === selectedId)) {
                selectedId = todos.length > 0 ? todos[0].id : null;
            }

            render();
        } catch (error) {
            loadingEl.hidden = true;
            showMessage(errorText(error), 'error');
        }
    }

    createForm.addEventListener('submit', async event => {
        event.preventDefault();

        setBusy(createForm, true);

        try {
            const result = await apiRequest(
                'POST',
                {},
                new FormData(createForm)
            );

            const todo = normalize(result.data);

            todos.unshift(todo);
            createForm.reset();
            selectTodo(todo.id);

            showMessage('Todo berhasil dibuat.');
        } catch (error) {
            showMessage(errorText(error), 'error');
        } finally {
            setBusy(createForm, false);
        }
    });

    editForm.addEventListener('submit', async event => {
        event.preventDefault();

        setBusy(editForm, true);

        try {
            // PUT: kirim seluruh data Todo
            const result = await apiRequest(
                'PUT',
                { id: selectedId },
                {
                    title: editForm.elements.title.value,
                    description: editForm.elements.description.value,
                    status: editForm.elements.status.value,
                    notification_time: editForm.elements.notification_time.value
                }
            );

            const updated = normalize(result.data);

            todos = todos.map(todo => todo.id === updated.id ? updated : todo);
            render();

            showMessage('Todo berhasil diperbarui.');
        } catch (error) {
            showMessage(errorText(error), 'error');

            // Todo sudah tidak ada di server, muat ulang daftar
            if (error.status === 404) {
                loadTodos();
            }
        } finally {
            setBusy(editForm, false);
        }
    });

    deleteButton.addEventListener('click', async () => {
        if (!selectedId || !confirm('Delete this Todo?')) {
            return;
        }

        deleteButton.disabled = true;

        try {
            await apiRequest('DELETE', { id: selectedId });

            todos = todos.filter(todo => todo.id !== selectedId);
            selectTodo(todos.length > 0 ? todos[0].id : null);

            showMessage('Todo berhasil dihapus.');
        } catch (error) {
            showMessage(errorText(error), 'error');

            if (error.status === 404) {
                loadTodos();
            }
        } finally {
            deleteButton.disabled = false;
        }
    });

    // Klik Todo di daftar: tampilkan detail tanpa reload halaman
    listEl.addEventListener('click', event => {
        const link = event.target.closest('a[data-id]');

        if (!link) {
            return;
        }

        event.preventDefault();
        selectTodo(Number(link.dataset.id));
    });

    loadTodos();
}