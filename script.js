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

const newTitleInput = document.getElementById("new-title");
const newDescriptionInput = document.getElementById("new-description");


function renderTodos() {
    todoList.innerHTML = "";

    todos.forEach(function(todo) {
        const li = document.createElement("li");
        li.className = "todo-item";

        if (todo.id === selectedTodoId) {
            li.classList.add("active");
        }

        if (todo.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.id = "todo-" + todo.id;

        const label = document.createElement("label");
        label.htmlFor = "todo-" + todo.id;

        const title = document.createElement("strong");
        title.textContent = todo.title;

        const description = document.createElement("span");
        description.textContent = todo.description;

        label.appendChild(title);
        label.appendChild(description);

        li.appendChild(checkbox);
        li.appendChild(label);

        li.addEventListener("click", function(event) {
            if (event.target !== checkbox) {
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
}


newTodoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = newTitleInput.value.trim();
    const description = newDescriptionInput.value.trim();

    if (title === "") {
        alert("Title tidak boleh kosong!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        title: title,
        description: description,
        status: "todo",
        completed: false
    };

    todos.push(newTodo);

    selectedTodoId = newTodo.id;

    newTitleInput.value = "";
    newDescriptionInput.value = "";

    renderTodos();
    showTodoDetail();
});


todoEditor.addEventListener("submit", function(event) {
    event.preventDefault();

    const todo = todos.find(function(item) {
        return item.id === selectedTodoId;
    });

    if (!todo) {
        return;
    }

    todo.title = titleInput.value.trim();
    todo.description = descriptionInput.value.trim();
    todo.status = statusInput.value;

    if (todo.status === "done") {
        todo.completed = true;
    } else {
        todo.completed = false;
    }

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

    todos.splice(todoIndex, 1);

    if (todos.length > 0) {
        selectedTodoId = todos[0].id;
        showTodoDetail();
    } else {
        selectedTodoId = null;
        titleInput.value = "";
        descriptionInput.value = "";
        statusInput.value = "todo";
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
    } else {
        themeToggle.textContent = "Dark Mode";
    }
});


renderTodos();
showTodoDetail();