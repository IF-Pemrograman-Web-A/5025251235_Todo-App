let db;

const dbRequest = indexedDB.open("TodoAppDB", 1);

dbRequest.onupgradeneeded = function(event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
    }
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully:", db);

    initializeTodos();
};

dbRequest.onerror = function(event) {
    console.error("Database error:", event.target.error);
};

function saveTodo(todo) {
    const transaction = db.transaction("todos", "readwrite");
    const store = transaction.objectStore("todos");

    store.put(todo);
}

function deleteTodo(id) {
    const transaction = db.transaction("todos", "readwrite");
    const store = transaction.objectStore("todos");

    store.delete(id);
}

function readImageFile(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Error reading file"));

        reader.readAsDataURL(file);
    });
}

function loadTodos() {
    const transaction = db.transaction("todos", "readonly");
    const store = transaction.objectStore("todos");

    const request = store.getAll();

    request.onsuccess = function(event) {
        todos.length = 0;

        event.target.result.forEach(function(todo) {
            todos.push(todo);
        });

        if (todos.length > 0) {
            selectedTodoId = todos[0].id;
        } else {
            selectedTodoId = null;
        }

        renderTodos();
        showTodoDetail();

        todos.forEach(function(todo) {
            scheduleNotification(todo);
        });
    };
}

function initializeTodos() {
    const transaction = db.transaction("todos", "readwrite");
    const store = transaction.objectStore("todos");

    const request = store.count();

    request.onsuccess = function(event) {
        if (event.target.result === 0) {
            todos.forEach(function(todo) {
                store.put(todo);
            });
        }
    };

    transaction.oncomplete = function() {
        loadTodos();
    };
}

const todos = [
    {
        id: 1,
        title: "Learn HTML",
        description: "Practice semantic HTML elements",
        status: "todo",
        completed: false
    },
    {
        id: 2,
        title: "Learn CSS",
        description: "Practice Flexbox and Grid",
        status: "todo",
        completed: false
    },
    {
        id: 3,
        title: "Finish assignment",
        description: "Complete The Style Warrior task",
        status: "todo",
        completed: false
    },
    {
        id: 4,
        title: "Read documentation",
        description: "Review HTML and CSS documentation",
        status: "todo",
        completed: false
    }
];

let selectedTodoId = 1;

const todoList = document.getElementById("todo-list");
const todoEditor = document.getElementById("todo-editor");
const newTodoForm = document.getElementById("new-todo-form");
const deleteButton = document.getElementById("delete-button");
const themeToggle = document.getElementById("theme-toggle");
const newTodoButton = document.getElementById("new-todo-button");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");
const notificationTimeInput = document.getElementById("notification-time");

const newTitleInput = document.getElementById("new-title");
const newDescriptionInput = document.getElementById("new-description");
const newImageInput = document.getElementById("new-image");
const newNotificationTimeInput = document.getElementById("new-notification-time");

const todoImage = document.getElementById("todo-img");

const notificationTimers = new Map();

async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        alert("Browser tidak mendukung notifikasi.");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission === "denied") {
        alert("Izin notifikasi ditolak oleh browser.");
        return false;
    }

    const permission = await Notification.requestPermission();

    return permission === "granted";
}

function scheduleNotification(todo) {
    if (notificationTimers.has(todo.id)) {
        clearTimeout(notificationTimers.get(todo.id));
        notificationTimers.delete(todo.id);
    }

    if (!todo.notificationTime) {
        return;
    }

    const notificationDate = new Date(todo.notificationTime);
    const delay = notificationDate.getTime() - Date.now();

    if (Number.isNaN(notificationDate.getTime())) {
        console.error("Invalid notification time:", todo.notificationTime);
        return;
    }

    if (delay <= 0) {
        return;
    }

    console.log("Notification scheduled:", todo.title);
    console.log("Notification time:", notificationDate);
    console.log("Delay:", delay);

    const timer = setTimeout(function() {
        if (Notification.permission !== "granted") {
            console.error("Notification permission is not granted.");
            notificationTimers.delete(todo.id);
            return;
        }

        navigator.serviceWorker.ready
            .then(function(registration) {
                return registration.showNotification(todo.title, {
                    body: todo.description || "Todo reminder"
                });
            })
            .then(function() {
                console.log("Notification shown:", todo.title);
            })
            .catch(function(error) {
                console.error("Notification error:", error);
            });

        notificationTimers.delete(todo.id);
    }, delay);

    notificationTimers.set(todo.id, timer);
}

function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach(function(todo) {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.tabIndex = 0;

        if (todo.id === selectedTodoId) {
            li.classList.add("active");
            li.setAttribute("aria-current", "true");
        }

        if (todo.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.id = "todo-" + todo.id;
        checkbox.setAttribute(
            "aria-label",
            "Complete " + todo.title
        );

        const label = document.createElement("label");
        label.htmlFor = "todo-" + todo.id;

        const title = document.createElement("strong");
        title.textContent = todo.title;

        const description = document.createElement("span");
        description.textContent = todo.description;

        label.appendChild(title);
        label.appendChild(description);

        if (todo.image) {
            const image = document.createElement("img");

            image.src = todo.image;
            image.alt = "Image for " + todo.title;

            label.appendChild(image);
        }

        li.appendChild(checkbox);
        li.appendChild(label);

        li.addEventListener("click", function(event) {
            if (event.target !== checkbox) {
                selectedTodoId = todo.id;
                showTodoDetail();
                renderTodos();
            }
        });

        li.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                if (event.target === checkbox) {
                    return;
                }

                event.preventDefault();

                selectedTodoId = todo.id;
                showTodoDetail();
                renderTodos();
            }
        });

        checkbox.addEventListener("change", function() {
            todo.completed = checkbox.checked;

            if (todo.completed) {
                todo.status = "done";
            } else {
                todo.status = "todo";
            }

            saveTodo(todo);

            showTodoDetail();
            renderTodos();
        });

        todoList.appendChild(li);
    });
}

function showTodoDetail() {
    const todo = todos.find(function(item) {
        return item.id === selectedTodoId;
    });

    if (!todo) {
        return;
    }

    titleInput.value = todo.title;
    descriptionInput.value = todo.description;
    statusInput.value = todo.status;
    notificationTimeInput.value = todo.notificationTime || "";

    if (todo.image) {
        todoImage.src = todo.image;
        todoImage.hidden = false;
    } else {
        todoImage.src = "";
        todoImage.hidden = true;
    }
}

newTodoForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = newTitleInput.value.trim();
    const description = newDescriptionInput.value.trim();
    const imageFile = newImageInput.files[0];
    const notificationTime = newNotificationTimeInput.value;

    if (title === "") {
        alert("Title tidak boleh kosong!");
        return;
    }

    if (notificationTime) {
        const permissionGranted = await requestNotificationPermission();

        if (!permissionGranted) {
            return;
        }
    }

    let image = "";

    if (imageFile) {
        image = await readImageFile(imageFile);
    }

    const newTodo = {
        id: Date.now(),
        title: title,
        description: description,
        status: "todo",
        completed: false,
        image: image,
        notificationTime: notificationTime
    };

    todos.push(newTodo);

    saveTodo(newTodo);
    scheduleNotification(newTodo);

    selectedTodoId = newTodo.id;

    newTitleInput.value = "";
    newDescriptionInput.value = "";
    newImageInput.value = "";
    newNotificationTimeInput.value = "";

    renderTodos();
    showTodoDetail();
});

todoEditor.addEventListener("submit", async function(event) {
    event.preventDefault();

    const todo = todos.find(function(item) {
        return item.id === selectedTodoId;
    });

    if (!todo) {
        return;
    }

    const notificationTime = notificationTimeInput.value;

    if (notificationTime) {
        const permissionGranted = await requestNotificationPermission();

        if (!permissionGranted) {
            return;
        }
    }

    todo.title = titleInput.value.trim();
    todo.description = descriptionInput.value.trim();
    todo.status = statusInput.value;
    todo.notificationTime = notificationTime;

    if (todo.status === "done") {
        todo.completed = true;
    } else {
        todo.completed = false;
    }

    saveTodo(todo);
    scheduleNotification(todo);

    renderTodos();
    showTodoDetail();
});

deleteButton.addEventListener("click", function() {
    const todoIndex = todos.findIndex(function(item) {
        return item.id === selectedTodoId;
    });

    if (todoIndex === -1) {
        return;
    }

    const todo = todos[todoIndex];

    if (notificationTimers.has(todo.id)) {
        clearTimeout(notificationTimers.get(todo.id));
        notificationTimers.delete(todo.id);
    }

    deleteTodo(todo.id);
    todos.splice(todoIndex, 1);

    if (todos.length > 0) {
        selectedTodoId = todos[0].id;
        showTodoDetail();
    } else {
        selectedTodoId = null;

        titleInput.value = "";
        descriptionInput.value = "";
        statusInput.value = "todo";
        notificationTimeInput.value = "";

        todoImage.src = "";
        todoImage.hidden = true;
    }

    renderTodos();
});

newTodoButton.addEventListener("click", function() {
    newTitleInput.focus();
});

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "Light Mode";
} else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "Dark Mode";
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("service-worker.js")
            .then(function(registration) {
                console.log("Service Worker registered");
                return registration.update();
            })
            .catch(function(error) {
                console.error(
                    "Service Worker registration failed:",
                    error
                );
            });
    });
}